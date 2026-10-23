# Barış Alaş — Web Sitesi Proje Notları

## Brief (Mert, 2026-10-22)
- Müşteri: Barış Alaş — kadın kuaförü, Çanakkale (Mert'in dayısı)
- Tek sayfa, profesyonel, bol fotoğraflı (dükkan içi/dışı, saç işleri — fotoğrafları Mert gönderecek)
- Bölümler: hizmetler, galeri, iletişim, sağ altta WhatsApp butonu
- Stack: Next.js + Tailwind, Vercel, kendi domain (ömür boyu kullanım)
- Dil: yalnızca Türkçe; metinler araştırmayla yazılacak, sade ve anlaşılır
- Logo yok → Mert üretip gönderecek
- Animasyonlu geçişler, kesin mobil uyum
- SEO hedefi: Lighthouse 100, CWV (LCP/CLS/INP/FCP) iyi, robots/sitemap/schema
- Node/npm en güncel sürüm araştırılıp kurulacak

## Araştırma raporları
- research/01-business.md — işletme bilgileri (IG, FB, harita, telefon)
- research/02-seo-cwv.md — SEO, CWV, Vercel
- research/03-toolchain.md — Node/npm/Next/Tailwind sürümleri, animasyon
- research/04-design-ux.md — tasarım referansları, UX, KVKK, foto rehberi

## Kararlar (Mert onaylı, 2026-10-22)
- Hosting: **Cloudflare ücretsiz** (Workers static assets, `output: 'export'`), DNS Cloudflare'e taşınacak.
- Node: **fnm + Node 24.22.1** (npm 11.19.1). `fnm default 24` → yeni shell'lerde global node 24 (Hermes kendi mutlak yolunu kullanır). Diğer projeler 22 isterse `.node-version` koyulmalı.
- Sayfa: **v1 tek sayfa**, v2'de /kaynak-sac, /protez-sac-peruk, /gelin-saci.
- Skill: emilkowalski animasyon skill'leri kuruldu (animate, animation-performance, review-animations, improve-animations, find-animation-opportunities, mobile-native, emil-design-eng, animation-vocabulary).
- Scaffold: create-next-app 16.4.2 → TS 5 (TS7 riski yok), Tailwind `@tailwindcss/turbopack` loader (postcss değil), şablon `cacheComponents: true` açık (export ile uyumu kontrol ediliyor).
- Tasarım: notes/DESIGN.md — "Kordon ışığı", Gloock + Onest, Boğaz/Kestane paleti, tek hareket anı = hero saç teli çizgisi.
- Veri tek kaynak: src/content/site.ts (`confirm` işaretli alanlar teyit bekliyor).

## Açık sorular (Mert'e)
_(araştırma sonrası doldurulacak)_

## Öğrenilenler / plan değişiklikleri
- [toolchain] Aktif `node` = Hermes Agent'ın gömülü v22 (~/.local/bin → ~/.hermes/node). Dokunma. /usr/local/bin'de resmi pkg Node 24.16 zaten var ama gölgede.
- [toolchain] "En son" Node = 26 (28 Eki'de LTS) ama Vercel sadece 24.x/22.x destekliyor → proje Node 24 (engines 24.x, .node-version). Plan: fnm ile 24 LTS en son patch (24.22.1).
- [toolchain] Next 16.4.2, React 19.3.1, Tailwind 4.3.3 (CSS-first), TS 7 native (Next desteği yalnız 3. parti kaynakta doğrulanmış → risk, TS 5.x/6.x pin düşün).
- [toolchain] Animasyon: CSS-first + tw-animate-css + React ViewTransition; gerekirse motion LazyMotion. Lenis yok. Hero/H1 opacity-0 fade yok (LCP).
- [toolchain] Skill adayı: emilkowalski/skills (animasyon zevki/perf).
- [seo] ⚠️ PLAN KIRICI: Vercel Hobby ticari kullanımı yasaklıyor (işletme sitesi = ticari). Seçenek: Pro $20/ay, ya da static export + ticari kullanıma izin veren host (Cloudflare Pages/Netlify — şartlar doğrulanmadı). "Ömür boyu ücretsiz Vercel" varsayımı yanlış → Mert'e sor.
- [seo] Hobby image quota 5K transform/ay; aşınca 402 + sadece alt text. Static export'ta resimleri build'de üret (sharp) → quota riski sıfır.
- [seo] Next 16: `priority` deprecated → `preload` ya da eager+fetchPriority. `images.qualities` zorunlu. viewport ayrı export. metadataBase şart.
- [seo] HairSalon JSON-LD, aggregateRating YOK (self-serving). FAQ rich result yok ama görünür SSS kalabilir. Map = facade. Yandex Webmaster da yapılacak (~%11 TR payı).
- [seo] DNS değerlerini Vercel domain kartından kopyala, hardcode etme. MX kayıtlarını koru.
- [ux] Ziyaretçi önceliği: fiyat ("fiyatları" her hizmette autocomplete), kapalı gün, konum, WhatsApp/Ara. Hero'da "Bugün açık" satırı.
- [ux] Sıra: hero → hızlı bilgi şeridi → hizmetler ("…'den başlayan") → galeri → hakkında → (yorum) → SSS → iletişim.
- [ux] Instagram embed YOK (KVKK §5.7 → cookie banner zorlar). Self-hosted 6–9 grid + profil linki. Map iframe yerine statik görsel + Maps URL.
- [ux] Cookie/izleme yoksa banner gerekmez; kısa Aydınlatma Metni yine konacak.
- [ux] Fiyatlar ve yüzü görünen müşteri foto rızası Mert'ten gelmeli. Foto: 4:3 çek, 4:5 kırp, orijinal gönder (WhatsApp sıkıştırması değil).
- [ux] Referans: ALICE Hair & Art (Stockholm) — en yakın brief eşleşmesi.
- [biz] Google Maps (doğrulandı): "Barış Alaş Kuaför Salonu Akol hotel", Cevat Paşa Mah. Kayserili Ahmet Paşa Cd. No:32 17000 Çanakkale Merkez (Akol Otel). 40.1523062, 26.4071657. 4.8★ / 213 yorum. 0535 462 09 90. Her gün 09–19 (?)
- [biz] Eski adres Barbaros Mah. Alpaslan Sk. 4/1 ("V.I.P Kuaför Salonu") → muhtemelen taşındı. NAP tutarsızlığı = SEO riski, dizinler güncellenmeli.
- [biz] barisalas.com.tr NXDOMAIN — Maps'teki web linki kırık. Mert'in "elimdeki domain" bu mu? Sor.
- [biz] FB: facebook.com/Barisalas. IG resmi hesap bulunamadı (@barisalas_ şüpheli).
- [biz] Hizmet: kesim, boya, şekillendirme, KAYNAK SAÇ + malzeme satışı, PERUK / PROTEZ SAÇ, makyaj, kaş, manikür/pedikür, ağda. Markalar: MAC, L'Oréal, Kérastase, Olaplex, Selective. Fiyat yok.
- [biz] Yorumlarda öne çıkan: Barış Bey'in dürüst tavsiyesi, doğal kaynak saç, modern kısa kesim.
- [biz] SEO fırsatı: "kadın kuaförü Çanakkale" Maps'te 13. sırada; ilk 5 rakipte kaynak/protez saç uzmanlığı yok, çoğunun gerçek sitesi yok → niş: "Çanakkale kaynak saç", "Çanakkale protez saç / peruk".
- [next16] cacheComponents/partialPrefetching export ile build kırar → kaldırıldı. `output:'export'`, `trailingSlash:true`, `images.unoptimized`.
- [next16] robots/sitemap/manifest .ts → `export const dynamic = 'force-static'` şart. OG görseli ve ikonlar .tsx değil statik dosya (uzantısız çıktı CF'de yanlış content-type).
- [next16] `priority` → `preload`. ViewTransition: `import { ViewTransition } from 'react'`, flag yok, yalnız startTransition içinde çalışır.
- [next16] Tailwind turbopack loader çalışıyor (doğrulandı); kırılırsa @tailwindcss/postcss'e dön.

## İlerleme
- 2026-10-22 Faz 0 ✅ (fnm, Node 24.22.1, skill'ler). Faz 1 ✅ iskelet: config (export), layout (Gloock/Onest latin-ext, metadata, viewport), JSON-LD HairSalon, robots, sitemap, `_headers`, tüm bölümler (placeholder foto, sabit oran), OpenNow (İstanbul saati, CLS'siz), WhatsApp float (safe-area). build+lint+tsc temiz; 390px/1440px ekran görüntüsü kontrol edildi.
- [test] Headless Chrome --window-size min ~500px → mobil testte 390px iframe sarmalayıcı kullan; animasyon için --virtual-time-budget.
- Sıradaki: Faz 2 kalanları (OG görseli, ikonlar, manifest — logo bekliyor), Faz 3 görsel hattı (sharp + <picture>), Faz 5 galeri lightbox.

## v2 yeniden tasarım (2026-10-22, Mert geri bildirimi: "çok sade, boş")
- Mert kararları: stok foto şimdilik (Unsplash, assets/stock + credits.json), çok sayfa (/, /hizmetler/, /hizmetler/[7 slug]/, /galeri/, /hakkimizda/, /iletisim/, /sss/, /kvkk/), referans görünüm (krem + kakao, grotesk), halftone wordmark footer, markalar marquee, 3 sütun akan yorumlar, WhatsApp CTA banner.
- Font: Inter Tight (başlık, italik vurgu) + Inter (gövde). Gloock/Onest bırakıldı (Mert ref görseli).
- Palet: krem #f7f0e8, fildisi #fffdf9, nude #eadbcd, çizgi #e0cfbf, mürekkep #1b1612, gri #6b5f57, kakao #7b5238 (ana), karamel #c49a74.
- InfiniteSlider: framer-motion yerine CSS-only (aynı API) — ~40KB JS tasarrufu, INP/TBT için.
- Yorumlar: ÖRNEK (sample:true), Google yorum temalarından yazıldı, uydurma isim. `qa:launch` gerçek yorum gelene kadar yayını engeller. Puan/sayı (4.8/213) gerçek.
- Codex: 0.155'te --full-auto yok → --approve-for-me; gpt-5.6-sol bu hesapta yok → gpt-6-luna.
- Lane'ler: L1 görsel hattı + Picture + lightbox ✅, L2 footer/slider/yorumlar (sürüyor), L3 QA scriptleri + CSP ✅ (sandbox port bind EPERM → Lighthouse'u ben koşacağım).
- [perf] İlk Lighthouse mobil LCP 9.5s (simüle) — sebep 6 preload font (412KB, 3 aile × latin+latin-ext). Tek aile (Inter Tight, italik preload:false) → 2 font; mobil 71→98. Framework JS ~160KB gz kaçınılmaz, bizim kod ~25KB.
- [perf] Fold üstü grid/galeri ilk görseli priority → /galeri 89→95, /hizmetler 89→99. Yerel QA sunucusu artık brotli/gzip (CF gibi).
- [qa] Tüm 13 indekslenen sayfa: mobil 95–100 perf, a11y/BP/SEO 100; masaüstü 99–100. 404/_not-found noindex → LH SEO kapısından hariç.
- [review] Opus incelemesi (research/07): HIGH = /img immutable cache + hash'siz dosya adı → gerçek foto stok fotoyu cache'te değiştiremezdi → L4 lane: içerik hash'li adlar. Diğer: footer touch ring/loop, HSTS preload kaldırıldı (domain belirsiz), interest-cohort kaldırıldı, wrangler.jsonc (404-page, force-trailing-slash), marquee durdur butonu (WCAG 2.2.2), koyu zeminde focus karamel, FAQPage yalnız /sss.
- [perf] /galeri LCP = 1. sütun 2. öğe (dikey); dikey color-01 başa alındı + ilk 2 priority → mobil 96–99. Son tur: 13/13 sayfa eşik üstü.

## v3 (2026-10-22, Mert: hizmet sayfası boş, SSS 10-12, diğer hizmetler 6 + Devamı→/sss/, vibe-check)
- Hizmet sayfası: dev başlık + ImageSlider (scroll-snap, autoplay, durdur butonu) + kapsam ticker + "Üç adımda" + 12 SSS (src/content/service-faq.ts, Opus yazdı, fiyat/kesin süre yok) + 6 fotoğraflı diğer hizmet + Devamı → /sss/. /sss/ hizmet bazlı gruplu (84+ soru).
- Eski site (baris-alas-6bd1.vercel.app): yalnız 8 iç mekân fotoğrafı (yüz yok). 7'si assets/photos'a (salon-01..06, beauty-02). Eski site şablon; saat çelişkisi (Pzt–Cmt 10–20, Pazar kapalı vs Google her gün 09–19), "2012'den beri", IG barisalaskuafor_canakkale → teyit bekliyor. research/08-old-site.md.
- vibe-check 84 madde: 0 kritik, 3 high (G1 stok/örnek içerik, G2 domain, G3 commit/remote yok), VIBE_CHECK.md. KVKK metni + apple-icon + manifest + launch gate src/ geneli düzeltildi.
- LH son: tüm sayfalar mobil 95–100, a11y/BP/SEO 100. Adım numarası text-kakao/30 kontrast hatası → text-kakao.

## 2026-10-24 — Hero, map section, fonts
- Home hero is now full-bleed real salon photo (salon-01) with dark overlay, per Mert's reference. Desktop top bar shows address + hours.
- New LocationSection (map + contact card, **no appointment form**, Mert's call) above the footer on every page except /iletisim (gated by HideOn); /iletisim shows the map instead of the exterior photo.
- Map = keyless Google Maps iframe, loading=lazy. CSP frame-src now allows www.google.com + maps.google.com. KVKK text mentions Google Maps.
- Full-bleed hero made the image the mobile LCP (home fell to 90). Fix: self-hosted Inter Tight cut to wght 400–600 + Latin-1/Turkish glyphs (276 KB → 49 KB). All pages mobile 98–100 again.
- Hosting is Vercel (project barissite); KVKK updated. Apex barisalas.com.tr 308 → www. DNS at hosting.com.tr pending (A @ 216.198.79.1 / 64.29.17.1, CNAME www → 6bf9fb6ead1e4d4c.vercel-dns-017.com.).
