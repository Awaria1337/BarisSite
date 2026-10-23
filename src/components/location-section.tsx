import { ArrowUpRight, Clock, MapPin, Phone } from "lucide-react";
import { WhatsAppButton, wrap } from "@/components/blocks";
import { OpenNow } from "@/components/open-now";
import { address, contact, directionsLink, hoursSummary, mapEmbedLink, site, social } from "@/content/site";
import { cn } from "@/lib/utils";

/** Lazy Google Maps iframe; loads only when scrolled near. */
export function MapEmbed({ className }: { className?: string }) {
  return (
    <div className={cn("relative overflow-hidden rounded-[2rem] bg-nude", className)}>
      <iframe
        src={mapEmbedLink}
        title={`${site.name} haritada`}
        loading="lazy"
        referrerPolicy="strict-origin-when-cross-origin"
        className="absolute inset-0 size-full border-0"
      />
    </div>
  );
}

/** Map + contact card shown above the footer on every page except /iletisim. */
export function LocationSection() {
  return (
    <section aria-labelledby="konum" className="border-t border-cizgi bg-fildisi py-20 lg:py-28">
      <div className={wrap}>
        <div className="mx-auto max-w-2xl text-center">
          <h2 id="konum" className="text-5xl sm:text-6xl">
            Hazırsanız <span className="accent">başlayalım</span>
            <span className="text-kakao">.</span>
          </h2>
          <p className="mt-5 text-lg text-gri">
            Salonumuz Çanakkale Merkez&apos;de, {address.landmark} içinde. Randevu için WhatsApp&apos;tan yazın ya da
            arayın.
          </p>
        </div>

        <div className="mt-12 grid gap-4 lg:grid-cols-[1.35fr_1fr]">
          <MapEmbed className="min-h-[22rem] lg:min-h-[32rem]" />

          <div className="flex flex-col rounded-[2rem] bg-murekkep p-8 text-krem sm:p-10">
            <p className="flex flex-col leading-none">
              <span className="font-display text-3xl font-semibold tracking-[-0.03em]">Barış Alaş</span>
              <span className="mt-2 text-xs tracking-[0.22em] text-karamel">kuaför · çanakkale</span>
            </p>

            <dl className="mt-10 grid gap-7 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              <div>
                <dt className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-karamel">
                  <MapPin aria-hidden="true" className="size-4" />
                  Adres
                </dt>
                <dd className="mt-3 leading-relaxed text-krem/85">
                  <address className="not-italic">
                    {address.neighborhood} {address.street}
                    <br />
                    {address.landmark}, {address.city}
                  </address>
                  <a
                    href={directionsLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex min-h-11 items-center gap-1 font-medium text-krem underline-offset-4 hover:underline"
                  >
                    Yol tarifi al
                    <ArrowUpRight aria-hidden="true" className="size-4" />
                  </a>
                </dd>
              </div>
              <div>
                <dt className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-karamel">
                  <Phone aria-hidden="true" className="size-4" />
                  Bizi arayın
                </dt>
                <dd className="mt-3">
                  <a href={`tel:${contact.phoneE164}`} className="font-display text-2xl font-semibold tracking-[-0.03em] hover:text-karamel">
                    {contact.phoneDisplay}
                  </a>
                </dd>
              </div>
            </dl>

            <p className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-1 rounded-full border border-krem/15 px-5 py-3 text-sm text-krem/85">
              <Clock aria-hidden="true" className="size-4 text-karamel" />
              {hoursSummary}
              <OpenNow as="span" className="text-karamel" />
            </p>

            <div className="mt-auto flex flex-wrap items-center gap-3 pt-10">
              <WhatsAppButton variant="light">WhatsApp&apos;tan randevu</WhatsAppButton>
              <a
                href={social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-12 items-center rounded-full border border-krem/20 px-5 text-sm transition-colors hover:border-karamel hover:text-karamel"
              >
                Facebook
              </a>
              {social.instagram && (
                <a
                  href={social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-12 items-center rounded-full border border-krem/20 px-5 text-sm transition-colors hover:border-karamel hover:text-karamel"
                >
                  Instagram
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
