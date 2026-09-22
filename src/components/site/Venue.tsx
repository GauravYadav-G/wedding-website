"use client";
import { LivingLamps } from "./LivingDecor";
import { useState } from "react";
import { ArrowUpRight, MapPin, Phone, Copy, Check } from "lucide-react";
import { wedding } from "@/lib/wedding";
export default function Venue() {
  const [map, setMap] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const copy = async (id: string, address: string) => {
    try { await navigator.clipboard.writeText(address); setCopied(id); setTimeout(() => setCopied(null), 1800); } catch { setCopied(null); }
  };
  return <section id="venue" className="story-venues" aria-labelledby="venue-title">
    <div className="venue-palace" aria-hidden="true"><span className="palace-glow" /><LivingLamps /></div>
    <header className="premium-heading" data-story=""><span className="eyebrow">The next chapter · 9 December 2026</span><p className="script-accent">A setting for our forever</p><h2 id="venue-title">A place for every memory.</h2></header>
    <div className="story-venue-grid">{[...wedding.venues].reverse().map(venue => <article className="story-venue-card" key={venue.id} data-story="">
      <span className="eyebrow">{venue.id === "amaatra" ? "09 December · The wedding" : "08 December · Haldi, Mehndi & Sangeet"}</span><MapPin size={25} strokeWidth={1.2} className="venue-pin" aria-hidden="true" /><h3>{venue.name}</h3><p>{venue.address}</p>
      <div className="venue-actions"><a className="premium-button" href={venue.mapUrl} target="_blank" rel="noreferrer">Get directions <ArrowUpRight size={15} /></a><button type="button" onClick={() => copy(venue.id,venue.address)} aria-label={`Copy address for ${venue.name}`}>{copied === venue.id ? <Check size={17} /> : <Copy size={17} />}</button></div>
      <button type="button" className="map-toggle" aria-expanded={map === venue.id} onClick={() => setMap(map === venue.id ? null : venue.id)}>{map === venue.id ? "Close map" : "Explore the location"} <span aria-hidden="true">{map === venue.id ? "−" : "+"}</span></button>
      {map === venue.id && <iframe title={`Map to ${venue.name}`} src={`https://www.google.com/maps?q=${encodeURIComponent(venue.mapQuery)}&z=15&output=embed`} loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />}
    </article>)}</div>
    <div className="venue-help"><p>A little help finding your way?</p>{wedding.contacts.map(phone => <a key={phone} href={`tel:+91${phone}`}><Phone size={13} /> +91 {phone}</a>)}</div>
  </section>;
}
