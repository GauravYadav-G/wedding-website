import fs from 'node:fs';
import { spawn, execSync } from 'node:child_process';

// Extract raw 720p frame 0 from a1.mp4
execSync('ffmpeg -y -v error -ss 0 -i public/video/a1.mp4 -vframes 1 /tmp/raw_720p_0.png');
const imgBase64 = fs.readFileSync('/tmp/raw_720p_0.png').toString('base64');

const easuSrc = fs.readFileSync('scripts/web-fsr/easu.glsl', 'utf8');
let rcasSrc = fs.readFileSync('scripts/web-fsr/rcas.glsl', 'utf8');
// Enable noise-adaptive denoise in RCAS
rcasSrc = rcasSrc.replace('//#define FSR_RCAS_DENOISE', '#define FSR_RCAS_DENOISE');

const htmlContent = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"/></head>
<body style="margin:0;background:#000;">
<canvas id="c" width="3840" height="2160"></canvas>
<script>
window.runFSR = async function(base64, targetW, targetH, sharpness) {
  const img = new Image();
  await new Promise(r => { img.onload = r; img.src = "data:image/png;base64," + base64; });
  
  const canvas = document.getElementById("c");
  canvas.width = targetW; canvas.height = targetH;
  const gl = canvas.getContext("webgl2", { preserveDrawingBuffer: true, antialias: false });
  if (!gl) throw Error("WebGL2 not supported");
  
  // Extension for float / color buffers
  gl.getExtension("EXT_color_buffer_float");

  const vsSrc = \`#version 300 es
    in vec2 aPos;
    out vec2 vUv;
    void main() {
      vUv = aPos * 0.5 + 0.5;
      gl_Position = vec4(aPos, 0.0, 1.0);
    }
  \`;

  function createShader(gl, type, src) {
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      throw Error(gl.getShaderInfoLog(s));
    }
    return s;
  }

  function createProgram(gl, vs, fs) {
    const p = gl.createProgram();
    gl.attachShader(p, vs);
    gl.attachShader(p, fs);
    gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
      throw Error(gl.getProgramInfoLog(p));
    }
    return p;
  }

  const quadBuf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, quadBuf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    -1, -1,
     1, -1,
    -1,  1,
    -1,  1,
     1, -1,
     1,  1
  ]), gl.STATIC_DRAW);

  // Source texture
  const srcTex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, srcTex);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, gl.RGBA, gl.UNSIGNED_BYTE, img);

  // EASU Shader
  const vs = createShader(gl, gl.VERTEX_SHADER, vsSrc);
  const easuFs = createShader(gl, gl.FRAGMENT_SHADER, \`#version 300 es
    precision highp float;
    \${easuGlsl}
  \`);
  const easuProg = createProgram(gl, vs, easuFs);

  // RCAS Shader
  const rcasFs = createShader(gl, gl.FRAGMENT_SHADER, \`#version 300 es
    precision highp float;
    \${rcasGlsl}
  \`);
  const rcasProg = createProgram(gl, vs, rcasFs);

  // FBO for EASU output
  const fboTex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, fboTex);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, targetW, targetH, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);

  const fbo = gl.createFramebuffer();
  gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, fboTex, 0);

  // PASS 1: EASU
  gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
  gl.viewport(0, 0, targetW, targetH);
  gl.useProgram(easuProg);

  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, srcTex);
  gl.uniform1i(gl.getUniformLocation(easuProg, "iChannel0"), 0);
  gl.uniform2f(gl.getUniformLocation(easuProg, "iResolution"), targetW, targetH);

  const aPosLoc1 = gl.getAttribLocation(easuProg, "aPos");
  gl.enableVertexAttribArray(aPosLoc1);
  gl.bindBuffer(gl.ARRAY_BUFFER, quadBuf);
  gl.vertexAttribPointer(aPosLoc1, 2, gl.FLOAT, false, 0, 0);

  gl.drawArrays(gl.TRIANGLES, 0, 6);

  // PASS 2: RCAS
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  gl.viewport(0, 0, targetW, targetH);
  gl.useProgram(rcasProg);

  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, fboTex);
  gl.uniform1i(gl.getUniformLocation(rcasProg, "iChannel0"), 0);
  gl.uniform2f(gl.getUniformLocation(rcasProg, "iResolution"), targetW, targetH);
  gl.uniform1f(gl.getUniformLocation(rcasProg, "sharpness"), sharpness);

  const aPosLoc2 = gl.getAttribLocation(rcasProg, "aPos");
  gl.enableVertexAttribArray(aPosLoc2);
  gl.bindBuffer(gl.ARRAY_BUFFER, quadBuf);
  gl.vertexAttribPointer(aPosLoc2, 2, gl.FLOAT, false, 0, 0);

  gl.drawArrays(gl.TRIANGLES, 0, 6);

  return canvas.toDataURL("image/png");
};
</script>
</body>
</html>`
  .replace('${easuGlsl}', easuSrc)
  .replace('${rcasGlsl}', rcasSrc);

fs.writeFileSync('/tmp/fsr_runner.html', htmlContent);
console.log('Created /tmp/fsr_runner.html');
