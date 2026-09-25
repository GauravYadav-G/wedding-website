"use client";

import { useEffect, useRef, useState } from "react";
import { Sparkles } from "lucide-react";

export default function OpeningEnvelope() {
  const root = useRef<HTMLElement>(null);
  const timers = useRef<Array<ReturnType<typeof setTimeout>>>([]);
  const [phase, setPhase] = useState<"sealed" | "opening" | "revealed" | "exiting">("sealed");

  useEffect(() => {
    const section = root.current;
    if (!section) return;
    const activeTimers = timers.current;
    const observer = new IntersectionObserver(([entry]) => {
      document.documentElement.dataset.envelopeActive = String(entry.isIntersecting);
    });
    observer.observe(section);
    return () => {
      observer.disconnect();
      delete document.documentElement.dataset.envelopeActive;
      activeTimers.forEach(clearTimeout);
      document.body.style.overflow = "";
    };
  }, []);

  const openInvitation = () => {
    if (phase !== "sealed") return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.body.style.overflow = "hidden";
    setPhase(reduced ? "revealed" : "opening");
    timers.current.push(setTimeout(() => setPhase("revealed"), reduced ? 80 : 1350));
    timers.current.push(setTimeout(() => setPhase("exiting"), reduced ? 1900 : 3150));
    timers.current.push(setTimeout(() => {
      document.body.style.overflow = "";
      document.getElementById("home")?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
    }, reduced ? 2250 : 3900));
  };

  return (
    <section ref={root} className="invitation-opening" data-phase={phase} aria-label="Open Deepak and Ayusha's wedding invitation">
      <div className="opening-stage">
        <div className="opening-ambient" aria-hidden="true"><i /><i /><i /></div>
        <div className="opening-kicker"><span lang="hi">॥ शुभ विवाह ॥</span><p>An invitation, made with love</p></div>
        <div className="opening-envelope">
          <div className="opening-liner" aria-hidden="true" />
          <div className="opening-card">
            <div className="opening-blessing">
              <span lang="hi">॥ श्री गणेशाय नमः ॥</span>
              <i className="opening-emblem" aria-hidden="true"><b /><em /><b /></i>
              <p>Together with their families</p>
            </div>
            <h2 className="opening-names"><span>Deepak</span><i>&amp;</i><span>Ayusha</span></h2>
            <div className="opening-details">
              <small>Request the pleasure of your company<br />as they begin their forever</small>
              <div className="opening-date"><b>09</b><span>December</span><b>2026</b></div>
              <p>Greater Noida West</p>
            </div>
          </div>
          <div className="opening-pocket" aria-hidden="true" />
          <div className="opening-flap" aria-hidden="true" />
          <button className="opening-trigger" type="button" onClick={openInvitation} aria-label="Open Deepak and Ayusha's invitation">
            <span>Open invitation</span>
          </button>
        </div>
        <div className="opening-scroll" aria-hidden="true"><span>Tap the AA seal to open</span><Sparkles size={14} /></div>
        <p className="opening-next">Our story begins here</p>
      </div>
    </section>
  );
}
