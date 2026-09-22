"use client";

import { useState, type FormEvent } from "react";
import {
  BadgeCheck,
  CalendarCheck,
  Check,
  Clock,
  Heart,
  LoaderCircle,
  Send,
  Users,
  X,
} from "lucide-react";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import { Mandala } from "./Ornaments";
import type { RsvpStats } from "@/lib/wedding";

type Attendance = "yes" | "no" | "maybe";

const ATTENDANCE_OPTIONS: Array<{
  value: Attendance;
  label: string;
  icon: typeof Check;
}> = [
  { value: "yes", label: "Joyfully Accepts", icon: Check },
  { value: "no", label: "Regretfully Declines", icon: X },
  { value: "maybe", label: "Will Confirm Later", icon: Clock },
];

const inputClass =
  "w-full rounded-xl border border-gold/40 bg-cream-2/60 px-4 py-3.5 font-body text-ink placeholder:text-ink/40 transition-all duration-300 outline-none focus:border-saffron focus:ring-2 focus:ring-saffron/25";

export default function Rsvp({ initialStats }: { initialStats: RsvpStats }) {
  const [stats, setStats] = useState<RsvpStats>(initialStats);
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [attendance, setAttendance] = useState<Attendance>("yes");
  const [guests, setGuests] = useState("1");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          mobile,
          attendance,
          guests: Number(guests.replace("+", "")) || 1,
          message,
        }),
      });
      const data = (await res.json()) as { ok: boolean; stats?: RsvpStats; error?: string };
      if (!res.ok || !data.ok) {
        throw new Error(data.error ?? "Could not save your RSVP");
      }
      if (data.stats) setStats(data.stats);
      setDone(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const reset = () => {
    setDone(false);
    setName("");
    setMobile("");
    setAttendance("yes");
    setGuests("1");
    setMessage("");
  };

  return (
    <section
      id="rsvp"
      className="relative scroll-mt-24 overflow-hidden bg-gradient-to-b from-maroon-2 via-maroon to-maroon-2 py-24 text-cream md:py-32"
    >
      <div className="dot-grid-light absolute inset-0 opacity-40" aria-hidden />
      <Mandala
        className="absolute top-1/2 left-1/2 h-[46rem] w-[46rem] -translate-x-1/2 -translate-y-1/2 animate-spin-slower text-gold-2/10"
        aria-hidden
      />

      <div className="relative mx-auto max-w-5xl px-5 md:px-8">
        <Reveal>
          <SectionHeading
            hindi="आपकी उपस्थिति"
            title="Will You Join Us?"
            index="05 — Kindly respond"
            tone="dark"
          />
        </Reveal>

        {/* live stats */}
        <Reveal delay={80} className="mt-10">
          <div className="mx-auto grid max-w-3xl grid-cols-3 gap-3 md:gap-5">
            {[
              { icon: Users, value: stats.guests, label: "Guests confirmed" },
              { icon: BadgeCheck, value: stats.attending, label: "Families accepted" },
              { icon: Clock, value: stats.maybe, label: "Awaiting replies" },
            ].map((item) => (
              <div
                key={item.label}
                className="flex flex-col items-center gap-1.5 rounded-2xl border border-gold-2/25 bg-cream-2/50 px-3 py-5 backdrop-blur-sm"
              >
                <item.icon className="h-5 w-5 text-gold-2" aria-hidden />
                <span className="font-display text-3xl font-semibold tabular-nums md:text-4xl">
                  {item.value}
                </span>
                <span className="text-center font-body text-[10px] font-medium tracking-[0.22em] text-ink/65 uppercase md:text-[11px]">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={140} className="mt-10">
          <div className="frame-double-light mx-auto max-w-2xl rounded-[26px] bg-cream-3 p-6 text-ink shadow-[0_18px_45px_rgba(100,65,30,0.1)] md:p-10">
            {done ? (
              <div className="flex flex-col items-center py-8 text-center">
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-saffron/12 text-saffron-2">
                  <CalendarCheck className="h-8 w-8" />
                </span>
                <h3 className="mt-5 font-display text-3xl font-semibold text-maroon">
                  Blessing received
                </h3>
                <p className="mt-3 max-w-sm font-body text-ink/70">
                  Thank you, {name.split(" ")[0] || "friend"} — your response has
                  been saved. We cannot wait to celebrate with you.
                </p>
                <p className="mt-2 font-hindi text-lg text-saffron-2">
                  धन्यवाद
                </p>
                <button
                  type="button"
                  onClick={reset}
                  className="mt-7 rounded-full border border-gold/50 px-7 py-3 font-body text-[12px] font-semibold tracking-[0.22em] text-maroon uppercase transition-all duration-300 hover:border-saffron hover:text-saffron-2"
                >
                  Send another response
                </button>
              </div>
            ) : (
              <form onSubmit={submit} noValidate={false}>
                <h3 className="text-center font-display text-3xl font-semibold text-maroon">
                  Please confirm your presence
                </h3>
                <p className="mt-2 text-center font-body text-sm text-ink/60">
                  Kindly respond before the celebrations
                </p>

                <div className="mt-8 grid gap-5 md:grid-cols-2">
                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="rsvp-name"
                      className="font-body text-[11px] font-semibold tracking-[0.25em] text-ink/60 uppercase"
                    >
                      Full name
                    </label>
                    <input
                      id="rsvp-name"
                      type="text"
                      required
                      minLength={2}
                      maxLength={120}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your good name"
                      className={inputClass}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="rsvp-mobile"
                      className="font-body text-[11px] font-semibold tracking-[0.25em] text-ink/60 uppercase"
                    >
                      Mobile number
                    </label>
                    <input
                      id="rsvp-mobile"
                      type="tel"
                      required
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      placeholder="+91 98765 43210"
                      className={inputClass}
                    />
                  </div>
                </div>

                <fieldset className="mt-6">
                  <legend className="mb-3 font-body text-[11px] font-semibold tracking-[0.25em] text-ink/60 uppercase">
                    Will you attend?
                  </legend>
                  <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                    {ATTENDANCE_OPTIONS.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setAttendance(option.value)}
                        aria-pressed={attendance === option.value}
                        className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-3 font-body text-[13px] font-medium transition-all duration-300 ${
                          attendance === option.value
                            ? "border-saffron bg-saffron/10 text-saffron-2 shadow-[0_8px_20px_rgba(217,107,43,0.18)]"
                            : "border-gold/40 bg-cream-2/40 text-ink/70 hover:border-saffron/60"
                        }`}
                      >
                        <option.icon className="h-4 w-4" />
                        {option.label}
                      </button>
                    ))}
                  </div>
                </fieldset>

                <div className="mt-6 grid gap-5 md:grid-cols-2">
                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="rsvp-guests"
                      className="font-body text-[11px] font-semibold tracking-[0.25em] text-ink/60 uppercase"
                    >
                      Number of guests
                    </label>
                    <select
                      id="rsvp-guests"
                      value={guests}
                      onChange={(e) => setGuests(e.target.value)}
                      className={inputClass}
                    >
                      {["1", "2", "3", "4"].map((n) => (
                        <option key={n} value={n}>
                          {n}
                        </option>
                      ))}
                      <option value="5">5+</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-2 md:col-span-1">
                    <label
                      htmlFor="rsvp-message"
                      className="font-body text-[11px] font-semibold tracking-[0.25em] text-ink/60 uppercase"
                    >
                      Food notes or message
                    </label>
                    <input
                      id="rsvp-message"
                      type="text"
                      maxLength={500}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Jain / no onion-garlic, allergies, blessings…"
                      className={inputClass}
                    />
                  </div>
                </div>

                {error ? (
                  <p
                    role="alert"
                    className="mt-5 rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-center font-body text-sm text-red-700"
                  >
                    {error}
                  </p>
                ) : null}

                <button
                  type="submit"
                  disabled={submitting}
                  className="mt-8 flex w-full items-center justify-center gap-2.5 rounded-full bg-maroon px-8 py-4 font-body text-[13px] font-semibold tracking-[0.22em] text-cream uppercase shadow-[0_16px_36px_rgba(107,31,38,0.35)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-saffron-2 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {submitting ? (
                    <>
                      <LoaderCircle className="h-4 w-4 animate-spin" />
                      Saving your RSVP…
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Send RSVP
                    </>
                  )}
                </button>

                <p className="mt-4 flex items-center justify-center gap-1.5 text-center font-body text-xs text-ink/50">
                  <Heart className="h-3.5 w-3.5 text-saffron" aria-hidden />
                  Your details stay private with the couple
                </p>
              </form>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
