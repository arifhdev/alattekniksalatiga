import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { WhatsAppFab } from "@/components/whatsapp-fab";
import { siteUrl, staticImages } from "@/lib/site";
import { getSettings } from "@/sanity/fetch";
import { SanityLive } from "@/sanity/live";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: `${settings.name} — Alat Teknik, Toko Besi & Safety di Salatiga`,
      template: `%s · ${settings.name}`,
    },
    description: settings.description,
    keywords: [
      "alat teknik salatiga",
      "toko besi salatiga",
      "duta teknik salatiga",
      "perkakas salatiga",
      "alat safety salatiga",
      "besi beton salatiga",
      "sewa genset salatiga",
    ],
    openGraph: {
      type: "website",
      locale: "id_ID",
      siteName: settings.name ?? undefined,
      images: [{ url: staticImages.ogDefault.src, width: staticImages.ogDefault.width, height: staticImages.ogDefault.height }],
    },
    twitter: { card: "summary_large_image" },
    alternates: { canonical: "/" },
  };
}

export const viewport: Viewport = {
  themeColor: "#0b0d11",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const settings = await getSettings();
  const localBusiness = {
    "@context": "https://schema.org",
    "@type": "HardwareStore",
    name: settings.legalName ?? settings.name,
    description: settings.description,
    url: siteUrl,
    image: `${siteUrl}${staticImages.ogDefault.src}`,
    logo: `${siteUrl}${staticImages.logo.src}`,
    telephone: settings.phones?.[0],
    email: settings.email,
    foundingDate: settings.since ? String(settings.since) : undefined,
    address: {
      "@type": "PostalAddress",
      streetAddress: settings.address?.street,
      addressLocality: settings.address?.city,
      addressRegion: settings.address?.region,
      addressCountry: "ID",
    },
    geo: settings.geo ? { "@type": "GeoCoordinates", latitude: settings.geo.lat, longitude: settings.geo.lng } : undefined,
  };

  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <a
          href="#konten"
          className="sr-only z-[60] rounded-lg bg-white px-4 py-2 text-ink focus:not-sr-only focus:fixed focus:top-4 focus:left-4"
        >
          Lewati ke konten
        </a>
        <Header whatsapp={settings.whatsapp?.[0]?.number} since={settings.since} />
        <main id="konten" className="flex-1">
          {children}
        </main>
        <Footer />
        <WhatsAppFab accounts={settings.whatsapp} />
        <SanityLive includeDrafts={false} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusiness).replace(/</g, "\\u003c") }}
        />
      </body>
    </html>
  );
}
