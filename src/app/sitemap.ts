import type { MetadataRoute } from "next";
import { services, site } from "@/content/site";

export const dynamic = "force-static";

const routes = ["/", "/hizmetler/", "/galeri/", "/hakkimizda/", "/iletisim/", "/sss/", "/kvkk/"];

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...routes.map((path) => ({
      url: `${site.url}${path}`,
      changeFrequency: "monthly" as const,
      priority: path === "/" ? 1 : path === "/kvkk/" ? 0.2 : 0.8,
    })),
    ...services.map((s) => ({
      url: `${site.url}/hizmetler/${s.slug}/`,
      changeFrequency: "monthly" as const,
      priority: s.featured ? 0.9 : 0.7,
    })),
  ];
}
