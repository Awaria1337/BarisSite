import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, Check, Phone, Star } from "lucide-react";
import { Breadcrumbs, CtaBanner, FaqList, WhatsAppButton, wrap } from "@/components/blocks";
import { JsonLdScript } from "@/components/json-ld";
import { OpenNow } from "@/components/open-now";
import Picture from "@/components/picture";
import { ImageSlider } from "@/components/ui/image-slider";
import { InfiniteSlider } from "@/components/ui/infinite-slider";
import { serviceFaq } from "@/content/service-faq";
import { address, contact, mapsLink, rating, serviceBySlug, services, site } from "@/content/site";
import { pageMetadata } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const dynamicParams = false;

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps<"/hizmetler/[slug]">) {
  const { slug } = await params;
  const s = serviceBySlug(slug);
  if (!s) return {};
  return pageMetadata({ title: s.seoTitle, description: s.description, path: `/hizmetler/${s.slug}/` });
}

const steps = [
  {
    title: "Görüşme",
    text: "Saçınıza bakıyor, ne istediğinizi dinliyoruz. Size uygun olanı ve olmayanı açıkça söylüyoruz.",
  },
  {
    title: "Uygulama",
    text: "Seçtiğimiz yöntemi, saçınızı yormadan ve acele etmeden uyguluyoruz.",
  },
  {
    title: "Bakım",
    text: "Evde nasıl bakmanız gerektiğini anlatıyor, gerekirse kontrol için sizi tekrar çağırıyoruz.",
  },
];

export default async function ServicePage({ params }: PageProps<"/hizmetler/[slug]">) {
  const { slug } = await params;
  const s = serviceBySlug(slug);
  if (!s) notFound();

  const path = `/hizmetler/${s.slug}/`;
  const others = services.filter((o) => o.slug !== s.slug);
  const questions = serviceFaq[s.slug] ?? s.faq;
  const lower = s.title.toLocaleLowerCase("tr-TR");

  return (
    <>
      {/* Hero */}
      <section className={cn(wrap, "grid gap-10 pb-14 pt-8 lg:min-h-[calc(100svh-4.5rem)] lg:grid-cols-[1fr_1.05fr] lg:items-center lg:gap-14 lg:pb-20")}>
        <div className="order-2 lg:order-1">
          <Breadcrumbs
            crumbs={[
              { name: "Ana sayfa", path: "/" },
              { name: "Hizmetler", path: "/hizmetler/" },
              { name: s.title, path },
            ]}
          />
          <h1 className="mt-8 text-[3.4rem] sm:text-8xl xl:text-[7.25rem]">
            <span className="mb-3 block font-sans text-xl font-medium tracking-normal text-kakao sm:text-2xl">
              Çanakkale&apos;de
            </span>
            {s.title}
            <span className="text-kakao">.</span>
          </h1>
          <p className="mt-7 max-w-[34ch] text-xl leading-snug text-murekkep sm:text-2xl">{s.short}</p>
          <p className="mt-4 max-w-[52ch] text-lg text-gri">
            Çanakkale Merkez&apos;de, {address.landmark} içindeki salonumuzda. <OpenNow as="span" />
          </p>

          <ul className="mt-8 flex flex-wrap gap-2" aria-label="Bu hizmete dahil olanlar">
            {s.includes.map((item) => (
              <li key={item} className="rounded-full border border-cizgi bg-fildisi px-4 py-2 text-sm">
                {item}
              </li>
            ))}
          </ul>

          <div className="mt-9 flex flex-wrap gap-3">
            <WhatsAppButton text={`Merhaba, ${lower} hakkında bilgi almak istiyorum.`}>Bilgi ve randevu</WhatsAppButton>
            <a
              href={`tel:${contact.phoneE164}`}
              className="inline-flex min-h-12 items-center gap-2 rounded-full border border-murekkep/20 px-6 font-medium transition-colors hover:border-kakao hover:text-kakao"
            >
              <Phone aria-hidden="true" className="size-4" />
              {contact.phoneDisplay}
            </a>
          </div>

          <dl className="mt-10 grid max-w-lg grid-cols-3 gap-4 border-t border-cizgi pt-6">
            <div>
              <dt className="text-sm text-gri">Google puanı</dt>
              <dd className="mt-1 flex items-center gap-1.5 font-display text-3xl font-semibold tracking-[-0.03em]">
                <Star aria-hidden="true" className="size-5 fill-kakao text-kakao" />
                {rating.value.toLocaleString("tr-TR")}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-gri">Yorum</dt>
              <dd className="mt-1 font-display text-3xl font-semibold tracking-[-0.03em]">
                <a href={mapsLink} target="_blank" rel="noopener noreferrer" className="hover:text-kakao">
                  {rating.count}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-sm text-gri">Açık</dt>
              <dd className="mt-1 font-display text-3xl font-semibold tracking-[-0.03em]">Her gün</dd>
            </div>
          </dl>
        </div>

        <ImageSlider label={`${s.title} fotoğrafları`} className="order-1 aspect-[4/5] rounded-[2rem] sm:aspect-[4/3] lg:order-2 lg:aspect-[4/5]">
          {s.gallery.map((id, i) => (
            <Picture key={id} id={id} fill priority={i === 0} sizes="(min-width: 1024px) 50vw, 100vw" />
          ))}
        </ImageSlider>
      </section>

      {/* Ticker */}
      <section aria-label={`${s.title} kapsamı`} className="border-y border-cizgi bg-murekkep py-6 text-krem">
        <InfiniteSlider gap={48} duration={36} durationOnHover={60} ariaLabel={`${s.title} kapsamı`}>
          {[...s.includes, ...s.includes].map((item, i) => (
            <span key={`${item}-${i}`} className="flex items-center gap-12 whitespace-nowrap font-display text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">
              {item}
              <span aria-hidden="true" className="text-karamel">
                ✦
              </span>
            </span>
          ))}
        </InfiniteSlider>
      </section>

      {/* Details */}
      <section aria-labelledby="detay" className={cn(wrap, "grid gap-12 py-20 lg:grid-cols-[1.3fr_1fr] lg:gap-20 lg:py-28")}>
        <div>
          <h2 id="detay" className="text-5xl sm:text-6xl">
            Nasıl <span className="accent">çalışıyoruz</span>
            <span className="text-kakao">?</span>
          </h2>
          <div className="mt-8 space-y-5 text-lg sm:text-xl">
            {s.intro.map((p) => (
              <p key={p} className="max-w-[58ch]">
                {p}
              </p>
            ))}
          </div>
        </div>
        <aside aria-labelledby="kapsam" className="self-start rounded-3xl border border-cizgi bg-fildisi p-8 sm:p-10">
          <h2 id="kapsam" className="text-3xl">
            Bu hizmette
          </h2>
          <ul className="mt-6 space-y-3 text-lg">
            {s.includes.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <Check aria-hidden="true" className="mt-1.5 size-4 shrink-0 text-kakao" />
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-8 border-t border-cizgi pt-6 text-gri">
            Fiyat saçınızın uzunluğuna ve yoğunluğuna göre değişir. Saçınızın fotoğrafını WhatsApp&apos;tan
            gönderirseniz net bilgi veririz.
          </p>
        </aside>
      </section>

      {/* Process — a real sequence, so numbered */}
      <section aria-labelledby="surec" className="bg-fildisi py-20 lg:py-28">
        <div className={wrap}>
          <h2 id="surec" className="text-5xl sm:text-6xl">
            Üç adımda<span className="text-kakao">.</span>
          </h2>
          <ol className="mt-12 grid border-l border-t border-cizgi md:grid-cols-3">
            {steps.map((step, i) => (
              <li key={step.title} className="border-b border-r border-cizgi p-8 sm:p-10">
                <span aria-hidden="true" className="font-display text-6xl font-semibold tracking-[-0.04em] text-kakao">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-6 text-3xl">{step.title}</h3>
                <p className="mt-3 text-lg text-gri">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* FAQ */}
      {questions.length > 0 && (
        <section aria-labelledby="hizmet-sss" className={cn(wrap, "grid gap-12 py-20 lg:grid-cols-[0.8fr_1.4fr] lg:gap-20 lg:py-28")}>
          <div>
            <h2 id="hizmet-sss" className="text-5xl sm:text-6xl">
              {s.title} <span className="accent">hakkında</span>
              <span className="text-kakao">.</span>
            </h2>
            <p className="mt-6 max-w-[34ch] text-lg text-gri">
              En çok sorulan {questions.length} soru. Aklınızdaki soru burada yoksa bize yazın.
            </p>
            <WhatsAppButton variant="outline" className="mt-8" text={`Merhaba, ${lower} hakkında bir sorum var.`}>
              Soru sorun
            </WhatsAppButton>
          </div>
          <div>
            <FaqList items={questions} />
          </div>
        </section>
      )}

      {/* Other services */}
      <section aria-labelledby="diger" className={cn(wrap, "py-20 lg:py-28")}>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h2 id="diger" className="text-5xl sm:text-6xl">
            Diğer <span className="accent">hizmetlerimiz</span>
            <span className="text-kakao">.</span>
          </h2>
          <Link
            href="/sss/"
            className="inline-flex min-h-12 items-center gap-2 rounded-full bg-murekkep px-6 font-medium text-krem transition-colors hover:bg-kakao-koyu"
          >
            Devamı
            <ArrowUpRight aria-hidden="true" className="size-4" />
          </Link>
        </div>
        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {others.map((o) => (
            <li key={o.slug} className="group relative overflow-hidden rounded-3xl border border-cizgi bg-fildisi">
              <div className="relative aspect-[16/10] overflow-hidden">
                <Picture
                  id={o.image}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  imgClassName="transition-transform duration-700 ease-out group-hover:scale-[1.04] motion-reduce:transition-none"
                />
              </div>
              <div className="p-6 sm:p-7">
                <h3 className="text-2xl sm:text-3xl">
                  <Link href={`/hizmetler/${o.slug}/`} className="after:absolute after:inset-0 group-hover:text-kakao">
                    {o.title}
                  </Link>
                </h3>
                <p className="mt-2 text-gri">{o.short}</p>
                <span className="mt-5 inline-flex items-center gap-1 text-sm font-medium">
                  İncele
                  <ArrowUpRight aria-hidden="true" className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </span>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <JsonLdScript
        data={{
          "@context": "https://schema.org",
          "@type": "Service",
          name: s.title,
          serviceType: s.title,
          description: s.description,
          url: `${site.url}${path}`,
          provider: { "@id": `${site.url}/#salon` },
          areaServed: { "@type": "City", name: "Çanakkale" },
        }}
      />

      <CtaBanner text={`Merhaba, ${lower} için randevu almak istiyorum.`} />
    </>
  );
}
