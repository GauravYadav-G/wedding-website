import { Heart, MapPin } from "lucide-react";
import { Mandala } from "./Ornaments";
import { wedding } from "@/lib/wedding";

const LINKS = [
  { href: "#invitation", label: "Invitation" },
  { href: "#events", label: "Events" },
  { href: "#gallery", label: "Gallery" },
  { href: "#venue", label: "Venue" },
  { href: "#rsvp", label: "RSVP" },
  { href: "#wishes", label: "Wishes" },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-maroon-2 py-16 text-cream md:py-20">
      <div className="dot-grid-light absolute inset-0 opacity-40" aria-hidden />
      <Mandala
        className="absolute -bottom-40 left-1/2 h-[36rem] w-[36rem] -translate-x-1/2 animate-spin-slower text-gold-2/10"
        aria-hidden
      />

      <div className="relative mx-auto flex max-w-4xl flex-col items-center px-5 text-center md:px-8">
        <p className="font-hindi text-4xl text-gold-2 md:text-5xl">राम राम</p>

        <p className="mt-6 flex flex-wrap items-center justify-center gap-3 font-display text-3xl font-semibold italic md:text-4xl">
          {wedding.bride.name}
          <Heart className="h-5 w-5 fill-saffron text-saffron" aria-hidden />
          {wedding.groom.name}
        </p>

        <p className="mt-3 flex items-center gap-2 font-body text-sm tracking-[0.2em] text-cream/60 uppercase">
          <MapPin className="h-4 w-4 text-gold-2" aria-hidden />
          09 · 12 · 2026 — {wedding.city}
        </p>

        <div className="mt-6 flex flex-wrap justify-center gap-5">{wedding.contacts.map(phone => <a key={phone} href={`tel:+91${phone}`} className="text-sm text-cream underline underline-offset-4">+91 {phone}</a>)}</div>

        <nav
          className="mt-9 flex flex-wrap items-center justify-center gap-x-7 gap-y-3"
          aria-label="Footer"
        >
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="font-body text-[12px] font-medium tracking-[0.22em] text-cream/65 uppercase transition-colors hover:text-gold-2"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="mt-10 h-px w-40 bg-gradient-to-r from-transparent via-gold-2/50 to-transparent" aria-hidden />

        <p className="mt-7 font-display text-lg text-cream/75 italic">
          Crafted with devotion for the people we love
        </p>
        <p className="mt-2 font-hindi text-sm text-gold-2/80">
          ॥ जय श्री राम ॥
        </p>
      </div>
    </footer>
  );
}
