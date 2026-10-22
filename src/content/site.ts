// Single source of truth for business data (NAP, hours, services, FAQ).
// Everything rendered on the pages and in JSON-LD reads from here, so NAP stays
// identical everywhere. `TODO(confirm` comments mark unverified research
// findings (notes/research/01-business.md); `npm run qa:launch` fails while any
// remain, and while testimonials are still `sample: true`.

import type { ImageId } from "@/content/images.generated";

export const site = {
  // Domain confirmed by Mert 2026-10-22 (registered at hosting.com.tr).
  url: "https://www.barisalas.com.tr",
  name: "Barış Alaş Kuaför Salonu",
  shortName: "Barış Alaş",
  owner: "Barış Alaş",
  locale: "tr_TR",
  foundingYear: 2009, // confirmed by Mert 2026-10-22
} as const;

export const contact = {
  phoneDisplay: "0535 462 09 90",
  phoneE164: "+905354620990",
  // TODO(confirm): is this number on WhatsApp?
  whatsapp: "905354620990",
} as const;

export const address = {
  // Google Maps listing, verified 2026-10-22. TODO(confirm): Akol Otel location is current.
  landmark: "Akol Otel",
  street: "Kayserili Ahmet Paşa Cd. No:32",
  neighborhood: "Cevat Paşa Mah.",
  district: "Merkez",
  city: "Çanakkale",
  postalCode: "17000",
  region: "Çanakkale",
  country: "TR",
  geo: { lat: 40.1523062, lng: 26.4071657 },
  placeId: "ChIJgxi5IuapsRQRWt2AiVXWlMI",
} as const;

export const social = {
  facebook: "https://www.facebook.com/Barisalas",
  // Confirmed by Mert 2026-10-22.
  instagram: "https://www.instagram.com/barisalaskuafor_canakkale/" as string | null,
} as const;

// Every day 09:00–19:00 (Google listing; confirmed by Mert 2026-10-22).
// day: 0 = Pazar … 6 = Cumartesi (matches Date#getDay)
export const hours: { day: number; open: string; close: string }[] = [1, 2, 3, 4, 5, 6, 0].map((day) => ({
  day,
  open: "09:00",
  close: "19:00",
}));

export const dayNamesTr = ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"];

export const rating = {
  // Shown as a badge linking to Google; never emitted as AggregateRating schema.
  value: 4.8,
  count: 213,
} as const;

export const brands = ["L'Oréal Professionnel", "Kérastase", "Olaplex", "Selective Professional", "M·A·C"];

export const nav = [
  { href: "/hizmetler/", label: "Hizmetler" },
  { href: "/galeri/", label: "Galeri" },
  { href: "/hakkimizda/", label: "Hakkımızda" },
  { href: "/sss/", label: "SSS" },
  { href: "/iletisim/", label: "İletişim" },
] as const;

export type Service = {
  slug: string;
  title: string;
  /** Page <title> / H1 focus phrase with the city, for local SEO. */
  seoTitle: string;
  description: string;
  short: string;
  intro: string[];
  includes: string[];
  image: ImageId;
  gallery: ImageId[];
  faq: { q: string; a: string }[];
  featured?: boolean;
};

export const services: Service[] = [
  {
    slug: "kaynak-sac",
    title: "Kaynak saç",
    seoTitle: "Çanakkale Kaynak Saç",
    description:
      "Çanakkale'de doğal görünen kaynak saç uygulaması. Saçınıza uygun renk ve yöntemle hacim ve uzunluk; bakım ve yenileme Barış Alaş Kuaför'de.",
    short: "Kendi saçınızdan ayırt edilmeyen, doğal hacim ve uzunluk.",
    intro: [
      "Kaynak saç, kendi saçınıza hacim ve uzunluk eklemenin en doğal yolu. Doğru renk, doğru doku ve doğru yöntem seçildiğinde fark edilmez; sadece daha dolgun ve daha uzun saçlarınız olur.",
      "İlk görüşmede saçınızın yapısına bakıyor, size uygun yöntemi ve kaç tutam gerektiğini anlatıyoruz. Rengi kendi saçınızla birebir eşleştiriyoruz.",
    ],
    includes: ["Ücretsiz ön görüşme", "Renk ve doku eşleştirme", "Uygulama", "Bakım ve yenileme", "Kaynak saç malzemesi"],
    image: "extension-01",
    gallery: ["extension-01", "extension-02", "extension-03"],
    featured: true,
    faq: [
      {
        q: "Kaynak saç belli olur mu?",
        a: "Renk ve doku kendi saçınıza göre seçilip doğru yöntemle uygulandığında belli olmaz. Bağlantı noktaları saçınızın altında kalır.",
      },
      {
        q: "Kaynak saç ne kadar dayanır?",
        a: "Saçınızın uzama hızına ve bakımına göre değişir. Düzenli bakımla uzun süre kullanabilirsiniz; ne zaman yenileme gerektiğini size söyleriz.",
      },
      {
        q: "Kaynak saç kendi saçıma zarar verir mi?",
        a: "Doğru yöntem ve doğru ağırlıkla uygulandığında ve bakımları aksatılmadığında saçınıza zarar vermez. Saçınız uygun değilse bunu açıkça söyleriz.",
      },
    ],
  },
  {
    slug: "protez-sac-peruk",
    title: "Protez saç ve peruk",
    seoTitle: "Çanakkale Protez Saç ve Peruk",
    description:
      "Çanakkale'de kadınlar için protez saç ve peruk. Saç seyrelmesi ve saç kaybında doğal görünen, size özel uyarlanan çözümler.",
    short: "Saç seyrelmesi ve kaybı için doğal, size özel çözümler.",
    intro: [
      "Saç seyrelmesi ya da saç kaybı yaşıyorsanız kendinizi yeniden iyi hissetmeniz için protez saç ve peruk çözümleri sunuyoruz.",
      "Görüşmelerimizi sakin ve özel bir ortamda yapıyoruz. Yüz şeklinize, ten renginize ve günlük hayatınıza uygun modeli birlikte seçiyor, kesip şekillendirerek size uyarlıyoruz.",
    ],
    includes: ["Özel ortamda görüşme", "Model ve renk seçimi", "Kesim ve şekillendirme", "Bakım desteği"],
    image: "extension-02",
    gallery: ["extension-02", "extension-03", "salon-02"],
    featured: true,
    faq: [
      {
        q: "Peruk doğal görünür mü?",
        a: "Doğru renk ve model seçilip yüzünüze göre kesildiğinde doğal görünür. Seçimi birlikte, aynanın karşısında yapıyoruz.",
      },
      {
        q: "Görüşme için randevu gerekli mi?",
        a: "Size zaman ayırabilmemiz ve özel bir ortam hazırlayabilmemiz için önceden WhatsApp'tan yazmanızı rica ediyoruz.",
      },
    ],
  },
  {
    slug: "sac-boyama-balyaj",
    title: "Boya, röfle ve balyaj",
    seoTitle: "Çanakkale Saç Boyama, Röfle ve Balyaj",
    description:
      "Çanakkale'de saç boyama, dip boya, röfle ve balyaj. İstediğiniz tonu birlikte seçiyor, saçınızı yormadan uyguluyoruz.",
    short: "İstediğiniz ton, saçınızı yormadan.",
    intro: [
      "Tek renk boyadan dip boyaya, röfleden balyaja kadar tüm renk işlemlerini yapıyoruz. Önce saçınızın geçmişini ve bugünkü durumunu konuşuyoruz.",
      "Rengi birlikte seçiyor, saçınızın kaldırabileceği şekilde uyguluyoruz. Gerekirse işlemi bir kerede değil, adım adım yapmayı öneriyoruz.",
    ],
    includes: ["Saç boyama", "Dip boya", "Röfle", "Balyaj", "Ombre", "Renk düzeltme"],
    image: "color-01",
    gallery: ["color-01", "color-02", "color-03", "color-04"],
    faq: [
      {
        q: "Balyaj ile röfle arasındaki fark nedir?",
        a: "Röflede açılan tutamlar daha düzenli ve kökten başlar. Balyajda geçiş daha yumuşaktır ve uçlara doğru açılır, dip uzadığında daha az belli olur.",
      },
      {
        q: "Boyadan önce saçımı yıkamalı mıyım?",
        a: "Bir gün önce yıkanmış saç idealdir. Emin değilseniz WhatsApp'tan sorun, saçınıza göre söyleyelim.",
      },
    ],
  },
  {
    slug: "sac-kesimi-fon",
    title: "Kesim ve fön",
    seoTitle: "Çanakkale Kadın Saç Kesimi ve Fön",
    description:
      "Çanakkale'de kadın saç kesimi, fön, maşa ve dalga. Yüz şeklinize ve günlük hayatınıza uyan kesimler; kısa saçta modern çizgiler.",
    short: "Yüzünüze ve günlük hayatınıza uyan kesimler.",
    intro: [
      "İyi bir kesim, sabah aynanın karşısında harcadığınız zamanı kısaltır. Yüz şeklinize, saçınızın yapısına ve günlük düzeninize bakarak kesiyoruz.",
      "Kısa ve modern kesimlerden uzun katlı kesimlere, fön, maşa ve dalgaya kadar her gün yaptığımız işler.",
    ],
    includes: ["Saç kesimi", "Uç alma", "Fön", "Maşa ve dalga", "Düz fön"],
    image: "cut-01",
    gallery: ["cut-01", "cut-02", "cut-03"],
    faq: [
      {
        q: "Kısa saç bana yakışır mı?",
        a: "Yüz şeklinize ve saçınızın yapısına bakıp dürüstçe söyleriz. Yakışmayacaksa önermeyiz.",
      },
    ],
  },
  {
    slug: "keratin-sac-bakimi",
    title: "Keratin ve saç bakımı",
    seoTitle: "Çanakkale Keratin Bakım ve Saç Bakımı",
    description:
      "Çanakkale'de keratin bakım, Brezilya fönü ve Olaplex ile onarıcı saç bakımı. Yıpranmış saçlara parlaklık ve yumuşaklık.",
    short: "Yıpranmış saçlara parlaklık ve yumuşaklık.",
    intro: [
      "Boya, ısı ve güneş saçı yorar. Keratin bakım ve onarıcı bakımlarla saçınızı güçlendiriyor, daha kolay şekil alan ve parlak bir hale getiriyoruz.",
      "Saçınızın ihtiyacına göre bakım öneriyoruz; gerekmeyen bir işlemi yapmıyoruz.",
    ],
    includes: ["Keratin bakım", "Brezilya fönü", "Olaplex bakım", "Bakım kürleri"],
    image: "care-01",
    gallery: ["care-01", "care-02", "cut-02"],
    faq: [
      {
        q: "Keratin bakım saça zarar verir mi?",
        a: "Doğru ürünle ve doğru sıcaklıkta uygulandığında saçı yıpratmaz, aksine korur. Uygulamadan sonra kullanmanız gereken şampuanı da söyleriz.",
      },
      {
        q: "Keratin bakım ne kadar kalıcı?",
        a: "Saçınızın yapısına ve ne sıklıkla yıkadığınıza göre birkaç ay sürer.",
      },
    ],
  },
  {
    slug: "gelin-saci",
    title: "Gelin ve özel gün",
    seoTitle: "Çanakkale Gelin Saçı ve Gelin Makyajı",
    description:
      "Çanakkale'de gelin saçı, topuz, nişan ve kına saçı, gelin makyajı. Prova ile düğün gününüz için size özel saç ve makyaj.",
    short: "Prova ile, o güne özel saç ve makyaj.",
    intro: [
      "Düğün gününüzde aklınızın saçınızda kalmaması için önce prova yapıyoruz. Gelinliğinize, yüzünüze ve düğünün saatine uygun modeli birlikte seçiyoruz.",
      "Gelin saçı ve topuzun yanında nişan, söz, kına ve davetler için de saç ve makyaj yapıyoruz.",
    ],
    includes: ["Gelin saçı", "Prova", "Topuz", "Nişan ve kına saçı", "Gelin makyajı", "Davet makyajı"],
    image: "bridal-01",
    gallery: ["bridal-01", "bridal-02", "bridal-03"],
    faq: [
      {
        q: "Gelin saçı için ne kadar önceden randevu almalıyım?",
        a: "Düğün sezonunda (Mayıs–Eylül) en az birkaç hafta önce yazmanızı öneriyoruz. Prova için de düğünden önce bir gün ayarlıyoruz.",
      },
    ],
  },
  {
    slug: "makyaj-ve-guzellik",
    title: "Makyaj ve güzellik",
    seoTitle: "Çanakkale Makyaj, Kaş, Manikür ve Pedikür",
    description:
      "Çanakkale'de makyaj, kaş tasarımı, manikür, pedikür ve ağda. Kuaför randevunuzla birlikte tüm bakımınız tek yerde.",
    short: "Kaş, makyaj, el ve ayak bakımı tek yerde.",
    intro: [
      "Saçınızı yaptırırken kaş, manikür ve pedikürü de aynı yerde halledebilirsiniz.",
      "Günlük ya da davet makyajı için de randevu alabilirsiniz.",
    ],
    includes: ["Makyaj", "Kaş tasarımı", "Manikür", "Pedikür", "Ağda"],
    image: "beauty-01",
    gallery: ["beauty-01", "beauty-02"],
    faq: [],
  },
];

export function serviceBySlug(slug: string) {
  return services.find((s) => s.slug === slug);
}

export const faq: { q: string; a: string }[] = [
  {
    q: "Randevu nasıl alabilirim?",
    a: "En kolay yol WhatsApp'tan yazmanız. Size uygun gün ve saati birlikte ayarlıyoruz. İsterseniz 0535 462 09 90'ı arayabilirsiniz.",
  },
  {
    q: "Pazar günü açık mısınız?",
    a: "Haftanın her günü 09:00–19:00 arası açığız.",
  },
  {
    q: "Salon nerede?",
    a: "Çanakkale Merkez'de, Akol Otel'in içinde: Cevat Paşa Mah. Kayserili Ahmet Paşa Cd. No:32.",
  },
  {
    q: "Fiyatlarınız ne kadar?",
    a: "Fiyat; saçınızın uzunluğuna, yoğunluğuna ve yapılacak işleme göre değişir. WhatsApp'tan saçınızın bir fotoğrafını gönderirseniz size net bilgi veririz.",
  },
  {
    q: "Hangi markaları kullanıyorsunuz?",
    a: "L'Oréal Professionnel, Kérastase, Olaplex ve Selective Professional ürünleriyle çalışıyoruz; makyajda M·A·C kullanıyoruz.",
  },
  ...services.flatMap((s) => s.faq.slice(0, 1)),
];

export type Testimonial = { quote: string; name: string; service: string; sample?: true };

// SAMPLE — placeholders written from themes in public Google reviews (honest
// advice, natural extensions, modern short cuts). Replace with real reviews
// shared with the customer's permission before launch (qa:launch blocks it).
export const testimonials: Testimonial[] = [
  { quote: "Saçıma gerekmeyen hiçbir işlemi önermedi. Dürüstlüğü için yıllardır buradayım.", name: "Ayşe K.", service: "Renk", sample: true },
  { quote: "Kaynak saçımı soran herkes kendi saçım sanıyor. O kadar doğal.", name: "Elif D.", service: "Kaynak saç", sample: true },
  { quote: "Kısa saça geçmekten korkuyordum, şimdi başka model düşünmüyorum.", name: "Merve A.", service: "Kesim", sample: true },
  { quote: "Gelin saçım düğün boyunca hiç bozulmadı. Prova çok iyi bir fikirdi.", name: "Zeynep T.", service: "Gelin saçı", sample: true },
  { quote: "İstediğim tonu tam tutturdular. Saçım hiç yıpranmadı.", name: "Selin Y.", service: "Balyaj", sample: true },
  { quote: "Ekip çok sıcak, salon tertemiz. Kendimi rahat hissettim.", name: "Gizem Ö.", service: "Fön", sample: true },
  { quote: "Peruk seçerken çok sabırlı davrandılar. Kendimi yeniden ben gibi hissettim.", name: "Hatice B.", service: "Protez saç", sample: true },
  { quote: "Keratin sonrası saçım çok daha kolay şekil alıyor.", name: "Derya S.", service: "Keratin", sample: true },
  { quote: "Çanakkale'de saçımı emanet ettiğim tek yer.", name: "Burcu E.", service: "Kesim ve renk", sample: true },
];

export const galleryCategories = ["Salon", "Renk", "Kesim", "Gelin", "Kaynak ve protez", "Bakım"] as const;

export const galleryItems: { id: ImageId; category: (typeof galleryCategories)[number] }[] = [
  // First tiles are the mobile LCP candidates (prioritized): lead with a portrait shot.
  { id: "color-01", category: "Renk" },
  { id: "salon-01", category: "Salon" },
  { id: "bridal-01", category: "Gelin" },
  { id: "cut-01", category: "Kesim" },
  { id: "extension-01", category: "Kaynak ve protez" },
  { id: "salon-02", category: "Salon" },
  { id: "color-02", category: "Renk" },
  { id: "care-01", category: "Bakım" },
  { id: "bridal-02", category: "Gelin" },
  { id: "cut-02", category: "Kesim" },
  { id: "color-03", category: "Renk" },
  { id: "salon-03", category: "Salon" },
  { id: "extension-02", category: "Kaynak ve protez" },
  { id: "cut-03", category: "Kesim" },
  { id: "color-04", category: "Renk" },
  { id: "bridal-03", category: "Gelin" },
  { id: "salon-04", category: "Salon" },
  { id: "extension-03", category: "Kaynak ve protez" },
  { id: "care-02", category: "Bakım" },
  { id: "salon-05", category: "Salon" },
  { id: "beauty-02", category: "Bakım" },
  { id: "salon-06", category: "Salon" },
];

export function whatsappLink(text = "Merhaba, web sitenizden ulaşıyorum. Randevu almak istiyorum.") {
  return `https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(text)}`;
}

export const mapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  `${site.name} ${address.city}`,
)}&query_place_id=${address.placeId}`;

export const directionsLink = `https://www.google.com/maps/dir/?api=1&destination=${address.geo.lat},${address.geo.lng}&destination_place_id=${address.placeId}`;

export const fullAddress = `${address.neighborhood} ${address.street}, ${address.landmark}, ${address.postalCode} ${address.city} ${address.district}`;
