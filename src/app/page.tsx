import { FlowerShower } from "@/components/site/LivingDecor";
import Hero from "@/components/site/Hero";


import Events from "@/components/site/Events";
import GalleryStack from "@/components/site/GalleryStack";
import Venue from "@/components/site/Venue";
import Rsvp from "@/components/site/Rsvp";
import CountdownScene from "@/components/site/CountdownScene";
import Footer from "@/components/site/Footer";
import { wedding } from "@/lib/wedding";
import MusicToggle from "@/components/site/MusicToggle";
import StoryMotion from "@/components/site/StoryMotion";

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
    image: ["/artwork/cd0d21ec3e1a409a.webp", "/images/ayusha-deepak-3.jpg"],
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
        <Hero />
        <Events />
        <GalleryStack />
        <Venue />
        <Rsvp />
        <CountdownScene />
      </main>
      <Footer />
    </>
  );
}
