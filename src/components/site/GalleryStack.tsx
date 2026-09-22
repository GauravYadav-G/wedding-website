"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { DiyaDivider } from "./Ornaments";

type CardConfig = {
  src: string;
  alt: string;
  /** stack phase: x (vw), y (vh), rotation (deg) */
  stack: [number, number, number];
  /** desktop spread phase: x (vw), y (vh), scale, width (vw) */
  target: [number, number, number, number];
  /** mobile spread phase: x (vw), y (vh), scale */
  small: [number, number, number];
};

const CARDS: CardConfig[] = [
  { src: "/images/ayusha-deepak-1.jpg", alt: "Ayusha and Deepak smiling at each other", stack: [-1.4, -1, -10], target: [-33, -10, 1, 20], small: [-29, -26, .85] },
  { src: "/images/ayusha-deepak-2.jpg", alt: "Ayusha and Deepak dancing together", stack: [-.5, -1.7, -4], target: [-19, 24, 1, 20], small: [29, -26, .85] },
  { src: "/images/ayusha-deepak-3.jpg", alt: "Ayusha and Deepak’s celebration portrait", stack: [.5, -1.7, 4], target: [19, 24, 1, 20], small: [-29, 27, .85] },
  { src: "/images/ayusha-deepak-4.jpg", alt: "Ayusha and Deepak together in the afternoon light", stack: [1.4, -1, 10], target: [33, -10, 1, 20], small: [29, 27, .85] },
];

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

export default function GalleryStack() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    if (!section || !stage) return;

    const cards = Array.from(
      stage.querySelectorAll<HTMLElement>(".stack-card")
    );
    const copy = copyRef.current;
    const hint = hintRef.current;

    const reduce = window
      .matchMedia("(prefers-reduced-motion: reduce)")
      .matches;
    const pointer = { x: 0, y: 0 };
    const rendered = { x: 0, y: 0 };
    let ticking = false;

    const render = () => {
      ticking = false;
      const rect = section.getBoundingClientRect();
      const travel = Math.max(1, rect.height - window.innerHeight);
      const raw = reduce ? 1 : clamp(-rect.top / travel, 0, 1);
      const progress = clamp((raw - 0.12) / 0.78, 0, 1);
      const small =
        window.matchMedia("(pointer: coarse)").matches ||
        window.innerWidth < 768;

      const targetPX = small ? 0 : pointer.x;
      const targetPY = small ? 0 : pointer.y;
      rendered.x += (targetPX - rendered.x) * 0.16;
      rendered.y += (targetPY - rendered.y) * 0.16;

      cards.forEach((card, i) => {
        const config = CARDS[i];
        if (!config) return;
        const endX = small ? config.small[0] : config.target[0];
        const endY = small ? config.small[1] : config.target[1];
        const endScale = small ? config.small[2] : config.target[2];

        const x = config.stack[0] + (endX - config.stack[0]) * progress;
        const y = config.stack[1] + (endY - config.stack[1]) * progress;
        const depth = 0.55 + (i / Math.max(1, CARDS.length - 1)) * 0.75;
        const px = x - rendered.x * 2.6 * depth * progress;
        const py = y - rendered.y * 2.2 * depth * progress;
        const rotation =
          reduce || small ? 0 : config.stack[2] * (1 - progress);
        const scale = 0.82 + (endScale - 0.82) * progress;
        const width = small ? 40 : config.target[3];

        card.style.width = `${width}vw`;
        card.style.transform = `translate(calc(-50% + ${px}vw), calc(-50% + ${py}vh)) rotate(${rotation}deg) scale(${scale})`;
      });

      if (copy) {
        const fade = clamp((progress - 0.3) / 0.35, 0, 1);
        copy.style.opacity = String(fade);
        copy.style.transform = `scale(${
          reduce ? 1 : 0.85 + 0.15 * clamp((progress - 0.3) / 0.6, 0, 1)
        })`;
      }
      if (hint) {
        hint.style.opacity = String(clamp(1 - raw / 0.12, 0, 1));
      }

      if (
        Math.abs(rendered.x - targetPX) > 0.005 ||
        Math.abs(rendered.y - targetPY) > 0.005
      ) {
        requestRender();
      }
    };

    const requestRender = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(render);
      }
    };

    const onPointerMove = (event: PointerEvent) => {
      if (reduce) return;
      const bounds = section.getBoundingClientRect();
      pointer.x = ((event.clientX - bounds.left) / Math.max(1, bounds.width)) * 2 - 1;
      pointer.y = (event.clientY / Math.max(1, window.innerHeight)) * 2 - 1;
      requestRender();
    };
    const onPointerLeave = () => {
      pointer.x = 0;
      pointer.y = 0;
      requestRender();
    };

    section.addEventListener("pointermove", onPointerMove, { passive: true });
    section.addEventListener("pointerleave", onPointerLeave);
    window.addEventListener("scroll", requestRender, { passive: true });
    window.addEventListener("resize", requestRender, { passive: true });
    requestRender();

    return () => {
      section.removeEventListener("pointermove", onPointerMove);
      section.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("scroll", requestRender);
      window.removeEventListener("resize", requestRender);
    };
  }, []);

  return (
    <section
      id="gallery"
      ref={sectionRef}
      className="relative bg-cream"
      style={{ height: "260vh" }}
      aria-label="Gallery of wedding moments"
    >
      <div ref={stageRef} className="stack-stage bg-gradient-to-b from-cream via-cream-2 to-cream">
        <div className="dot-grid absolute inset-0 opacity-60" aria-hidden />

        {/* mini header */}
        <div className="absolute inset-x-0 top-24 z-20 flex flex-col items-center gap-2 px-6 text-center md:top-28">
          <span className="font-body text-[11px] font-medium tracking-[0.45em] text-ink/60 uppercase">
            03 — The Gallery
          </span>
          <span className="font-hindi text-lg text-saffron-2">यादें</span>
          <DiyaDivider className="h-8 w-48" />
        </div>

        {/* photo cards */}
        {CARDS.map((card, i) => (
          <div
            key={card.src}
            className="stack-card z-10 aspect-square overflow-hidden rounded-2xl border-4 border-cream-3 shadow-[0_30px_70px_rgba(67,18,23,0.35)]"
            style={{ zIndex: 10 + i }}
          >
            <Image
              src={card.src}
              alt={card.alt}
              fill
              sizes="(max-width: 767px) 40vw, 19vw"
              className="object-cover"
            />
          </div>
        ))}

        {/* centre copy — revealed as the cards spread */}
        <div
          ref={copyRef}
          className="absolute top-1/2 left-1/2 z-30 w-[min(85vw,440px)] -translate-x-1/2 -translate-y-1/2 text-center opacity-0"
        >
          <p className="font-hindi text-xl text-saffron-2">प्रेम</p>
          <h3 className="mt-2 font-display text-4xl leading-tight font-semibold text-maroon md:text-5xl">
            Almost time for our forever
          </h3>
          <p className="mx-auto mt-4 max-w-md font-body text-base text-ink/70 md:text-lg">
            Four celebrations, one joyful beginning — a glimpse of the
            celebration waiting for us.
          </p>
        </div>

        {/* scroll hint */}
        <div
          ref={hintRef}
          className="absolute inset-x-0 bottom-10 z-30 flex flex-col items-center gap-2 text-ink/60"
        >
          <span className="font-body text-[10px] font-medium tracking-[0.4em] uppercase">
            Scroll to spread the moments
          </span>
          <ChevronDown className="h-5 w-5 animate-float" aria-hidden />
        </div>
      </div>
    </section>
  );
}
