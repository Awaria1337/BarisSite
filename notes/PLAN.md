# Barış Alaş — Uygulama Planı v1 (2026-10-22)

Kaynaklar: research/01..05. Kararlar gerekçeleriyle; varsayımlar ve çökme noktaları en altta.

## 1. Mimari kararlar

| Konu | Karar | Neden |
|---|---|---|
| Framework | Next.js 16.4.x App Router, tamamen statik (`output: 'export'`) | Tek sayfa, sunucu işi yok; statik = en iyi LCP/TTFB, host bağımsız |
| Dil | TypeScript 5.9/6.x (TS 7 değil) | TS 7 + Next desteği yalnız 3. parti kaynakta doğrulanmış |
| Stil | Tailwind 4.3 (CSS-first `@theme`) | brief |
| Node | 24.x LTS (fnm ile), `.node-version` + `engines` | Vercel/Cloudflare uyumu; 26 henüz LTS değil ve Vercel desteklemiyor; Hermes'in Node'una dokunulmaz |
| Hosting | **Cloudflare Workers static assets (ücretsiz)** — Mert onayına bağlı | Vercel Hobby ticari kullanımı yasaklıyor; Pro $240/yıl. CF ücretsiz, ticari serbest, İstanbul/İzmir PoP |
| Görseller | Build öncesi sharp ile AVIF+WebP, 4–5 genişlik, blur placeholder (veya next-image-export-optimizer) | Statik exportta Next image optimizer yok; quota riski de yok |
| Animasyon | CSS-first + scroll-driven (`@supports`) + React `<ViewTransition>` (galeri lightbox); JS lib yok, gerekirse `motion` LazyMotion | INP/LCP korunur |
| Galeri | Grid sabit aspect-ratio + lazy lightbox (native `<dialog>` + ViewTransition; swipe gerekirse PhotoSwipe lazy) | sıfır CLS |
| WhatsApp | düz `wa.me/90535…?text=` link, sağ alt, safe-area | 0 KB, KVKK temiz |
| Harita | statik görsel + "Yol tarifi" Maps URL (iframe yok) | perf + çerez yok |
| Instagram | embed yok; self-hosted grid + profil linki | KVKK çerez banner'ı gerektirmesin |
| Analitik | yok ya da Cloudflare Web Analytics (çerezsiz) | banner gerekmez |
| SEO | metadata API, `robots.ts`, `sitemap.ts`, OG görseli, `HairSalon` JSON-LD (aggregateRating yok), görünür SSS | research/02 |

## 2. Sayfa yapısı (tek sayfa)

1. **Hero** — büyük fotoğraf (mobilde dikey kırpım), H1: "Çanakkale'de kadın kuaförü" + isim; WhatsApp + Ara butonları; "Bugün 09:00–19:00 açık" satırı (statik saatlerden istemci tarafında hesap, CLS'siz)
2. **Bilgi şeridi** — adres (Akol Otel), saatler, telefon, 4.8★ Google rozeti → GBP linki
3. **Hizmetler** — gruplar: Kesim & Fön · Renk (boya, röfle, balyaj) · Bakım (keratin, Brezilya fönü, Olaplex) · **Kaynak Saç & Protez Saç / Peruk** (öne çıkan niş) · Gelin & Özel Gün · Güzellik (makyaj, kaş, manikür/pedikür, ağda). Fiyat varsa "…'den başlayan", yoksa "Fiyat için WhatsApp"
4. **Galeri** — salon içi/dışı + işler (önce/sonra çiftleri)
5. **Barış Alaş hakkında** — kısa hikâye, kullanılan markalar
6. **SSS** — "kaynak saç ne kadar dayanır", "keratin zararlı mı", "pazar açık mı", "randevu nasıl" vb.
7. **İletişim** — harita görseli, adres, telefon, WhatsApp, Facebook/Instagram, saatler
8. **Footer** — NAP, Aydınlatma Metni linki (modal ya da /aydinlatma ayrı statik sayfa)

## 3. Tasarım yönü (taslak — frontend-design 2. geçişte kesinleşir)

- Konu: Çanakkale kordonu, Boğaz, saç = malzeme (kaynak/protez uzmanlığı).
- Kaçınılacak AI-kalıpları: krem+terracotta, siyah+asit yeşil, ALL-CAPS eyebrow, 01/02/03 numaralar, her bölüme fade-up.
- Palet taslağı: Boğaz mürekkebi `#14303A`, deniz camı `#A9C5C0`, kum `#ECE8E1`, kestane `#6B3E2E`, beyaz `#FFFFFF`. (Kontrast testi şart.)
- Tip: ekspresif serif başlık + sade sans gövde, ikisi de latin-ext (ğ ş ı İ). Aday: Gloock / Onest (kesinleşecek).
- Tek akılda kalan an: hero yüklenirken başlığın satır satır clip-path ile açılması (H1 görünür kalır, yalnız transform/clip — LCP'yi bozmaz). Geri kalan sakin.

## 4. Fazlar

0. **Hazırlık** — Node 24 (fnm) kur [ONAY], `npx skills add emilkowalski/skills` [opsiyonel], git init
1. **İskelet** — create-next-app, static export config, Tailwind tema token'ları, fontlar, bölüm bileşenleri boş, `content/site.ts` (NAP/saat/hizmet tek kaynak), placeholder görseller sabit oranlarla
2. **SEO çekirdeği** — metadata, robots, sitemap, JSON-LD, OG görseli, ikonlar, `public/_headers` (cache + güvenlik)
3. **Görsel hattı** — `scripts/images.mjs` (sharp: AVIF/WebP/blur), EXIF/GPS temizleme
4. **Bölümler + metin** — Türkçe metinler, hizmetler, SSS
5. **Hareket** — hero açılışı, galeri ViewTransition, reduced-motion
6. **Gerçek fotoğraflar + logo** (Mert'ten)
7. **Kalite kapısı** — Lighthouse (mobil) 100/100/100/100, axe, gerçek cihaz testi, `web-design-guidelines` denetimi
8. **Yayın** — Cloudflare'e deploy, domain DNS → Cloudflare, www/apex yönlendirme, Search Console + Bing + Yandex, sitemap gönderimi
9. **Site dışı yerel SEO** — Google İşletme Profili web linki + bilgiler güncelle, eski adresli dizinleri düzelt

Delegasyon: Faz 1–3 iskelet bende (mimari). Faz 4 metin bende; bölüm bileşenleri tam spec ile codex lane'lerine bölünebilir. Faz 7 denetimi Opus ajanı.

## 5. Plan nerede çöker? (pre-mortem)

| # | Varsayım | Yanlışsa | Önlem |
|---|---|---|---|
| A | Hosting Vercel'de ücretsiz olabilir | ToS ihlali, hesap kapanabilir | CF'ye geçildi; Mert Vercel'de ısrar ederse Pro ($20/ay) |
| B | Domain Mert'in kontrolünde, NS değiştirilebilir | CF apex için zone şart → kurulum kilitlenir | Registrar + domain adını şimdi öğren; .com.tr NS değişimi registrar panelinden |
| C | **Google İşletme Profili'ne erişim var** | Site ne kadar iyi olsa da harita sıralaması GBP'ye bağlı; kırık web linki kalır | Dayının GBP sahibi olduğu Google hesabı lazım. **Yerel SEO'nun %70'i burada** |
| D | Akol Otel adresi güncel | Yanlış NAP → sıralama düşer, müşteri yanlış yere gider | Mert'ten teyit |
| E | Tek sayfa "SEO %100 öne çıkmak" için yeter | Tek URL; kaynak saç, protez saç, gelin saçı gibi ayrı niyetler tek sayfada yarışır | **İtiraz:** v1 tek sayfa yayınla; v2'de 2–3 hizmet sayfası (/kaynak-sac, /protez-sac-peruk, /gelin-saci) — en büyük niş fırsatı bunlar |
| F | Lighthouse 100 = Google'da 1. sıra | Değil. CWV kırıcı değil eşik; sıralama = GBP + yorumlar + alaka + NAP | Beklentiyi doğru kur; Lighthouse 100 yine hedef |
| G | Fotoğraflar kaliteli ve izinli gelir | WhatsApp sıkıştırması / izinsiz yüz → hem görsel hem KVKK sorunu | Foto rehberi + rıza notu Mert'e verildi; iskelet placeholder ile ilerler |
| H | Fiyatlar paylaşılacak | "fiyatları" aramalarında zayıf kalırız | Fallback: "Fiyat için WhatsApp" |
| I | Static export + kendi görsel hattı sorunsuz | Next 16 export + image tuhaflıkları | Faz 3'te erken spike; olmazsa next-image-export-optimizer |
| J | fnm kurulumu diğer projeleri etkilemez | Global Node değişir, GuardioX vb. projeler 22'ye bağlıysa kırılır | O projelere `.node-version 22`; ya da fnm'i yalnız bu klasörde kullan |
