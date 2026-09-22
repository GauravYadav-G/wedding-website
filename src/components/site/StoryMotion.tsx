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
          { opacity: .7, transform: "translateY(16px)" },
          { opacity: 1, transform: "translateY(0)" },
        ], { duration: 650, easing: "cubic-bezier(.2,.7,.2,1)" }));
        observer.unobserve(entry.target);
      });
    }, { rootMargin: "80px 0px", threshold: 0 });
    document.querySelectorAll("[data-story]").forEach(el => observer.observe(el));
    const stop = () => { if(reduced.matches) { observer.disconnect(); animations.forEach(animation => animation.cancel()); } };
    reduced.addEventListener("change", stop);
    return () => { living.disconnect(); document.removeEventListener("visibilitychange", visibility); delete document.body.dataset.motionHidden; observer.disconnect(); animations.forEach(animation => animation.cancel()); reduced.removeEventListener("change", stop); };
  }, []);
  return null;
}
