"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Mandala } from "./Ornaments";

const LINKS = [
  { href: "#invitation", label: "Invitation" },
  { href: "#events", label: "Events" },
  { href: "#gallery", label: "Gallery" },
  { href: "#venue", label: "Venue" },
  { href: "#rsvp", label: "RSVP" },
  { href: "#wishes", label: "Wishes" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled
            ? "border-b border-gold/25 bg-cream shadow-[0_8px_30px_rgba(67,18,23,0.08)]"
            : "invisible pointer-events-none -translate-y-full opacity-0"
        }`}
      >
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 md:h-[72px] md:px-8">
          <a
            href="#home"
            className="group flex items-center gap-3"
            aria-label="Ayusha weds Deepak — back to top"
          >
            <Mandala className="h-9 w-9 text-saffron transition-transform duration-700 group-hover:rotate-90" />
            <span className="flex flex-col leading-none">
              <span className="font-display text-xl font-semibold tracking-wide text-maroon">
                Ayusha <span className="font-hindi text-saffron-2">&amp;</span> Deepak
              </span>
              <span className="mt-1 font-body text-[10px] font-medium uppercase tracking-[0.35em] text-ink/60">
                09 · 12 · 2026
              </span>
            </span>
          </a>

          <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary">
            {LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="group relative font-body text-[13px] font-medium uppercase tracking-[0.18em] text-ink/75 transition-colors hover:text-maroon"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 h-px w-0 bg-saffron transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
            <a
              href="#rsvp"
              className="rounded-full bg-maroon px-6 py-2.5 font-body text-[13px] font-medium uppercase tracking-[0.18em] text-cream transition-all duration-300 hover:bg-saffron-2 hover:shadow-[0_10px_24px_rgba(169,74,16,0.35)]"
            >
              Reserve
            </a>
          </nav>

          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-gold/40 text-maroon lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </header>

      {/* mobile overlay menu */}
      <div
        className={`fixed inset-0 z-[60] flex flex-col bg-maroon-2 text-cream transition-all duration-500 lg:hidden ${
          open ? "visible opacity-100" : "invisible opacity-0"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
      >
        <div className="dot-grid-light pointer-events-none absolute inset-0 opacity-40" />
        <div className="flex h-16 items-center justify-between px-5">
          <span className="font-display text-xl font-semibold">Ayusha &amp; Deepak</span>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-gold-2/40 text-cream"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="relative flex flex-1 flex-col items-center justify-center gap-2" aria-label="Mobile">
          {LINKS.map((link, i) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={`py-3 font-display text-4xl font-medium text-cream transition-all duration-500 hover:text-gold-2 ${
                open ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
              }`}
              style={{ transitionDelay: `${80 + i * 60}ms` }}
            >
              {link.label}
            </a>
          ))}
          <span className="mt-6 font-hindi text-gold-2">॥ जय श्री राम ॥</span>
        </nav>
      </div>
    </>
  );
}
