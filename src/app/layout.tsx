import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
  ),
  title: "Deepak & Ayusha | Shubh Vivah — 9 December 2026, Greater Noida West",
  description:
    "Deepak weds Ayusha — a divine celebration in Greater Noida West. Celebrations on 8th and 9th December 2026. RSVP, browse the schedule, venues and share your blessings.",
  keywords: [
    "wedding invitation",
    "Deepak weds Ayusha",
    "Shubh Vivah",
    "Greater Noida wedding",
    "Indian wedding website",
  ],
  openGraph: {
    title: "Deepak & Ayusha | Shubh Vivah",
    description:
      "A divine celebration at Greater Noida West — 9th December 2026. Reserve your blessing.",
    images: ["/images/ayusha-deepak-3.jpg"],
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#fbf3e6",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      
    >
      <body className="bg-cream font-body text-ink antialiased">{children}</body>
    </html>
  );
}
