/* eslint-disable @next/next/no-img-element */
import { getVenue, wedding } from "@/lib/wedding";
export default function Events() {
  return <section id="events" className="timeline" aria-labelledby="timeline-title">
    <div className="timeline__scenery" aria-hidden="true">
      <picture className="timeline__garden-underlay"><source media="(max-width:700px)" srcSet="/artwork/9833bdd6ffb94266.webp" /><img src="/artwork/8181dc1636014ee4.webp" alt="" /></picture>
      <picture className="timeline__backdrop"><source media="(max-width:700px)" srcSet="/artwork/acf828b9baf56ad9.webp" /><img src="/artwork/6db71f5b0f5620aa.webp" alt="" /></picture>
    </div>
    <div className="timeline__heading"><h2 id="timeline-title">Wedding <span>Celebration </span>Timeline</h2><p>Mark your calendars, we can’t wait to celebrate</p></div>
    <div className="timeline__cards">{wedding.events.map(event => <article className="timeline-card" key={event.id}>
      <img src="/artwork/timeline-card-blank.png" alt="" loading="lazy" />
      <div className="timeline-card__copy"><h3>{event.name.replace(" — The Wedding", "")}</h3><p>{event.day}<br />{event.dateLabel}<br />{wedding.city}<br />{event.timeLabel}</p><a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(getVenue(event.venueId).mapQuery)}`} target="_blank" rel="noreferrer">See the route ↗</a><a href={`/api/calendar?event=${event.id}`}>Add to calendar</a></div>
    </article>)}</div>
    <div className="timeline__ornaments" aria-hidden="true">{[0,1,2,3].map(i => <img key={i} src="/artwork/9f8fb90f116e078e.webp" alt="" />)}</div>
  </section>;
}
