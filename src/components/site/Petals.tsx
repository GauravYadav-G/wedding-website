"use client";


import { PetalShape } from "./Ornaments";

const PETAL_COLORS = ["#e8913f", "#d96b2b", "#e7b45c", "#c24d1d", "#f0b45f"];

type PetalConfig = {
  left: number;
  delay: number;
  duration: number;
  size: number;
  color: string;
  opacity: number;
};

export default function Petals({ count = 14 }: { count?: number }) {
  const petals: PetalConfig[] = Array.from({ length: count }, (_, i) => ({
    left: (i * 37.7) % 100,
    delay: -((i * 2.7) % 18),
    duration: 12 + ((i * 3.1) % 10),
    size: 10 + ((i * 5.3) % 14),
    color: PETAL_COLORS[i % PETAL_COLORS.length],
    opacity: .45 + ((i * .07) % .4),
  }));

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {petals.map((p, i) => (
        <span
          key={i}
          className="petal"
          style={{
            left: `${p.left}%`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            opacity: p.opacity,
          }}
        >
          <PetalShape color={p.color} size={p.size} />
        </span>
      ))}
    </div>
  );
}
