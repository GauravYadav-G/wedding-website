"use client";

import { useState, type FormEvent } from "react";
import { Check, Heart, LoaderCircle, Send, Sparkles } from "lucide-react";
import Reveal from "./Reveal";
import { Mandala } from "./Ornaments";

const inputClass =
  "w-full rounded-xl border border-gold/40 bg-cream-2/70 px-4 py-3.5 font-body text-ink placeholder:text-ink/40 transition-all duration-300 outline-none focus:border-saffron focus:ring-2 focus:ring-saffron/25";

export default function Wishes() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
        error?: string;
      };
      if (!res.ok || !data.ok) {
        throw new Error(data.error ?? "Could not send your blessing right now");
      }
      setSent(true);
      setName("");
      setMessage("");
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
      className="relative scroll-mt-24 overflow-hidden bg-cream py-20 md:py-28"
      aria-labelledby="wishes-title"
    >
      <Mandala
        className="absolute -top-24 -right-24 h-72 w-72 text-gold/10 pointer-events-none"
        aria-hidden
      />
      <Mandala
        className="absolute -bottom-28 -left-28 h-80 w-80 text-gold/10 pointer-events-none"
        aria-hidden
      />

      <div className="relative mx-auto max-w-4xl px-5 md:px-8">
        <header className="premium-heading text-center mb-10" data-story="">
          <span className="eyebrow">॥ आशीर्वाद ॥ · Held by love</span>
          <p className="script-accent">With every blessing</p>
          <h2 id="wishes-title" className="font-display text-4xl md:text-5xl text-maroon font-normal mt-2">
            Send Your Blessings
          </h2>
          <p className="mt-3 font-body text-sm md:text-base text-ink/70 max-w-lg mx-auto">
            Your heartfelt prayers and warm wishes will be delivered directly to Deepak &amp; Ayusha.
          </p>
        </header>

        <Reveal delay={100}>
          <div className="frame-double mx-auto max-w-xl rounded-[26px] bg-cream-3 p-7 md:p-10 shadow-[0_24px_60px_rgba(107,31,38,0.12)]">
            {sent ? (
              <div className="text-center py-6 animate-fade-in">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-saffron/15 text-saffron-2">
                  <Check className="h-8 w-8 stroke-[2.5]" />
                </div>
                <h3 className="font-display text-2xl md:text-3xl text-maroon font-semibold">
                  Thank You for Your Blessing!
                </h3>
                <p className="mt-3 font-body text-sm md:text-base leading-relaxed text-ink/75 max-w-md mx-auto">
                  Your heartfelt blessing has been received and emailed with love directly to Deepak &amp; Ayusha.
                </p>
                <div className="mt-7 flex items-center justify-center gap-2 font-display text-sm text-saffron-2">
                  <Heart className="h-4 w-4 fill-saffron text-saffron" />
                  <span>Deepak &amp; Ayusha treasure your love</span>
                </div>
                <button
                  type="button"
                  onClick={() => setSent(false)}
                  className="mt-8 inline-flex items-center gap-2 rounded-full border border-gold/45 px-6 py-2.5 font-body text-xs font-semibold tracking-[0.16em] uppercase text-ink/75 transition-all duration-300 hover:border-saffron hover:text-saffron-2 hover:bg-cream-2"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  Send Another Blessing
                </button>
              </div>
            ) : (
              <form onSubmit={submit} className="flex flex-col gap-5">
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="blessing-name"
                    className="font-body text-[11px] font-semibold tracking-[0.25em] text-ink/60 uppercase"
                  >
                    Your Name
                  </label>
                  <input
                    id="blessing-name"
                    type="text"
                    required
                    minLength={2}
                    maxLength={120}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Ramesh & Sunita Mishra"
                    className={inputClass}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="blessing-message"
                      className="font-body text-[11px] font-semibold tracking-[0.25em] text-ink/60 uppercase"
                    >
                      Your Blessing &amp; Wishes
                    </label>
                    <span className="font-body text-[11px] text-ink/40 tabular-nums">
                      {message.length}/500
                    </span>
                  </div>
                  <textarea
                    id="blessing-message"
                    required
                    rows={4}
                    minLength={2}
                    maxLength={500}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Write your prayers, blessings and warm wishes for the bride and groom…"
                    className={`${inputClass} resize-none leading-relaxed`}
                  />
                </div>

                {error ? (
                  <p
                    role="alert"
                    className="rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-center font-body text-sm text-red-700"
                  >
                    {error}
                  </p>
                ) : null}

                <button
                  type="submit"
                  disabled={submitting}
                  className="mt-2 flex w-full items-center justify-center gap-2.5 rounded-full bg-saffron-2 px-8 py-3.5 font-body text-[13px] font-semibold tracking-[0.22em] text-cream uppercase shadow-[0_14px_32px_rgba(169,74,16,0.3)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-maroon disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {submitting ? (
                    <>
                      <LoaderCircle className="h-4 w-4 animate-spin" />
                      Sending blessing…
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Send Blessing to Couple
                    </>
                  )}
                </button>

                <p className="mt-1 flex items-center justify-center gap-1.5 text-center font-body text-xs text-ink/50">
                  <Heart className="h-3.5 w-3.5 fill-saffron text-saffron" aria-hidden />
                  Delivered straight to Deepak &amp; Ayusha
                </p>
              </form>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
