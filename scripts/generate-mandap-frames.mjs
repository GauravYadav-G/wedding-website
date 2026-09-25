// Regenerate all 24 fps frame tiers from the two original user-provided clips.
// Requires ffmpeg on PATH. Run: node scripts/generate-mandap-frames.mjs
import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
const sources = {
  desktop: 'public/video/Generate_an_–_second_Indian.mp4',
  mobile: 'public/video/now_generat_for_portnait.mp4',
};
for (const [variant, source] of Object.entries(sources)) {
  const widths = variant === 'desktop' ? [1280, 1920, 3840] : [720, 1080, 2160];
  for (const [tier, suffix] of ['', '-hd', '-4k'].entries()) {
    const destination = `public/video/mandap-frames/${variant}${suffix}`;
    mkdirSync(destination, { recursive: true });
    execFileSync('ffmpeg', ['-y', '-v', 'error', '-i', source, '-an', '-vf',
      `fps=24,scale=${widths[tier]}:-2:flags=lanczos,unsharp=5:5:0.35:3:3:0`,
      '-frames:v', '240', '-c:v', 'libwebp', '-quality', '88', '-compression_level', '4',
      '-start_number', '0', `${destination}/%03d.webp`], { stdio: 'inherit' });
  }
  execFileSync('ffmpeg', ['-y', '-v', 'error', '-i', source, '-frames:v', '1',
    '-vf', `scale=${widths[2]}:-2:flags=lanczos`, '-quality', '90',
    `public/video/mandap-${variant}-poster.webp`], { stdio: 'inherit' });
}

// Motion batches are intentionally small. 4K assets are used only for still detail.
for (const [variant, source] of Object.entries(sources)) {
  const temporary = mkdtempSync(join(tmpdir(), 'mandap-motion-'));
  const destination = `public/video/mandap-motion/${variant}`;
  mkdirSync(destination, { recursive: true });
  try {
    execFileSync('ffmpeg', ['-y', '-v', 'error', '-i', source, '-an', '-vf',
      `fps=24,scale=${variant === 'desktop' ? 960 : 540}:-2:flags=lanczos`,
      '-frames:v', '240', '-c:v', 'libwebp', '-quality', '70', '-compression_level', '4',
      '-start_number', '0', join(temporary, '%03d.webp')], { stdio: 'inherit' });
    for (let chunk = 0; chunk < 20; chunk++) {
      const frames = Array.from({ length: 12 }, (_, i) => readFileSync(join(temporary, `${String(chunk * 12 + i).padStart(3, '0')}.webp`)));
      const header = Buffer.alloc(56);
      header.writeUInt32LE(12, 0);
      let offset = header.length;
      frames.forEach((frame, i) => { header.writeUInt32LE(offset, 4 + i * 4); offset += frame.length; });
      header.writeUInt32LE(offset, 52);
      writeFileSync(`${destination}/${String(chunk).padStart(2, '0')}.bin`, Buffer.concat([header, ...frames]));
    }
  } finally { rmSync(temporary, { recursive: true }); }
}
