"use client";
/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef } from "react";
import { LivingChakra } from "./LivingDecor";
import Petals from "./Petals";
import { wedding } from "@/lib/wedding";

const art = "/artwork/";

function Scenery({
  desktop,
  mobile,
  className,
  alt = "",
}: {
  desktop: string;
  mobile: string;
  className: string;
  alt?: string;
}) {
  return (
    <picture>
      <source media="(max-width: 700px)" srcSet={art + mobile} />
      <img className={className} src={art + desktop} alt={alt} decoding="async" />
    </picture>
  );
}

export default function TempleScene() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = ref.current;
    if (!section) return;
    const observer = new IntersectionObserver(([entry]) => {
      section.dataset.active = String(entry.isIntersecting);
    });
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="invitation" className="hero" ref={ref} tabIndex={-1} aria-label="Wedding invitation and Ram Mandir blessing">
      <div className="hero__stage">
        <Scenery className="hero__sky" desktop="d81463ceaca156e6.webp" mobile="3a1202a6edfbd91f.webp" />
        <Scenery className="hero__mountains" desktop="c25249f713a6ca00.webp" mobile="c245028d56191860.webp" />
        <Scenery className="hero__clouds" desktop="b6df9c73f9585ad5.webp" mobile="bad6103adb6c57a4.webp" />
        <div className="hero__corners">
          <Scenery className="scene-corners" desktop="b4f038c348f07bc0.webp" mobile="f323d25bb2e9e42f.webp" />
        </div>
        <div className="bells" aria-hidden="true">
          {["7e1a3a5150e03a86.png", "22081e683158c046.png", "7e1a3a5150e03a86.png", "22081e683158c046.png"].map((src, i) => (
            <img key={i} src={art + src} alt="" />
          ))}
        </div>
        <div className="hero__temple-wrap">
          <Scenery
            className="hero__temple"
            desktop="cd0d21ec3e1a409a.webp"
            mobile="979c419bb7c2ce1d.webp"
            alt="An ornate golden Ram Mandir surrounded by mountains"
          />
        </div>
        <div className="hero__flag-group" aria-hidden="true">
          <img className="hero__flag" src={art + "be9b608a683e28b1.webp"} alt="" />
          <img className="hero__flag-banner" src={art + "ram-flag.png"} alt="" />
        </div>
        <h2 className="hero__names">
          <span className="scene-name">{wedding.groom.name}</span>
          <span className="scene-weds">weds</span>
          <span className="scene-name">{wedding.bride.name}</span>
        </h2>
        <div className="hero__invite">
          <div className="invite-ganesh-heading" lang="hi">
            ॥ श्री गणेशाय नमः ॥
          </div>
          <LivingChakra />
          <img className="ganpati" src={art + "912497b016e41aa1.webp"} alt="Lord Ganesha" />
          <img
            className="invite-shloka invite-shloka--wide"
            src={art + "cbcf61a7736f01a5.webp"}
            alt="वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ। निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा॥"
          />
          <p className="invite-hosts">{wedding.groom.sonOf}</p>
          <p className="invite-request">
            With the blessings of Lord Ganesha, we joyfully invite you to the wedding of our beloved son
          </p>
          <p className="invite-name">{wedding.groom.name}</p>
          <p className="invite-and">with</p>
          <p className="invite-name">{wedding.bride.name}</p>
          <p className="invite-relation">Beloved daughter of</p>
          <p className="invite-family">{wedding.bride.daughterOf}</p>
          <p className="invite-date">9 December 2026 · Greater Noida West</p>
          <p className="invite-events">Your presence completes our celebration</p>
          <p className="invite-story">
            Walk with us from the first joyful rituals
            <br />
            to the beginning of their forever.
          </p>
          <a className="scene-arrow" href="#events" aria-label="Discover our wedding celebrations">
            ↓
          </a>
        </div>
        <div className="hero-petals" aria-hidden="true">
          <Petals count={8} />
        </div>
      </div>
    </section>
  );
}
