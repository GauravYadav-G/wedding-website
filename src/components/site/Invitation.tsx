import Image from "next/image";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import { CornerFlourish, Mandala } from "./Ornaments";
import { wedding } from "@/lib/wedding";

export default function Invitation() {
  return (
    <section
      id="invitation"
      className="dot-grid relative scroll-mt-24 overflow-hidden bg-cream py-24 md:py-32"
    >
      {/* watermark mandalas */}
      <Mandala
        className="absolute -top-24 -left-24 h-72 w-72 text-gold/10"
        aria-hidden
      />
      <Mandala
        className="absolute -right-28 -bottom-28 h-96 w-96 text-gold/10"
        aria-hidden
      />

      <div className="relative mx-auto max-w-3xl px-5 md:px-8">
        <Reveal>
          <SectionHeading hindi="शुभ आरंभ" title="The Invitation" index="01 — With love" />
        </Reveal>

        <Reveal delay={120} className="mt-14">
          <div className="frame-double relative rounded-[28px] bg-cream-3 px-6 py-12 text-center shadow-[0_30px_80px_rgba(107,31,38,0.14)] md:px-16 md:py-16">
            <CornerFlourish className="absolute top-3 left-3 h-14 w-14 text-gold/60" />
            <CornerFlourish className="absolute top-3 right-3 h-14 w-14 rotate-90 text-gold/60" />
            <CornerFlourish className="absolute bottom-3 left-3 h-14 w-14 -rotate-90 text-gold/60" />
            <CornerFlourish className="absolute right-3 bottom-3 h-14 w-14 rotate-180 text-gold/60" />

            <p className="font-hindi text-base text-saffron-2 md:text-lg">
              ॥ श्री गणेशाय नमः ॥
            </p>

            <p className="mt-7 font-body text-[11px] font-medium tracking-[0.45em] text-ink/60 uppercase md:text-xs">
              Together with their families
            </p>

            <p className="mx-auto mt-6 max-w-md font-display text-xl leading-relaxed text-ink md:text-2xl">
              {wedding.groom.sonOf} request the honour of your gracious
              presence at the wedding of their beloved son
            </p>

            <p className="gold-text mt-5 font-display text-6xl font-semibold italic md:text-7xl">
              {wedding.groom.name}
            </p>

            <p className="mt-4 font-display text-lg text-ink/70 italic md:text-xl">
              with his soulmate
            </p>

            <p className="gold-text mt-3 font-display text-6xl font-semibold italic md:text-7xl">
              {wedding.bride.name}
            </p>

            <p className="mt-5 font-display text-lg text-ink/80 italic md:text-xl">
              daughter of {wedding.bride.daughterOf}
            </p>

            {/* arch photo */}
            <div className="relative mx-auto mt-12 w-64 md:w-72">
              <div className="frame-double arch-top relative aspect-[3/4] overflow-hidden rounded-[999px_999px_18px_18px] border-gold/60">
                <Image
                  src="/images/couple-candid.jpg"
                  alt={`${wedding.groom.fullName} and ${wedding.bride.fullName} laughing together at golden hour`}
                  fill
                  sizes="(min-width: 768px) 288px, 256px"
                  className="object-cover"
                />
                <div
                  className="absolute inset-0 bg-gradient-to-t from-maroon/25 to-transparent"
                  aria-hidden
                />
              </div>
              <Mandala
                className="absolute -right-10 -bottom-4 h-20 w-20 animate-spin-slower text-saffron/70"
                aria-hidden
              />
              <span
                className="absolute -top-3 -left-6 h-12 w-12 rounded-full border border-gold/50 bg-cream-3"
                aria-hidden
              />
            </div>

            {/* shloka */}
            <blockquote className="mx-auto mt-12 max-w-xl">
              <p className="font-hindi text-xl leading-relaxed text-maroon md:text-2xl">
                समंजन्तु विश्वे देवाः समापो हृदयानि नौ
              </p>
              <p className="mt-4 font-display text-lg text-ink/75 italic md:text-xl">
                “May all the divine powers unite our hearts as one.”
              </p>
              <footer className="mt-3 font-body text-[11px] font-medium tracking-[0.35em] text-ink/50 uppercase">
                Rigveda X.85.47
              </footer>
            </blockquote>

            <div className="mt-10 flex items-center justify-center gap-4" aria-hidden>
              <span className="h-px w-16 bg-gradient-to-r from-transparent to-gold/60" />
              <Mandala className="h-8 w-8 text-gold/70" />
              <span className="h-px w-16 bg-gradient-to-l from-transparent to-gold/60" />
            </div>

            <p className="mt-8 font-display text-2xl text-maroon italic md:text-3xl">
              We await your gracious presence
            </p>
            <p className="mt-2 font-body text-sm tracking-[0.2em] text-ink/60 uppercase">
              {wedding.dateLabel} · {wedding.city}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
