"use client";

import { useEffect, useMemo, useState } from "react";

const LABELS = ["Days", "Hours", "Minutes", "Seconds"];

export default function Countdown({
  target,
  tone = "dark",
}: {
  target: string;
  tone?: "dark" | "light";
}) {
  const targetMs = useMemo(() => new Date(target).getTime(), [target]);
  const [parts, setParts] = useState<string[] | null>(null);

  useEffect(() => {
    const tick = () => {
      const remaining = Math.max(0, targetMs - Date.now());
      const totalSeconds = Math.floor(remaining / 1000);
      setParts([
        String(Math.floor(totalSeconds / 86400)),
        String(Math.floor((totalSeconds % 86400) / 3600)).padStart(2, "0"),
        String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0"),
        String(totalSeconds % 60).padStart(2, "0"),
      ]);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetMs]);

  const blockClass =
    tone === "dark"
      ? "border-gold/40 bg-cream-3/85 text-maroon"
      : "border-gold-2/30 bg-maroon-2/40 text-cream backdrop-blur-sm";

  return (
    <div
      role="timer"
      aria-label="Countdown to the wedding"
      className="flex items-stretch gap-2 md:gap-3"
    >
      {LABELS.map((label, i) => (
        <div key={label} className="flex items-center gap-2 md:gap-3">
          <div
            className={`flex min-w-16 flex-col items-center rounded-2xl border px-3 py-2.5 shadow-[0_10px_30px_rgba(107,31,38,0.12)] md:min-w-20 md:px-4 md:py-3 ${blockClass}`}
          >
            <span className="font-display text-3xl leading-none font-semibold tabular-nums md:text-4xl">
              {parts ? parts[i] : "--"}
            </span>
            <span
              className={`mt-1 font-body text-[10px] font-medium uppercase tracking-[0.28em] ${
                tone === "dark" ? "text-ink/55" : "text-cream/70"
              }`}
            >
              {label}
            </span>
          </div>
          {i < LABELS.length - 1 ? (
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                tone === "dark" ? "bg-gold" : "bg-gold-2"
              }`}
              aria-hidden
            />
          ) : null}
        </div>
      ))}
    </div>
  );
}
