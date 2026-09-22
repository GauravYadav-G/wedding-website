"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Music } from "lucide-react";

/**
 * Ambient temple soundscape generated with WebAudio:
 * a soft tanpura-style drone plus occasional pentatonic bells.
 * No audio assets required — everything is synthesized.
 */
export default function MusicToggle() {
  const [playing, setPlaying] = useState(false);
  const ctxRef = useRef<AudioContext | null>(null);
  const masterRef = useRef<GainNode | null>(null);
  const bellTimerRef = useRef<number | null>(null);
  const playingRef = useRef(false);

  const teardown = useCallback(() => {
    playingRef.current = false;
    if (bellTimerRef.current) {
      window.clearInterval(bellTimerRef.current);
      bellTimerRef.current = null;
    }
    if (ctxRef.current) {
      void ctxRef.current.close().catch(() => {});
      ctxRef.current = null;
      masterRef.current = null;
    }
  }, []);

  useEffect(() => () => teardown(), [teardown]);

  const playBell = (ctx: AudioContext, master: GainNode, freq: number) => {
    const now = ctx.currentTime;
    const strike = (f: number, peak: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = f;
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(peak, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 4.5);
      osc.connect(gain).connect(master);
      osc.start(now);
      osc.stop(now + 5);
    };
    strike(freq, 0.09);
    strike(freq * 2.42, 0.03);
    strike(freq * 3.83, 0.012);
  };

  const start = () => {
    const Ctor =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!Ctor) return;
    const ctx = new Ctor();
    ctxRef.current = ctx;

    const master = ctx.createGain();
    master.gain.value = 0;
    master.connect(ctx.destination);
    masterRef.current = master;
    master.gain.linearRampToValueAtTime(1, ctx.currentTime + 2.5);

    // tanpura-ish drone
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 340;
    filter.Q.value = 0.6;
    filter.connect(master);

    const drones: Array<[number, number]> = [
      [110, 0.05],
      [110.7, 0.045],
      [164.8, 0.02],
      [220.4, 0.012],
    ];
    for (const [freq, vol] of drones) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      gain.gain.value = vol;
      osc.connect(gain).connect(filter);
      osc.start();
    }

    // breathing movement on the drone
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.frequency.value = 0.07;
    lfoGain.gain.value = 0.018;
    lfo.connect(lfoGain).connect(filter.frequency);
    lfo.start();

    // occasional soft bells (C5 D5 E5 G5)
    const bells = [523.25, 587.33, 659.25, 783.99];
    const scheduleBells = () => {
      if (!playingRef.current) return;
      const ctxNow = ctxRef.current;
      const masterNow = masterRef.current;
      if (!ctxNow || !masterNow) return;
      playBell(ctxNow, masterNow, bells[Math.floor(Math.random() * bells.length)]);
      bellTimerRef.current = window.setTimeout(
        scheduleBells,
        4200 + Math.random() * 3800
      );
    };
    bellTimerRef.current = window.setTimeout(scheduleBells, 1200);

    playingRef.current = true;
    setPlaying(true);
  };

  const stop = () => {
    playingRef.current = false;
    const ctx = ctxRef.current;
    const master = masterRef.current;
    if (bellTimerRef.current) {
      window.clearTimeout(bellTimerRef.current);
      bellTimerRef.current = null;
    }
    if (ctx && master) {
      master.gain.cancelScheduledValues(ctx.currentTime);
      master.gain.setValueAtTime(master.gain.value, ctx.currentTime);
      master.gain.linearRampToValueAtTime(0, ctx.currentTime + 1);
      window.setTimeout(() => teardown(), 1200);
    } else {
      teardown();
    }
    setPlaying(false);
  };


  return (
    <button
      type="button"
      onClick={() => (playing ? stop() : start())}
      aria-pressed={playing}
      aria-label={playing ? "Pause ambient music" : "Play ambient music"}
      className="group fixed right-5 bottom-5 z-50 flex h-13 w-13 items-center justify-center rounded-full border border-gold/50 bg-cream-3/90 text-maroon shadow-[0_12px_30px_rgba(67,18,23,0.25)] backdrop-blur transition-all duration-300 hover:bg-cream md:right-8 md:bottom-8"
    >
      <span
        className={`absolute inset-1 rounded-full border border-dashed border-saffron/50 transition-opacity duration-500 ${
          playing ? "animate-spin-slower opacity-100" : "opacity-0"
        }`}
        aria-hidden
      />
      <Music
        className={`h-5 w-5 transition-transform duration-300 group-hover:scale-110 ${
          playing ? "text-saffron" : "text-maroon"
        }`}
      />
    </button>
  );
}
