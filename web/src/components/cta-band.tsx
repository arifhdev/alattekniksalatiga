import Image from "next/image";
import { Phone } from "lucide-react";
import { WhatsAppLogo } from "@/components/brand-icons";
import { staticImages, telLink, waLink } from "@/lib/site";
import { getSettings } from "@/sanity/fetch";

export async function CtaBand({
  title,
  message = "Halo Duta Teknik Salatiga, saya ingin meminta penawaran harga.",
}: {
  /** Overrides the headline from Site Settings, e.g. on product pages. */
  title?: string;
  message?: string;
}) {
  const settings = await getSettings();
  const cta = settings.cta;
  const bg = staticImages.ctaBackground;
  const phone = settings.phones?.[0];
  return (
    <section className="relative isolate overflow-hidden bg-brand text-white">
      <Image src={bg.src} alt="" fill sizes="100vw" className="-z-20 object-cover opacity-15 mix-blend-multiply" />
      <div className="reveal mx-auto flex max-w-6xl flex-col gap-8 px-4 py-14 sm:px-6 md:flex-row md:items-center md:justify-between">
        <div className="max-w-2xl">
          {cta?.eyebrow && <p className="text-sm font-medium text-white/80">{cta.eyebrow}</p>}
          <h2 className="mt-2 text-[clamp(1.6rem,3vw,2.25rem)] leading-tight font-semibold text-balance">
            {title ?? cta?.title} {cta?.accent}
          </h2>
          {cta?.description && <p className="mt-3 text-[15px] leading-relaxed text-white/85">{cta.description}</p>}
        </div>
        <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
          <a
            href={waLink(settings.whatsapp?.[0]?.number, message)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-white px-6 py-3.5 text-sm font-semibold text-brand transition hover:bg-ink hover:text-white"
          >
            <WhatsAppLogo className="size-5" /> Chat WhatsApp
          </a>
          {phone && (
            <a
              href={telLink(phone)}
              className="inline-flex items-center justify-center gap-2 border border-white/60 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              <Phone className="size-4" aria-hidden /> {phone}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
