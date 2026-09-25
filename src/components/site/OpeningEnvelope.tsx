"use client";

import { useEffect, useRef } from "react";
import { ArrowDown } from "lucide-react";

const clamp = (value: number) => Math.max(0, Math.min(1, value));
const range = (value: number, start: number, end: number) => clamp((value - start) / (end - start));

export default function OpeningEnvelope() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = root.current;
    if (!section) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let holdTimer: ReturnType<typeof setTimeout> | undefined;
    let holding = false;
    let heldOnce = false;
    const previousOverflow = document.body.style.overflow;
    const observer = new IntersectionObserver(([entry]) => {
      document.documentElement.dataset.envelopeActive = String(entry.isIntersecting);
    });
    observer.observe(section);
    const paint = () => {
      frame = 0;
      const bounds = section.getBoundingClientRect();
      const distance = Math.max(1, section.offsetHeight - innerHeight);
      let progress = reduced.matches ? 0.68 : clamp(-bounds.top / distance);
      if (!reduced.matches && !heldOnce && !holding && progress >= .64 && progress < .84) {
        holding = true;
        progress = .64;
        document.documentElement.dataset.invitationHold = "true";
        document.body.style.overflow = "hidden";
        window.scrollTo(0, section.offsetTop + distance * .64);
        holdTimer = setTimeout(() => {
          holding = false;
          heldOnce = true;
          delete document.documentElement.dataset.invitationHold;
          document.body.style.overflow = previousOverflow;
          schedule();
        }, 2000);
      } else if (holding) progress = .64;
      section.style.setProperty("--envelope-progress", progress.toFixed(4));
      section.style.setProperty("--envelope-open", range(progress, 0.06, 0.4).toFixed(4));
      section.style.setProperty("--invitation-rise", range(progress, 0.3, 0.62).toFixed(4));
      section.style.setProperty("--envelope-exit", range(progress, 0.84, 0.99).toFixed(4));
      section.dataset.phase = progress < 0.22 ? "sealed" : progress < 0.62 ? "opening" : "revealed";
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(paint); };
    paint();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    reduced.addEventListener("change", schedule);
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(holdTimer);
      if (holding) document.body.style.overflow = previousOverflow;
      delete document.documentElement.dataset.invitationHold;
      observer.disconnect();
      delete document.documentElement.dataset.envelopeActive;
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      reduced.removeEventListener("change", schedule);
    };
  }, []);

  return (
    <section ref={root} className="invitation-opening" aria-label="Scroll to open Deepak and Ayusha's wedding invitation">
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
          <div className="opening-seal" aria-hidden="true"><b>द</b><span>&amp;</span><b>आ</b></div>
        </div>
        <div className="opening-scroll" aria-hidden="true"><span>Scroll to open</span><ArrowDown size={16} /><i><b /></i></div>
        <p className="opening-next">Our story begins here</p>
      </div>
    </section>
  );
}
