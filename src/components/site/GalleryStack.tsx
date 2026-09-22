"use client";
/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Expand, Pause, Play, X } from "lucide-react";
import { Mandala } from "./Ornaments";
const photos = [
  { src: "/images/ayusha-deepak-1.webp", alt: "Deepak and Ayusha smiling at each other", title: "It begins with us.", caption: "A glance, a smile, and a new chapter waiting to unfold." },
  { src: "/images/ayusha-deepak-2.webp", alt: "Deepak and Ayusha dancing together", title: "A little dance. A lot of joy.", caption: "The kind of happiness we can’t wait to share with you." },
  { src: "/images/ayusha-deepak-4.webp", alt: "Deepak and Ayusha standing together in the light", title: "In every little moment.", caption: "Together is where the next chapter begins." },
  { src: "/images/ayusha-deepak-3.webp", alt: "Deepak and Ayusha’s celebration portrait", title: "And now, our forever.", caption: "With our families’ blessings, and you by our side." },
];
export default function GalleryStack() {
  const root = useRef<HTMLElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const touchX = useRef<number | null>(null);
  const [active, setActive] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  useEffect(() => {
    const section = root.current;
    if (!section) return;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false;
    let timer: ReturnType<typeof setInterval> | undefined;
    const sync = () => {
      clearInterval(timer);
      section.dataset.moving = String(visible && !document.hidden && !reduce.matches);
      if (visible && autoPlay && !document.hidden && !reduce.matches) timer = setInterval(() => setActive(index => (index + 1) % photos.length), 6000);
    };
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); }, { threshold: .15 });
    observer.observe(section);
    document.addEventListener("visibilitychange", sync); reduce.addEventListener("change", sync);
    return () => { clearInterval(timer); observer.disconnect(); document.removeEventListener("visibilitychange", sync); reduce.removeEventListener("change", sync); };
  }, [autoPlay]);
  const select = (index: number) => { setAutoPlay(false); setActive((index + photos.length) % photos.length); };
  const move = (direction: number) => { setAutoPlay(false); setActive(index => (index + direction + photos.length) % photos.length); };
  const open = () => { setAutoPlay(false); dialog.current?.showModal(); };
  return <section id="gallery" ref={root} className="memory-story" aria-labelledby="gallery-title">
    <div className="memory-canopy" aria-hidden="true"><img src="/artwork/b4f038c348f07bc0.webp" alt="" loading="lazy" /></div>
    <header className="premium-heading" data-story=""><span className="eyebrow">A note from Deepak</span><p className="script-accent">A new chapter, with Ayusha</p><h2 id="gallery-title">Some moments<br />deserve to last forever.</h2><p>As Ayusha and I begin this new chapter, I look forward to celebrating it with the people who mean the most to us. These little moments are only the beginning.</p></header>
    <div className="memory-stage" aria-roledescription="carousel" aria-label="Deepak and Ayusha’s photographs" onTouchStart={event => { touchX.current = event.touches[0].clientX; }} onTouchEnd={event => { if(touchX.current !== null) { const delta=event.changedTouches[0].clientX-touchX.current; if(Math.abs(delta)>45) move(delta<0?1:-1); touchX.current=null; } }}>
      <Mandala className="memory-halo" aria-hidden="true" />
      {photos.map((photo, index) => { const offset=(index-active+photos.length)%photos.length; const position=offset===3?-1:offset;
        return <button type="button" key={photo.src} className="memory-card" data-position={position} onClick={() => position===0 ? open() : select(index)} tabIndex={position===2?-1:0} aria-hidden={position===2} aria-label={position===0?`Enlarge photo: ${photo.alt}`:`Show photo: ${photo.alt}`}><img src={photo.src} alt={photo.alt} width="960" height="1440" loading="eager" decoding="async" /><span className="memory-card-footer"><span>Deepak &amp; Ayusha</span><Expand size={14} /></span></button>;
      })}
    </div>
    <div className="memory-caption" aria-live={autoPlay ? "off" : "polite"}>{photos.map((photo,index)=><div key={photo.src} className={index===active?"is-active":""} aria-hidden={index!==active}><h3>{photo.title}</h3><p>{photo.caption}</p></div>)}</div>
    <div className="memory-controls"><button type="button" onClick={() => move(-1)} aria-label="Previous photograph"><ArrowLeft size={18} /></button><div className="memory-dots" role="group" aria-label="Choose a photograph">{photos.map((photo,index)=><button type="button" key={photo.src} onClick={()=>select(index)} aria-label={`Photograph ${index+1}`} aria-pressed={index===active}><span /></button>)}</div><button type="button" onClick={()=>move(1)} aria-label="Next photograph"><ArrowRight size={18} /></button><button type="button" onClick={()=>setAutoPlay(value=>!value)} aria-label={autoPlay?"Pause slideshow":"Play slideshow"}>{autoPlay?<Pause size={15}/>:<Play size={15}/>}</button></div>
    <p className="memory-closing script-accent">Join us as the story continues…</p>
    <dialog ref={dialog} className="photo-dialog" aria-label="Wedding photo viewer" onClick={event=>{if(event.target===event.currentTarget)dialog.current?.close();}} onKeyDown={event=>{if(event.key==="ArrowRight")move(1);if(event.key==="ArrowLeft")move(-1);}}>
      <button type="button" className="photo-close" onClick={()=>dialog.current?.close()} aria-label="Close photo viewer"><X /></button>
      <div className="lightbox-images">{photos.map((photo,index)=><img key={photo.src} src={photo.src} alt={index===active?photo.alt:""} aria-hidden={index!==active} className={index===active?"is-active":""}/>)}</div>
      <div className="photo-controls"><button type="button" onClick={()=>move(-1)} aria-label="Previous photo"><ArrowLeft /></button><p>{active+1} / {photos.length}<span>{photos[active].title}</span></p><button type="button" onClick={()=>move(1)} aria-label="Next photo"><ArrowRight /></button></div>
    </dialog>
  </section>;
}
