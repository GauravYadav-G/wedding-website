"use client";

import { useState } from "react";

import { Check, Copy, MapPin, Navigation } from "lucide-react";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import { wedding } from "@/lib/wedding";

export default function Venue() {
  const [active, setActive] = useState(0);
  const [copied, setCopied] = useState(false);
  const venue = wedding.venues[active];

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(venue.address);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <section
      id="venue"
      className="relative scroll-mt-24 overflow-hidden py-24 text-cream md:py-32"
    >
      <div className="relative mx-auto max-w-5xl px-5 md:px-8">
        <Reveal>
          <SectionHeading
            hindi="स्थान"
            title="Looking forward to see you"
            index="04 — Where we gather"
            tone="dark"
          />
        </Reveal>

        <Reveal delay={120} className="mt-14">
          <div className="frame-double-light overflow-hidden rounded-[26px] bg-cream text-ink shadow-[0_18px_45px_rgba(100,65,30,0.1)]">
            {/* venue tabs */}
            <div
              className="flex flex-wrap gap-2 border-b border-gold/25 bg-cream-2 px-5 pt-5 pb-4 md:px-8"
              role="tablist"
              aria-label="Wedding venues"
            >
              {wedding.venues.map((v, i) => (
                <button
                  key={v.id}
                  type="button"
                  role="tab"
                  aria-selected={i === active}
                  onClick={() => setActive(i)}
                  className={`rounded-full px-5 py-2.5 font-body text-[12px] font-semibold tracking-[0.16em] uppercase transition-all duration-300 ${
                    i === active
                      ? "bg-maroon text-cream shadow-[0_8px_20px_rgba(107,31,38,0.35)]"
                      : "border border-gold/40 text-ink/70 hover:border-saffron hover:text-saffron-2"
                  }`}
                >
                  {v.label}
                </button>
              ))}
            </div>

            {/* map */}
            <div className="relative aspect-[16/10] w-full md:aspect-[16/8]">
              <iframe
                key={venue.id}
                title={`Google Map showing ${venue.name}`}
                src={`https://www.google.com/maps?q=${encodeURIComponent(
                  venue.mapQuery
                )}&z=14&output=embed`}
                className="absolute inset-0 h-full w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>

            {/* address bar */}
            <div className="flex flex-col gap-4 border-t border-gold/25 px-5 py-6 md:flex-row md:items-center md:justify-between md:px-8">
              <div className="flex items-start gap-3.5">
                <span className="mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-saffron/10 text-saffron-2">
                  <MapPin className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-display text-xl font-semibold text-maroon md:text-2xl">
                    {venue.name}
                  </p>
                  <p className="mt-1 max-w-md font-body text-sm leading-relaxed text-ink/70">
                    {venue.address}
                  </p>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <button
                  type="button"
                  onClick={copyAddress}
                  className={`inline-flex items-center gap-2 rounded-full border px-5 py-2.5 font-body text-[12px] font-semibold tracking-[0.16em] uppercase transition-all duration-300 ${
                    copied
                      ? "border-saffron bg-saffron/10 text-saffron-2"
                      : "border-gold/45 text-ink/75 hover:border-saffron hover:text-saffron-2"
                  }`}
                >
                  {copied ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                  {copied ? "Copied" : "Copy address"}
                </button>
                <a
                  href={venue.mapUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-maroon px-5 py-2.5 font-body text-[12px] font-semibold tracking-[0.16em] text-cream uppercase transition-all duration-300 hover:bg-saffron-2"
                >
                  <Navigation className="h-4 w-4" />
                  Directions
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
