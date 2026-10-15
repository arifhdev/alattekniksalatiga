import type { Metadata } from "next";
import { ArrowUpRight, Clock, Mail, MapPin, Phone } from "lucide-react";
import { WhatsAppLogo } from "@/components/brand-icons";
import { ContactForm } from "@/components/contact-form";
import { PageHero } from "@/components/ui";
import { mapLink, staticImages, telLink, waLink } from "@/lib/site";
import { getSettings } from "@/sanity/fetch";

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSettings();
  return {
    title: "Hubungi Kami",
    description: `Hubungi ${site.name} — ${site.address?.street ?? ""}, ${site.address?.city ?? ""}. Telp ${site.phones?.[0] ?? ""}, WhatsApp ${site.whatsapp?.[0]?.display ?? ""}.`,
    alternates: { canonical: "/hubungi-kami" },
  };
}

export default async function ContactPage() {
  const site = await getSettings();
  const addressLine = [site.address?.street, site.address?.city, site.address?.region].filter(Boolean).join(", ");
  const directions = mapLink(site.geo, addressLine);
  const cards = [
    {
      icon: MapPin,
      label: "Alamat",
      body: (
        <a href={directions} target="_blank" rel="noopener noreferrer" className="hover:text-brand">
          {site.address?.street}
          <br />
          {site.address?.city}, {site.address?.region}
        </a>
      ),
    },
    {
      icon: Phone,
      label: "Telepon",
      body: (
        <span className="flex flex-col">
          {site.phones?.map((p) => (
            <a key={p} href={telLink(p)} className="hover:text-brand">
              {p}
            </a>
          ))}
        </span>
      ),
    },
    {
      icon: WhatsAppLogo,
      label: "WhatsApp",
      body: (
        <span className="flex flex-col">
          {site.whatsapp?.map((w) => (
            <a key={w._key} href={waLink(w.number)} target="_blank" rel="noopener noreferrer" className="hover:text-brand">
              {w.display}
            </a>
          ))}
        </span>
      ),
    },
    {
      icon: Mail,
      label: "Email",
      body: (
        <a href={`mailto:${site.email ?? ""}`} className="break-all hover:text-brand">
          {site.email}
        </a>
      ),
    },
  ];

  return (
    <>
      <PageHero
        eyebrow="Hubungi Kami"
        title="Mari bicara"
        accent="soal proyek Anda."
        description="Tanyakan harga, stok, atau spesifikasi — tim kami siap membantu melalui telepon, WhatsApp, maupun langsung di toko."
        image={staticImages.contactHero}
        crumbs={[{ href: "/", label: "Beranda" }, { label: "Hubungi Kami" }]}
      />

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map(({ icon: Icon, label, body }) => (
            <li key={label} className="reveal rounded-2xl bg-card p-6 ring-1 ring-line">
              <span className="grid size-11 place-items-center rounded-xl bg-ink text-brand-bright">
                <Icon className="size-5" aria-hidden />
              </span>
              <h2 className="mt-5 font-mono text-[11px] tracking-[0.25em] text-muted uppercase">{label}</h2>
              <div className="mt-2 text-[15px] leading-relaxed text-ink">{body}</div>
            </li>
          ))}
        </ul>

        <div className="mt-6 grid gap-6 lg:grid-cols-5">
          <div className="reveal rounded-3xl bg-card p-6 ring-1 ring-line sm:p-10 lg:col-span-3">
            <h2 className="text-3xl font-semibold tracking-tight text-ink">
              Kirim <span className="text-brand">pesan</span>
            </h2>
            <p className="mt-2 text-muted">Ceritakan kebutuhan Anda, kami balas secepatnya.</p>
            <div className="mt-8">
              <ContactForm storeName={site.name ?? ""} accounts={site.whatsapp ?? []} />
            </div>
          </div>
          <div className="reveal flex flex-col overflow-hidden rounded-3xl bg-ink text-white lg:col-span-2">
            <iframe
              title={`Peta lokasi ${site.name}`}
              src={site.mapEmbedUrl ?? undefined}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-80 w-full flex-1 border-0 lg:min-h-[420px]"
            />
            <div className="p-6 sm:p-8">
              <p className="flex items-center gap-2 text-sm text-white/60">
                <Clock className="size-4" aria-hidden /> Kunjungi toko kami
              </p>
              <p className="mt-2 text-lg font-medium">
                {site.address?.street}, {site.address?.city}
              </p>
              <a
                href={directions}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex items-center gap-2 rounded-sm bg-white px-5 py-3 text-sm font-medium text-ink transition hover:bg-brand-bright hover:text-white"
              >
                Petunjuk arah <ArrowUpRight className="size-4" aria-hidden />
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
