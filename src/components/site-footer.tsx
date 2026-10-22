import HalftoneWordmarkFooter from "@/components/ui/halftone-wordmark-footer";
import { address, contact, nav, services, site, social, whatsappLink } from "@/content/site";

export function SiteFooter() {
  const columns = [
    {
      title: "Sayfalar",
      links: [{ label: "Ana sayfa", href: "/" }, ...nav.map((n) => ({ label: n.label, href: n.href }))],
    },
    {
      title: "Hizmetler",
      links: services.slice(0, 6).map((s) => ({ label: s.title, href: `/hizmetler/${s.slug}/` })),
    },
    {
      title: "İletişim",
      links: [
        { label: contact.phoneDisplay, href: `tel:${contact.phoneE164}` },
        { label: "WhatsApp", href: whatsappLink(), external: true },
        { label: `${address.landmark}, ${address.city}`, href: "/iletisim/" },
        { label: "Facebook", href: social.facebook, external: true },
        ...(social.instagram ? [{ label: "Instagram", href: social.instagram, external: true }] : []),
        { label: "Aydınlatma metni", href: "/kvkk/" },
      ],
    },
  ];

  return (
    <HalftoneWordmarkFooter
      wordmark="barış alaş"
      label={site.name}
      meta={`© ${new Date().getFullYear()} · ${address.city}`}
      columns={columns}
      crop={-0.2}
      height="680px"
    />
  );
}
