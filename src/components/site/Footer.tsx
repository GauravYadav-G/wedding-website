import { Heart, MapPin } from "lucide-react";
import { Mandala } from "./Ornaments";
import { wedding } from "@/lib/wedding";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-maroon-2 py-16 text-cream md:py-20">
      <div className="dot-grid-light absolute inset-0 opacity-40" aria-hidden />
      <Mandala
        className="absolute -bottom-40 left-1/2 h-[36rem] w-[36rem] -translate-x-1/2 animate-spin-slower text-gold-2/10"
        aria-hidden
      />

      <div className="relative mx-auto flex max-w-4xl flex-col items-center px-5 text-center md:px-8">
        <p className="font-hindi text-4xl text-gold-2 md:text-5xl">सीता राम</p>

        <p className="mt-6 flex flex-wrap items-center justify-center gap-3 font-display text-3xl font-semibold italic md:text-4xl">
          {wedding.groom.name}
          <Heart className="h-5 w-5 fill-saffron text-saffron" aria-hidden />
          {wedding.bride.name}
        </p>

        <p className="mt-3 flex items-center gap-2 font-body text-sm tracking-[0.2em] text-cream/60 uppercase">
          <MapPin className="h-4 w-4 text-gold-2" aria-hidden />
          09 · 12 · 2026 — {wedding.city}
        </p>

        <div className="mt-6 flex flex-wrap justify-center gap-5">{wedding.contacts.map(phone => <a key={phone} href={`tel:+91${phone}`} className="text-sm text-cream underline underline-offset-4">+91 {phone}</a>)}</div>



        <div className="mt-10 h-px w-40 bg-gradient-to-r from-transparent via-gold-2/50 to-transparent" aria-hidden />

        <p className="mt-7 font-display text-lg text-cream/75 italic">
          Your presence is our most beautiful gift
        </p>
        <p className="mt-2 font-hindi text-sm text-gold-2/80">
          ॥ जय सीता राम ॥
        </p>
      </div>
    </footer>
  );
}
