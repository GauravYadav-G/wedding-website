"use client";
import { useEffect, useState } from "react";
const labels = ["Days", "Hours", "Minutes", "Seconds"];
export default function Countdown({ target, tone = "dark" }: { target: string; tone?: "dark" | "light" }) {
  const [parts, setParts] = useState<string[] | null>(null);
  useEffect(() => {
    const targetMs = new Date(target).getTime();
    let interval: ReturnType<typeof setInterval> | undefined;
    const tick = () => {
      const seconds = Math.max(0, Math.floor((targetMs - Date.now()) / 1000));
      setParts([Math.floor(seconds / 86400), Math.floor(seconds % 86400 / 3600), Math.floor(seconds % 3600 / 60), seconds % 60].map(part => String(part).padStart(2, "0")));
    };
    const sync = () => { clearInterval(interval); if(!document.hidden) { tick(); interval = setInterval(tick, 1000); } };
    sync(); document.addEventListener("visibilitychange", sync);
    return () => { clearInterval(interval); document.removeEventListener("visibilitychange", sync); };
  }, [target]);
  return <div className={`wedding-clock wedding-clock-${tone}`} role="timer" aria-label="Countdown to 9 December 2026"><div className="clock-numbers">{labels.map((label, index) => <div className="clock-unit" key={label}><span className="clock-value">{parts?.[index] ?? "—"}</span><span className="clock-label">{label}</span></div>)}</div></div>;
}
