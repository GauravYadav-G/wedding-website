"use client";

import { useState, type FormEvent } from "react";
import { Heart, LoaderCircle, MessageCircleHeart, Send } from "lucide-react";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import { Mandala } from "./Ornaments";
import type { Wish } from "@/lib/wedding";

function formatStamp(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

const AVATAR_TONES = [
  "bg-saffron/12 text-saffron-2",
  "bg-maroon/10 text-maroon",
  "bg-gold/15 text-gold",
  "bg-saffron-2/12 text-saffron-2",
];

const inputClass =
  "w-full rounded-xl border border-gold/40 bg-cream-2/50 px-4 py-3.5 font-body text-ink placeholder:text-ink/40 transition-all duration-300 outline-none focus:border-saffron focus:ring-2 focus:ring-saffron/25";

export default function Wishes({ initialWishes }: { initialWishes: Wish[] }) {
  const [wishes, setWishes] = useState<Wish[]>(initialWishes);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [justPosted, setJustPosted] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/wishes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, message }),
      });
      const data = (await res.json()) as {
        ok: boolean;
        wish?: Wish;
        error?: string;
      };
      if (!res.ok || !data.ok || !data.wish) {
        throw new Error(data.error ?? "Could not post your wish");
      }
      setWishes((prev) => [data.wish as Wish, ...prev]);
      setName("");
      setMessage("");
      setJustPosted(true);
      window.setTimeout(() => setJustPosted(false), 2400);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      id="wishes"
      className="dot-grid relative scroll-mt-24 overflow-hidden bg-cream py-24 md:py-32"
    >
      <Mandala
        className="absolute -top-28 -right-28 h-80 w-80 text-gold/10"
        aria-hidden
      />
      <Mandala
        className="absolute -bottom-32 -left-32 h-96 w-96 text-gold/10"
        aria-hidden
      />

      <div className="relative mx-auto max-w-6xl px-5 md:px-8">
        <Reveal>
          <SectionHeading
            hindi="आशीर्वाद"
            title="Blessings & Wishes"
            index="06 — From the people we love"
          />
        </Reveal>

        <Reveal delay={100} className="mt-12">
          <div className="frame-double mx-auto max-w-2xl rounded-[26px] bg-cream-3 p-6 shadow-[0_24px_60px_rgba(107,31,38,0.12)] md:p-8">
            <form onSubmit={submit}>
              <div className="flex flex-col gap-5 md:flex-row">
                <div className="flex flex-1 flex-col gap-2">
                  <label
                    htmlFor="wish-name"
                    className="font-body text-[11px] font-semibold tracking-[0.25em] text-ink/60 uppercase"
                  >
                    Your name
                  </label>
                  <input
                    id="wish-name"
                    type="text"
                    required
                    minLength={2}
                    maxLength={120}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Meera & Karan"
                    className={inputClass}
                  />
                </div>
                <div className="flex flex-col gap-2 md:w-64">
                  <label
                    htmlFor="wish-message"
                    className="flex items-center justify-between font-body text-[11px] font-semibold tracking-[0.25em] text-ink/60 uppercase"
                  >
                    Wish
                    <span className="tabular-nums">{message.length}/280</span>
                  </label>
                  <input
                    id="wish-message"
                    type="text"
                    required
                    minLength={2}
                    maxLength={280}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder=" Shower your blessings…"
                    className={inputClass}
                  />
                </div>
              </div>
              {error ? (
                <p
                  role="alert"
                  className="mt-4 rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-center font-body text-sm text-red-700"
                >
                  {error}
                </p>
              ) : null}
              <button
                type="submit"
                disabled={submitting}
                className="mt-5 flex w-full items-center justify-center gap-2.5 rounded-full bg-saffron-2 px-8 py-3.5 font-body text-[13px] font-semibold tracking-[0.22em] text-cream uppercase shadow-[0_14px_32px_rgba(169,74,16,0.3)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-maroon disabled:cursor-not-allowed disabled:opacity-70"
              >
                {submitting ? (
                  <>
                    <LoaderCircle className="h-4 w-4 animate-spin" />
                    Posting…
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    {justPosted ? "Posted — thank you!" : "Post a wish"}
                  </>
                )}
              </button>
            </form>
          </div>
        </Reveal>

        {/* wishes wall */}
        <div className="mt-14 columns-1 gap-5 sm:columns-2 lg:columns-3">
          {wishes.map((wish, i) => (
            <Reveal key={wish.id} delay={Math.min(i, 4) * 70} className="mb-5 break-inside-avoid">
              <figure className="group rounded-2xl border border-gold/25 bg-cream-3 p-6 shadow-[0_14px_36px_rgba(107,31,38,0.08)] transition-all duration-500 hover:-translate-y-1 hover:border-gold/50 hover:shadow-[0_22px_50px_rgba(107,31,38,0.14)]">
                <div className="flex items-center gap-3.5">
                  <span
                    className={`flex h-11 w-11 items-center justify-center rounded-full font-display text-xl font-semibold ${
                      AVATAR_TONES[i % AVATAR_TONES.length]
                    }`}
                    aria-hidden
                  >
                    {wish.name.trim().charAt(0).toUpperCase()}
                  </span>
                  <div>
                    <figcaption className="font-display text-lg leading-tight font-semibold text-maroon">
                      {wish.name}
                    </figcaption>
                    <span className="font-body text-xs text-ink/50">
                      {formatStamp(wish.createdAt)}
                    </span>
                  </div>
                </div>
                <blockquote className="mt-4 flex gap-2.5 font-body text-[15px] leading-relaxed text-ink/80">
                  <MessageCircleHeart
                    className="mt-0.5 h-4.5 w-4.5 shrink-0 text-saffron/70"
                    aria-hidden
                  />
                  {wish.message}
                </blockquote>
              </figure>
            </Reveal>
          ))}
        </div>

        {wishes.length === 0 ? (
          <p className="mt-10 text-center font-display text-2xl text-ink/50 italic">
            Be the first to leave a blessing…
          </p>
        ) : null}

        <p className="mt-4 flex items-center justify-center gap-2 text-center font-body text-sm text-ink/55">
          <Heart className="h-4 w-4 fill-saffron text-saffron" aria-hidden />
          Every wish is treasured by the couple
        </p>
      </div>
    </section>
  );
}
