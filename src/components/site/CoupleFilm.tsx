"use client";
import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";

export default function CoupleFilm() {
  const root=useRef<HTMLElement>(null);
  const video=useRef<HTMLVideoElement>(null);
  const pausedByGuest=useRef(false);
  const [playing,setPlaying]=useState(false);
  useEffect(()=>{
    const section=root.current,player=video.current;if(!section||!player)return;
    const reduced=matchMedia("(prefers-reduced-motion: reduce)");let visible=false;
    const sync=()=>{if(visible&&!document.hidden&&!reduced.matches&&!pausedByGuest.current){if(!player.getAttribute("src"))player.src="/video/couple-reel.mp4";void player.play().catch(()=>{});}else player.pause();};
    const observer=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting&&entry.intersectionRatio>.15;sync();},{threshold:[0,.15]});observer.observe(section);
    reduced.addEventListener("change",sync);document.addEventListener("visibilitychange",sync);
    return()=>{observer.disconnect();player.pause();reduced.removeEventListener("change",sync);document.removeEventListener("visibilitychange",sync);};
  },[]);
  const toggle=async()=>{const player=video.current;if(!player)return;if(!player.paused){pausedByGuest.current=true;player.pause();}else{pausedByGuest.current=false;if(!player.getAttribute("src"))player.src="/video/couple-reel.mp4";try{await player.play();}catch{setPlaying(false);}}};
  return <section ref={root} className="couple-cinema" aria-label="Deepak and Ayusha's film">
    <div className="couple-cinema-backdrop" aria-hidden="true"/>
    <video ref={video} muted loop playsInline preload="none" poster="/video/couple-reel-poster.webp" aria-label="Deepak and Ayusha together in their personal celebration film" onPlaying={()=>setPlaying(true)} onPause={()=>setPlaying(false)}/>
    <div className="couple-cinema-shade" aria-hidden="true"/>
    <div className="couple-cinema-copy"><span className="eyebrow">A glimpse of us</span><h2>Every little moment.<br/><em>Always, you.</em></h2><p>Deepak &amp; Ayusha</p></div>
    <span className="cinema-date">09 · 12 · 2026</span>
    <button className="cinema-control" type="button" onClick={toggle} aria-label={playing?"Pause our film":"Play our film"}>{playing?<Pause size={14}/>:<Play size={14}/>}<span>{playing?"Pause":"Play"}</span></button>
  </section>;
}
