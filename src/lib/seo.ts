import type { Metadata } from "next";
import { site } from "@/content/site";

const ogImage = { url: "/og.jpg", width: 1200, height: 630, alt: site.name };

/** Per-page metadata with canonical, Open Graph and Twitter in one place. */
export function pageMetadata({
  title,
  description,
  path,
}: {
  /** A string goes through the layout's title template; `{ absolute }` bypasses it. */
  title: string | { absolute: string };
  description: string;
  path: string;
}): Metadata {
  const ogTitle = typeof title === "string" ? title : title.absolute;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: site.locale,
      url: path,
      siteName: site.name,
      title: ogTitle,
      description,
      images: [ogImage],
    },
    twitter: { card: "summary_large_image", title: ogTitle, description, images: [ogImage.url] },
  };
}

export type Crumb = { name: string; path: string };

export function breadcrumbJsonLd(crumbs: Crumb[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: `${site.url}${c.path}`,
    })),
  };
}

/** Safe inline JSON-LD (escapes `<` so content can't break out of the script tag). */
export function jsonLdHtml(data: unknown) {
  return { __html: JSON.stringify(data).replace(/</g, "\\u003c") };
}
