"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, Phone, X } from "lucide-react";
import { WhatsAppIcon } from "@/components/icons";
import { contact, nav, whatsappLink } from "@/content/site";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Close the mobile menu whenever the route changes (incl. back/forward).
  const [menuPath, setMenuPath] = useState(pathname);
  if (menuPath !== pathname) {
    setMenuPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu on Escape.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 transition-[background-color,box-shadow] duration-300",
        scrolled || open ? "bg-krem/90 shadow-[0_1px_0_var(--color-cizgi)] backdrop-blur-md" : "bg-krem",
      )}
    >
      <div className="mx-auto flex h-18 w-full max-w-7xl items-center justify-between gap-6 px-5 sm:px-8">
        <Link href="/" className="flex flex-col leading-none" onClick={() => setOpen(false)}>
          {/* TODO: logo from Mert */}
          <span className="font-display text-xl font-semibold tracking-[-0.03em]">Barış Alaş</span>
          <span className="mt-1 text-[0.7rem] tracking-[0.22em] text-kakao">kuaför · çanakkale</span>
        </Link>

        <nav aria-label="Ana menü" className="hidden lg:block">
          <ul className="flex items-center gap-8 text-[0.95rem]">
            {nav.map((item) => {
              const active = pathname.startsWith(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "relative py-2 transition-colors hover:text-kakao",
                      active && "text-kakao after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:bg-kakao",
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={`tel:${contact.phoneE164}`}
            className="hidden items-center gap-2 px-3 text-sm text-gri transition-colors hover:text-murekkep md:flex"
          >
            <Phone aria-hidden="true" className="size-4" />
            {contact.phoneDisplay}
          </a>
          <a
            href={whatsappLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden min-h-11 items-center gap-2 rounded-full border border-murekkep/15 px-5 text-sm font-medium transition-colors hover:border-kakao hover:text-kakao sm:inline-flex"
          >
            <WhatsAppIcon className="size-4" />
            WhatsApp
          </a>
          <button
            type="button"
            className="grid size-11 place-items-center rounded-full lg:hidden"
            aria-expanded={open}
            aria-controls="mobil-menu"
            aria-label={open ? "Menüyü kapat" : "Menüyü aç"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X aria-hidden="true" className="size-6" /> : <Menu aria-hidden="true" className="size-6" />}
          </button>
        </div>
      </div>

      <nav
        id="mobil-menu"
        aria-label="Mobil menü"
        hidden={!open}
        className="border-t border-cizgi bg-krem px-5 pb-8 pt-4 lg:hidden"
      >
        <ul className="flex flex-col">
          {nav.map((item) => (
            <li key={item.href} className="border-b border-cizgi">
              <Link
                href={item.href}
                onClick={() => setOpen(false)}
                aria-current={pathname.startsWith(item.href) ? "page" : undefined}
                className="block py-4 font-display text-2xl font-semibold tracking-[-0.03em]"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
        <a href={`tel:${contact.phoneE164}`} className="mt-6 flex items-center gap-2 text-gri">
          <Phone aria-hidden="true" className="size-4" />
          {contact.phoneDisplay}
        </a>
      </nav>
    </header>
  );
}
