export type EventIcon = "sun" | "palette" | "music" | "flame" | "toast";

export interface WeddingEvent {
  id: string;
  name: string;
  hindi: string;
  day: string;
  dateIso: string;
  dateLabel: string;
  time: string; // 24h HH:mm
  timeLabel: string;
  venueId: string;
  note: string;
  icon: EventIcon;
}

export interface WeddingVenue {
  id: string;
  label: string;
  name: string;
  address: string;
  mapQuery: string;
  mapUrl: string;
}

export const wedding = {
  groom: { name: "Deepak", fullName: "Deepak", sonOf: "Shri. Shyam & Smt. Ranju Devi" },
  bride: { name: "Ayusha", fullName: "Ayusha", daughterOf: "Shri. Lokesh Ranjan Mishra & Smt. Radha Mishra" },
  city: "Greater Noida West",
  dateIso: "2026-12-09",
  dateLabel: "Wednesday, 9th December 2026",
  countdownTarget: "2026-12-09T00:00:00+05:30",
  hashtag: "#AyushaWedsDeepak",
  contacts: ["8585947016", "9871207859"],
  venues: [
    {
      id: "home", label: "Haldi · Mehndi · Sangeet", name: "Our Home",
      address: "C-66, GR Garden Phase 2, Greater Noida West, Uttar Pradesh 201318",
      mapQuery: "28.6164458,77.4541243",
      mapUrl: "https://www.google.com/maps/place/Deep+Jyoti+construction/@28.6164505,77.4515494,954m/data=!3m2!1e3!4b1!4m6!3m5!1s0x390cef0039d25c57:0x243e607887123d4a!8m2!3d28.6164458!4d77.4541243!16s%2Fg%2F11y4b2wfyn",
    },
    {
      id: "amaatra", label: "Wedding", name: "Amaatra Banquet Gaur City",
      address: "Gaur High Street, 14 Avenue, Greater Noida W Road, Gaur City 2, Greater Noida, Uttar Pradesh 201009",
      mapQuery: "28.6182054,77.4184893",
      mapUrl: "https://www.google.com/maps/place/Amaatra+Banquet+Gaur+City/@28.61846,77.4188593,142m/data=!3m1!1e3!4m6!3m5!1s0x390cef4cc94e6625:0x625aae88ac3428e2!8m2!3d28.6182054!4d77.4184893!16s%2Fg%2F11khs2ln33",
    },
  ] as WeddingVenue[],
  events: [
    { id: "haldi", name: "Haldi", hindi: "हल्दी", day: "Tuesday", dateIso: "2026-12-08", dateLabel: "8th December 2026", time: "10:00", timeLabel: "10:00 AM", venueId: "home", note: "A morning of turmeric, blessings and laughter with our families.", icon: "sun" },
    { id: "mehndi", name: "Mehndi", hindi: "मेहंदी", day: "Tuesday", dateIso: "2026-12-08", dateLabel: "8th December 2026", time: "17:00", timeLabel: "5:00 PM", venueId: "home", note: "An evening of henna, music and joyful togetherness.", icon: "palette" },
    { id: "sangeet", name: "Sangeet", hindi: "संगीत", day: "Tuesday", dateIso: "2026-12-08", dateLabel: "8th December 2026", time: "19:00", timeLabel: "7:00 PM", venueId: "home", note: "Join us for a night of music, dancing and celebration.", icon: "music" },
    { id: "wedding", name: "Wedding", hindi: "शुभ विवाह", day: "Wednesday", dateIso: "2026-12-09", dateLabel: "9th December 2026", time: "", timeLabel: "", venueId: "amaatra", note: "Celebrate the wedding of Ayusha and Deepak. Ceremony time to be announced.", icon: "flame" },
  ] as WeddingEvent[],
};

export function getVenue(id: string): WeddingVenue {
  return wedding.venues.find((v) => v.id === id) ?? wedding.venues[0];
}

export type RsvpStats = {
  total: number;
  attending: number;
  guests: number;
  maybe: number;
};

export type Wish = {
  id: number;
  name: string;
  message: string;
  createdAt: string;
};
