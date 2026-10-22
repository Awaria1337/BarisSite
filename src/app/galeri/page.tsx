import { CtaBanner, PageHeader, wrap } from "@/components/blocks";
import LightboxGallery from "@/components/ui/lightbox-gallery";
import { galleryCategories, galleryItems } from "@/content/site";
import { pageMetadata } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const metadata = pageMetadata({
  title: "Galeri: Salonumuz ve Çalışmalarımız",
  description:
    "Barış Alaş Kuaför'den fotoğraflar: Çanakkale'deki salonumuz, saç kesimi, boya ve balyaj, gelin saçı, kaynak saç ve bakım çalışmalarımız.",
  path: "/galeri/",
});

export default function GalleryPage() {
  return (
    <>
      <PageHeader
        crumbs={[
          { name: "Ana sayfa", path: "/" },
          { name: "Galeri", path: "/galeri/" },
        ]}
        title="Salondan"
        accent="kareler"
        intro="Salonumuzdan ve müşterilerimiz için yaptığımız çalışmalardan. Büyütmek için fotoğrafa dokunun."
      />
      <section aria-label="Fotoğraf galerisi" className={cn(wrap, "pb-10")}>
        <LightboxGallery items={galleryItems} categories={[...galleryCategories]} columns="2-4" />
      </section>
      <CtaBanner />
    </>
  );
}
