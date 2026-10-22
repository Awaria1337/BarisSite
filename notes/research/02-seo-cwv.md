# 02 — SEO, Core Web Vitals, Vercel: research and checklist

Project: single-page Turkish site for a women's hair salon in Çanakkale. Stack: Next.js (App Router) + Tailwind, Vercel, custom domain.
Researched 2026-10-22. Each nontrivial claim has a source URL. Items marked **[verify]** could not be confirmed from a primary source.

---

## 0. TL;DR decisions

| Topic | Decision |
|---|---|
| Next.js version | **Next.js 16.x** (16.3 shipped 2026-08-03; a security release covering 16.3 and 15.5 followed on 2026-08-26). Pin the latest 16.x patch. Sources: https://nextjs.org/blog?page=1, https://nextjs.org/blog |
| Hero image | `next/image` with **`preload`** (`priority` is **deprecated since v16**). Alternatively use `loading="eager"` + `fetchPriority="high"`. Source: https://nextjs.org/docs/app/api-reference/components/image#priority |
| Image config | v16 **requires** `images.qualities` (default `[75]`). Set `formats: ['image/avif','image/webp']`, `minimumCacheTTL: 2678400`, and trimmed `deviceSizes`. Same source, `#qualities`, `#formats`, `#minimumcachettl` |
| Fonts | `next/font/google` with `subsets: ['latin', 'latin-ext']`. One variable font, maybe two at most. |
| Schema | One JSON-LD `HairSalon` node in the page (native `<script type="application/ld+json">`, `<` escaped). **No self-made `aggregateRating`.** FAQPage markup is optional because Google will not show the rich result for this site. |
| Map | Facade: a static image plus a "Haritada aç" link, and the iframe loads only on click. |
| WhatsApp / Instagram | Plain `<a href="https://wa.me/90...">` link. Local gallery images instead of Instagram embeds. |
| Animations | CSS only (transitions, `@starting-style`, scroll-driven animations if needed), all behind `prefers-reduced-motion`. No Framer Motion/GSAP on the critical path. |
| Hosting plan | **Vercel Hobby is forbidden for this site** (commercial). Use **Pro ($20/month per developer seat, includes $20 usage credit)**, or a static export to a host that allows commercial use on its free tier. See section 5. |
| Domain | Vercel recommends `www` as the primary domain with apex → www redirect. Either direction is fine for SEO if you pick one and keep it consistent with canonical, sitemap and GBP. |

---

## 1. Next.js Metadata API (v16)

Source for everything below unless noted otherwise: https://nextjs.org/docs/app/api-reference/functions/generate-metadata (updated 2026-08-19).

### Rules
- `metadata` / `generateMetadata` work **only in Server Components**. You cannot export both from one segment.
- For a single static page, use a static `export const metadata` in `app/layout.tsx` and/or `app/page.tsx`. `generateMetadata` isn't needed.
- **`metadataBase` is required** when URL fields are relative. Without it the build errors. Set it in the root layout.
- `title.template` applies only to **child** segments, and `title.default` is required alongside it. On a one-page site, set `title.absolute` on the home page or define the full title as `default`.
- **`themeColor`, `colorScheme` and `viewport` were removed from `metadata`** (deprecated since v14). Use `export const viewport: Viewport` instead. https://nextjs.org/docs/app/api-reference/functions/generate-viewport
- Merging is **shallow**. A child that sets `openGraph` replaces the parent's entire `openGraph` object.
- Streaming metadata (v15.2+): for a page that is fully static there is nothing to stream, and the tags land in `<head>`. Keep the page static. Don't call `cookies()`/`headers()`.
- File-based metadata (`opengraph-image`, `icon`, `apple-icon`, `robots.ts`, `sitemap.ts`, `manifest.ts`) **overrides** the `metadata` object. https://nextjs.org/docs/app/api-reference/file-conventions/metadata
- Don't set `maximumScale: 1` / `userScalable: false` in the viewport. Lighthouse a11y fails it (`meta-viewport`) and it blocks zoom.

### Template (app/layout.tsx)
```tsx
import type { Metadata, Viewport } from 'next'

export const metadata: Metadata = {
  metadataBase: new URL('https://www.ORNEK.com'),
  title: {
    default: 'Çanakkale Kadın Kuaförü | <Salon Adı> – Gelin Saçı, Boya, Kesim',
    template: '%s | <Salon Adı>',
  },
  description:
    'Çanakkale merkezde kadın kuaförü <Salon Adı>: gelin saçı, topuz, ombre/balayaj, keratin bakım ve kesim. Randevu için hemen arayın veya WhatsApp’tan yazın.',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    url: '/',
    siteName: '<Salon Adı>',
    title: 'Çanakkale Kadın Kuaförü | <Salon Adı>',
    description: '…',
    // images: provided by app/opengraph-image.jpg (file convention)
  },
  twitter: { card: 'summary_large_image' },
  robots: { index: true, follow: true, googleBot: { 'max-image-preview': 'large' } },
  verification: {
    google: '<GSC token>',          // or verify via DNS TXT (preferred, see §3)
    yandex: '<Yandex token>',
    other: { 'msvalidate.01': '<Bing token>' },
  },
  formatDetection: { telephone: false }, // we render explicit tel: links
  category: 'beauty',
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#111111' },
  ],
  colorScheme: 'light',
}
```
- `<html lang="tr">` is required (a11y `html-has-lang` and correct Turkish hyphenation/case: `text-transform: uppercase` maps i→İ only with `lang="tr"`).
- Skip `alternates.languages` / hreflang, since there's only one language. Add it only if you add an English version (e.g. for tourists).
- `keywords` meta is ignored by Google. Leave it out or keep it minimal.

### File conventions to add
| File | Notes |
|---|---|
| `app/robots.ts` | `MetadataRoute.Robots`: `rules: { userAgent: '*', allow: '/' }`, `sitemap: 'https://www.ORNEK.com/sitemap.xml'`, `host`. https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots |
| `app/sitemap.ts` | One URL, `lastModified`, plus an `images: [...]` array (image sitemap support) listing gallery image URLs for Google Images. https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap |
| `app/opengraph-image.jpg` + `opengraph-image.alt.txt` | A 1200×630 photo of the salon or its work. Static file is simplest. The size limit is 8 MB for OG and 5 MB for Twitter, or the build fails. If generating with `ImageResponse` (`next/og`), you must load a **TTF/OTF font that covers Turkish glyphs** (ğ ş ı İ). https://nextjs.org/docs/app/api-reference/file-conventions/metadata/opengraph-image |
| `app/icon.png` / `app/icon.svg`, `app/apple-icon.png` (180×180), `app/favicon.ico` | Auto `<link>` tags. https://nextjs.org/docs/app/api-reference/file-conventions/metadata/app-icons |
| `app/manifest.ts` | `name`, `short_name`, `lang: 'tr'`, `theme_color`, `icons` (192/512). Optional, but cheap and good for Best Practices. https://nextjs.org/docs/app/api-reference/file-conventions/metadata/manifest |

---

## 2. JSON-LD structured data

### Injection (official Next.js guidance)
https://nextjs.org/docs/app/guides/json-ld
- Render a native `<script type="application/ld+json">` in `page.tsx`/`layout.tsx`. Don't use `next/script`, because JSON-LD isn't executable.
- Escape `<` to block XSS: `JSON.stringify(jsonLd).replace(/</g, '\\u003c')`.
- Type it with `schema-dts` (`WithContext<HairSalon>`).
- Validate with https://search.google.com/test/rich-results and https://validator.schema.org/.

### Type choice
- `HairSalon` (Thing > Organization/Place > LocalBusiness > HealthAndBeautyBusiness > HairSalon). It inherits `hasMap`, `areaServed`, `sameAs`, `priceRange`, `paymentAccepted`, `currenciesAccepted`, `makesOffer`, and `hasOfferCatalog`. https://schema.org/HairSalon
- Google: "use the most specific LocalBusiness subtype". An array `@type` is allowed, e.g. `["HairSalon","BeautySalon"]`, if they also do makeup/nails. Google doesn't support `additionalType`. https://developers.google.com/search/docs/appearance/structured-data/local-business

### Google-required / recommended properties
From https://developers.google.com/search/docs/appearance/structured-data/local-business:
- **Required:** `name`, `address` (`PostalAddress`, as complete as possible).
- **Recommended:** `geo` (**≥5 decimal places**), `openingHoursSpecification` (`dayOfWeek`, `opens`, `closes`, plus `validFrom`/`validThrough` for holidays), `priceRange` (**<100 chars**, e.g. `"₺₺"` or `"₺500–₺5000"`), `telephone` (**with country code**: `+90 286 …`), `url`, `image` (crawlable, multiple, ideally 16:9, 4:3 and 1:1), `department`.
- **Reviews:** `aggregateRating`/`review` are only recommended "for sites that capture reviews about **other** local businesses". Self-serving reviews (the entity controls reviews about itself), *including embedded Google or Facebook review widgets*, are **ineligible for star rich results**. https://developers.google.com/search/docs/appearance/structured-data/review-snippet → **Do not add aggregateRating.** Show testimonials as plain HTML if you want them.

### Template
```ts
const jsonLd: WithContext<HairSalon> = {
  '@context': 'https://schema.org',
  '@type': 'HairSalon',
  '@id': 'https://www.ORNEK.com/#salon',
  name: '<Salon Adı>',                    // EXACTLY as on GBP & signage
  url: 'https://www.ORNEK.com/',
  image: [
    'https://www.ORNEK.com/og/salon-16x9.jpg',
    'https://www.ORNEK.com/og/salon-4x3.jpg',
    'https://www.ORNEK.com/og/salon-1x1.jpg',
  ],
  logo: 'https://www.ORNEK.com/logo.png',
  telephone: '+90-286-XXX-XX-XX',
  priceRange: '₺₺',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '<Mahalle>, <Cadde/Sokak> No:<n>',
    addressLocality: 'Merkez',             // ilçe
    addressRegion: 'Çanakkale',            // il
    postalCode: '17100',                   // verify actual
    addressCountry: 'TR',
  },
  geo: { '@type': 'GeoCoordinates', latitude: 40.14XXX, longitude: 26.40XXX },
  hasMap: 'https://maps.app.goo.gl/<GBP share link>',  // or https://www.google.com/maps?cid=<CID>
  areaServed: [
    { '@type': 'City', name: 'Çanakkale' },
    // optionally: Kepez, Kale, Barbaros, … (only real ones)
  ],
  openingHoursSpecification: [
    { '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],
      opens: '09:00', closes: '20:00' },
  ],
  sameAs: [
    'https://www.instagram.com/<handle>/',
    'https://www.facebook.com/<page>',
  ],
  paymentAccepted: 'Nakit, Kredi Kartı',
  currenciesAccepted: 'TRY',
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Hizmetler',
    itemListElement: [
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Gelin Saçı' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Saç Boyama / Balayaj' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Keratin Bakım' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Kadın Saç Kesimi' } },
    ],
  },
}
```
- Hours, phone and address **must match GBP exactly** (NAP consistency).
- Optionally add a `WebSite` node (`name`, `url`, `inLanguage: 'tr-TR'`) using `@graph` for the site-name display.

### FAQPage status
- Since Aug 2023 Google shows FAQ rich results **only for well-known, authoritative government or health sites**. Other sites don't get them, and Google says you don't need to remove existing markup. https://developers.google.com/search/blog/2023/08/howto-faq-changes, https://developers.google.com/search/docs/appearance/structured-data/faqpage
- I found no 2025–26 reversal. **Decision:** keep a visible Turkish SSS (FAQ) section for content and long-tail queries ("Çanakkale gelin saçı fiyatları", "randevu gerekli mi?"). FAQPage JSON-LD is optional (harmless, but no SERP feature).

---

## 3. Local SEO (Çanakkale)

### Google Business Profile (the #1 ranking lever for the local pack)
Guidelines: https://support.google.com/business/answer/3038177
- **Name = real-world name only.** No "Çanakkale Kuaför" keywords in the name unless it's literally on the sign. Keyword stuffing can get the profile suspended.
- **Primary category:** "Kuaför" / *Hair salon*, or "Kadın kuaförü" (*Women's hair salon*) if available. Secondary categories only if true (e.g. *Beauty salon* / *Güzellik salonu* if they also do makeup or nails). Pick only categories that complete "This business IS a…", and don't use categories as keywords.
- Exact address with a pin. Local landline or mobile under the owner's control. Hours, including special and holiday hours.
- Website URL = the canonical homepage (`https://www.ORNEK.com/`). A UTM tag (`?utm_source=gbp`) is fine and is a common practice for attribution. The canonical tag protects it.
- Ongoing work: upload real photos weekly (interior, exterior, team, work), list Services with prices, add Products, post Updates, use the Q&A, and **ask every client for a Google review**. Reply to all reviews in Turkish. Review count, recency and keywords in reviews are strong local signals. [General practice, widely documented; not a Google primary claim.]
- Add a "Randevu" (appointment) link. A WhatsApp link is fine.

### NAP consistency
- Use one canonical spelling of name, address and phone across the site footer, JSON-LD, GBP, Instagram bio, Facebook, Apple Business Connect (Apple Maps), Yandex Business (Yandex Haritalar), and Turkish directories/platforms where the salon is listed (e.g. booking apps).
- Render NAP as **text** on the page (not only in an image), inside `<address>`, with `<a href="tel:+90…">`.

### Turkish keyword strategy
Primary cluster (homepage = the only page, so all go on it, naturally):
- `Çanakkale kuaför`, `Çanakkale kadın kuaförü`, `Çanakkale bayan kuaförü` (very common colloquial variant, include it), `Çanakkale gelin saçı`, `Çanakkale gelin başı`, `Çanakkale topuz`, `Çanakkale saç boyama / balayaj / ombre`, `Çanakkale keratin bakım`, `Çanakkale kuaför fiyatları`, `[mahalle] kuaför`, and "near me" phrasing like `yakınımdaki kuaför` (handled by GBP proximity, not by text).
- Write correct Turkish characters (Çanakkale, not Canakkale). Google normalises diacritics fairly well, but also mention "Canakkale" once naturally, e.g. in an image filename or URL slug if you have one. [Practice; verify with GSC queries after launch.]
- Validate volumes with Google Keyword Planner (TR, Çanakkale location) and GSC data after launch. **[verify]**: no reliable public volume data was found.

### Title / H1 / description patterns
- `<title>` (≤ ~60 chars): `Çanakkale Kadın Kuaförü | <Salon Adı> – Gelin Saçı & Renk`
- Meta description (~150–160 chars): service + location + CTA, e.g. "Çanakkale merkezde kadın kuaförü: gelin saçı, balayaj, keratin ve kesim. Randevu için arayın ya da WhatsApp’tan yazın."
- **One H1**: `Çanakkale’de Kadın Kuaförü – <Salon Adı>`. Then H2s per section: `Hizmetlerimiz`, `Gelin Saçı ve Topuz`, `Galeri`, `Fiyatlar`, `Yorumlar`, `Sıkça Sorulan Sorular`, `İletişim ve Konum`.
- Section ids in Turkish (`#gelin-saci`, `#iletisim`) give clean fragment links in GBP and Instagram.
- Page is a single URL, so content depth on it matters: 600–1200 words of real text (services, process, materials and brands used, neighbourhoods served, parking, how to book).

### Image alt text (Turkish)
- Describe what is in the photo, with location or service where it's true. Avoid keyword lists.
  - ✅ `alt="Çanakkale'deki salonumuzda örgülü gelin topuzu"`
  - ✅ `alt="<Salon Adı> salonunun Kordon tarafından dış cephesi"`
  - ❌ `alt="çanakkale kuaför çanakkale gelin saçı kuaför"`
- Use descriptive filenames: `canakkale-gelin-topuzu-01.jpg`.
- Decorative images get `alt=""`.

### Google Map without hurting performance
- A Google Maps `<iframe>` pulls in hundreds of KB of JS and multiple third-party origins. Lighthouse flags it under third-party, TBT and Best Practices (third-party cookies / console errors). [Common knowledge; measure.]
- **Facade pattern:**
  1. Show a static, self-hosted map screenshot or illustrated map (`next/image`, lazy, fixed aspect-ratio box) plus a `<a href="https://www.google.com/maps/search/?api=1&query=<Salon+Adı>&query_place_id=<PLACE_ID>">Yol tarifi al</a>` link. Maps URLs docs: https://developers.google.com/maps/documentation/urls/get-started
  2. Optionally add a "Haritayı yükle" button that swaps in `<iframe src="https://www.google.com/maps/embed?pb=…" loading="lazy" title="<Salon Adı> konumu" referrerpolicy="no-referrer-when-downgrade">` inside a reserved `aspect-ratio` container, so there's zero CLS.
- Don't use the Maps JS API, since it needs an API key, billing and heavy JS.

### Search engines and verification
- **Google Search Console:** add a **Domain property** verified via **DNS TXT**. That covers apex, www, http and https. Submit `sitemap.xml`. Use URL Inspection → Request indexing at launch. https://support.google.com/webmasters/answer/9008080
- **Bing Webmaster Tools:** import from GSC (one click), or use the `msvalidate.01` meta. Bing also powers DuckDuckGo, Yahoo and ChatGPT-search-style results. Bing has about 1.2% share in Turkey. https://www.bing.com/webmasters
- **Yandex Webmaster: yes, worth doing in Turkey.** Statcounter shows Yandex at about **10.9%** (Dec 2025, all platforms) to roughly 9–16% depending on device in 2026, versus Google's ~87%. https://gs.statcounter.com/search-engine-market-share/2025-12/turkey. Verify with `verification.yandex` (meta) or DNS, submit the sitemap, and **create a Yandex Business (Yandex Haritalar) listing**, the Yandex equivalent of GBP. https://webmaster.yandex.com
- **Apple Business Connect:** for Apple Maps / Siri (iPhone share in Turkey is significant). https://businessconnect.apple.com
- IndexNow (Bing/Yandex instant indexing) is optional. With one page that rarely changes, it isn't needed.

---

## 4. Core Web Vitals for a photo-heavy page

Targets (p75, field data): **LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1**. Lab/diagnostic targets: FCP ≤ 1.8 s, TTFB ≤ 0.8 s. https://web.dev/articles/vitals, https://web.dev/articles/fcp, https://web.dev/articles/ttfb

### Rendering
- Keep the whole page **statically prerendered** (no `cookies()`/`headers()`/`searchParams`). It's served from the CDN, which gives the best TTFB.
- Make everything a Server Component. Only small islands are `'use client'`: the gallery lightbox, the mobile menu (or use `<details>`/`popover` with no JS), and the map facade button.
- Avoid big client libraries. Check bundle size with `next build` output and `@next/bundle-analyzer`.

### next/image (v16)
Source: https://nextjs.org/docs/app/api-reference/components/image (updated 2026-09-28)
- **Hero/LCP:** `preload` (new in v16) inserts `<link rel="preload">` in `<head>`. **`priority` is deprecated in v16.** Docs: "In most cases, you should use `loading="eager"` or `fetchPriority="high"` instead of `preload`". Don't combine `preload` with `loading`/`fetchPriority`. Also don't use `preload` when different images are the LCP element on mobile and desktop (art direction). In that case use `fetchPriority="high"`.
  - Recommendation: one hero image for all viewports with `preload` and `sizes="100vw"`, or `fetchPriority="high"` if you art-direct.
- **Always** set `sizes` on `fill`/responsive images, e.g. gallery `sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"`. Without it the browser downloads oversized candidates.
- Use **static imports** (`import hero from '@/public/…'` or `./images/x.jpg`). You get automatic width/height (no CLS), automatic `blurDataURL` for `placeholder="blur"`, and hashed immutable URLs.
- `next.config.ts`:
  ```ts
  images: {
    formats: ['image/avif', 'image/webp'],   // AVIF first; note: each format cached separately (more transformations)
    qualities: [60, 75],                      // REQUIRED since v16 (default [75])
    deviceSizes: [640, 828, 1080, 1440, 1920],// trim defaults → fewer variants/transformations
    imageSizes: [256, 384],
    minimumCacheTTL: 2678400,                 // 31 days (default 4h) → fewer re-transformations
  }
  ```
- Lazy loading is the default (`loading="lazy"`). Keep it for everything below the fold.
- Reserve space: width/height or a `fill` inside an `aspect-ratio` box. Never let images size themselves.
- Pre-compress source photos before committing them (≤ 2560 px long edge, JPEG q≈80 or AVIF). Vercel's limit is 8192 px per side for source images, and only JPEG/PNG/WebP/AVIF get optimized. https://vercel.com/docs/image-optimization/limits-and-pricing
- Gallery: a CSS grid of thumbnails at about 33vw, opening a lightbox on demand. Don't render 40 full-size images upfront. `content-visibility: auto` on off-screen sections helps rendering cost.

### Fonts (Turkish)
https://nextjs.org/docs/app/api-reference/components/font
- `next/font/google` self-hosts at build time, so the browser makes no requests to Google. `display` defaults to `swap` and `adjustFontFallback` defaults to `true`, which generates a metric-matched fallback and cuts CLS.
- **`subsets: ['latin', 'latin-ext']`**. **ğ, ş, ı, İ are in latin-ext** (Ç ç Ö ö Ü ü are in basic Latin-1). Without latin-ext those glyphs fall back to a different font, which shows up as visible "ransom-note" glyphs and can cause CLS. Confirm that the chosen family offers latin-ext on its Google Fonts page.
- Use **one variable font** (e.g. a serif display face plus the system UI stack, or a single variable sans). Each extra family adds preload bytes. Expose it via `variable: '--font-x'` and Tailwind v4 `@theme inline { --font-sans: var(--font-x); }`.
- A script/handwritten display font is costly. Use it only for the H1 if needed, with `preload: false` if it isn't in the LCP text.

### CLS sources to eliminate
- Images without dimensions → use static imports or explicit sizes.
- Font swap → next/font fallback metrics.
- Embeds (map, video) → fixed `aspect-ratio` container.
- Cookie banners or sticky bars injected late → render them in SSR HTML with reserved space, or use `position: fixed` overlays (which don't shift layout).
- Carousels/sliders that change height → fixed height.

### Third-party scripts
- **WhatsApp:** `<a href="https://wa.me/90XXXXXXXXXX?text=Merhaba%2C%20randevu%20almak%20istiyorum" rel="noopener" aria-label="WhatsApp ile yazın">`. A floating button is fine as a `position: fixed` link with an inline SVG icon. **No widget scripts**, since those add 100–300 KB of JS, hurt TBT/INP and set third-party cookies. wa.me format: https://faq.whatsapp.com/5913398998672934
- **Instagram embeds: avoid.** `embed.js` loads heavy JS and iframes, sets third-party cookies (Best Practices penalty), causes layout shift as embeds resize, and is often blocked by tracking protection. Self-host the best photos in the gallery and link to the profile with an Instagram icon link.
- Analytics: prefer Vercel Web Analytics (a small first-party script). If you use GA4, load it via `@next/third-parties/google` (`GoogleAnalytics`), which loads after hydration. Note that a consent banner may be needed under KVKK (Turkey's data protection law) for cookie-based analytics **[verify with legal]**, which is another reason to choose cookieless Vercel Analytics. https://nextjs.org/docs/app/guides/third-party-libraries
- Use `next/script` with `strategy="lazyOnload"` for anything non-essential.

### Animation, INP, TBT
- JS animation libraries (Framer Motion ~30–60 KB, GSAP) add hydration and main-thread work. Prefer **CSS transitions/keyframes** on `transform`/`opacity` only (compositor-friendly), `IntersectionObserver` (a few lines) or CSS scroll-driven animations (`animation-timeline: view()`) for reveal-on-scroll. https://web.dev/articles/animations-guide
- Never animate the LCP element's opacity from 0 on load. That delays LCP, because an element at opacity 0 isn't painted.
- Wrap all motion:
  ```css
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after { animation-duration: .01ms !important; animation-iteration-count: 1 !important; transition-duration: .01ms !important; scroll-behavior: auto !important; }
  }
  ```
- INP: keep event handlers tiny. The lightbox opens with a native `<dialog>` (`showModal()`), which gives focus trapping and Esc for free. https://web.dev/articles/optimize-inp

---

## 5. Vercel specifics

### ⚠️ Hobby plan forbids commercial use
https://vercel.com/docs/limits/fair-use-guidelines#commercial-usage (updated 2026-09-14):
> "Hobby teams are restricted to non-commercial personal use only. All commercial usage of the platform requires either a Pro or Enterprise plan."
> Commercial usage = any deployment "used for the purpose of financial gain of **anyone** involved in **any part of the production** of the project, including a paid employee or consultant writing the code." Examples include "Advertising the sale of a product or service" and "Receiving payment to create, update, or host the site".

A salon site advertising paid services is **commercial on two counts**: it advertises services, and the developer may be paid. **Hobby is not allowed.**

Options:
1. **Vercel Pro: $20/month per developer seat, includes $20 of usage credit**, plus unlimited viewer seats. https://vercel.com/pricing. One seat is enough. Image optimization is billed on demand at $0.05 per 1K transformations after the credit. https://vercel.com/docs/limits/fair-use-guidelines#additional-resources. Simplest and fully compliant. **Recommended** if the client accepts about $240/year.
2. **Static export (`output: 'export'`) on a host whose free tier permits commercial use.** Candidates are Cloudflare Pages/Workers static assets (free plan: 20,000 files, 25 MiB per file; https://developers.cloudflare.com/changelog/2025-09-02-increased-static-asset-limits) and Netlify. **[verify each host's ToS for commercial use on the free tier before choosing]**. Trade-offs, per https://nextjs.org/docs/app/guides/static-exports:
   - The default `next/image` loader **doesn't work**. You need `images.unoptimized: true` with pre-generated AVIF/WebP plus `srcset`, done at build time (e.g. `next-image-export-optimizer` or a sharp script), or a custom loader (Cloudinary/Cloudflare Images).
   - `redirects`/`headers` in next.config aren't supported. Configure them on the host instead (`_redirects`/`_headers`).
   - `robots.ts`, `sitemap.ts` and static `opengraph-image` still work, because they prerender as static route handlers.
   - For a one-page static site this is viable, and performance is equal or better.
3. Recommendation: **build it as a fully static page regardless** (no server features). Then hosting stays portable: Vercel Pro now, static export later if cost matters.

### Image optimization quotas
https://vercel.com/docs/image-optimization/limits-and-pricing (updated 2026-08-11)
| | Hobby included | Pro on-demand |
|---|---|---|
| Transformations | **5,000 / month** | $0.05–0.0812 per 1K |
| Cache reads | 300K / month (8 KB units) | $0.40–0.64 per 1M |
| Cache writes | 100K / month (8 KB units) | $4.00–6.40 per 1M |
- A transformation is billed on every cache **MISS and STALE**. One source image × each width × each format × each quality is a separate variant. 60 photos × 5 widths × 2 formats ≈ 600 variants. The default 4-hour `minimumCacheTTL` causes STALE re-transforms, so set it to 31 days.
- On Hobby, exceeding the quota means **new images return 402 and render the alt text** (already-cached ones keep working). There's no charge, but it causes broken images. On Pro, usage is billed. Set **Spend Management**.
- Cost reduction guide: https://vercel.com/kb/guide/reduce-image-optimization-costs-on-vercel

### Analytics / Speed Insights
- **Web Analytics:** Hobby includes 50K events/month. **Pro has no included events: $3 per 100K events.** https://vercel.com/pricing. It's cookieless and the script is tiny (`@vercel/analytics`, loaded async). Negligible CWV impact.
- **Speed Insights:** free tier on all plans, 10,000 events per rolling 30 days, **Real Experience Score only**. Collection pauses for 14+ days if exceeded. **Speed Insights Plus** (all CWV, breakdowns): **$10 per project per month plus $0.65 per 10K events on Pro.** https://vercel.com/docs/speed-insights/limits-and-pricing. Use `sampleRate` to control volume.
- For a small salon: Web Analytics plus free Speed Insights is enough. Use PageSpeed Insights / CrUX for field CWV for free (once traffic is enough for CrUX).

### Custom domain
https://vercel.com/docs/domains/working-with-domains/add-a-domain, https://vercel.com/kb/guide/a-record-and-caa-with-vercel
- **Apex (`ornek.com`):** `A` record → **use the value shown on the project's domain card**. Historically `76.76.21.21`; newer projects may get a different anycast IP such as `216.198.79.1`. "The card is the source of truth."
- **www:** `CNAME` → the **project-specific** target shown on the card, e.g. `d1d4fc829fe7bc7c.vercel-dns-017.com`. The legacy `cname.vercel-dns.com` may still resolve, but use the card value.
- Or switch nameservers to Vercel DNS. If you do, **copy MX/TXT records first**, so the business email doesn't break.
- CAA: only needed if an existing CAA record blocks Let's Encrypt.
- Add **both** apex and www to the project, then use **Edit → "Redirect to"** to redirect one to the other (308 permanent). Vercel **recommends www as primary**, with apex → www, because a CNAME gives the CDN more traffic control. https://vercel.com/docs/domains/working-with-domains/deploying-and-redirecting
- Whatever you choose, use the same host in `metadataBase`, canonical, sitemap, GBP website field, Instagram bio and JSON-LD `url`.
- For a `.com.tr` domain, registration goes through TRABIS via a Turkish registrar. Setting DNS to Vercel works the same way.

---

## 6. Accessibility essentials (Lighthouse 100)

Lighthouse a11y runs axe-core checks. Scoring 100 doesn't guarantee accessibility, so also do manual checks. https://developer.chrome.com/blog/lighthouse-11-0, https://developer.chrome.com/docs/lighthouse/accessibility/scoring
- `<html lang="tr">`, a unique `<title>`, and a viewport that allows zoom (no `maximum-scale=1`/`user-scalable=no`).
- Landmarks: `<header>`, `<nav aria-label="Ana menü">`, `<main id="icerik">`, `<footer>`. Add a skip link: `<a href="#icerik" class="sr-only focus:not-sr-only">İçeriğe geç</a>`.
- Headings: exactly one `<h1>`, then H2/H3 in order with no skipped levels.
- **Color contrast:** ≥ 4.5:1 for body text and ≥ 3:1 for large text and UI. Watch for pastel/blush/gold-on-white palettes (common in salon designs), which often fail. This is also a problem for text over hero photos: add a dark gradient overlay.
- Every `<img>` has `alt`. Icon-only links/buttons (WhatsApp, Instagram, phone, menu) need `aria-label` in Turkish ("WhatsApp ile mesaj gönderin", "Instagram sayfamız", "Hemen arayın").
- Link text must be distinguishable. No duplicate vague "Tıklayın" links. Links inside text need more than color alone (underline).
- Touch targets ≥ 24×24 CSS px (WCAG 2.2 AA target size); aim for 44×44 on mobile CTAs.
- Visible focus styles (`focus-visible:ring`). Don't remove outlines.
- Forms, if any: `<label>` for every input, plus `autocomplete` (`tel`, `name`).
- `iframe` (map) needs a `title`. A `<dialog>` lightbox needs an accessible name and a close button with a label. Return focus to the trigger on close.
- Don't use `aria-hidden` on focusable elements. Lists must be real `<ul>/<li>`.
- No auto-playing carousels. If you must have one, add pause controls and respect reduced motion.
- **Best Practices 100:** HTTPS (automatic), no console errors, no deprecated APIs, **no third-party cookies** (another reason to skip Instagram/FB/Maps iframes on load), correct image aspect ratios, images served at appropriate resolution, a valid `<!doctype html>` and charset, and source maps optional.
- **SEO 100:** title and meta description, `robots` allows indexing, valid canonical, descriptive link text, `<a href>` crawlable links, `hreflang` valid if used, legible font sizes (≥12px, ideally 16px body), tap targets sized.

---

## 7. Launch checklist

- [ ] Next.js 16 (latest patch), fully static page; `next build` shows `○ (Static)` for `/`
- [ ] `metadataBase`, title, description, canonical `/`, OG (tr_TR), twitter card, `viewport` export with themeColor
- [ ] `robots.ts`, `sitemap.ts` (with image entries), `opengraph-image.jpg` + alt.txt, icons, `manifest.ts`
- [ ] `HairSalon` JSON-LD with `<` escaped; passes Rich Results Test and the Schema validator; NAP identical to GBP; **no aggregateRating**
- [ ] `<html lang="tr">`, one H1 with "Çanakkale" plus "kadın kuaförü", H2 sections, 600+ words of real Turkish copy, SSS section
- [ ] Hero uses `preload` (or `fetchPriority="high"`), `sizes="100vw"`; every other image is lazy with `sizes`; static imports with `placeholder="blur"`
- [ ] `images.qualities`, `formats`, trimmed `deviceSizes`, `minimumCacheTTL: 2678400`
- [ ] next/font with `latin` + `latin-ext`, one variable family
- [ ] WhatsApp/phone/Instagram as plain links; map facade; no Instagram embed; no animation libraries; `prefers-reduced-motion`
- [ ] Contrast checked; aria-labels on icon links; skip link; focus styles; `<dialog>` lightbox
- [ ] Vercel **Pro** (or static export to a commercial-OK host); Spend Management set; Web Analytics on
- [ ] Domain: apex and www added, one redirects to the other (308); MX records preserved
- [ ] GSC Domain property (DNS TXT) plus sitemap; Bing (import from GSC); Yandex Webmaster plus Yandex Business; Apple Business Connect
- [ ] GBP: correct category, real name, website = canonical URL, photos, services, review-request routine
- [ ] Lighthouse (mobile, incognito) 100/100/100/100; PageSpeed Insights on the production URL; recheck CrUX after 28 days

---

## Sources
- Next.js blog (versions): https://nextjs.org/blog, https://nextjs.org/blog?page=1
- next/image: https://nextjs.org/docs/app/api-reference/components/image
- generateMetadata: https://nextjs.org/docs/app/api-reference/functions/generate-metadata
- generateViewport: https://nextjs.org/docs/app/api-reference/functions/generate-viewport
- Metadata files: https://nextjs.org/docs/app/api-reference/file-conventions/metadata
- OG image: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/opengraph-image
- JSON-LD guide: https://nextjs.org/docs/app/guides/json-ld
- next/font: https://nextjs.org/docs/app/api-reference/components/font
- Static exports: https://nextjs.org/docs/app/guides/static-exports
- Google LocalBusiness: https://developers.google.com/search/docs/appearance/structured-data/local-business
- Google review snippet (self-serving): https://developers.google.com/search/docs/appearance/structured-data/review-snippet
- Google FAQ changes: https://developers.google.com/search/blog/2023/08/howto-faq-changes, https://developers.google.com/search/docs/appearance/structured-data/faqpage
- schema.org HairSalon: https://schema.org/HairSalon
- GBP guidelines: https://support.google.com/business/answer/3038177
- Statcounter Turkey: https://gs.statcounter.com/search-engine-market-share/2025-12/turkey
- Vercel fair use / commercial: https://vercel.com/docs/limits/fair-use-guidelines
- Vercel image pricing: https://vercel.com/docs/image-optimization/limits-and-pricing
- Vercel pricing: https://vercel.com/pricing
- Speed Insights pricing: https://vercel.com/docs/speed-insights/limits-and-pricing
- Vercel domains: https://vercel.com/docs/domains/working-with-domains/add-a-domain, https://vercel.com/kb/guide/a-record-and-caa-with-vercel, https://vercel.com/docs/domains/working-with-domains/deploying-and-redirecting
- Cloudflare static asset limits: https://developers.cloudflare.com/changelog/2025-09-02-increased-static-asset-limits
- web.dev vitals: https://web.dev/articles/vitals, https://web.dev/articles/optimize-inp, https://web.dev/articles/animations-guide
- Lighthouse a11y: https://developer.chrome.com/blog/lighthouse-11-0
