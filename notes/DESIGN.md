# Tasarım planı (frontend-design, 2 geçiş)

## Konu / kitle / iş
- Konu: Çanakkale merkezde, Akol Otel içinde, 10+ yıllık kadın kuaförü. Uzmanlık: kaynak saç, protez saç/peruk; dürüst tavsiye ("gereksiz işlem yapmaz").
- Kitle: Çanakkale'de yaşayan 20–60 yaş kadınlar, gelinler; saç kaybı yaşayanlar (hassas kitle — sakin, saygılı ton). %80+ mobil, Instagram/Google Maps'ten gelir.
- Sayfanın işi: 5 saniyede "nerede, açık mı, nasıl yazarım" + işin kalitesini fotoğrafla kanıtlamak → WhatsApp.

## 1. geçiş (ilk taslak) — ve eleştirisi
Taslak: krem zemin + büyük serif başlık + altın vurgu + her bölüm fade-up + 01/02/03 hizmet kartları.
Eleştiri: bu, "kuaför sitesi" deyince herkesin varacağı yer (AI kalıbı #1 ve #4). Çanakkale'ye ve kaynak/protez uzmanlığına dair hiçbir şey söylemiyor. → revize.

## 2. geçiş (revize)
**Fikir: "Kordon ışığı."** Salon Kordon'a yakın Akol Otel'de; Boğaz'ın serin mavi-yeşili + saçın sıcak tonları. Fotoğraflar sıcak, çerçeve serin. Saç teli = tek ince çizgi motifi.

### Renk (kontrast test edilecek)
| Ad | Hex | Rol |
|---|---|---|
| Boğaz | `#163A43` | ana metin, koyu bölümler (iletişim/footer) |
| Deniz camı | `#BFD3CE` | yumuşak yüzeyler, ayraçlar |
| Sis | `#F2F4F2` | sayfa zemini (serin kırık beyaz, krem değil) |
| Kestane | `#7A4130` | tek vurgu: birincil buton, saç teli çizgisi |
| Bal | `#D9A066` | yalnız koyu zemin üstünde küçük vurgu |
| Beyaz | `#FFFFFF` | kart/görsel arka planı |

### Tip
- Başlık: **Gloock** (yüksek kontrastlı, karakterli serif; latin-ext ✓). Yalnız 400; büyük boyda kullanılır.
- Gövde/arayüz: **Onest** (variable, latin-ext ✓) — sıcak, okunaklı grotesk.
- Ölçek: 1.25 modüler; gövde 17px mobil / 18px masaüstü; satır ≤ 68ch; başlıklarda sıkı satır aralığı.
- Yasak: tek kelimeyi italik/renkli vurgulama, ALL-CAPS etiket, "A · B · C" meta dizileri, → ekli buton metinleri.

### Yerleşim
```
MOBİL                         MASAÜSTÜ
┌──────────────┐              ┌───────────────┬──────────────┐
│ logo     ☎   │              │ Barış Alaş     │              │
│ [foto 4:5    │              │ Kuaför         │  [foto 4:5,  │
│  tam genişlik]│              │ ~~~ saç teli   │   sağa taşan]│
│ Barış Alaş   │              │ Çanakkale'de.. │              │
│ ~~~          │              │ [WhatsApp][Ara]│              │
│ Bugün açık   │              │ Bugün açık ... │              │
│ [WA] [Ara]   │              └───────────────┴──────────────┘
└──────────────┘
bilgi şeridi: adres | saat | ★4.8 (213) — yatay, mobilde 3 satır
hizmetler: sol hizalı liste, kart yok; gruplar arası ince deniz camı çizgisi;
           kaynak/protez grubu geniş, fotoğraflı (öne çıkan tek blok)
galeri:    düzensiz ama sabit oranlı grid (4:5 ve 1:1), mobilde 2 sütun
hakkında:  Barış Bey portresi + kısa metin + marka adları düz metin
SSS:       <details> akordeon (JS yok)
iletişim:  Boğaz zemin, statik harita, büyük telefon, saatler tablosu
```
- Hizalama: metin sola; yalnız hero masaüstünde asimetrik.
- Köşe: fotoğraflar 2px (neredeyse keskin), butonlar tam yuvarlak (pill) — hiyerarşi farkı bilinçli.

### Hareket (tek orkestre an)
1. **Hero yüklenişi:** başlık altındaki "saç teli" SVG çizgisi soldan sağa çizilir (stroke-dashoffset, ~900ms, ease-out). H1 ve foto anında görünür (LCP korunur).
2. Kullanıcı tetiklemeli: galeri fotoğrafına dokununca `<ViewTransition>` ile büyüme; SSS açılışı; buton basış geri bildirimi (scale .97).
3. Scroll-reveal yok (generic). `prefers-reduced-motion` → çizgi direkt çizili.

### İlkeler
- Fotoğraf kahraman; arayüz sessiz.
- Her ekranda bir sonraki adım belli: WhatsApp.
- Hassas kitle (protez saç): "kayıp/eksik" değil "hacim, doğallık, kendinizi iyi hissetmek" dili.
