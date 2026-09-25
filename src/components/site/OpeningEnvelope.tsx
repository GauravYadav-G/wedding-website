"use client";

import { useEffect, useRef, useState } from "react";
import { Sparkles } from "lucide-react";

export default function OpeningEnvelope() {
  const started = useRef(false);
  const timers = useRef<Array<ReturnType<typeof setTimeout>>>([]);
  const [phase, setPhase] = useState<"sealed" | "releasing" | "opening" | "revealed" | "exiting" | "complete">("sealed");

  useEffect(() => {
    const activeTimers = timers.current;
    const previousOverflow = document.body.style.overflow;
    document.documentElement.dataset.envelopeActive = "true";
    document.body.style.overflow = "hidden";
    return () => {
      delete document.documentElement.dataset.envelopeActive;
      activeTimers.forEach(clearTimeout);
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  useEffect(() => {
    if (phase !== "complete") return;
    document.body.style.overflow = "";
    delete document.documentElement.dataset.envelopeActive;
    document.getElementById("invitation")?.focus({ preventScroll: true });
  }, [phase]);

  const openInvitation = () => {
    if (started.current) return;
    started.current = true;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.body.style.overflow = "hidden";
    window.scrollTo({ top: 0, behavior: "instant" });
    setPhase(reduced ? "revealed" : "releasing");
    if (!reduced) timers.current.push(setTimeout(() => setPhase("opening"), 280));
    timers.current.push(setTimeout(() => setPhase("revealed"), reduced ? 80 : 2450));
    timers.current.push(setTimeout(() => setPhase("exiting"), reduced ? 100 : 4100));
    timers.current.push(setTimeout(() => setPhase("complete"), reduced ? 180 : 5300));
  };

  if (phase === "complete") return null;

  return (
    <section className="invitation-opening" data-phase={phase} aria-label="Open Deepak and Ayusha's wedding invitation">
      <div className="opening-stage">
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
              <time className="opening-date" dateTime="2026-12-09"><span>December</span><b>09</b><span>2026</span></time>
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
      </div>
    </section>
  );
}
