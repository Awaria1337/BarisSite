import Link from "next/link";
import { CtaBanner, FaqJsonLd, FaqList, PageHeader, wrap } from "@/components/blocks";
import { serviceFaq } from "@/content/service-faq";
import { faq, services } from "@/content/site";
import { pageMetadata } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const metadata = pageMetadata({
  title: "Sık Sorulan Sorular",
  description:
    "Randevu, fiyat, çalışma saatleri, kaynak saç, protez saç, boya, keratin bakım ve gelin saçı hakkında sık sorulan sorular ve cevapları. Barış Alaş Kuaför, Çanakkale.",
  path: "/sss/",
});

const groups = [
  { id: "genel", title: "Genel", items: faq.filter((f) => !services.some((s) => s.faq.some((x) => x.q === f.q))) },
  ...services.map((s) => ({ id: s.slug, title: s.title, items: serviceFaq[s.slug] ?? s.faq })),
].filter((g) => g.items.length > 0);

export default function FaqPage() {
  const all = groups.flatMap((g) => g.items);
  return (
    <>
      <PageHeader
        crumbs={[
          { name: "Ana sayfa", path: "/" },
          { name: "SSS", path: "/sss/" },
        ]}
        title="Sık"
        accent="sorulanlar"
        intro={`${all.length} soru ve cevap. Aradığınızı bulamazsanız WhatsApp'tan yazın, hemen yanıtlayalım.`}
      />

      <nav aria-label="Konular" className={cn(wrap, "pb-12")}>
        <ul className="flex flex-wrap gap-2">
          {groups.map((g) => (
            <li key={g.id}>
              <a href={`#${g.id}`} className="inline-flex min-h-11 items-center rounded-full border border-cizgi bg-fildisi px-5 text-sm transition-colors hover:border-kakao hover:text-kakao">
                {g.title}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className={cn(wrap, "space-y-20 pb-16")}>
        {groups.map((g) => (
          <section key={g.id} id={g.id} aria-labelledby={`${g.id}-baslik`} className="grid gap-8 lg:grid-cols-[0.7fr_1.5fr] lg:gap-16">
            <div>
              <h2 id={`${g.id}-baslik`} className="text-4xl sm:text-5xl">
                {g.title}
                <span className="text-kakao">.</span>
              </h2>
              {g.id !== "genel" && (
                <Link href={`/hizmetler/${g.id}/`} className="mt-4 inline-block font-medium underline-offset-4 hover:underline">
                  Hizmet sayfasına git
                </Link>
              )}
            </div>
            <FaqList items={g.items} />
          </section>
        ))}
      </div>

      <FaqJsonLd items={all} />
      <CtaBanner />
    </>
  );
}
