import Link from "next/link";
import { ArrowUpRight, MapPin, Star } from "lucide-react";
import {
  BrandsMarquee,
  CtaBanner,
  FaqList,
  ServiceGrid,
  SectionHeading,
  TestimonialsSection,
  WhatsAppButton,
  wrap,
} from "@/components/blocks";
import { OpenNow } from "@/components/open-now";
import Picture from "@/components/picture";
import { address, contact, faq, mapsLink, rating, services, site } from "@/content/site";
import { pageMetadata } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const metadata = pageMetadata({
  title: { absolute: "Barış Alaş Kuaför Salonu | Çanakkale Kadın Kuaförü" },
  description:
    "Çanakkale Merkez'de, Akol Otel içinde kadın kuaförü. Kaynak saç, protez saç, boya ve balyaj, kesim, keratin ve gelin saçı. Randevu için WhatsApp.",
  path: "/",
});

const featured = services.filter((s) => s.featured);

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className={cn(wrap, "grid gap-10 pb-16 pt-6 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:gap-16 lg:pb-24 lg:pt-10")}>
        <div className="order-2 lg:order-1">
          <p className="eyebrow">{site.foundingYear}&apos;dan beri Çanakkale&apos;de kadın kuaförü</p>
          <h1 className="mt-5 text-[3.1rem] sm:text-7xl xl:text-[5.6rem]">
            Saçınıza ne yakışırsa, <span className="accent">onu</span> yaparız<span className="text-kakao">.</span>
          </h1>
          <p className="mt-7 max-w-[44ch] text-lg text-gri">
            Kesimden renge, kaynak saçtan gelin saçına kadar. {address.landmark} içindeki salonumuzda size dürüst
            tavsiye, doğal sonuç.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <WhatsAppButton>Randevu alın</WhatsAppButton>
            <Link
              href="/hizmetler/"
              className="inline-flex min-h-12 items-center gap-2 rounded-full border border-murekkep/20 px-6 font-medium transition-colors hover:border-kakao hover:text-kakao"
            >
              Hizmetlerimiz
            </Link>
          </div>
          <dl className="mt-10 grid max-w-lg grid-cols-2 gap-6 border-t border-cizgi pt-6 text-sm">
            <div>
              <dt className="flex items-center gap-1.5 text-gri">
                <Star aria-hidden="true" className="size-4 fill-kakao text-kakao" />
                Google puanı
              </dt>
              <dd className="mt-1">
                <a href={mapsLink} target="_blank" rel="noopener noreferrer" className="font-medium hover:text-kakao">
                  {rating.value.toLocaleString("tr-TR")} · {rating.count} yorum
                </a>
              </dd>
            </div>
            <div>
              <dt className="flex items-center gap-1.5 text-gri">
                <MapPin aria-hidden="true" className="size-4 text-kakao" />
                {address.landmark}
              </dt>
              <dd className="mt-1 font-medium">
                <OpenNow />
              </dd>
            </div>
          </dl>
        </div>

        <div className="relative order-1 lg:order-2">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] sm:aspect-[5/4] lg:aspect-[4/5]">
            <Picture
              id="hero-02"
              fill
              priority
              sizes="(min-width: 1024px) 46vw, 100vw"
              alt="Uzun, parlak saçlı kadın"
            />
          </div>
          <div className="absolute -bottom-6 -left-4 hidden w-44 overflow-hidden rounded-2xl border-4 border-krem shadow-xl sm:block lg:-left-10 lg:w-52">
            <div className="relative aspect-square">
              <Picture id="salon-01" fill sizes="13rem" alt="Salonumuzun içi" />
            </div>
          </div>
        </div>
      </section>

      <BrandsMarquee />

      {/* Services */}
      <section aria-labelledby="hizmetler" className={cn(wrap, "py-20 lg:py-28")}>
        <SectionHeading
          id="hizmetler"
          title="Salonumuzda"
          accent="neler yapıyoruz"
          note="Saçınıza bakmadan fiyat ya da işlem önermiyoruz. Önce dinliyor, sonra size gerçekten yakışacak olanı söylüyoruz."
        />
        <div className="mt-14">
          <ServiceGrid />
        </div>
      </section>

      {/* Specialty: extensions & hair systems */}
      <section aria-labelledby="uzmanlik" className="bg-murekkep py-20 text-krem lg:py-28">
        <div className={cn(wrap, "grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-20")}>
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div className="relative col-span-2 aspect-[16/10] overflow-hidden rounded-2xl">
              <Picture id="extension-03" fill sizes="(min-width: 1024px) 45vw, 100vw" />
            </div>
            <div className="relative aspect-square overflow-hidden rounded-2xl">
              <Picture id="extension-01" fill sizes="(min-width: 1024px) 22vw, 50vw" />
            </div>
            <div className="relative aspect-square overflow-hidden rounded-2xl">
              <Picture id="extension-02" fill sizes="(min-width: 1024px) 22vw, 50vw" />
            </div>
          </div>
          <div>
            <p className="text-sm text-karamel">Uzmanlık alanımız</p>
            <h2 id="uzmanlik" className="mt-4 text-5xl sm:text-6xl">
              Kaynak saç ve <span className="accent text-karamel">protez saç</span>
            </h2>
            <p className="mt-6 max-w-[48ch] text-krem/80">
              Kendi saçınızdan ayırt edilmeyen kaynak saç; saç seyrelmesi ve kaybı yaşayanlar için size özel protez saç
              ve peruk. Renk ve dokuyu kendi saçınıza göre seçiyor, görüşmeleri sakin ve özel bir ortamda yapıyoruz.
            </p>
            <ul className="mt-8 space-y-4">
              {featured.map((s) => (
                <li key={s.slug}>
                  <Link
                    href={`/hizmetler/${s.slug}/`}
                    className="group flex items-center justify-between border-b border-krem/15 pb-4 text-xl font-medium"
                  >
                    {s.title}
                    <ArrowUpRight aria-hidden="true" className="size-5 text-karamel transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </Link>
                </li>
              ))}
            </ul>
            <WhatsAppButton
              variant="light"
              className="mt-10"
              text="Merhaba, kaynak saç / protez saç hakkında bilgi almak istiyorum."
            >
              Ücretsiz ön görüşme
            </WhatsAppButton>
          </div>
        </div>
      </section>

      {/* Gallery preview */}
      <section aria-labelledby="galeri-onizleme" className={cn(wrap, "py-20 lg:py-28")}>
        <SectionHeading id="galeri-onizleme" title="Salondan" accent="kareler" note="Salonumuzdan ve yaptığımız çalışmalardan seçtiklerimiz." />
        <div className="mt-14 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 lg:grid-rows-2">
          {(["color-01", "salon-03", "bridal-01", "cut-03", "color-02"] as const).map((id, i) => (
            <div
              key={id}
              className={cn(
                "relative overflow-hidden rounded-2xl",
                i === 0 ? "col-span-2 row-span-2 aspect-square lg:aspect-auto" : "aspect-square",
              )}
            >
              <Picture id={id} fill sizes={i === 0 ? "(min-width: 1024px) 50vw, 100vw" : "(min-width: 1024px) 25vw, 50vw"} />
            </div>
          ))}
        </div>
        <Link
          href="/galeri/"
          className="mt-10 inline-flex min-h-12 items-center gap-2 rounded-full border border-murekkep/20 px-6 font-medium transition-colors hover:border-kakao hover:text-kakao"
        >
          Galerinin tamamı
          <ArrowUpRight aria-hidden="true" className="size-4" />
        </Link>
      </section>

      <TestimonialsSection />

      {/* About teaser */}
      <section aria-labelledby="hakkimizda-ozet" className="bg-fildisi py-20 lg:py-28">
        <div className={cn(wrap, "grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-center lg:gap-20")}>
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem]">
            <Picture id="about-01" fill sizes="(min-width: 1024px) 45vw, 100vw" />
          </div>
          <div>
            <p className="eyebrow">Barış Alaş</p>
            <h2 id="hakkimizda-ozet" className="mt-4 text-5xl sm:text-6xl">
              Dürüst tavsiye, <span className="accent">doğal sonuç</span>
              <span className="text-kakao">.</span>
            </h2>
            <p className="mt-6 max-w-[52ch] text-gri">
              Müşterilerimiz bize en çok dürüstlüğümüz için geliyor. Saçınıza gerekmeyen bir işlemi önermiyor, size
              gerçekten yakışacak olanı söylüyoruz. {site.foundingYear}&apos;dan beri Çanakkale&apos;de aynı özenle çalışıyoruz.
            </p>
            <Link href="/hakkimizda/" className="mt-8 inline-flex items-center gap-2 font-medium underline-offset-4 hover:underline">
              Bizi tanıyın
              <ArrowUpRight aria-hidden="true" className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ preview */}
      <section aria-labelledby="sss-ozet" className={cn(wrap, "grid gap-12 py-20 lg:grid-cols-[0.8fr_1.4fr] lg:gap-20 lg:py-28")}>
        <div>
          <h2 id="sss-ozet" className="text-5xl sm:text-6xl">
            Sık sorulanlar<span className="text-kakao">.</span>
          </h2>
          <p className="mt-6 max-w-[34ch] text-gri">Bilmek istediğiniz her şey. Cevabını bulamadığınız soruyu bize yazın.</p>
          <a href={`tel:${contact.phoneE164}`} className="mt-6 inline-block font-medium underline-offset-4 hover:underline">
            {contact.phoneDisplay}
          </a>
        </div>
        <div>
          <FaqList items={faq.slice(0, 5)} />
          <Link href="/sss/" className="mt-8 inline-flex items-center gap-2 font-medium underline-offset-4 hover:underline">
            Tüm sorular
            <ArrowUpRight aria-hidden="true" className="size-4" />
          </Link>
        </div>
      </section>

      <CtaBanner />
    </>
  );
}
