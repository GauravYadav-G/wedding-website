"use client";
import { useEffect, useRef } from "react";
import { ArrowDown } from "lucide-react";

const clamp = (value: number) => Math.max(0, Math.min(1, value));
export default function Hero() {
  const root = useRef<HTMLElement>(null);
  useEffect(() => {
    const section = root.current;
    if (!section) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const video = section.querySelector<HTMLVideoElement>(".ceremony-video")!;
    const line = section.querySelector<HTMLElement>(".ceremony-scroll i")!;
    const title = section.querySelector<HTMLElement>(".ceremony-title")!;
    let frame = 0, top = 0, distance = 1, progress = 0;
    let seekQueued = false;
    let visible = true, disposed = false;
    const measure = () => {
      top = section.getBoundingClientRect().top + window.scrollY;
      distance = Math.max(1, section.offsetHeight - innerHeight);
    };
    const paintInterface = () => {
      line.style.transform = `scaleX(${progress})`;
      title.style.opacity = String(1 - clamp(progress / .3));
      section.dataset.phase = progress < .25 ? "arrival" : progress < .5 ? "together" : "varmala";
      section.dataset.progress = progress.toFixed(3);
      section.style.setProperty("--ceremony-exit", String(clamp((progress - .87) / .13)));
    };
    const seek = () => {
      if (disposed || video.readyState < 1 || !Number.isFinite(video.duration)) return;
      const desired = (reduced.matches ? .5 : progress) * Math.max(0, video.duration - .04);
      if (Math.abs(video.currentTime - desired) < 1 / 48) return;
      if (video.seeking) { seekQueued = true; return; }
      seekQueued = false;
      video.currentTime = desired;
    };
    const update = () => {
      frame = 0;
      if (disposed || document.hidden || !visible) return;
      progress = clamp((window.scrollY - top) / distance);
      paintInterface();
      seek();
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    const resize = () => { measure(); schedule(); };
    const mediaReady = () => { video.pause(); seek(); };
    const seeked = () => { if (seekQueued) requestAnimationFrame(seek); };
    const viewportResize = () => {
      resize();
      // Browser chrome changing height must not discard downloaded frames.
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      document.documentElement.dataset.ceremonyActive = String(visible);
      if (visible) schedule();
    });
    observer.observe(section);
    const visibility = () => schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", viewportResize);
    document.addEventListener("visibilitychange", visibility);
    video.addEventListener("loadedmetadata", mediaReady);
    video.addEventListener("seeked", seeked);
    reduced.addEventListener("change", schedule);
    video.load();
    resize();
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
      delete document.documentElement.dataset.ceremonyActive;
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", viewportResize);
      document.removeEventListener("visibilitychange", visibility);
      video.removeEventListener("loadedmetadata", mediaReady);
      video.removeEventListener("seeked", seeked);
      reduced.removeEventListener("change", schedule);
    };
  }, []);
  return (
    <section ref={root} id="home" className="varmala-story" aria-label="Deepak and Ayusha approach each other and exchange varmala as you scroll">
      <div className="varmala-stage">
        <picture className="ceremony-environment"><source media="(max-aspect-ratio:1/1)" srcSet="/video/ceremony-scroll-mobile-poster.webp"/><img src="/video/ceremony-scroll-desktop-poster.webp" alt="" fetchPriority="high"/></picture>
        <video className="ceremony-video" muted playsInline preload="auto" disablePictureInPicture aria-hidden="true">
          <source media="(max-aspect-ratio:1/1)" src="/video/ceremony-scroll-mobile.mp4" type="video/mp4" />
          <source src="/video/ceremony-scroll-desktop.mp4" type="video/mp4" />
        </video>
        <div className="ceremony-light" aria-hidden="true"/><div className="ceremony-exit" aria-hidden="true"/>
        <header className="ceremony-title"><p lang="hi">॥ सीता राम ॥</p><span className="eyebrow">Together with our families</span><h1>Deepak <span>&amp;</span> Ayusha</h1><p className="ceremony-title-date">09 December 2026 · Greater Noida West</p></header>
        <div className="ceremony-narration"><p data-caption="arrival">Two paths. One beautiful beginning.</p><p data-caption="together">With every step, closer to forever.</p><p data-caption="varmala">Two garlands. A promise for a lifetime.</p></div>
        <div className="ceremony-scroll"><span>Scroll to bring our story to life</span><ArrowDown size={17}/><div><i/></div></div>
        <a className="ceremony-skip" href="#invitation">Read the invitation <span aria-hidden="true">↗</span></a>
      </div>
    </section>
  );
}
