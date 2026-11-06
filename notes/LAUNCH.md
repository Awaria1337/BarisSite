# Yayın ve işletme notları (2026-11-06)

Site 2026-11-06'da yayına alındı. Bir sorun olursa önce bu dosyaya bak.

## Adresler

| Ne | Değer |
|---|---|
| Canlı site (asıl adres) | https://www.barisalas.com.tr |
| Kök domain | https://barisalas.com.tr → 301 → www (`worker/index.js`) |
| Yedek / test adresi | https://barissite.zilelimert38.workers.dev |
| GitHub | `Awaria1337/BarisSite`, dal `main` |
| Sahip | Barış Alaş (erkek; "Barış Bey"). Site Mert tarafından yapıldı. |

## Barındırma: Cloudflare Workers (ücretsiz plan)

- Worker adı: `barissite`. Ayarlar `wrangler.jsonc` içinde: statik dosyalar `./out` klasöründen, `run_worker_first`, `404-page`, `force-trailing-slash`, `workers_dev: true`, `preview_urls: true`.
- **Otomatik deploy:** Cloudflare Workers Builds GitHub'a bağlı. `main` dalına yapılan her push için `npm run build` ve ardından `npx wrangler deploy` çalışır. Elle deploy gerekmez.
- Özel domainler kodda tanımlı (`wrangler.jsonc` → `routes`, `custom_domain: true`): `www.barisalas.com.tr` ve `barisalas.com.tr`. Cloudflare bunlar için DNS kaydını ve SSL sertifikasını kendisi oluşturur. Panelden "Connect domain" yapma.
- `workers_dev: true` kaldırılırsa workers.dev adresi 404 verir (bir kez yaşandı).
- Güvenlik başlıkları (CSP, HSTS, X-Frame-Options vb.) ve `/img` için kalıcı önbellek ayarı: `public/_headers`.
- Node sürümü: `.node-version` = 24.
- Ücretsiz planın süre sınırı yok, günde 100.000 isteğe kadar ücretsiz.

## Domain ve DNS

- Kayıt firması: **hosting.com.tr**. Domain 2026-10-22'de alındı, **bitiş tarihi 2027-10-21**. Her yıl yenilenmeli; otomatik yenilemenin açık olması önerildi. Yenilenmezse site kapanır.
- Nameserver'lar Cloudflare'de: `dane.ns.cloudflare.com` ve `olga.ns.cloudflare.com` (hosting.com.tr panelinden değiştirildi). DNSSEC kapalı.
- Cloudflare'de zone `barisalas.com.tr` aktif. www ve kök domain için kayıtlar Worker custom domain üzerinden otomatik oluşur.

## Vercel (kapatıldı)

- Eski `barissite` Vercel projesi 2026-11-06'da silindi; domain de Vercel hesabından kaldırıldı. `vercel.json` repodan silindi.
- Vercel hesabında eski projeler hâlâ duruyor: `baris-alas`, `baris-alas-salon`, `baris-alas-6bd1` (eski site), `baris-alas-7pbj`. Bunlara dokunulmadı.

## Google

- Search Console: `barisalas.com.tr` domain mülkü olarak doğrulandı (daha önceden doğrulanmıştı, ayrıca TXT kaydı gerekmedi).
- Site haritası gönderildi: `https://www.barisalas.com.tr/sitemap.xml` (14 URL). İlk gönderimde "Getirilemedi" göründü; bunun sebebi DNS'in yeni taşınmış olmasıydı, site haritası Googlebot'a 200 dönüyor. Birkaç gün içinde "Başarılı" olması bekleniyor.
- Dizine ekleme istendi: `https://www.barisalas.com.tr/` (2026-11-06).
- Yapılacak (Mert): Google İşletme Profili ve Instagram'daki web sitesi linkini `https://www.barisalas.com.tr` yapmak.

## Lighthouse (canlı site, 2026-11-06)

| | Mobil | Masaüstü |
|---|---|---|
| Performans | 87 | 97 |
| Erişilebilirlik | 100 | 100 |
| En iyi uygulamalar | 93 | 93 |
| SEO | 100 | 100 |

- En iyi uygulamalar puanı 93: Cloudflare Web Analytics betiğini (`static.cloudflareinsights.com/beacon.min.js`) sayfaya kendiliğinden ekliyor, bizim CSP'miz de bunu engelliyor ve konsola hata düşüyor. Çözüm: Cloudflare → Web Analytics → barisalas.com.tr → Disable. CSP'ye izin ekleme; KVKK metni "takip aracı yok" diyor. Mert bunu şimdilik bıraktı.
- Mobil performans 87: yavaş telefon simülasyonunda LCP 3,9 sn (hero `salon-01`); gerçek ölçümde yaklaşık 0,4 sn. Galeri görselleri mobilde büyük (`uses-responsive-images` yaklaşık 126 KB tasarruf). Mert "kalsın" dedi.

## İçerik kararları (Mert onaylı)

- Google puanı **4.8 / 213 yorum**. Değiştirme (4.9 isteği gerçek olmadığı için reddedildi, Mert kabul etti).
- Uzmanlık başlığı: "Kaynak saç ve çıtçıt saç".
- Örnek (sahte) müşteri yorumları kaldırıldı. Yorum bölümünde sadece Google puanı ve Google yorumlarına giden link var.
- Yüzü görünen stok fotoğraflar kaldırıldı (about-01, beauty-01, bridal-03, care-01); yerlerine gerçek salon fotoğrafları (salon-0x) kullanıldı.
- Kalan stok fotoğraflar kabul edildi; QA bunun için sadece uyarı veriyor. İleride Barış Bey'in yüz görünmeyen iş fotoğraflarıyla değiştirilecek: `assets/photos` + `alt.json`, ardından `scripts/images.mjs`.
- Sahip onayladı (2026-11-06): WhatsApp 0535 462 09 90, salon Akol Otel içinde, KVKK metni uygun. `TODO(confirm)` işaretleri kaldırıldı.
- Instagram'dan fotoğraf çekme denendi ama yapılamadı; Mert vazgeçti.

## Kontroller

- `npm run build` sonra `node scripts/qa-check.mjs --launch`. Son çalıştırma: 17 sayfa, 0 hata, 1 uyarı (stok foto).
- Yerelde yönlendirme testi: `npx wrangler dev --local-upstream barisalas.com.tr`.
