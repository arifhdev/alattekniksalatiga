import Link from "next/link";
import { ArrowUpRight, MapPin, Phone, Mail } from "lucide-react";
import { Logo } from "@/components/logo";
import { ClaudeLogo, NextjsLogo, WhatsAppLogo } from "@/components/brand-icons";
import { mapLink, nav, telLink, waLink } from "@/lib/site";
import { getCategories, getSettings } from "@/sanity/fetch";

export async function Footer() {
  const [settings, categories] = await Promise.all([getSettings(), getCategories()]);
  const { address } = settings;
  const addressLine = [address?.street, address?.city, address?.region].filter(Boolean).join(", ");

  return (
    <footer className="grain relative overflow-hidden bg-ink text-white">
      <div className="hairline-grid absolute inset-0 opacity-60" aria-hidden />
      <div className="relative mx-auto max-w-7xl px-4 pt-20 sm:px-6">
        <div className="grid gap-12 border-b border-white/10 pb-16 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Logo tone="light" since={settings.since} />
            {settings.footerText && (
              <p className="mt-6 max-w-sm text-[15px] leading-relaxed text-white/60">{settings.footerText}</p>
            )}
            {settings.whatsapp?.[0] && (
              <a
                href={waLink(settings.whatsapp[0].number)}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2.5 text-sm text-white/85 transition hover:border-[#25D366] hover:text-white"
              >
                <WhatsAppLogo className="size-4 text-[#25D366]" />
                Chat WhatsApp
              </a>
            )}
          </div>

          <div className="grid grid-cols-2 gap-8 lg:col-span-4">
            <div>
              <h2 className="font-mono text-[11px] tracking-[0.25em] text-white/40 uppercase">Navigasi</h2>
              <ul className="mt-5 space-y-3 text-[15px]">
                {nav.map((n) => (
                  <li key={n.href}>
                    <Link href={n.href} className="text-white/70 transition hover:text-white">
                      {n.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="font-mono text-[11px] tracking-[0.25em] text-white/40 uppercase">Kategori</h2>
              <ul className="mt-5 space-y-3 text-[15px]">
                {categories.map((c) => (
                  <li key={c._id}>
                    <Link href={`/kategori/${c.slug}`} className="text-white/70 transition hover:text-white">
                      {c.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="lg:col-span-4">
            <h2 className="font-mono text-[11px] tracking-[0.25em] text-white/40 uppercase">Hubungi Kami</h2>
            <ul className="mt-5 space-y-4 text-[15px] text-white/70">
              {addressLine && (
                <li className="flex gap-3">
                  <MapPin className="mt-0.5 size-4 shrink-0 text-brand-bright" aria-hidden />
                  <a href={mapLink(settings.geo, addressLine)} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                    {addressLine}
                  </a>
                </li>
              )}
              {!!settings.phones?.length && (
                <li className="flex gap-3">
                  <Phone className="mt-0.5 size-4 shrink-0 text-brand-bright" aria-hidden />
                  <span className="flex flex-wrap gap-x-3 gap-y-1">
                    {settings.phones.map((p) => (
                      <a key={p} href={telLink(p)} className="hover:text-white">
                        {p}
                      </a>
                    ))}
                  </span>
                </li>
              )}
              {!!settings.whatsapp?.length && (
                <li className="flex gap-3">
                  <WhatsAppLogo className="mt-0.5 size-4 shrink-0 text-brand-bright" />
                  <span className="flex flex-wrap gap-x-3 gap-y-1">
                    {settings.whatsapp.map((w) => (
                      <a key={w._key} href={waLink(w.number)} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                        {w.display}
                      </a>
                    ))}
                  </span>
                </li>
              )}
              {settings.email && (
                <li className="flex gap-3">
                  <Mail className="mt-0.5 size-4 shrink-0 text-brand-bright" aria-hidden />
                  <a href={`mailto:${settings.email}`} className="break-all hover:text-white">
                    {settings.email}
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>

        <p
          aria-hidden
          className="pointer-events-none -mb-[0.18em] pt-10 text-center font-display text-[clamp(3.5rem,15vw,13rem)] leading-none tracking-tight text-white/[0.06] select-none"
        >
          Duta Teknik
        </p>

        <div className="flex flex-col gap-4 border-t border-white/10 py-7 text-sm text-white/50 md:flex-row md:items-center md:justify-between">
          <p>
            © {settings.since ? `${settings.since}–` : ""}
            <CurrentYear /> {settings.legalName ?? settings.name}. Hak cipta dilindungi.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
            <p>
              Developed by{" "}
              <a
                href="https://revelation.co.id"
                target="_blank"
                rel="noopener"
                className="inline-flex items-center gap-0.5 font-medium text-white/80 transition hover:text-white"
              >
                Revelation Soft <ArrowUpRight className="size-3.5" aria-hidden />
              </a>
            </p>
            <p className="flex items-center gap-2">
              <span>Built with</span>
              <a
                href="https://nextjs.org"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 font-medium text-white/80 hover:text-white"
              >
                <NextjsLogo className="size-4 text-white" /> Next.js
              </a>
              <span>&amp;</span>
              <a
                href="https://claude.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 font-medium text-white/80 hover:text-white"
              >
                <ClaudeLogo className="size-4" /> Claude
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

async function CurrentYear() {
  "use cache";
  return new Date().getFullYear();
}
