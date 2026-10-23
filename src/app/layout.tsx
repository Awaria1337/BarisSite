import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { ViewTransition } from "react";
import { WhatsAppIcon } from "@/components/icons";
import { HideOn } from "@/components/hide-on";
import { SalonJsonLd } from "@/components/json-ld";
import { LocationSection } from "@/components/location-section";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { TopBar } from "@/components/top-bar";
import { site, whatsappLink } from "@/content/site";
import "./globals.css";

// One family keeps the font payload small: Inter Tight upright (preloaded) for
// headings and body, and its italic only for accent words (loaded on demand).
// Self-hosted from google/fonts, cut with fonttools (varLib.instancer wght=400:600 + pyftsubset to
// Latin-1 + Turkish glyphs). License: ./fonts/OFL.txt.
const display = localFont({
  src: "./fonts/InterTight.woff2",
  variable: "--font-inter-tight",
  weight: "400 600",
  display: "swap",
});

const italic = localFont({
  src: "./fonts/InterTight-Italic.woff2",
  variable: "--font-inter-tight-italic",
  weight: "400 600",
  style: "italic",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name} | Çanakkale Kadın Kuaförü`, template: `%s | ${site.shortName} Kuaför` },
  applicationName: site.name,
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#f7f0e8",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="tr" className={`${display.variable} ${italic.variable} antialiased`}>
      <body>
        <a
          href="#icerik"
          className="sr-only z-50 rounded-full bg-murekkep px-5 py-3 text-krem focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          İçeriğe geç
        </a>
        <TopBar />
        <SiteHeader />
        <ViewTransition>
          <main id="icerik">{children}</main>
        </ViewTransition>
        <HideOn paths={["/iletisim/"]}>
          <LocationSection />
        </HideOn>
        <SiteFooter />
        <a
          href={whatsappLink()}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="WhatsApp'tan yazın"
          className="fixed z-50 grid size-14 place-items-center rounded-full bg-[#1f8f4e] text-white shadow-[0_10px_30px_-10px_rgba(27,22,18,0.5)] transition-transform hover:scale-105 active:scale-95"
          style={{
            right: "max(1.25rem, env(safe-area-inset-right))",
            bottom: "max(1.25rem, env(safe-area-inset-bottom))",
          }}
        >
          <WhatsAppIcon className="size-7" />
        </a>
        <SalonJsonLd />
      </body>
    </html>
  );
}
