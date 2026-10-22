# 08 — Old site (baris-alas-6bd1.vercel.app)

Fetched 2026-10-22 with curl (no login, no forms submitted). Next.js (Turbopack) build, © 2025.
Pages crawled (from sitemap.xml): `/`, `/hizmetler`, `/galeri`, `/hakkimizda`, `/iletisim`, `/randevu`.
`/admin`, `/login`, `/api/` are disallowed in robots.txt and were not visited.
The canonical domain it points to, `barisalas.com.tr`, **does not resolve (DNS)** as of today.

Important caveat: the old site is a **template with a lot of placeholder content**. Several pages still
show `+90 5XX XXX XX XX` and `wa.me/905000000000`; the testimonials use randomuser.me stock portraits;
the stats contradict each other (500+ vs 2000+ customers, 10+ vs 14+ years); the home page even says
"beşiktaş · merkez" (an Istanbul district). Treat everything below as *claims*, not facts.

## Photos
- Only real salon photos: `/salon-1.png` … `/salon-8.png` (iPhone, 4032×2268, all interior, no people).
  Downloaded to `assets/old-site-raw/` — see `manifest.json`. The old site's alt texts for these
  ("balyaj n°03", "gelin", "kısa kesim", …) are wrong: none of the 8 shows a hairstyle.
- `/logo.png` (302×167, too small; not copied) and `/logo.ico`, `/favicon.ico` — listed only.
- Stock, NOT the salon's (not downloaded): Unsplash `photo-1516975080664-ed2fc6a32937` (before/after "after"),
  `photo-1605497788044-5a32c7078486` ("before"), plus `photo-1487412947147-5cebf100ffc2`,
  `photo-1554519515-242161756769`, `photo-1595476108010-b4d1f102b1b1`, `photo-1634449571010-02389ed0f9b0`
  (referenced in home page payload); randomuser.me/api/portraits/women/{12,24,29,34,44,52,65,68,78}.jpg
  (fake testimonial avatars).
- `/galeri` and `/hizmetler` render empty ("Bu kategoride henüz görsel/hizmet bulunmuyor") — CMS never filled.

## Business facts — old site vs. what we have (src/content/site.ts)

| Item | Old site says (source) | site.ts / known | Status |
|---|---|---|---|
| Name | "Barış Alaş Kuaför Salonu" (JSON-LD, footer of /hakkimizda) | same | match |
| Address | "Cevat Paşa, Kayserili Ahmet Paşa Cd. No:32, 17000 Çanakkale Merkez/Çanakkale" (/iletisim, /hakkimizda) | + "Akol Otel" landmark | match (old site has no Akol Otel mention) |
| Geo | 40.1523062, 26.4071657 (JSON-LD, /) | same | match |
| Phone | +90 535 462 09 90 (/iletisim, /hakkimizda); placeholder on other pages | 0535 462 09 90 | match |
| WhatsApp | wa.me/905354620990 (/iletisim) | 905354620990 (TODO confirm) | supports that the number is on WhatsApp (not proof) |
| E-mail | info@barisalas.com.tr (/iletisim) | — | new; domain is dead, so likely not working |
| Hours | "Pzt–Cmt · 10:00–20:00 / Pazar kapalı" (all pages) | every day 09:00–19:00 incl. Sunday (Google) | **CONTRADICTION** — ask owner |
| Instagram | `https://www.instagram.com/barisalaskuafor_canakkale/` (/iletisim; URL returns 200) and `instagram.com/barisalas` / "@barisalas" (/, template) | null (TODO) | candidate: **@barisalaskuafor_canakkale** — confirm |
| Facebook | none | facebook.com/Barisalas | — |
| TikTok | link to bare `tiktok.com` (placeholder) | — | ignore |
| Founding | "2012'den beri" (/); "14+ Yıllık Deneyim" (/hakkimizda); "10+ yıl" (/) | — | weakly consistent with ~2012; confirm |
| Team size | "10+ Uzman Ekip" (/hakkimizda); "Ekip üyeleri yakında eklenecek" | — | unverified |
| Customers | "500+ mutlu misafir" (/) vs "2000+ Mutlu Müşteri" (/hakkimizda) | — | template numbers, don't reuse |
| Rating | "4.9 · 300+ google yorumu" (/) | 4.8 / 213 (Google) | **CONTRADICTION** — old site invented; use Google |
| Brands | Kérastase, Olaplex, Wella (/); FAQ adds L'Oréal Professionnel | L'Oréal Prof., Kérastase, Olaplex, Selective, M·A·C | Wella only on old site; unverified |
| Parking | "vale hizmeti ve yakın otopark anlaşmalı"; FAQ "Merkeze yakın 2 otopark anlaşmalıdır" (/) | — | unverified template claim |
| Prices | none anywhere | — | — |

## Services listed (home page, /)
1. Saç Kesimi ("imza kesim") 2. Boyama & Röfle (balyaj, ombre, ton-sür-ton) 3. Keratin Bakımı
4. Gelin Saçı (deneme seansı, düğün günü rezervasyonu, "tül ve aksesuar dahil") 5. Fön & Şekillendirme
6. Özel Bakım Paketi (kesim + bakım + fön). Contact form also lists: Saç Kesimi, Boyama, Keratin, Gelin, Fön, Özel Bakım.
Galeri filter categories: Kesim, Boyama, Gelin, Bakım, Genel. Photos show manikür stations and hair-extension
samples, but the old site lists neither manikür nor kaynak saç as a service.

## About / copy (usable as tone reference, not fact)
- Tagline: "Saçı değil, kadını şekillendiriyoruz." — barış alaş (/)
- "On yılı aşan titiz zanaat, uzman ekip ve özenle seçilmiş premium ürünlerle her misafirimize özel bir imza hazırlıyoruz." (/)
- /hakkimizda: "Baris Alas, profesyonel güzellik hizmetlerini en üst seviyede sunmak için kurulmuş bir stüdyodur…" (generic).
- Values: Kalite, Deneyim, Güven, İnovasyon (/hakkimizda).

## FAQ on old site (/, from JS bundle) — all template answers, verify before reuse
- Randevu: WhatsApp en kolay yol.  - İlk ziyaret: saçı yıkamadan gelin, son boya tarihini bilin, referans görsel getirin.
- Gelin: düğünden 4–6 hafta önce deneme.  - Keratin: "düşük ısı + formaldehit içermeyen" formül (claim — verify!).
- İptal: en geç 24 saat önce.  - Çocuklar: özel gün için evet.  - Otopark: 2 anlaşmalı otopark.

## Not usable
Testimonials (Zeynep Karahan, Ayşegül Demir, Selin Oral, Melis Aksoy, Burcu Şahin, Ecem Tutal, Deniz Kurt,
Pınar Yıldız, Gözde Meriç) are template/fake with stock avatars — do not reuse.
