import { FlowerShower } from "@/components/site/LivingDecor";
import CoupleFilm from "@/components/site/CoupleFilm";
import TempleScene from "@/components/site/TempleScene";
import Events from "@/components/site/Events";
import GalleryStack from "@/components/site/GalleryStack";
import Venue from "@/components/site/Venue";
import Rsvp from "@/components/site/Rsvp";
import CountdownScene from "@/components/site/CountdownScene";
import Footer from "@/components/site/Footer";
import { wedding } from "@/lib/wedding";
import MusicToggle from "@/components/site/MusicToggle";
import StoryMotion from "@/components/site/StoryMotion";
import OpeningEnvelope from "@/components/site/OpeningEnvelope";
import FamilyBlessing from "@/components/site/FamilyBlessing";
import ChapterBlend from "@/components/site/ChapterBlend";
import Wishes from "@/components/site/Wishes";

export default function HomePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: `${wedding.groom.fullName} & ${wedding.bride.fullName} — Wedding`,
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
    image: ["/images/ayusha-deepak-3.jpg"],
    description:
      "Deepak weds Ayusha — wedding celebrations in Greater Noida West on 8th and 9th December 2026.",
    organizer: {
      "@type": "Person",
      name: "The families of Deepak and Ayusha",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <StoryMotion />
      <MusicToggle />
      <FlowerShower />
      <main>
        <OpeningEnvelope />
        <TempleScene />
        <ChapterBlend tone="light" />
        <FamilyBlessing />
        <ChapterBlend tone="warm" />
        <Events />
        <ChapterBlend tone="dark" />
        <CoupleFilm />
        <ChapterBlend tone="dark" />
        <GalleryStack />
        <ChapterBlend tone="light" />
        <Venue />
        <ChapterBlend tone="warm" />
        <Rsvp />
        <ChapterBlend tone="warm" />
        <Wishes />
        <ChapterBlend tone="dark" />
        <CountdownScene />
      </main>
      <Footer />
    </>
  );
}
