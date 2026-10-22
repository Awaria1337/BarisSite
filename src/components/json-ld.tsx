import { address, contact, hours, services, site, social } from "@/content/site";
import { jsonLdHtml } from "@/lib/seo";

const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export function JsonLdScript({ data }: { data: unknown }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdHtml(data)} />;
}

// HairSalon structured data, emitted once in the root layout. No
// aggregateRating: self-served review markup is ineligible for rich results
// (notes/research/02-seo-cwv.md).
export function SalonJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "HairSalon",
    "@id": `${site.url}/#salon`,
    name: site.name,
    url: `${site.url}/`,
    telephone: contact.phoneE164,
    image: [`${site.url}/og.jpg`],
    priceRange: "₺₺",
    foundingDate: String(site.foundingYear),
    address: {
      "@type": "PostalAddress",
      streetAddress: `${address.neighborhood} ${address.street}, ${address.landmark}`,
      addressLocality: address.city,
      addressRegion: address.region,
      postalCode: address.postalCode,
      addressCountry: address.country,
    },
    geo: { "@type": "GeoCoordinates", latitude: address.geo.lat, longitude: address.geo.lng },
    hasMap: `https://www.google.com/maps/place/?q=place_id:${address.placeId}`,
    areaServed: { "@type": "City", name: address.city },
    openingHoursSpecification: hours.map((h) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: dayNames[h.day],
      opens: h.open,
      closes: h.close,
    })),
    makesOffer: services.map((s) => ({
      "@type": "Offer",
      itemOffered: { "@type": "Service", name: s.title, url: `${site.url}/hizmetler/${s.slug}/` },
    })),
    sameAs: [social.facebook, social.instagram].filter(Boolean),
  };

  return <JsonLdScript data={data} />;
}
