import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { getSiteUrl, OG_IMAGE_PATH } from "@/lib/site-url";
import "./globals.css";

const shareTitle = "Ayusha weds Deepak | Shubh Vivah — 8–9 December 2026";
const shareDescription =
  "With the blessings of Lord Ganesha & our families, join us on 8–9 December 2026 in Greater Noida West. View the schedule, venues & send your blessings.";
const ogImageAlt =
  "Ayusha weds Deepak — Shubh Vivah wedding invitation on 8–9 December 2026 in Greater Noida West";

export const metadata: Metadata = {
  metadataBase: getSiteUrl(),
  title: "Deepak & Ayusha | Shubh Vivah — 9 December 2026, Greater Noida West",
  description:
    "Deepak weds Ayusha — a divine celebration in Greater Noida West. Celebrations on 8th and 9th December 2026. Browse the schedule, venues and share your blessings.",
  keywords: [
    "wedding invitation",
    "Deepak weds Ayusha",
    "Ayusha weds Deepak",
    "Shubh Vivah",
    "Greater Noida wedding",
    "Indian wedding website",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: shareTitle,
    description: shareDescription,
    url: "/",
    siteName: "Shubh Vivah · Wedding Invitation",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: OG_IMAGE_PATH,
        width: 1024,
        height: 537,
        type: "image/jpeg",
        alt: ogImageAlt,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: shareTitle,
    description: shareDescription,
    images: [
      {
        url: OG_IMAGE_PATH,
        alt: ogImageAlt,
      },
    ],
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
