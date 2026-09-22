"use client";
/* The scene is composed from separate foreground and background illustrations. */
/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef } from "react";
import { wedding } from "@/lib/wedding";
const art = "/artwork/";
function Scenery({ desktop, mobile, className, alt = "" }: { desktop: string; mobile: string; className: string; alt?: string }) {
  return <picture><source media="(max-width: 700px)" srcSet={art + mobile} /><img className={className} src={art + desktop} alt={alt} /></picture>;
}
export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const section = ref.current;
    if (!section || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const y = Math.max(0, window.scrollY);
      const progress = Math.min(1, y / (window.innerWidth < 701 ? 450 : 900));
      section.style.setProperty("--name-drift", `${y * .35}px`);
      section.style.setProperty("--name-opacity", `${1 - progress}`);
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { cancelAnimationFrame(frame); window.removeEventListener("scroll", onScroll); };
  }, []);
  return <section id="home" className="hero" ref={ref} aria-label="Wedding invitation">
    <div className="hero__stage">
      <Scenery className="hero__sky" desktop="d81463ceaca156e6.webp" mobile="3a1202a6edfbd91f.webp" />
      <Scenery className="hero__mountains" desktop="c25249f713a6ca00.webp" mobile="c245028d56191860.webp" />
      <Scenery className="hero__clouds" desktop="b6df9c73f9585ad5.webp" mobile="bad6103adb6c57a4.webp" />
      <div className="hero__corners"><Scenery className="scene-corners" desktop="b4f038c348f07bc0.webp" mobile="f323d25bb2e9e42f.webp" /></div>
      <div className="bells" aria-hidden="true">{["7e1a3a5150e03a86.png", "22081e683158c046.png", "7e1a3a5150e03a86.png", "22081e683158c046.png"].map((src, i) => <img key={i} src={art + src} alt="" />)}</div>
      <div className="hero__temple-wrap"><Scenery className="hero__temple" desktop="cd0d21ec3e1a409a.webp" mobile="979c419bb7c2ce1d.webp" alt="An ornate golden Ram Mandir surrounded by mountains" /></div>
      <div className="hero__flag-group" aria-hidden="true"><img className="hero__flag" src={art + "be9b608a683e28b1.webp"} alt="" /><img className="hero__flag-banner" src={art + "ram-flag.png"} alt="" /></div>
      <h1 className="hero__names"><span className="scene-name">{wedding.bride.name}</span><span className="scene-weds">weds</span><span className="scene-name">{wedding.groom.name}</span></h1>
      <div className="hero__invite" id="invitation">
        <div className="invite-ganesh-heading" lang="hi">॥ श्री गणेशाय नमः ॥</div>
        <img className="ganpati" src={art + "912497b016e41aa1.webp"} alt="Lord Ganesha" />
        <img className="invite-shloka invite-shloka--wide" src={art + "cbcf61a7736f01a5.webp"} alt="वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ। निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा॥" />
        <p className="invite-hosts">{wedding.bride.daughterOf}</p>
        <p className="invite-request">Cordially request the honor of your presence at the wedding celebration of their beloved daughter</p>
        <p className="invite-name">{wedding.bride.name}</p><p className="invite-and">with</p><p className="invite-name">{wedding.groom.name}</p>
        <p className="invite-relation">Son of</p><p className="invite-family">{wedding.groom.sonOf}</p>
        <p className="invite-events">On The Following Events</p><a className="scene-arrow" href="#events" aria-label="View the wedding events">↓</a>
      </div>
      <a className="scene-scroll" href="#invitation">Scroll to discover <span>↓</span></a>
    </div>
  </section>;
}
