# Barış Alaş Kuaför Salonu — web sitesi

Çanakkale'de kadın kuaförü Barış Alaş'ın web sitesi: https://www.barisalas.com.tr

Next.js 16 (App Router, tamamen statik `output: 'export'`), Tailwind CSS 4, TypeScript. Node 24 (`.node-version`).

## Komutlar

```bash
npm install
npm run dev          # geliştirme sunucusu
npm run build        # görselleri üretir (prebuild) + statik site → out/
npm run serve        # out/ klasörünü üretim başlıklarıyla yerelde sunar (127.0.0.1:4321)
npm run qa           # build + statik kontroller + Lighthouse (tüm sayfalar, mobil+masaüstü)
npm run qa:launch    # yayın kapısı: stok foto, örnek yorum, teyitsiz bilgi kalmışsa durur
```

## İçerik

- İşletme bilgileri, hizmetler, SSS, yorumlar: `src/content/site.ts`, `src/content/service-faq.ts`
- Fotoğraflar: `assets/photos/<id>.jpg` koyun (aynı isimli stok fotoğrafın yerine geçer), sonra `npm run build`.
  Görseller `scripts/images.mjs` ile AVIF/WebP varyantlarına, içerik hash'li adlarla dönüştürülür.

## Notlar

Kararlar ve araştırma: `notes/`. Güvenlik/yayın denetimi: `VIBE_CHECK.md`.
