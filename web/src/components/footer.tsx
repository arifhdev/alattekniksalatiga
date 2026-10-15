import Link from "next/link";
import type { ReactNode } from "react";
import { ChevronUp, Mail, MapPin, Navigation, Phone, Smartphone } from "lucide-react";
import { Logo } from "@/components/logo";
import { WhatsAppLogo } from "@/components/brand-icons";
import { mapLink, nav, telLink, waLink } from "@/lib/site";
import { getCategories, getSettings } from "@/sanity/fetch";

function FooterHeading({ children }: { children: ReactNode }) {
  return (
    <h2 className="text-xl font-normal text-white">
      {children}
      <span className="mt-3 block h-[3px] w-8 bg-brand" aria-hidden />
    </h2>
  );
}

export async function Footer() {
  const [settings, categories] = await Promise.all([getSettings(), getCategories()]);
  const { address } = settings;
  const addressLine = [address?.street, address?.city].filter(Boolean).join(" ");
  const pages = nav.filter((n) => n.href !== "/");
  const mainWa = settings.whatsapp?.[0];

  return (
    <footer className="bg-[#0d0d0d] text-white/60">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 pt-12 pb-10 sm:px-6 sm:pt-16 sm:pb-14 md:grid-cols-3">
        <div>
          <Logo tone="light" />
          {settings.footerText && <p className="mt-6 text-[13.5px] leading-relaxed">{settings.footerText}</p>}
          <Link
            href="/tentang-kami"
            className="mt-6 inline-block bg-brand px-4 py-2.5 text-[13px] font-semibold text-white transition hover:bg-brand-dark"
          >
            Baca Selengkapnya
          </Link>
        </div>

        <div>
          <FooterHeading>Navigasi</FooterHeading>
          <div className="mt-7 grid grid-cols-2 gap-6 text-[13.5px]">
            <ul className="space-y-3 border-l border-white/10 pl-4">
              {pages.map((n) => (
                <li key={n.href}>
                  <Link href={n.href} className="transition hover:text-white">
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
            <ul className="space-y-3 border-l border-white/10 pl-4">
              {categories.map((c) => (
                <li key={c._id}>
                  <Link href={`/kategori/${c.slug}`} className="transition hover:text-white">
                    {c.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div>
          <FooterHeading>Hubungi Kami</FooterHeading>
          <ul className="mt-7 space-y-4 text-[13px]">
            {addressLine && (
              <ContactRow icon={<Navigation className="size-4 rotate-[270deg] fill-current" aria-hidden />} label="Alamat">
                <a href={mapLink(settings.geo, addressLine)} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                  {addressLine}
                </a>
              </ContactRow>
            )}
            {!!settings.phones?.length && (
              <ContactRow icon={<Phone className="size-4 fill-current" aria-hidden />} label="Telp">
                {settings.phones.map((p, i) => (
                  <span key={p}>
                    {i > 0 && " / "}
                    <a href={telLink(p)} className="hover:text-white">
                      {p}
                    </a>
                  </span>
                ))}
              </ContactRow>
            )}
            {!!settings.whatsapp?.length && (
              <ContactRow icon={<Smartphone className="size-4" aria-hidden />} label="HP / WA">
                {settings.whatsapp.map((w, i) => (
                  <span key={w._key}>
                    {i > 0 && " / "}
                    <a href={waLink(w.number)} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                      {w.display}
                    </a>
                  </span>
                ))}
              </ContactRow>
            )}
            {settings.email && (
              <ContactRow icon={<Mail className="size-4" aria-hidden />} label="Email">
                <a href={`mailto:${settings.email}`} className="break-all hover:text-white">
                  {settings.email}
                </a>
              </ContactRow>
            )}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/5 bg-black/40">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 pt-6 pb-24 text-[12.5px] sm:px-6 md:flex-row md:pb-6 md:items-center md:justify-between">
          <p>
            Copyright © {settings.since ? `${settings.since} - ` : ""}
            <CurrentYear />. All Rights Reserved. Design &amp; Development by{" "}
            <a href="https://revelation.co.id" target="_blank" rel="noopener" className="text-brand-bright hover:underline">
              Revelation Soft
            </a>
            .
          </p>
          <ul className="flex gap-2">
            {mainWa && (
              <SocialIcon href={waLink(mainWa.number)} label="WhatsApp">
                <WhatsAppLogo className="size-3.5" />
              </SocialIcon>
            )}
            {settings.phones?.[0] && (
              <SocialIcon href={telLink(settings.phones[0])} label="Telepon">
                <Phone className="size-3.5" aria-hidden />
              </SocialIcon>
            )}
            {settings.email && (
              <SocialIcon href={`mailto:${settings.email}`} label="Email">
                <Mail className="size-3.5" aria-hidden />
              </SocialIcon>
            )}
            <SocialIcon href={mapLink(settings.geo, addressLine)} label="Google Maps">
              <MapPin className="size-3.5" aria-hidden />
            </SocialIcon>
            <li className="md:ml-3">
              <a
                href="#"
                aria-label="Kembali ke atas"
                className="grid size-9 place-items-center border border-white/15 text-white/70 transition hover:border-brand hover:bg-brand hover:text-white"
              >
                <ChevronUp className="size-4" aria-hidden />
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}

function ContactRow({ icon, label, children }: { icon: ReactNode; label: string; children: ReactNode }) {
  return (
    <li className="flex gap-3">
      <span className="mt-0.5 shrink-0 text-brand">{icon}</span>
      <span>
        <span className="font-semibold text-white uppercase">{label}: </span>
        {children}
      </span>
    </li>
  );
}

function SocialIcon({ href, label, children }: { href: string; label: string; children: ReactNode }) {
  const external = href.startsWith("http");
  return (
    <li>
      <a
        href={href}
        aria-label={label}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        className="grid size-9 place-items-center rounded-full border border-white/15 text-white/70 transition hover:border-brand hover:bg-brand hover:text-white"
      >
        {children}
      </a>
    </li>
  );
}

async function CurrentYear() {
  "use cache";
  return new Date().getFullYear();
}
