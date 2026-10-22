import { BrandsMarquee, CtaBanner, PageHeader, TestimonialsSection, wrap } from "@/components/blocks";
import Picture from "@/components/picture";
import { address, site } from "@/content/site";
import { pageMetadata } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const metadata = pageMetadata({
  title: "Hakkımızda: Barış Alaş ve Ekibi",
  description:
    "Barış Alaş Kuaför Salonu, Çanakkale Merkez'de Akol Otel içinde. Dürüst tavsiye, doğal sonuç ve kaynak saç, protez saç uzmanlığıyla kadın kuaförü.",
  path: "/hakkimizda/",
});

const values = [
  {
    title: "Dürüst tavsiye",
    text: "Saçınıza gerekmeyen bir işlemi önermiyoruz. Yakışmayacaksa söylüyoruz.",
  },
  {
    title: "Doğal sonuç",
    text: "Kaynak saçta, renkte ve kesimde amacımız fark edilmeyen, size ait duran bir sonuç.",
  },
  {
    title: "Özenli ürünler",
    text: "Saçınızı yormayan profesyonel ürünlerle çalışıyoruz.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        crumbs={[
          { name: "Ana sayfa", path: "/" },
          { name: "Hakkımızda", path: "/hakkimizda/" },
        ]}
        title="Barış Alaş"
        accent="ve ekibi"
        intro={`${site.foundingYear}'dan beri Çanakkale Merkez'de, ${address.landmark} içinde kadın kuaförüyüz.`}
      />

      <section aria-labelledby="hikaye" className={cn(wrap, "grid gap-12 pb-20 lg:grid-cols-2 lg:items-center lg:gap-20")}>
        <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem]">
          <Picture id="about-01" fill priority sizes="(min-width: 1024px) 50vw, 100vw" />
        </div>
        <div>
          <h2 id="hikaye" className="text-4xl sm:text-5xl">
            Hikâyemiz<span className="text-kakao">.</span>
          </h2>
          <div className="mt-8 space-y-5 text-lg">
            <p className="max-w-[56ch]">
              {site.owner}, {site.foundingYear}&apos;dan beri Çanakkale&apos;de kadın kuaförlüğü yapıyor. Müşterilerimizin çoğu yıllardır bize
              geliyor ve bize en çok dürüstlüğümüz için güveniyor.
            </p>
            <p className="max-w-[56ch]">
              Kesim, renk ve bakımın yanında kaynak saç, protez saç ve peruk konusunda uzmanız. Saç seyrelmesi ya da
              kaybı yaşayan müşterilerimizle görüşmelerimizi sakin ve özel bir ortamda yapıyoruz.
            </p>
            <p className="max-w-[56ch]">
              Salonumuz {address.landmark}&apos;in içinde; kolayca ulaşabilir, rahatça vakit geçirebilirsiniz.
            </p>
          </div>
        </div>
      </section>

      <section aria-labelledby="degerler" className="bg-fildisi py-20 lg:py-28">
        <div className={wrap}>
          <h2 id="degerler" className="text-4xl sm:text-5xl">
            Bizi biz yapan üç şey<span className="text-kakao">.</span>
          </h2>
          <ul className="mt-12 grid border-l border-t border-cizgi md:grid-cols-3">
            {values.map((v) => (
              <li key={v.title} className="border-b border-r border-cizgi p-8 sm:p-10">
                <h3 className="text-2xl">{v.title}</h3>
                <p className="mt-3 text-gri">{v.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-label="Salon fotoğrafları" className={cn(wrap, "grid grid-cols-2 gap-3 py-20 sm:gap-4 lg:grid-cols-4")}>
        {(["salon-01", "salon-02", "salon-03", "salon-04"] as const).map((id) => (
          <div key={id} className="relative aspect-[3/4] overflow-hidden rounded-2xl">
            <Picture id={id} fill sizes="(min-width: 1024px) 25vw, 50vw" />
          </div>
        ))}
      </section>

      <BrandsMarquee />
      <TestimonialsSection />
      <CtaBanner />
    </>
  );
}
