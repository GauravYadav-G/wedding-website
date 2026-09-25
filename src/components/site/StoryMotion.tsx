"use client";
import { useEffect } from "react";
export default function StoryMotion() {
  useEffect(() => {
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    if (reduced.matches) return;
    const animations: Animation[] = [];
    const living = new IntersectionObserver(entries => entries.forEach(entry => {
      (entry.target as HTMLElement).dataset.motionVisible = String(entry.isIntersecting);
    }), { rootMargin: "100px" });
    document.querySelectorAll(".living-chakra,.living-lamps,.peacock-dance,.peacock-gateway,.hero__corners,.memory-canopy").forEach(el => living.observe(el));
    const visibility = () => { document.body.dataset.motionHidden = String(document.hidden); };
    document.addEventListener("visibilitychange", visibility);
    visibility();
    const observer = new IntersectionObserver(entries => {
      if (reduced.matches) return;
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        // Content stays visible before enhancement, even during a fast scroll.
        animations.push(entry.target.animate([
          { opacity: .35, transform: "translateY(28px) scale(.985)", filter: "blur(10px)" },
          { opacity: 1, transform: "translateY(0) scale(1)", filter: "blur(0px)" },
        ], { duration: 1050, easing: "cubic-bezier(.16,1,.3,1)", fill: "both" }));
        observer.unobserve(entry.target);
      });
    }, { rootMargin: "80px 0px", threshold: 0 });
    document.querySelectorAll("[data-story]").forEach(el => observer.observe(el));
    const artwork = new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      animations.push(entry.target.animate([
        { transform: "scale(1.045)", filter: "saturate(.88) blur(3px)" },
        { transform: "scale(1)", filter: "saturate(1) blur(0px)" },
      ], { duration: 1800, easing: "cubic-bezier(.16,1,.3,1)", fill: "both" }));
      artwork.unobserve(entry.target);
    }), { rootMargin: "100px 0px", threshold: .08 });
    document.querySelectorAll(".family-blessing-art img,.venue-palace img,.forever-art img").forEach(el => artwork.observe(el));
    const stop = () => { if(reduced.matches) { observer.disconnect(); animations.forEach(animation => animation.cancel()); } };
    reduced.addEventListener("change", stop);
    return () => { living.disconnect(); artwork.disconnect(); document.removeEventListener("visibilitychange", visibility); delete document.body.dataset.motionHidden; observer.disconnect(); animations.forEach(animation => animation.cancel()); reduced.removeEventListener("change", stop); };
  }, []);
  return null;
}
