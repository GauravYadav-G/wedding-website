/* eslint-disable @next/next/no-img-element */
import { CalendarPlus } from "lucide-react";
import { wedding } from "@/lib/wedding";
import Countdown from "./Countdown";
export default function CountdownScene() {
  return <section className="forever-scene" aria-labelledby="countdown-title">
    <div className="forever-art"><img src="/artwork/c22fb695b0b75f19.webp" alt="A decorated elephant holding a lotus beside a tranquil palace lake" width="862" height="1067" loading="lazy" decoding="async" /></div>
    <div className="forever-content" data-story=""><span className="eyebrow">The best is yet to come</span><p className="script-accent">Every moment closer to</p><h2 id="countdown-title">our forever.</h2><p className="forever-description">A day of love. A lifetime of togetherness.<br />We can’t wait to celebrate with you.</p><Countdown target={wedding.countdownTarget} /><div className="forever-date"><span>09 . 12 . 2026</span><span>Greater Noida West</span></div><a className="premium-button" href="/api/calendar?event=wedding"><CalendarPlus size={16} /> Save our wedding date</a><p className="forever-signature">Deepak <span>&amp;</span> Ayusha</p></div>
  </section>;
}
