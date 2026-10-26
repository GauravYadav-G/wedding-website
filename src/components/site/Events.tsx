"use client";

import { useEffect, useRef, useState } from "react";
import { PeacockDance } from "./LivingDecor";
import { ArrowUpRight, CalendarPlus, Flame, Flower2, Music2, Sun } from "lucide-react";
import { getVenue, wedding } from "@/lib/wedding";

const icons = [Sun, Flower2, Music2, Flame];

export default function Events() {
  const trackRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const track = trackRef.current;
    const grid = gridRef.current;
    if (!track || !grid) return;

    let rafId: number | null = null;

    const updateScroll = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        if (window.innerWidth > 700) {
          if (grid.style.transform) grid.style.transform = "";
          return;
        }

        const rect = track.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const totalDistance = rect.height - windowHeight;

        if (totalDistance <= 0) return;

        const rawProgress = -rect.top / totalDistance;
        const progress = Math.max(0, Math.min(1, rawProgress));

        const cards = grid.children;
        if (cards.length > 1) {
          const firstCard = cards[0] as HTMLElement;
          const lastCard = cards[cards.length - 1] as HTMLElement;
          const maxTranslate = lastCard.offsetLeft - firstCard.offsetLeft;
          const currentTranslate = progress * maxTranslate;
          grid.style.transform = `translate3d(-${currentTranslate.toFixed(2)}px, 0, 0)`;

          const index = Math.min(
            cards.length - 1,
            Math.round(progress * (cards.length - 1))
          );
          setActiveIndex(index);
        }
      });
    };

    window.addEventListener("scroll", updateScroll, { passive: true });
    window.addEventListener("resize", updateScroll, { passive: true });
    updateScroll();

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", updateScroll);
      window.removeEventListener("resize", updateScroll);
    };
  }, []);

  return (
    <section id="events" className="celebrations" aria-labelledby="celebrations-title">
      <div className="peacock-gateway" aria-label="Two peacocks on a flower-filled palace terrace">
        <picture>
          <source media="(max-width:700px)" srcSet="/artwork/acf828b9baf56ad9.webp" />
          <img
            src="/artwork/6db71f5b0f5620aa.webp"
            alt="Two peacocks with their full heads and flowing tails on an ornate garden terrace"
            width="1515"
            height="3552"
            loading="eager"
            decoding="async"
          />
        </picture>
      </div>
      <div className="celebrations-content">
        <PeacockDance />
        <header className="premium-heading" data-story="">
          <span className="eyebrow">08 — 09 December 2026 · Greater Noida West</span>
          <p className="script-accent">Our home fills with joy</p>
          <h2 id="celebrations-title">First, the celebrations.</h2>
          <p>
            On 8 December, join Deepak’s family at home for haldi, mehndi and sangeet.
            <br />
            The next day, gather with us as Deepak and Ayusha begin their married life.
          </p>
        </header>

        <div className="celebration-track" ref={trackRef}>
          <div className="celebration-sticky">
            <div className="celebration-grid" ref={gridRef}>
              {wedding.events.map((event, index) => {
                const Icon = icons[index];
                const venue = getVenue(event.venueId);
                return (
                  <article
                    data-story=""
                    className={`celebration-card ${index === 3 ? "celebration-card-wedding" : ""}`}
                    key={event.id}
                  >
                    <span className="ceremony-icon">
                      <Icon size={27} strokeWidth={1.15} aria-hidden="true" />
                    </span>
                    <span className="ceremony-hindi" lang="hi">
                      {event.hindi}
                    </span>
                    <h3>{event.name}</h3>
                    <div className="ceremony-date">
                      <strong>{index === 3 ? "09" : "08"}</strong>
                      <span>
                        DECEMBER
                        <br />
                        {event.day}
                      </span>
                    </div>
                    <p className="ceremony-time">{event.timeLabel || "The wedding day"}</p>
                    <p className="ceremony-venue">{venue.name}</p>
                    <div className="ceremony-actions">
                      <a href={venue.mapUrl} target="_blank" rel="noreferrer">
                        Directions <ArrowUpRight size={13} />
                      </a>
                      <a
                        href={`/api/calendar?event=${event.id}`}
                        aria-label={`Add ${event.name} to calendar`}
                      >
                        <CalendarPlus size={16} />
                      </a>
                    </div>
                  </article>
                );
              })}
            </div>
            <div className="celebration-dots" aria-hidden="true">
              {wedding.events.map((_, i) => (
                <span
                  key={i}
                  className={`celebration-dot ${i === activeIndex ? "is-active" : ""}`}
                />
              ))}
            </div>
          </div>
        </div>

        <p className="celebration-footnote">
          Two families, a thousand blessings, a lifetime of love.
        </p>
      </div>
    </section>
  );
}
