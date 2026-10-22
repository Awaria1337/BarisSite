import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowUpRight, Droplets, Flower2, Gem, Heart, Palette, Scissors, Sparkles } from "lucide-react";
import Picture from "@/components/picture";
import { WhatsAppIcon } from "@/components/icons";
import { JsonLdScript } from "@/components/json-ld";
import { MotionPause } from "@/components/motion-pause";
import { InfiniteSlider } from "@/components/ui/infinite-slider";
import { TestimonialsColumns } from "@/components/ui/testimonials-columns";
import { brands, rating, services, testimonials, whatsappLink, mapsLink, type Service } from "@/content/site";
import { breadcrumbJsonLd, type Crumb } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const wrap = "mx-auto w-full max-w-7xl px-5 sm:px-8";

/** Big display heading with an optional side note, as in the reference layout. */
export function SectionHeading({
  id,
  title,
  accent,
  note,
  as: Tag = "h2",
  className,
}: {
  id?: string;
  title: ReactNode;
  accent?: ReactNode;
  note?: ReactNode;
  as?: "h1" | "h2";
  className?: string;
}) {
  return (
    <div className={cn("grid gap-6 lg:grid-cols-[1fr_minmax(0,24rem)] lg:items-end lg:gap-16", className)}>
      <Tag id={id} className="text-[2.6rem] sm:text-6xl lg:text-7xl">
        {title}
        {accent && (
          <>
            {" "}
            <span className="accent">{accent}</span>
          </>
        )}
        <span className="text-kakao">.</span>
      </Tag>
      {note && <p className="max-w-[46ch] text-gri lg:border-l lg:border-cizgi lg:pl-6">{note}</p>}
    </div>
  );
}

export function WhatsAppButton({
  text,
  children = "WhatsApp'tan yazın",
  variant = "solid",
  className,
}: {
  text?: string;
  children?: ReactNode;
  variant?: "solid" | "light" | "outline";
  className?: string;
}) {
  return (
    <a
      href={whatsappLink(text)}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "inline-flex min-h-12 items-center gap-2.5 rounded-full px-6 font-medium transition-[transform,background-color] duration-200 active:scale-[0.97]",
        variant === "solid" && "bg-kakao text-fildisi hover:bg-kakao-koyu",
        variant === "light" && "bg-karamel text-murekkep hover:bg-nude",
        variant === "outline" && "border border-murekkep/20 hover:border-kakao hover:text-kakao",
        className,
      )}
    >
      <WhatsAppIcon className="size-5" />
      {children}
    </a>
  );
}

const serviceIcons: Record<string, typeof Scissors> = {
  "kaynak-sac": Gem,
  "protez-sac-peruk": Heart,
  "sac-boyama-balyaj": Palette,
  "sac-kesimi-fon": Scissors,
  "keratin-sac-bakimi": Droplets,
  "gelin-saci": Sparkles,
  "makyaj-ve-guzellik": Flower2,
};

/** Bordered service grid with photo, icon, title and short copy (reference #1). */
export function ServiceGrid({
  items = services,
  headingLevel = 3,
  priorityFirst = false,
}: {
  items?: Service[];
  headingLevel?: 2 | 3;
  /** Set when the grid is above the fold, so its first image is the LCP candidate. */
  priorityFirst?: boolean;
}) {
  const H = headingLevel === 2 ? "h2" : "h3";
  return (
    <ul className="grid border-l border-t border-cizgi sm:grid-cols-2 lg:grid-cols-3">
      {items.map((s, i) => {
        const Icon = serviceIcons[s.slug] ?? Sparkles;
        return (
          <li key={s.slug} className="group relative border-b border-r border-cizgi bg-krem transition-colors hover:bg-fildisi">
            <div className="relative aspect-[16/9] overflow-hidden sm:aspect-[4/3]">
              <Picture
                id={s.image}
                alt=""
                fill
                priority={priorityFirst && i === 0}
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                imgClassName="transition-transform duration-700 ease-out group-hover:scale-[1.04] motion-reduce:transition-none"
              />
            </div>
            <div className="flex flex-col p-7 sm:p-9">
              <Icon aria-hidden="true" className="size-5 text-kakao" strokeWidth={1.5} />
              <H className="mt-5 text-3xl">
                <Link href={`/hizmetler/${s.slug}/`} className="after:absolute after:inset-0">
                  {s.title}
                </Link>
              </H>
              <p className="mt-3 text-gri">{s.short}</p>
              <div className="mt-7 flex items-center justify-between border-t border-cizgi pt-5 text-sm">
                <span className="text-gri">{s.includes.slice(0, 2).join(", ")}</span>
                <span className="inline-flex items-center gap-1 font-medium">
                  Detaylar
                  <ArrowUpRight aria-hidden="true" className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </span>
              </div>
            </div>
          </li>
        );
      })}
      {items.length % 3 !== 0 && (
        // Fills the last row so the bordered grid never ends with orphan cells.
        <li
          className={cn(
            "flex flex-col justify-between gap-8 border-b border-r border-cizgi bg-murekkep p-7 text-krem sm:p-9",
            items.length % 3 === 1 && "lg:col-span-2",
            items.length % 2 === 0 && "sm:col-span-2 lg:col-span-1",
          )}
        >
          <div>
            <p className="text-sm text-karamel">Aradığınızı bulamadınız mı?</p>
            <p className="mt-4 max-w-[22ch] font-display text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">
              Saçınız için ne istediğinizi bize yazın.
            </p>
          </div>
          <WhatsAppButton variant="light" className="self-start" text="Merhaba, bir hizmet hakkında bilgi almak istiyorum.">
            Bize sorun
          </WhatsAppButton>
        </li>
      )}
    </ul>
  );
}

/** FAQ accordion in the reference style; native <details>, no JS. */
export function FaqList({ items }: { items: { q: string; a: string }[] }) {
  return (
    <div className="border-t border-cizgi">
      {items.map((f, i) => (
        <details key={f.q} className="group border-b border-cizgi" name="sss">
          <summary className="flex cursor-pointer list-none items-center gap-5 py-6 [&::-webkit-details-marker]:hidden">
            <span aria-hidden="true" className="w-6 shrink-0 text-xs tabular-nums text-gri">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="flex-1 font-display text-xl font-semibold tracking-[-0.025em] sm:text-2xl">{f.q}</span>
            <span
              aria-hidden="true"
              className="grid size-11 shrink-0 place-items-center rounded-full border border-cizgi text-xl transition-[transform,background-color,color] duration-300 group-open:rotate-45 group-open:border-kakao group-open:bg-kakao group-open:text-fildisi"
            >
              +
            </span>
          </summary>
          <p className="max-w-[62ch] pb-7 pl-11 text-gri">{f.a}</p>
        </details>
      ))}
    </div>
  );
}

export function FaqJsonLd({ items }: { items: { q: string; a: string }[] }) {
  return (
    <JsonLdScript
      data={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: items.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      }}
    />
  );
}

/** Dark WhatsApp call-to-action banner (reference #6). */
export function CtaBanner({ text }: { text?: string }) {
  return (
    <section aria-labelledby="cta-baslik" className={cn(wrap, "py-16 lg:py-24")}>
      <div className="relative overflow-hidden rounded-3xl bg-murekkep px-7 py-14 text-krem sm:px-14 lg:flex lg:items-center lg:justify-between lg:gap-12 lg:py-20">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -right-6 -top-16 select-none font-display text-[18rem] font-semibold leading-none text-krem/[0.04]"
        >
          &amp;
        </span>
        <div className="relative">
          <p className="text-sm text-karamel">Randevunun en hızlı yolu</p>
          <h2 id="cta-baslik" className="mt-4 text-5xl sm:text-6xl">
            WhatsApp&apos;tan <span className="accent text-karamel">hemen yazın</span>
          </h2>
          <p className="mt-5 max-w-[44ch] text-krem/80">Randevu ya da danışma için tek mesaj yeterli. Saçınızın fotoğrafını gönderirseniz fiyat bilgisini de hemen verelim.</p>
        </div>
        <WhatsAppButton text={text} variant="light" className="relative mt-10 lg:mt-0 lg:shrink-0" />
      </div>
    </section>
  );
}

export function BrandsMarquee() {
  return (
    <section data-marquee aria-labelledby="markalar" className="border-y border-cizgi bg-fildisi py-10">
      <div className={cn(wrap, "mb-6 flex items-center justify-between gap-4")}>
        <h2 id="markalar" className="font-sans text-sm font-medium tracking-normal text-gri">
          Çalıştığımız markalar
        </h2>
        <MotionPause />
      </div>
      <InfiniteSlider gap={72} duration={32} durationOnHover={60} ariaLabel="Çalıştığımız markalar">
        {brands.map((b) => (
          <span key={b} className="whitespace-nowrap font-display text-3xl font-semibold tracking-[-0.03em] text-murekkep/70 sm:text-4xl">
            {b}
          </span>
        ))}
      </InfiniteSlider>
    </section>
  );
}

export function TestimonialsSection() {
  return (
    <section data-marquee aria-labelledby="yorumlar" className="overflow-hidden py-20 lg:py-28">
      <div className={cn(wrap, "text-center")}>
        <h2 id="yorumlar" className="text-5xl sm:text-6xl lg:text-7xl">
          {rating.count} yorum, <span className="accent">{rating.value.toLocaleString("tr-TR")} puan</span>
          <span className="text-kakao">.</span>
        </h2>
        <p className="mx-auto mt-6 max-w-[52ch] text-gri">
          Müşterilerimizin bizim için en çok söylediği şey: gereksiz bir işlem önermemek ve doğal sonuçlar.
        </p>
        <a href={mapsLink} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex items-center gap-2 text-sm font-medium underline-offset-4 hover:underline">
          <span aria-hidden="true" className="tracking-[0.2em] text-kakao">★★★★★</span>
          Google yorumlarının tamamını okuyun
        </a>
        <div className="mt-6">
          <MotionPause />
        </div>
      </div>
      <div className={cn(wrap, "mt-14")}>
        <TestimonialsColumns items={testimonials} />
      </div>
    </section>
  );
}

export function Breadcrumbs({ crumbs }: { crumbs: Crumb[] }) {
  return (
    <>
      <nav aria-label="Konum" className="text-sm text-gri">
        <ol className="flex flex-wrap items-center gap-2">
          {crumbs.map((c, i) => (
            <li key={c.path} className="flex items-center gap-2">
              {i > 0 && <span aria-hidden="true">/</span>}
              {i === crumbs.length - 1 ? (
                <span aria-current="page" className="text-murekkep">
                  {c.name}
                </span>
              ) : (
                <Link href={c.path} className="hover:text-kakao">
                  {c.name}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
      <JsonLdScript data={breadcrumbJsonLd(crumbs)} />
    </>
  );
}

/** Inner page header: breadcrumbs + H1 + intro. */
export function PageHeader({
  crumbs,
  title,
  accent,
  intro,
}: {
  crumbs: Crumb[];
  title: ReactNode;
  accent?: ReactNode;
  intro?: ReactNode;
}) {
  return (
    <section className={cn(wrap, "pb-14 pt-10 lg:pb-20 lg:pt-14")}>
      <Breadcrumbs crumbs={crumbs} />
      <SectionHeading as="h1" title={title} accent={accent} note={intro} className="mt-8" />
    </section>
  );
}
