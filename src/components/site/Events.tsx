import { PeacockDance } from "./LivingDecor";
import { ArrowUpRight, CalendarPlus, Flame, Flower2, Music2, Sun } from "lucide-react";
import { getVenue, wedding } from "@/lib/wedding";
const icons = [Sun, Flower2, Music2, Flame];
export default function Events() {
  return <section id="events" className="celebrations" aria-labelledby="celebrations-title">
    <div className="peacock-gateway" aria-label="Two peacocks on a flower-filled palace terrace">
      <picture><source media="(max-width:700px)" srcSet="/artwork/acf828b9baf56ad9.webp" /><img src="/artwork/6db71f5b0f5620aa.webp" alt="Two peacocks with their full heads and flowing tails on an ornate garden terrace" width="1515" height="3552" loading="eager" decoding="async" /></picture>
    </div>
    <div className="celebrations-content">
      <PeacockDance />
      <header className="premium-heading" data-story=""><span className="eyebrow">08 — 09 December 2026 · Greater Noida West</span><p className="script-accent">Our home fills with joy</p><h2 id="celebrations-title">First, the celebrations.</h2><p>On 8 December, join Deepak’s family at home for haldi, mehndi and sangeet.<br />The next day, gather with us as Deepak and Ayusha begin their married life.</p></header>
      <div className="celebration-grid">{wedding.events.map((event, index) => {
        const Icon = icons[index]; const venue = getVenue(event.venueId);
        return <article data-story="" className={`celebration-card ${index === 3 ? "celebration-card-wedding" : ""}`} key={event.id}>
          <span className="ceremony-icon"><Icon size={27} strokeWidth={1.15} aria-hidden="true" /></span>
          <span className="ceremony-hindi" lang="hi">{event.hindi}</span><h3>{event.name}</h3>
          <div className="ceremony-date"><strong>{index === 3 ? "09" : "08"}</strong><span>DECEMBER<br />{event.day}</span></div>
          <p className="ceremony-time">{event.timeLabel || "The wedding day"}</p><p className="ceremony-venue">{venue.name}</p>
          <div className="ceremony-actions"><a href={venue.mapUrl} target="_blank" rel="noreferrer">Directions <ArrowUpRight size={13} /></a><a href={`/api/calendar?event=${event.id}`} aria-label={`Add ${event.name} to calendar`}><CalendarPlus size={16} /></a></div>
        </article>;
      })}</div><p className="celebration-footnote">Two families, a thousand blessings, a lifetime of love.</p>
    </div>
  </section>;
}
