import { Mandala } from "./Ornaments";
import { wedding } from "@/lib/wedding";

const ITEMS = [
  "शुभ विवाह",
  "Ayusha weds Deepak",
  "Save the Date",
  "09 · 12 · 2026",
  "Greater Noida West, Uttar Pradesh",
  "शुभ विवाह",
  wedding.hashtag,
  "Save the Date",
];

export default function Marquee() {
  const doubled = [...ITEMS, ...ITEMS];
  return (
    <div
      aria-hidden
      className="marquee-mask relative overflow-hidden border-y border-gold/30 bg-maroon py-4 text-cream"
    >
      <div className="animate-marquee flex w-max items-center gap-12 whitespace-nowrap pr-12">
        {doubled.map((item, i) => (
          <span key={i} className="flex items-center gap-12">
            <span
              className={
                /[\u0900-\u097F]/.test(item)
                  ? "font-hindi text-lg text-gold-2"
                  : "font-body text-sm font-medium tracking-[0.3em] uppercase"
              }
            >
              {item}
            </span>
            <Mandala className="h-4 w-4 shrink-0 text-gold/50" />
          </span>
        ))}
      </div>
    </div>
  );
}
