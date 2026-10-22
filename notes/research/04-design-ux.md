# 04 — Design, UX, Copy, WhatsApp, KVKK & Photo Brief

Project: Barış Alaş — kadın kuaförü, Çanakkale. Single page, Turkish, mobile-first, photo-heavy.
Research date: 2026-10-22. Sources are listed inline and again at the end.

> Method note: WebFetch returns page text, not pixels, so the visual descriptions in section 1 come from
> Awwwards metadata (palette, tags, description) plus the site's text structure. Before copying a
> pattern, open the live site and check it. The search figures in section 3 come from Google autocomplete
> signals (fetched live, hl=tr/gl=tr). They are not Keyword Planner volumes.

---

## 1. Reference sites (real salons, not templates)

| # | Site | Recognition | What sets it apart | What to borrow |
|---|------|-------------|--------------------|----------------|
| 1 | **ALICE Hair & Art**, Stockholm — https://www.alicehairart.se/ | Awwwards Honorable Mention, 11 Feb 2025 ([awwwards](https://www.awwwards.com/sites/alice-hair-art)) | Single page built in Framer. Two colours only, #F5F5F5 / #121212, tagged "Luxury, Clean, Minimal, Single page, Gallery". Headline: "The seamless blend of hairdressing & art". The nav is three anchors (Info / Hair / & Art). The "book" block is plain text links, one per stylist. | Closest match to our brief. A near-monochrome frame lets the photos carry the colour. Short anchor nav. Booking is a single plain block, not a widget. |
| 2 | **Il Colorista**, Verona — https://ilcolorista.salon/ | Awwwards HM, 29 Sep 2022 ([awwwards](https://www.awwwards.com/sites/il-colorista-salon)) | Warm peach palette (#f5a490 / #f8c4b6). GSAP/WebGL scroll transitions. Hero = H1 "Atelier a Isola della Scala" over a 10-photo carousel of balayage/colour work. Line: "Ogni donna ha il suo colore". The WhatsApp icon sits in the header. Hours ("Tutti i giorni 8:30–18:30") are only in the footer. | A warm, skin-friendly accent colour. The town name in the H1 (local SEO). The WhatsApp icon. Anti-pattern: hours and phone hidden in the footer. |
| 3 | **Marco Ambrosi Salon**, Italy — https://www.marcoambrosi.salon/ | Awwwards HM, 2 Jun 2021 ([awwwards](https://www.awwwards.com/sites/marco-ambrosi-salon)) | Black + coral (#DF6C4F) + grey. Video and animation show the colour/extension process. | Process clips (folyo → durulama → fön) as short muted loops are more convincing than stills. |
| 4 | **Mistretta Coiffure**, Switzerland — https://mistretta.ch/en/ | Awwwards HM, 17 Oct 2018 ([awwwards](https://www.awwwards.com/sites/mistretta-coiffure)) | "Every pixel… designed to recreate the same aesthetic experience as entering the salon". Fullscreen, gallery, fluid transitions. A single blue accent on white. | Make the hero the salon's own interior, so the site feels like stepping through the door. |
| 5 | **Salon Sona** beauty studio microsite — http://ss.art4web.co | Awwwards HM, 29 Aug 2019 ([awwwards](https://www.awwwards.com/sites/salon-sona)) | Earthy brown #987654 + red accent. Fullscreen, minimal, vertical menu. | A vertical side label or section index, as a quiet editorial touch. |
| 6 | **HAIR by Skin Clinic**, La Rochelle — https://hair-by-skinclinic.com/ | Awwwards HM, 22 Mar 2021 ([awwwards](https://www.awwwards.com/sites/hair-by-skin-clinic)) | Black/white + blue. Parallax, strong content architecture, photo & video. | Clear content order on a long scroll. |
| 7 | **Spoke & Weal**, US multi-city — https://www.spokeandweal.com | Design-led independent brand | Hero "A full service hair salon." with two CTAs ("Schedule Online" / "See the Menu"). A ticker strip of cities separated by ✦. Numbered services list, each card = photo + short text + **price range** + "Book →". Arrow glyphs (→ ↗) used as UI. | Numbered service list with **"…'den başlayan" prices**. Two hero CTAs (primary contact, secondary "Hizmetler"). Ticker strip, e.g. "Fön ✦ Boya ✦ Balyaj ✦ Gelin Saçı". |
| 8 | **Hershesons**, London — https://www.hershesons.com | Leading London salon brand | Hero "Great Hair Made Easy" with "In our salons, On set, or At Home". "Book Now" is in the top nav and in the hero. Separate desktop/mobile hero crops. Press quotes under "Our Spaces". | **Art-direct a separate mobile crop of the hero** (vertical) instead of letting a landscape image crop itself. Lesson: their second "Book Now" points to the stores page, not booking, so keep every CTA pointing to the same action. |
| 9 | **Album Hair** — https://www.albumhair.com/ | Awwwards nominee; featured by [Webflow](https://webflow.com/blog/web-design-for-hair-salons) | Background video glides through the salon interior. Two yellow CTAs pop against an otherwise neutral palette ([summary via search](https://studio.salonory.com/business-builders/hair-salon-website-design-inspiration/)). | **One saturated CTA colour** reserved only for "WhatsApp / Ara". Everything else neutral. |
| 10 | **Serenity Hair Salon**, Blaxland AU — https://serenityhairblaxland.com.au | Awwwards nominee, Sep 2025 ([awwwards](https://www.awwwards.com/sites/serenity-hair-salon-blaxland)) | Palette sampled from the salon's own hand-painted mural. Service breakdowns, embedded map, local SEO. | **Sample the palette from the client's real interior photos** (wall, tile, wood, chair leather) once they arrive. |

Also worth a glance: Awwwards' hair listing ([awwwards.com/websites/hair](https://www.awwwards.com/websites/hair/)), which includes Fruits Hair Lab, Hair Me Up and MABE Hair, and the London/Paris roundups ([thesalonbusiness](https://thesalonbusiness.com/hair-salon-websites/), [cyberoptik](https://cyberoptik.net/blog/best-salon-websites)). I found no Istanbul salon website with design recognition. Turkish awards (Estetica / Hairist) recognise salon *interiors*, e.g. Toprak Şeker and Ebil Hair Design ([estetica 2018](https://www.esteticamagazine.com/2018/05/03/istanbul-extravaganza-turkish-hairdresser-of-the-year-awards-winners-announced), [estetica 2017](https://www.esteticamagazine.com/2017/07/23/hairist-2017-turkeys-most-prestigious-hairdressing-event)). A strong Turkish salon site is still uncommon.

### Patterns the award sites share
- **Restrained palette, 1–2 neutrals + one accent.** The photos supply the colour. Suggested start: warm off-white (#F6F1EC-ish), deep ink (#1D1A18), one accent pulled from the interior photos.
- **Editorial type pairing:** a high-contrast serif or display face for headings plus a clean sans for body. *Must support Turkish glyphs (ç ğ ı İ ö ş ü)*. Test "Saç Bakımı · Dip Boya · Işıl" before choosing. Safe Google Fonts with full Turkish support include Fraunces, Cormorant Garamond, DM Serif Display, Playfair Display, Instrument Serif, Inter, Manrope and DM Sans (verify each in the font tester).
- **Big, honest photos:** full-bleed hero, generous whitespace, few words.
- **Motion is subtle:** fade/slide on scroll, slow Ken Burns on the hero, hover zoom. Respect `prefers-reduced-motion`. Do not import WebGL for a local salon; on mid-range Android phones it costs more than it gives.
- **The town name sits in the H1 or hero** (Il Colorista, Serenity), which helps local SEO.

---

## 2. Conversion patterns for a local salon

### What visitors want first, in rough priority
1. **Can I reach them now?** Phone / WhatsApp, and whether they are open today. Turkish autocomplete for "kadın kuaförü" includes "en yakın", "400 m içinde", "**ne zaman kapalı**" and "**hangi gün kapalı**". People check the **closed day** (Turkish salons often close on Monday or Sunday).
2. **Where?** Address, district or landmark, and a one-tap "Yol tarifi".
3. **How much?** "fiyatları" is a top autocomplete suffix for *every* service tested (dip boya, balyaj, brezilya fönü, keratin, gelin saçı, röfle, kaynak, protez tırnak), and also for "çanakkale kuaför fiyatları". A SalonCentric poll found 40% want to know what they'll get and pay before booking ([SalonCentric](https://www.probeautycentral.saloncentric.com/give-the-people-what-they-want-this-is-what-clients-want-to-see-on-your-website)). One agency reports that starting prices on service tiles cut price-question emails by about 60% (single-vendor claim, [redefineweb](https://redefineweb.com/blog/proven-beauty-salon-web-design-books-more-clients/)).
4. **Are they good?** Before/after work, and how many reviews they have and their rating.
5. **Vibe:** interior photos, the owner's face and story.

Several guides put location, starting prices and how-to-book above the fold, with hours and map lower ([getsiimple](https://getsiimple.com/blog/how-to-get-hair-salon-clients-fast-with-a-one-page-website/)). They also call for a persistent booking CTA ([insidea](https://insidea.com/blog/marketing/hair-salons/website-design-ideas-for-hair-salons)) and hours that match the Google Business Profile ([digittrix](https://www.digittrix.com/blogs/how-salon-marketing-strategies-can-turn-website-visitors-into-paying-clients)).

### Recommended section order (one page)
1. **Hero:** interior or signature work photo with a separate vertical mobile crop. H1 "Barış Alaş Kuaför — Çanakkale". One-line promise. Primary CTA **"WhatsApp'tan Randevu"**, secondary **"Ara"** (tel:). A small live line: "Bugün açık · 09:00–20:00" computed from the hours JSON (shows "Bugün kapalı · Yarın 09:00'da açığız" on the closed day).
2. **Quick info strip** (right under the hero, 3 icons): 📍 semt / landmark · 🕘 hours or closed day · ⭐ Google rating (if used). *No emoji in production. Use SVG icons.*
3. **Hizmetler:** grouped list (Saç Kesim & Fön / Renk / Bakım / Özel Gün / Güzellik) with "₺…'den başlayan" prices *if the owner agrees*. Otherwise "Fiyat için WhatsApp'tan yazın". Each group gets a small "Sor →" WhatsApp link with prefilled text naming that service.
4. **Galeri:** tabs "Salonumuz" / "Öncesi–Sonrası". Before/after uses a drag slider or side-by-side pair.
5. **Hakkımızda:** owner portrait, 3–4 warm sentences, years of experience.
6. **Yorumlar** (optional, see rules below).
7. **İletişim:** address (selectable text), tel, WhatsApp, hours table with today highlighted, static map image linking to Google Maps, Instagram link.
8. Footer: KVKK/Gizlilik link, © year.

### Sticky mobile CTA
- Use **either** a floating WhatsApp FAB **or** a bottom action bar on mobile, not both stacked. Recommendation: a floating WhatsApp FAB bottom-right on all screens. On mobile, after the user scrolls past the hero, optionally swap to a slim 2-button bar `[ Ara ] [ WhatsApp ]`. Keep it simple: the FAB alone is enough for v1.
- Hide or shrink the FAB while the hero CTA is visible (IntersectionObserver), so two identical CTAs don't compete on first view.

### Trust signals: Google reviews, and the rules
- **Linking out is always fine.** "Google'da 4,9 ★ · 120+ yorum → Yorumları gör" linking to the Business Profile is the safest pattern. Google's brand guidance allows businesses to *reference user reviews in marketing materials* and to use the unaltered "G" icon linking to *their* profile ([Google Brand Resource Center — user reviews](https://about.google/brand-resource-center/guidance/user-reviews)). Keep the rating/count updated by hand (monthly) and **do not round up**.
- **Showing review text pulled from Google** via the Places API requires attribution under Google's terms: the Google Maps logo, *"You must always credit the author when displaying photos or reviews"* (avatar/name/profile link), a link so users can view the review on Google Maps, and *"a clear notice that describes how reviews are being ordered and filtered"*. Caching or storing Places content is forbidden except place IDs ([Places API policies](https://developers.google.com/maps/documentation/places/web-service/policies)). The API returns at most 5 reviews ([idukki](https://idukki.io/blog/embed-google-reviews-on-website.md)). It also needs an API key, billing and a runtime call, which is overkill here.
- **Copy-pasting review text** into the site is a grey area: it implies a ToS issue and reviewer names are personal data under KVKK. If quoting, ask the reviewer's permission and use first name + initial only ("Ayşe K."). Google itself suggests asking permission ([localvisibilitysystem](https://www.localvisibilitysystem.com/2015/03/18/pasting-or-embedding-google-reviews-on-your-site-will-they-get-filtered/)).
- **Do not** add `AggregateRating` schema for your own business reviews on your own site. Google does not show "self-serving" review stars for LocalBusiness. (This is from my knowledge of Google's review-snippet guideline and was not re-fetched in this session, so verify before relying on it.)
- **Recommendation:** a rating badge that links out + 3 short quotes used with permission, *or* skip quotes entirely and let the before/after gallery be the proof.

### Instagram without heavy embeds
- Native Instagram embeds load third-party JS and tracking cookies, and private accounts can't be embedded ([schieb.de](https://www.schieb.de/749387/instagram-fotos-optimal-in-die-eigene-webseite-einbetten)). The KVKK cookie guide says social plugins are **not** consent-exempt for logged-out / non-member visitors (Kriter B doesn't apply, [KVKK Rehber §5.7](https://kvkk.gov.tr/Icerik/7353/Cerez-Uygulamalari-Hakkinda-Rehber)). So an embed would force a consent banner.
- **Better:** self-host 6–9 hand-picked images (from the salon's own account, so rights are clear) in a static grid, with a "@hesapadı — Instagram'da takip et ↗" link. Zero third-party requests and fast. Refresh by redeploying.

---

## 3. Turkish vocabulary, service list & tone

### Search signals (Google TR autocomplete, live 2026-10-22)
| Seed | Top suggestions (what people append) | Implication |
|------|--------------------------------------|-------------|
| çanakkale kuaför | **kadın**, kuaförler, **fiyatları**, **tavsiye**, *[stylist first names]*, en çok oy alanlar, **ağda** | Title/H1 should contain "Çanakkale" + "kadın kuaförü". Reviews and "tavsiye" matter. Ağda is a local query too. |
| kadın kuaförü | en yakın, 400 m içinde, **ne zaman / hangi gün kapalı**, saç kesim fiyatları, fiyatları | Show the closed day prominently. Keep the Google Business Profile complete (proximity). |
| dip boya | **fiyatları**, nasıl yapılır, renkleri, ne kadar sürer, fiyatları 2026 | Price + duration ("~1,5 saat") in the service list. |
| balyaj | nedir, saç, **modelleri**, **fiyatları**, **balyaj ve röfle farkı** | One-line explanations under colour services. A gallery of balyaj results. |
| brezilya fönü | fiyat, nedir, **zararlı mı**, keratin, **ne kadar kalıcı**, yorumları | Short reassurance FAQ ("Formaldehitsiz ürün kullanıyoruz" only if true; "3–6 ay kalıcı" style guidance). Brezilya fönü and keratin are often conflated ([listelist](https://listelist.com/keratin-bakimi-nedir/)). Avg 3–6 ay ([hurriyet](https://www.hurriyet.com.tr/yazarlar/nilufer-pazvantoglu/brezilya-keratin-bakimiyla-dumduz-saclar-16285832)). |
| keratin bakım | fiyat, nedir, ne işe yarar, ne kadar sürer, zararlı mı | Same FAQ pattern. |
| gelin saçı | **modelleri (2026)**, fiyat, **topuz**, açık, aksesuarları | A dedicated "Gelin & Özel Gün" block with photos. Seasonal (May–Sep wedding season). |
| röfle / ombre | modelleri, nedir, fiyatları, "ombre sombre farkı" | Colour services are visual searches, so photos sell them. |
| saç kaynak | fiyatları, çeşitleri, merkezi | Include only if offered. |
| protez tırnak / ipek kirpik / kaş laminasyonu | modelleri, fiyatları, nedir, "öncesi sonrası" | If offered, list under "Güzellik". "Öncesi sonrası" is literally searched. |

I found no Keyword Planner/Trends volumes. For hard numbers, the owner or the team can run Google Keyword Planner (TR, Çanakkale) or compare in trends.google.com.tr: "brezilya fönü" vs "keratin bakımı", and "balyaj" vs "röfle" vs "ombre".

### Suggested service menu (natural Turkish, grouped)
Use the names customers say, with the trendy term in parentheses where useful.

- **Kesim & Fön:** Saç Kesimi · Uç Alma · Fön · Maşa / Dalga · Düz Fön (Pürüzsüz Fön)
- **Renk:** Saç Boyama · Dip Boya · Röfle · Balyaj (Balayage) · Ombre / Sombre · Gölge Boya / Tonlama (Şeftali, Küllü vb.) · Renk Açma
- **Bakım & Düzleştirme:** Keratin Bakım · Brezilya Fönü · Saç Bakımı / Bakım Kürü (Botoks, Olaplex vb., only if real) · Perma
- **Özel Gün:** Gelin Saçı (Gelin Başı) · Nişan / Söz / Kına Saçı · Topuz · Abiye Saç · Gelin Makyajı · Prova
- **Kaynak:** Saç Kaynak (Mikro / Bant, if offered)
- **Güzellik:** Kaş Alma / Kaş Tasarımı · Kaş Laminasyonu · İpek Kirpik · Makyaj · Ağda · Manikür · Pedikür · Kalıcı Oje · Protez Tırnak

"Gelin başı" is the colloquial term and appears in national price references alongside fön/dip boya/röfle ([karekod.org](https://www.karekod.org/blog/?p=13971)). Use "Gelin Saçı" as the heading and "gelin başı" in body text for coverage. Reference 2026 national ranges (vary hugely by city, so use them only for sanity checks): fön ≈ 290–485 TL, dip boya ≈ 1.035–1.705 TL, röfle (uzun) ≈ 4.425–7.280 TL, gelin başı ≈ 4.220–6.980 TL (same source).

**Action:** get the owner's real list and only show what the salon actually does. Don't pad the list.

### Tone of voice (warm, simple, local)
- Use **"siz"** (polite but friendly), never stiff corporate "müşterilerimize hizmet vermekteyiz".
- Short sentences, everyday words, the first person plural "biz".
- Use local anchors: Çanakkale, the semt/street name, a landmark ("Kordon'a 2 dakika", only if true).
- Avoid superlatives that can't be proven ("en iyi", "1 numara"). Reklam Kurulu scrutinises unproven claims, and the voice feels more authentic without them.
- Sample lines:
  - Hero: **"Saçınız bizde emin ellerde."** / **"Çanakkale'de sıcak bir salon, özenli eller."**
  - Sub: "Kesimden gelin saçına, boyadan bakıma — size en çok yakışanı birlikte bulalım."
  - CTA: **"WhatsApp'tan Randevu Al"**, **"Hemen Ara"**, **"Yol Tarifi Al"**
  - Services intro: "Fiyatlar saçın uzunluğuna ve kullanılan ürüne göre değişebilir. Net bilgi için bize yazın, hemen dönelim."
  - About: "Yıllardır Çanakkale'de, aynı sevgiyle… Salonumuza gelen herkes bizim misafirimiz."
  - Hours: "Pazartesi kapalıyız. Diğer günler 09:00–20:00 arası sizi bekliyoruz."
  - Gallery: "Ellerimizden çıkanlar" / "Öncesi — Sonrası"
- Turkish typography details: `lang="tr"` on `<html>` (correct `text-transform: uppercase` for i→İ). Use the Turkish decimal comma (4,9). Write currency as "1.500 ₺" or "1.500 TL". Write times as 09:00.

---

## 4. WhatsApp click-to-chat

### URL format
- `https://wa.me/<countrycode><number>?text=<urlencoded>`. Use the international number with **no +, no leading 0, no spaces/dashes/brackets** ([WhatsApp Help Center — click to chat](https://faq.whatsapp.com/5913398998672934), summarised by [Bird](https://bird.com/explained/whatsapp/what-is-a-whatsapp-click-to-chat-link)). Turkish mobile **0 5xx xxx xx xx → 905xxxxxxxxx**.
- Encode the text with `encodeURIComponent()` (UTF-8 handles ç ğ ı ö ş ü). Spaces become %20, newline %0A ([Unipile](https://www.unipile.com/tr/?p=275019)). Don't hand-encode twice ("a%2520b" bug, [Bird](https://bird.com/explained/whatsapp/what-is-a-whatsapp-click-to-chat-link)).
- Keep prefilled text short. Bird quotes a ~140-character limit for Meta-managed short links. Plain wa.me text can be longer, but short is better UX.
- Prefilled text examples:
  - Default FAB: `Merhaba, web sitenizden ulaşıyorum. Randevu almak istiyorum.`
  - Per service: `Merhaba, Balyaj için fiyat ve randevu bilgisi alabilir miyim?`
  - Encoded: `https://wa.me/905XXXXXXXXX?text=Merhaba%2C%20web%20sitenizden%20ula%C5%9F%C4%B1yorum.%20Randevu%20almak%20istiyorum.`
- The number must be on WhatsApp (ideally **WhatsApp Business** with a greeting/away message and hours, so after-hours messages get an auto-reply).
- Add `target="_blank" rel="noopener"`. On mobile, wa.me opens the app. On desktop, it opens WhatsApp Web or Desktop.

### Accessibility
- Use a real `<a>` element, not a div with JS. Add `aria-label="WhatsApp ile yazın"` (the icon alone has no text). Use a visible text label on desktop ("WhatsApp") or a tooltip.
- Size the target at **56×56 px** (exceeds WCAG 2.2 SC 2.5.8 minimum of 24×24 CSS px, [W3C](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html); aim for ≥44 px per 2.5.5 Enhanced).
- Give it a visible `:focus-visible` ring and ≥3:1 contrast of the icon against the button. WhatsApp green #25D366 with a white glyph is fine for the icon; check the ring against the page background.
- Place it last in the DOM or after the main landmarks, so keyboard users aren't trapped at the start. Respect `prefers-reduced-motion` for any pulse animation. Better still, don't pulse at all.

### Placement (avoid collisions)
- `position: fixed; right: max(16px, env(safe-area-inset-right)); bottom: max(16px, env(safe-area-inset-bottom));` with `viewport-fit=cover` in the viewport meta. This clears the iPhone home indicator and Android gesture bar.
- iOS Safari's bottom toolbar collapses and expands. Use `bottom` with safe-area (not `vh`) so the button rides above it.
- **If there is no cookie banner (recommended, see below), there is no collision.** If a banner is ever added, lift the FAB above it (CSS var for banner height) or place the banner at the top.
- Don't cover the last line of the footer or the map. Add `padding-bottom` ≈ 88 px to the footer.
- Keep `z-index` below any lightbox, and hide the FAB while the gallery lightbox is open.

---

## 5. KVKK and cookies for this site

Primary source: KVKK **"Çerez Uygulamaları Hakkında Rehber"**, updated edition **KVKK Yayınları No: 69, Temmuz 2025** ([kvkk.gov.tr](https://kvkk.gov.tr/Icerik/7353/Cerez-Uygulamalari-Hakkinda-Rehber)). The guide is advisory. KVKK (6698) has no cookie-specific article; cookies are assessed under its general principles ([erdem-erdem](https://www.erdem-erdem.av.tr/bilgi-bankasi/kisisel-verileri-koruma-kurumu-cerez-uygulamalari-hakkinda-rehberi-guncelledi)).

Key points from the guide (text extracted from the PDF):
- Consent-exempt cookies must meet **Kriter A** (only for transmitting the communication) or **Kriter B**: *"Çerez kullanımının, abonenin veya kullanıcının hizmet almak için açıkça talep ettiği bilgi toplum hizmetleri için kesinlikle gerekli olması."*
- **First-party analytics can fall under Kriter B (§5.9):** *"…birinci taraf analitiklerin Kriter B kapsamında değerlendirilebileceği düşünülmektedir."* The conditions: the purpose is limited to audience/performance measurement; IP masking is recommended; the cookies are *"yalnızca anonim istatistikler üretmek için kullanılması"*; there is no cross-site tracking; the lifetime is reasonable; and *"toplanan verilerin üçüncü taraflara iletilmemesi"*.
- A cookie that remembers consent choices is itself Kriter B (§5.8).
- **Social plugins** (Instagram/Facebook embeds) are *not* exempt for logged-out or non-member visitors (§5.7).
- A first visit does not count as consent, and analytics/ads/personalisation cookies generally need **açık rıza** ([ntv summary](https://www.ntv.com.tr/teknoloji/kvkk-cerezler-icin-rehber-hazirladi,BdjApRquJEmK4KG6JZ-IpQ)).
- **Aydınlatma (information notice) is separate from consent.** It must be easily accessible, clear and simple, and must name the cookies and their purposes. Bundling aydınlatma with consent is not acceptable.

### Verdict for Barış Alaş
| Setup | Banner needed? |
|-------|----------------|
| Static site, **no cookies at all**, self-hosted fonts/images, static map image, wa.me/tel: links | **No cookie banner.** Nothing is stored on the device. Still add a short "Gizlilik / KVKK Aydınlatma" page or modal (see below). |
| + **cookieless analytics** (e.g. Cloudflare Web Analytics, Plausible, Umami; no cookies or localStorage IDs, no IP storage) | **No banner.** This stays outside the cookie question (nothing written to the device). Mention it in the privacy note. *Verify the chosen tool's data-processing location; transfer abroad is its own KVKK topic under the 2024 amended Art. 9.* |
| + first-party, cookie-based, IP-masked analytics | Arguably exempt under Kriter B (§5.9), but needs disclosure. Prefer cookieless instead. |
| + Google Analytics / Meta Pixel / Instagram embed / Google Fonts from Google CDN / live Google Maps iframe | **Consent banner needed.** These are third parties, involve cross-site tracking and send data abroad. Avoid them. |

**Google Maps:** the live iframe sets Google cookies and calls Google on load. Use a **static map image** (self-made screenshot or illustrated map) wrapped in a link built with **Maps URLs**. These need no API key: `https://www.google.com/maps/search/?api=1&query=Barış+Alaş+Kuaför+Çanakkale&query_place_id=<PLACE_ID>`, and for directions `https://www.google.com/maps/dir/?api=1&destination=...` ([Maps URLs docs](https://developers.google.com/maps/documentation/urls/get-started)). An alternative is a click-to-load facade: "Haritayı yüklemek için dokunun" ([example plugin](https://si.wordpress.org/plugins/gdpr-dsgvo-compliant-embeds-for-google-maps/)).

**Still recommended even with zero cookies:** a short **Aydınlatma Metni** linked in the footer. It should cover who the data controller is (the salon), that the site keeps no cookies, that hosting servers may keep technical logs (IP), that messages sent via WhatsApp/phone are processed to arrange appointments (legal basis: contract preparation / legitimate interest), how long data is kept, and how to apply under KVKK Art. 11. **VERBİS:** a small salon is very likely exempt. Since Kurul decision 2025/1572 (RG 1 Oct 2025), controllers whose main activity is not special-category data are exempt under <50 employees and <100M TL balance ([erdem-erdem](https://www.erdem-erdem.av.tr/bilgi-bankasi/verbis-kayit-yukumlulugune-iliskin-yeni-istisnalarin-uygulama-esaslari-aciklandi), [hukukihaber](https://www.hukukihaber.net/kisisel-verileri-koruma-kurulunun-04092025-tarihli-ve-20251572-sayili-karari-isiginda-verbis-kayit-yukumlulugunun-istisna-kapsaminda-degisimi)). *This is not legal advice. Have the owner's accountant or lawyer confirm.*

---

## 6. Photo brief for the client (send to the nephew)

### Why consent matters (KVKK)
- A recognisable face is personal data. Sources say verbal OK to *take* a photo ≠ permission to *publish* it. Get **açık ve yazılı rıza** that names the purpose (website + Instagram), and keep proof ([halktv, lawyer S. Canbolat](https://halktv.com.tr/turkiye/oncesi-sonrasini-paylasan-estetikcilerin-basi-buyuk-belaya-girebilir-hapsi-bile-varmis-1053963h)).
- KVKK has fined a business for publishing people's footage without consent ([halı saha decision](https://www.takvim.com.tr/yasam/2022/01/21/kisisel-verileri-koruma-kurulu-tarafindan-hali-saha-macinin-riza-alinmadan-kaydedilip-paylasilmasina-para-cezasi-kesildi)). It has also handled continued publication of photos after a relationship ended and a removal request was made (Kurul 2022/491, [kvkk.gov.tr](https://www.kvkk.gov.tr/Icerik/7564/2022-491)). Consent can be withdrawn, so the site must allow quick removal (one-file swap).
- **Practical:** a one-page Turkish consent form (name, date, which photos, where they'll be used: web sitesi / Instagram, "istediğiniz zaman geri alabilirsiniz", signature). Or a WhatsApp message in which the customer explicitly writes "Fotoğraflarımın web sitesi ve Instagram'da paylaşılmasına izin veriyorum". Keep the screenshot.
- **Safest default:** shoot hair work **from behind or the side, face not visible**, or crop at the jaw. Most before/after hair work reads perfectly from the back (balyaj, boya, kesim). Gelin saçı topuz looks best from behind anyway.
- Staff photos also need the staff member's consent.

### What to shoot (shot list, ~40–60 raw → we pick ~20–25)
| Set | Count | Orientation / ratio | Notes |
|-----|-------|---------------------|-------|
| **Exterior / tabela** | 3–4 | 1 horizontal + 2 vertical | Daytime, sign straight-on and readable. Shows people how to recognise the door. |
| **Interior wide** | 4–6 | **horizontal 3:2 or 16:9** (desktop hero) **and vertical 4:5 / 9:16** (mobile hero) from the same spot | Corner of the room at chest height, lights on, everything tidy, no clutter or bags. |
| **Interior details** | 6–8 | **vertical 4:5** and square | Mirror station, chair, products shelf, tools, plants, coffee corner, decor details. |
| **Owner portrait** | 3–5 | vertical 4:5 | Near a window, natural smile, at work, plus one posed. |
| **Work / process** | 4–6 | vertical | Hands with brush, folyo, fön, (optional 5–10 s video clips, vertical 9:16, steady). |
| **Before/after pairs** | 8–12 pairs | **vertical 4:5, identical framing** | See rules below. |
| **Özel gün (gelin/topuz)** | 3–6 | vertical | From behind or side. Plain backdrop. |

**Why 4:5 vertical:** phones are the main audience and the photos double as Instagram posts (4:5 is Instagram's tallest feed ratio). Shoot at the phone's **native 4:3 full resolution** and we crop to 4:5 / 1:1 / 16:9 later. Leave space around the subject. Don't use the phone's 16:9 photo mode (lower resolution on many phones).

### Lighting & phone settings
- **Daylight from a window, beside or in front of the subject**, never behind. Late morning on a bright or overcast day is ideal. Turn the salon lights on too, but avoid mixing very warm bulbs with daylight on hair colour shots.
- **No flash.** No beauty/portrait filters, no AI enhancement (it distorts hair colour and undermines the before/after). Use the main 1× lens, not ultra-wide, for people (wide-angle distorts). Ultra-wide is OK for the interior wide shot only.
- Wipe the lens. Tap to focus on the hair and lower exposure slightly if blondes blow out. Hold horizontal lines (mirror, counter) level and turn on the grid.
- Send **originals**, not WhatsApp-compressed copies. Use Google Drive / WeTransfer / AirDrop, or WhatsApp "Belge olarak gönder".

### Before/after consistency rules
1. Same spot, same background (plain wall or the same mirror area), same light, same distance, same lens.
2. Same angle: back of head for colour/length, side for layers/volume.
3. Hair brushed or styled in both, or note "fön öncesi". Don't compare wet with styled.
4. Shoot the "after" within minutes of finishing, before the client leaves, from the same mark (a tape mark on the floor helps).
5. No filters on either photo. Do colour correction identically, or not at all.

### File naming & delivery
`YYYYMMDD_kategori_konu_NN.jpg`, e.g. `20261105_ic-mekan_genis_01.jpg`, `20261105_once-sonra_balyaj-ayse_01-once.jpg` / `…_01-sonra.jpg`. Categories: `dis-mekan`, `ic-mekan`, `detay`, `portre`, `islem`, `once-sonra`, `gelin`. Put pairs in the same folder. Add a simple note (or a line in a sheet) per pair: service name, consent yes/no, face visible yes/no.

### Production-side notes (for us)
- Export AVIF/WebP plus a JPEG fallback via `<picture>`. Hero ≤ ~200 KB on mobile. Use `srcset` with 480/768/1200/1920 widths. Set `loading="lazy"` on everything except the hero (`fetchpriority="high"`). Include width/height attributes to avoid CLS.
- Strip EXIF/GPS from customer photos before publishing (location metadata is personal data too).
- Write Turkish `alt` text, e.g. "Balyaj öncesi ve sonrası — omuz boyu kahve saç".

---

## Sources
- Awwwards: [hair listing](https://www.awwwards.com/websites/hair/), [ALICE](https://www.awwwards.com/sites/alice-hair-art), [Il Colorista](https://www.awwwards.com/sites/il-colorista-salon), [Marco Ambrosi](https://www.awwwards.com/sites/marco-ambrosi-salon), [Mistretta](https://www.awwwards.com/sites/mistretta-coiffure), [Salon Sona](https://www.awwwards.com/sites/salon-sona), [HAIR by Skin Clinic](https://www.awwwards.com/sites/hair-by-skin-clinic), [Serenity](https://www.awwwards.com/sites/serenity-hair-salon-blaxland)
- Live sites: alicehairart.se, ilcolorista.salon, spokeandweal.com, hershesons.com, albumhair.com
- Roundups: [Webflow](https://webflow.com/blog/web-design-for-hair-salons), [Salonory](https://studio.salonory.com/business-builders/hair-salon-website-design-inspiration/), [thesalonbusiness](https://thesalonbusiness.com/hair-salon-websites/), [cyberoptik](https://cyberoptik.net/blog/best-salon-websites)
- Conversion: [SalonCentric](https://www.probeautycentral.saloncentric.com/give-the-people-what-they-want-this-is-what-clients-want-to-see-on-your-website), [redefineweb](https://redefineweb.com/blog/proven-beauty-salon-web-design-books-more-clients/), [getsiimple](https://getsiimple.com/blog/how-to-get-hair-salon-clients-fast-with-a-one-page-website/), [insidea](https://insidea.com/blog/marketing/hair-salons/website-design-ideas-for-hair-salons), [digittrix](https://www.digittrix.com/blogs/how-salon-marketing-strategies-can-turn-website-visitors-into-paying-clients)
- Google: [Brand guidance — user reviews](https://about.google/brand-resource-center/guidance/user-reviews), [Places API policies](https://developers.google.com/maps/documentation/places/web-service/policies), [Maps URLs](https://developers.google.com/maps/documentation/urls/get-started)
- WhatsApp: [Help Center click to chat](https://faq.whatsapp.com/5913398998672934), [Bird](https://bird.com/explained/whatsapp/what-is-a-whatsapp-click-to-chat-link), [Unipile](https://www.unipile.com/tr/?p=275019)
- Accessibility: [WCAG 2.2 SC 2.5.8](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)
- KVKK: [Çerez Rehberi (Temmuz 2025)](https://kvkk.gov.tr/Icerik/7353/Cerez-Uygulamalari-Hakkinda-Rehber), [Erdem & Erdem on update](https://www.erdem-erdem.av.tr/bilgi-bankasi/kisisel-verileri-koruma-kurumu-cerez-uygulamalari-hakkinda-rehberi-guncelledi), [VERBİS 2025/1572](https://www.erdem-erdem.av.tr/bilgi-bankasi/verbis-kayit-yukumlulugune-iliskin-yeni-istisnalarin-uygulama-esaslari-aciklandi), [Kurul 2022/491](https://www.kvkk.gov.tr/Icerik/7564/2022-491), [halı saha fine](https://www.takvim.com.tr/yasam/2022/01/21/kisisel-verileri-koruma-kurulu-tarafindan-hali-saha-macinin-riza-alinmadan-kaydedilip-paylasilmasina-para-cezasi-kesildi), [before/after consent article](https://halktv.com.tr/turkiye/oncesi-sonrasini-paylasan-estetikcilerin-basi-buyuk-belaya-girebilir-hapsi-bile-varmis-1053963h)
- Turkish services/prices: [karekod 2026 tarifeler](https://www.karekod.org/blog/?p=13971), [listelist keratin](https://listelist.com/keratin-bakimi-nedir/), [Hürriyet brezilya fönü](https://www.hurriyet.com.tr/yazarlar/nilufer-pazvantoglu/brezilya-keratin-bakimiyla-dumduz-saclar-16285832), [Armut Çanakkale](https://armut.com/canakkale-sac-bakimi); Google autocomplete (suggestqueries.google.com, hl=tr, gl=tr, fetched 2026-10-22)
- Instagram embeds: [schieb.de](https://www.schieb.de/749387/instagram-fotos-optimal-in-die-eigene-webseite-einbetten)
