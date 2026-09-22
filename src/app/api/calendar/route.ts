import { getVenue, wedding } from "@/lib/wedding";
export const dynamic = "force-dynamic";
function escapeIcs(value: string): string {
  return value.replace(/([,;\\])/g, "\\$1").replace(/\n/g, "\\n");
}
function stamp(date: Date) { return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z"; }
export async function GET(request: Request) {
  const eventId = new URL(request.url).searchParams.get("event");
  const events = eventId ? wedding.events.filter(event => event.id === eventId) : wedding.events;
  if (!events.length) return new Response("Event not found", { status: 404 });
  const lines = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Ayusha and Deepak//Wedding//EN", "CALSCALE:GREGORIAN", "METHOD:PUBLISH"];
  for (const event of events) {
    const venue = getVenue(event.venueId);
    const start = new Date(`${event.dateIso}T${event.time || "00:00"}:00+05:30`);
    const dates = event.time
      ? [`DTSTART:${stamp(start)}`, `DTEND:${stamp(new Date(start.getTime() + 3 * 3600000))}`]
      : [`DTSTART;VALUE=DATE:${event.dateIso.replace(/-/g, "")}`, `DTEND;VALUE=DATE:${new Date(new Date(event.dateIso).getTime() + 86400000).toISOString().slice(0,10).replace(/-/g, "")}`];
    lines.push("BEGIN:VEVENT", `UID:${event.id}@ayusha-deepak-wedding`, `DTSTAMP:${stamp(new Date())}`, ...dates,
      `SUMMARY:${escapeIcs(`Ayusha & Deepak — ${event.name}`)}`,
      `DESCRIPTION:${escapeIcs(`${event.note} ${wedding.hashtag}`)}`,
      `LOCATION:${escapeIcs(`${venue.name}, ${venue.address}`)}`, "END:VEVENT");
  }
  lines.push("END:VCALENDAR");
  return new Response(lines.join("\r\n"), { headers: { "Content-Type": "text/calendar; charset=utf-8", "Content-Disposition": 'attachment; filename="ayusha-deepak-wedding.ics"' } });
}
