import {execFileSync} from 'node:child_process';
import {readFileSync,writeFileSync,mkdirSync,mkdtempSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';import {join} from 'node:path';
const tmp=mkdtempSync(join(tmpdir(),'ceremony-avc-'));
try {
 const file=join(tmp,'desktop.h264');
 execFileSync('ffmpeg',['-y','-v','error','-i','public/video/a1.mp4','-an','-vf','scale=2560:1440:flags=lanczos,cas=strength=0.34','-c:v','libx264','-preset','slow','-crf','12','-profile:v','high','-level:v','5.1','-pix_fmt','yuv420p','-bf','0','-g','12','-keyint_min','12','-sc_threshold','0','-x264-params','aud=1:repeat-headers=1','-f','h264',file]);
 const data=readFileSync(file),starts=[];
 for(let i=0;i<data.length-5;i++){let prefix=0;if(data[i]===0&&data[i+1]===0&&data[i+2]===0&&data[i+3]===1)prefix=4;else if(data[i]===0&&data[i+1]===0&&data[i+2]===1)prefix=3;if(prefix){if((data[i+prefix]&31)===9)starts.push(i);i+=prefix;}}
 if(starts.length!==240)throw Error(`Expected 240 frames, found ${starts.length}`);
 starts.push(data.length);const root='public/video/ceremony-v2/desktop/avc';mkdirSync(root,{recursive:true});
 for(let chunk=0;chunk<20;chunk++){const frames=Array.from({length:12},(_,i)=>data.subarray(starts[chunk*12+i],starts[chunk*12+i+1]));const header=Buffer.alloc(56);header.writeUInt32LE(12);let offset=56;frames.forEach((f,i)=>{header.writeUInt32LE(offset,4+i*4);offset+=f.length});header.writeUInt32LE(offset,52);writeFileSync(`${root}/${String(chunk).padStart(2,'0')}.bin`,Buffer.concat([header,...frames]));}
 console.log('Desktop hardware-decodable frame batches:',(data.length/1048576).toFixed(2),'MB');
}finally{rmSync(tmp,{recursive:true});}
