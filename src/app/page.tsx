import { desc, sql } from "drizzle-orm";
import { db } from "@/db";
import { rsvps, wishes } from "@/db/schema";
import Nav from "@/components/site/Nav";
import Hero from "@/components/site/Hero";


import Events from "@/components/site/Events";
import GalleryStack from "@/components/site/GalleryStack";
import Venue from "@/components/site/Venue";
import Rsvp from "@/components/site/Rsvp";
import Wishes from "@/components/site/Wishes";
import Countdown from "@/components/site/Countdown";
import Footer from "@/components/site/Footer";
import MusicToggle from "@/components/site/MusicToggle";
import { wedding, type RsvpStats, type Wish } from "@/lib/wedding";

export const dynamic = "force-dynamic";

const DEFAULT_STATS: RsvpStats = {
  total: 0,
  attending: 0,
  guests: 0,
  maybe: 0,
};

async function getData(): Promise<{ stats: RsvpStats; wishList: Wish[] }> {
  if (!process.env.DATABASE_URL) return { stats: DEFAULT_STATS, wishList: [] };
  try {
    const [statsRow] = await db
      .select({
        total: sql<number>`count(*)::int`,
        attending: sql<number>`(count(*) filter (where attendance = 'yes'))::int`,
        guests: sql<number>`(coalesce(sum(guests) filter (where attendance = 'yes'), 0))::int`,
        maybe: sql<number>`(count(*) filter (where attendance = 'maybe'))::int`,
      })
      .from(rsvps);

    const wishRows = await db
      .select()
      .from(wishes)
      .orderBy(desc(wishes.createdAt))
      .limit(30);

    return {
      stats: statsRow ?? DEFAULT_STATS,
      wishList: wishRows.map((row) => ({
        id: row.id,
        name: row.name,
        message: row.message,
        createdAt: row.createdAt.toISOString(),
      })),
    };
  } catch (error) {
    console.error("Could not load wedding data", error);
    return { stats: DEFAULT_STATS, wishList: [] };
  }
}

export default async function HomePage() {
  const { stats, wishList } = await getData();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: `${wedding.bride.fullName} & ${wedding.groom.fullName} — Wedding`,
    startDate: wedding.dateIso,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: {
      "@type": "Place",
      name: wedding.venues[1].name,
      address: {
        "@type": "PostalAddress",
        streetAddress: wedding.venues[1].address,
        addressLocality: "Greater Noida West",
        addressRegion: "Uttar Pradesh",
        postalCode: "201009",
        addressCountry: "IN",
      },
    },
    image: ["/artwork/cd0d21ec3e1a409a.webp", "/images/ayusha-deepak-3.jpg"],
    description:
      "Ayusha weds Deepak — wedding celebrations in Greater Noida West on 8th and 9th December 2026.",
    organizer: {
      "@type": "Person",
      name: "The families of Ayusha and Deepak",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Nav />
      <main>
        <Hero />
        <Events />
        <section className="couple-intro"><h2><span>Meet the</span>BRIDE &amp; GROOM</h2><div className="couple-message"><p>Our hearts are full and our smiles wide. We’re ready to make memories that last a lifetime, and they’ll be incomplete without you by our side. Come celebrate our love, share our joy, and help us make this day a beautiful, laughter-filled beginning.</p></div></section>
        <GalleryStack />
        <Venue />
        <Rsvp initialStats={stats} />
        <Wishes initialWishes={wishList} />
        <section className="scene-countdown">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/artwork/c22fb695b0b75f19.webp" alt="An elephant holding a lotus beside a tranquil wedding lake" loading="lazy" />
          <div><h2>The countdown begins</h2><p>Our families are excited to welcome you as we celebrate one of the happiest days of our lives.</p><Countdown target={wedding.countdownTarget} tone="dark" /></div>
        </section>
      </main>
      <Footer />
      <MusicToggle />
    </>
  );
}
