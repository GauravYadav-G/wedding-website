import type { CSSProperties } from "react";
import Image from "next/image";
import { Mandala } from "./Ornaments";

export function FlowerShower() {
  const motifs = ["mogra", "marigold", "rose-petals", "gota-leaf", "peacock-feather", "kalire"];
  return <div className="flower-shower" aria-hidden="true">{Array.from({length:26},(_,i)=>{
    const motif = motifs[i % motifs.length];
    return <span key={i} className={`drifting-blossom flying-${motif}`} style={{
      "--x":`${((i * 37.7 + 7) % 106) - 3}%`,
      "--delay":`${-i * 2.7}s`,
      "--duration":`${19 + (i % 7) * 2.4}s`,
      "--size":`${20 + (i % 6) * 5}px`,
      "--drift":`${-45 + (i % 5) * 23}px`,
      "--depth":`${.55 + (i % 4) * .15}`,
    } as CSSProperties}><Image src={`/artwork/flying-${motif}.webp`} alt="" width={320} height={320} /></span>;
  })}</div>;
}
export function LivingChakra() {
  return <div className="living-chakra" aria-hidden="true"><Mandala/><Mandala/></div>;
}
export function LivingLamps() {
  return <div className="living-lamps" aria-hidden="true">{[0,1].map(i=><div className="brass-lamp" key={i}><span className="lamp-aura"/><span className="incense-smoke"/><span className="lamp-flame"><i/></span><span className="lamp-bowl"/><span className="lamp-stem"/><span className="lamp-foot"/></div>)}</div>;
}
export function PeacockDance() {
  return <div className="peacock-dance" aria-hidden="true"><svg viewBox="0 0 360 250" fill="none"><g className="peacock-fan">{Array.from({length:13},(_,i)=><g key={i} transform={`rotate(${(i-6)*12} 180 206)`}><path d="M180 211Q147 112 180 20Q213 112 180 211" fill={i%2?"#466e58":"#315b51"} stroke="#bfa165" strokeWidth="1"/><path d="M180 203V45" stroke="#c5ac70" strokeWidth=".8"/><ellipse cx="180" cy="59" rx="11" ry="20" fill="#bd9b52"/><ellipse cx="180" cy="57" rx="7" ry="13" fill="#388b89"/><ellipse cx="180" cy="54" rx="4" ry="8" fill="#123f56"/></g>)}</g><g className="peacock-body"><path d="M166 208C145 180 168 157 177 141C188 121 164 112 172 97C177 88 190 90 195 97C204 112 188 122 193 142C198 162 218 186 200 207Z" fill="#215a6b" stroke="#c4a56a" strokeWidth="1.5"/><path d="M182 152Q155 184 183 201Q207 180 182 152" fill="#386f69" stroke="#bca369"/><path d="M181 209L175 226M188 209L194 226M168 226H180M189 226H201" stroke="#99794c" strokeWidth="2"/><path d="M174 97L163 102L174 105" fill="#c5a05d"/><circle cx="181" cy="98" r="2" fill="#fff0d6"/><path d="M181 91L176 80M184 90V77M187 91L192 80" stroke="#b28b43" strokeWidth="2"/><circle cx="176" cy="79" r="3" fill="#467e73"/><circle cx="184" cy="76" r="3" fill="#467e73"/><circle cx="192" cy="79" r="3" fill="#467e73"/></g></svg></div>;
}
