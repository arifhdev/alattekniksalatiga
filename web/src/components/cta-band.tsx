import Image from "next/image";
import { ArrowUpRight, Phone } from "lucide-react";
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
    <section className="px-4 py-20 sm:px-6 sm:py-28">
      <div className="grain reveal relative isolate mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-ink px-6 py-16 text-white sm:px-14 sm:py-20">
        <Image src={bg.src} alt="" fill sizes="(min-width: 1280px) 1280px, 100vw" className="-z-20 object-cover opacity-40" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ink via-ink/85 to-ink/30" aria-hidden />
        <div className="max-w-2xl">
          {cta?.eyebrow && (
            <span className="font-mono text-[11px] tracking-[0.28em] text-white/55 uppercase">{cta.eyebrow}</span>
          )}
          <h2 className="mt-5 text-[clamp(2rem,4.5vw,3.5rem)] leading-[1.02] font-semibold tracking-[-0.035em] text-balance">
            {title ?? cta?.title}{" "}
            {cta?.accent && <span className="font-display font-normal text-brand-bright italic">{cta.accent}</span>}
          </h2>
          {cta?.description && <p className="mt-5 text-lg leading-relaxed text-white/65">{cta.description}</p>}
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a
              href={waLink(settings.whatsapp?.[0]?.number, message)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-3.5 font-medium text-ink transition hover:bg-[#3be07a]"
            >
              <WhatsAppLogo className="size-5" /> Chat WhatsApp
              <ArrowUpRight className="size-4" aria-hidden />
            </a>
            {phone && (
              <a
                href={telLink(phone)}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 px-6 py-3.5 font-medium text-white transition hover:bg-white/10"
              >
                <Phone className="size-4" aria-hidden /> {phone}
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
