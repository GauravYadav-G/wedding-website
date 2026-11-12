import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { getSiteUrl, OG_IMAGE_PATH, SHARE_DESCRIPTION } from "@/lib/site-url";
import "./globals.css";

const shareTitle = "Deepak weds Ayusha | Shubh Vivah — 8–9 December 2026";
const ogImageAlt =
  "Deepak weds Ayusha — Shubh Vivah wedding invitation on 8–9 December 2026 in Greater Noida West";

export const metadata: Metadata = {
  metadataBase: getSiteUrl(),
  title: "Deepak & Ayusha | Shubh Vivah — 9 December 2026, Greater Noida West",
  description: SHARE_DESCRIPTION,
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
    description: SHARE_DESCRIPTION,
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
    description: SHARE_DESCRIPTION,
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
