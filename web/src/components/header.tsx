"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { Logo } from "@/components/logo";
import { defaultInquiry, nav, waLink } from "@/lib/site";

export function Header({ whatsapp, since }: { whatsapp?: string | null; since?: number | null }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  // product detail pages open on a light background instead of a dark hero
  const solid = scrolled || open || /^\/produk\/.+/.test(pathname);
  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-6">
      <div
        className={`mx-auto flex max-w-7xl items-center justify-between rounded-2xl border px-3 py-2.5 transition-all duration-500 sm:px-4 ${
          solid
            ? "border-white/10 bg-ink/80 shadow-[0_20px_60px_-20px_rgb(0_0_0/0.6)] backdrop-blur-xl"
            : "border-white/10 bg-ink/40 backdrop-blur-md"
        }`}
      >
        <Logo tone="light" since={since} />

        <nav aria-label="Navigasi utama" className="hidden items-center gap-1 md:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? "page" : undefined}
              className={`rounded-full px-4 py-2 text-sm transition-colors ${
                isActive(item.href) ? "bg-white/10 text-white" : "text-white/65 hover:text-white"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={waLink(whatsapp, defaultInquiry)}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-medium text-ink transition hover:bg-brand-bright hover:text-white sm:inline-flex"
          >
            Minta Penawaran <ArrowUpRight className="size-4" aria-hidden />
          </a>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Tutup menu" : "Buka menu"}
            className="grid size-11 place-items-center rounded-full text-white hover:bg-white/10 md:hidden"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div
          id="mobile-menu"
          className="mx-auto mt-2 max-w-7xl rounded-2xl border border-white/10 bg-ink/95 p-3 backdrop-blur-xl md:hidden"
        >
          <nav aria-label="Navigasi seluler" className="flex flex-col">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                aria-current={isActive(item.href) ? "page" : undefined}
                className={`rounded-xl px-4 py-3.5 text-lg ${isActive(item.href) ? "bg-white/10 text-white" : "text-white/70"}`}
              >
                {item.label}
              </Link>
            ))}
            <a
              href={waLink(whatsapp, defaultInquiry)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-3.5 font-medium text-ink"
            >
              Minta Penawaran via WhatsApp <ArrowUpRight className="size-4" aria-hidden />
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
