import { ArrowUpRight, Clock, MapPin, Phone } from "lucide-react";
import { PageHeader, WhatsAppButton, wrap } from "@/components/blocks";
import { OpenNow } from "@/components/open-now";
import { MapEmbed } from "@/components/location-section";
import { address, contact, dayNamesTr, directionsLink, hours, mapsLink, site, social } from "@/content/site";
import { pageMetadata } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const metadata = pageMetadata({
  title: "İletişim ve Adres: Akol Otel, Çanakkale",
  description:
    "Barış Alaş Kuaför Salonu adres, telefon ve çalışma saatleri. Cevat Paşa Mah. Kayserili Ahmet Paşa Cd. No:32, Akol Otel, Çanakkale. Randevu için WhatsApp.",
  path: "/iletisim/",
});

export default function ContactPage() {
  return (
    <>
      <PageHeader
        crumbs={[
          { name: "Ana sayfa", path: "/" },
          { name: "İletişim", path: "/iletisim/" },
        ]}
        title="Bize"
        accent="ulaşın"
        intro="Randevu için en hızlı yol WhatsApp. Telefonla da arayabilir ya da salona uğrayabilirsiniz."
      />

      <section className={cn(wrap, "grid gap-12 pb-24 lg:grid-cols-2 lg:gap-16")}>
        <div className="space-y-10">
          <div>
            <h2 className="flex items-center gap-2 font-sans text-sm font-medium tracking-normal text-gri">
              <Phone aria-hidden="true" className="size-4 text-kakao" />
              Telefon
            </h2>
            <a href={`tel:${contact.phoneE164}`} className="mt-3 block font-display text-4xl font-semibold tracking-[-0.03em] hover:text-kakao sm:text-5xl">
              {contact.phoneDisplay}
            </a>
            <WhatsAppButton className="mt-6" />
          </div>

          <div>
            <h2 className="flex items-center gap-2 font-sans text-sm font-medium tracking-normal text-gri">
              <MapPin aria-hidden="true" className="size-4 text-kakao" />
              Adres
            </h2>
            <address className="mt-3 text-xl not-italic leading-relaxed">
              {site.name}
              <br />
              {address.neighborhood} {address.street}
              <br />
              {address.landmark}, {address.postalCode} {address.city} {address.district}
            </address>
            <div className="mt-5 flex flex-wrap gap-3">
              <a
                href={directionsLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-12 items-center gap-2 rounded-full bg-murekkep px-6 font-medium text-krem transition-colors hover:bg-kakao-koyu"
              >
                Yol tarifi al
                <ArrowUpRight aria-hidden="true" className="size-4" />
              </a>
              <a
                href={mapsLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-12 items-center gap-2 rounded-full border border-murekkep/20 px-6 font-medium transition-colors hover:border-kakao hover:text-kakao"
              >
                Google Haritalar&apos;da aç
              </a>
            </div>
          </div>

          <div>
            <h2 className="flex items-center gap-2 font-sans text-sm font-medium tracking-normal text-gri">
              <Clock aria-hidden="true" className="size-4 text-kakao" />
              Çalışma saatleri
            </h2>
            <OpenNow className="mt-3 font-medium text-kakao" />
            <table className="mt-4 w-full max-w-sm text-left">
              <caption className="sr-only">Haftalık çalışma saatleri</caption>
              <tbody>
                {hours.map((h) => (
                  <tr key={h.day} className="border-b border-cizgi">
                    <th scope="row" className="py-2.5 font-normal text-gri">
                      {dayNamesTr[h.day]}
                    </th>
                    <td className="py-2.5 text-right tabular-nums">
                      {h.open}–{h.close}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-gri">
            Bizi{" "}
            <a href={social.facebook} target="_blank" rel="noopener noreferrer" className="text-murekkep underline underline-offset-4 hover:text-kakao">
              Facebook
            </a>
            {social.instagram && (
              <>
                {" ve "}
                <a href={social.instagram} target="_blank" rel="noopener noreferrer" className="text-murekkep underline underline-offset-4 hover:text-kakao">
                  Instagram
                </a>
              </>
            )}
            &apos;ta da takip edebilirsiniz.
          </p>
        </div>

        <MapEmbed className="min-h-[28rem] lg:min-h-full" />
      </section>
    </>
  );
}
