import { CtaBanner, PageHeader, ServiceGrid, wrap } from "@/components/blocks";
import { pageMetadata } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const metadata = pageMetadata({
  title: "Hizmetler: Kaynak Saç, Boya, Kesim, Gelin Saçı",
  description:
    "Çanakkale'de kaynak saç, protez saç ve peruk, boya, röfle, balyaj, kesim, fön, keratin bakım, gelin saçı, makyaj ve manikür.",
  path: "/hizmetler/",
});

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        crumbs={[
          { name: "Ana sayfa", path: "/" },
          { name: "Hizmetler", path: "/hizmetler/" },
        ]}
        title="Hizmetlerimiz"
        intro="Her hizmeti saçınıza bakarak, size özel uyguluyoruz. Fiyat ve uygun saat için WhatsApp'tan yazmanız yeterli."
      />
      <section aria-label="Hizmet listesi" className={cn(wrap, "pb-10")}>
        <ServiceGrid headingLevel={2} priorityFirst />
      </section>
      <CtaBanner />
    </>
  );
}
