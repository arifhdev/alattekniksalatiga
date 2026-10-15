"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { CircleCheck, MapPin, Menu, Phone, Search, X } from "lucide-react";
import { WhatsAppLogo } from "@/components/brand-icons";
import { Logo } from "@/components/logo";
import { mapLink, telLink, waLink } from "@/lib/site";
import type { CategoryData, Settings } from "@/sanity/types";

export function Header({ settings, categories }: { settings: Settings; categories: CategoryData[] }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const items = [
    { href: "/", label: "Beranda" },
    { href: "/tentang-kami", label: "Tentang Kami" },
    ...categories.map((c) => ({ href: `/kategori/${c.slug}`, label: c.title ?? "" })),
    { href: "/produk", label: "Semua Produk" },
  ];
  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));
  const addressLine = [settings.address?.street, settings.address?.city].filter(Boolean).join(" ");
  const mainWa = settings.whatsapp?.[0];

  return (
    <header className="relative z-40">
      {/* top bar */}
      <div className="bg-paper-2 text-[12px] text-muted sm:text-[13px]">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-5 gap-y-1 px-4 py-2 sm:px-6 sm:py-2.5">
          {!!settings.phones?.length && (
            <span className="flex items-center gap-2">
              <Phone className="size-3.5 text-brand" aria-hidden />
              {settings.phones.map((p, i) => (
                <span key={p}>
                  {i > 0 && " / "}
                  <a href={telLink(p)} className="hover:text-brand">
                    {p}
                  </a>
                </span>
              ))}
            </span>
          )}
          {!!settings.whatsapp?.length && (
            <span className="flex items-center gap-2 sm:border-l sm:border-line sm:pl-5">
              <WhatsAppLogo className="size-3.5 text-brand" />
              {settings.whatsapp.map((w, i) => (
                <span key={w._key}>
                  {i > 0 && " / "}
                  <a href={waLink(w.number)} target="_blank" rel="noopener noreferrer" className="hover:text-brand">
                    {w.display}
                  </a>
                </span>
              ))}
            </span>
          )}
        </div>
      </div>

      {/* logo row */}
      <div className="bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-4 py-4 sm:px-6 sm:py-6 md:pb-12">
          <Logo />
          <div className="flex items-center gap-8">
            {addressLine && (
              <div className="hidden items-center gap-3 md:flex">
                <CircleCheck className="size-6 text-brand" strokeWidth={1.5} aria-hidden />
                <div className="text-[13px] leading-snug">
                  <p className="font-semibold text-ink">Alamat Toko</p>
                  <p className="text-muted">{addressLine}</p>
                </div>
              </div>
            )}
            <ul className="flex items-center gap-3 text-ink sm:gap-4">
              {mainWa && (
                <li>
                  <a href={waLink(mainWa.number)} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="hover:text-brand">
                    <WhatsAppLogo className="size-4" />
                  </a>
                </li>
              )}
              {settings.phones?.[0] && (
                <li>
                  <a href={telLink(settings.phones[0])} aria-label="Telepon" className="hover:text-brand">
                    <Phone className="size-4" aria-hidden />
                  </a>
                </li>
              )}
              <li>
                <a
                  href={mapLink(settings.geo, addressLine)}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Lokasi di Google Maps"
                  className="hover:text-brand"
                >
                  <MapPin className="size-4" aria-hidden />
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* nav bar: overlaps the section below on desktop, like the draft */}
      <div className="relative md:-mt-6 md:-mb-6 md:px-6">
        <div className="mx-auto flex max-w-6xl items-stretch bg-ink text-white">
          <nav aria-label="Navigasi utama" className="hidden flex-1 items-stretch lg:flex">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive(item.href) ? "page" : undefined}
                className={`flex items-center px-4 text-[12.5px] font-semibold tracking-wide uppercase transition-colors first:pl-5 hover:text-brand-bright ${
                  isActive(item.href) ? "text-brand-bright" : "text-white"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <Link href="/produk" aria-label="Cari produk" className="flex items-center px-4 text-white hover:text-brand-bright">
              <Search className="size-4" aria-hidden />
            </Link>
          </nav>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            className="flex flex-1 items-center gap-2 px-4 py-3.5 text-sm font-semibold tracking-wide uppercase lg:hidden"
          >
            {open ? <X className="size-5" aria-hidden /> : <Menu className="size-5" aria-hidden />}
            Menu
          </button>
          <Link
            href="/hubungi-kami"
            className="flex items-center bg-brand px-6 py-3.5 text-[13px] font-semibold transition hover:bg-brand-dark sm:px-10 lg:py-4"
          >
            Hubungi Kami
          </Link>
        </div>

        {open && (
          <nav id="mobile-menu" aria-label="Navigasi seluler" className="mx-auto max-w-6xl bg-ink-2 lg:hidden">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                aria-current={isActive(item.href) ? "page" : undefined}
                className={`block border-t border-white/10 px-4 py-3.5 text-sm font-semibold tracking-wide uppercase ${
                  isActive(item.href) ? "text-brand-bright" : "text-white"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
