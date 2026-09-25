import {execFileSync} from 'node:child_process';
import {mkdirSync,mkdtempSync,writeFileSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import sharp from 'sharp';
for(const [variant,file] of [['desktop','a1'],['mobile','a2']]) {
 const temporary=mkdtempSync(join(tmpdir(),'corrected-ceremony-'));
 const root=`public/video/ceremony-v2/${variant}`;
 mkdirSync(`${root}/motion`,{recursive:true});mkdirSync(`${root}/detail`,{recursive:true});
 try {
  execFileSync('ffmpeg',['-y','-v','error','-i',`public/video/${file}.mp4`,'-an','-vf','fps=24','-frames:v','240','-start_number','0',join(temporary,'%03d.png')]);
  const frames=new Array(240);let next=0;
  await Promise.all([0,1].map(async()=>{while(next<240){const index=next++,name=String(index).padStart(3,'0'),input=join(temporary,`${name}.png`);
   frames[index]=variant==='desktop'?await sharp(input).resize(1920,1080).sharpen({sigma:.5,m1:.35,m2:.8}).avif({quality:63,effort:3}).toBuffer():await sharp(input).resize(540,960).webp({quality:76}).toBuffer();
   await sharp(input).resize(variant==='desktop'?3840:2160,variant==='desktop'?2160:3840).sharpen({sigma:.5,m1:.35,m2:.8}).webp({quality:82}).toFile(`${root}/detail/${name}.webp`);
   if(index%60===0)console.log(variant,index);
  }}));
  for(let chunk=0;chunk<20;chunk++){const list=frames.slice(chunk*12,chunk*12+12),header=Buffer.alloc(56);header.writeUInt32LE(12);let offset=56;list.forEach((f,i)=>{header.writeUInt32LE(offset,4+i*4);offset+=f.length});header.writeUInt32LE(offset,52);writeFileSync(`${root}/motion/${String(chunk).padStart(2,'0')}.bin`,Buffer.concat([header,...list]));}
  await sharp(join(temporary,'000.png')).resize(variant==='desktop'?1920:900).webp({quality:88}).toFile(`${root}/poster.webp`);
  await sharp(join(temporary,'239.png')).resize(variant==='desktop'?1920:900).webp({quality:88}).toFile(`${root}/ending.webp`);
  console.log(variant,'complete',frames.reduce((n,f)=>n+f.length,0)/1048576,'MB motion');
 }finally{rmSync(temporary,{recursive:true});}
}
