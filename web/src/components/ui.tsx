import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import { SanityImage, type SanityImageData } from "@/components/sanity-image";

type StaticImg = { src: string; width: number; height: number };

export function Eyebrow({ children, tone = "dark" }: { children: ReactNode; tone?: "dark" | "light" }) {
  return (
    <span
      className={`inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.28em] uppercase ${
        tone === "light" ? "text-white/60" : "text-muted"
      }`}
    >
      <span className="h-px w-6 bg-current" aria-hidden />
      {children}
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  accent,
  description,
  tone = "dark",
  action,
}: {
  eyebrow?: string | null;
  title?: string | null;
  accent?: string | null;
  description?: string | null;
  tone?: "dark" | "light";
  action?: ReactNode;
}) {
  return (
    <div className="reveal flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
      <div className="max-w-2xl">
        {eyebrow && <Eyebrow tone={tone}>{eyebrow}</Eyebrow>}
        <h2
          className={`mt-5 text-[clamp(2rem,4.6vw,3.5rem)] leading-[1.02] font-semibold tracking-[-0.035em] text-balance ${
            tone === "light" ? "text-white" : "text-ink"
          }`}
        >
          {title}
          {accent && (
            <>
              {" "}
              <span className={`font-display font-normal italic ${tone === "light" ? "text-brand-bright" : "text-brand"}`}>
                {accent}
              </span>
            </>
          )}
        </h2>
        {description && (
          <p className={`mt-5 text-lg leading-relaxed ${tone === "light" ? "text-white/60" : "text-muted"}`}>
            {description}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}

export function PageHero({
  eyebrow,
  title,
  accent,
  description,
  image,
  sanityImage,
  crumbs,
}: {
  eyebrow?: string | null;
  title: string;
  accent?: string | null;
  description?: string | null;
  image?: StaticImg;
  sanityImage?: SanityImageData;
  crumbs: { href?: string; label: string }[];
}) {
  return (
    <section className="grain relative isolate overflow-hidden bg-ink pt-36 pb-20 text-white sm:pt-44 sm:pb-24">
      {sanityImage ? (
        <SanityImage
          image={sanityImage}
          alt=""
          fill
          priority
          sizes="100vw"
          className="hero-zoom -z-20 object-cover opacity-45"
        />
      ) : (
        image && (
          <Image src={image.src} alt="" fill priority sizes="100vw" className="hero-zoom -z-20 object-cover opacity-45" />
        )
      )}
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink via-ink/70 to-ink/30" aria-hidden />
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Breadcrumbs items={crumbs} />
        <div className="hero-in mt-8 max-w-3xl">
          {eyebrow && <Eyebrow tone="light">{eyebrow}</Eyebrow>}
          <h1 className="mt-5 text-[clamp(2.5rem,6.5vw,5rem)] leading-[0.98] font-semibold tracking-[-0.04em] text-balance">
            {title}
            {accent && (
              <>
                {" "}
                <span className="font-display font-normal text-brand-bright italic">{accent}</span>
              </>
            )}
          </h1>
          {description && <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/65">{description}</p>}
        </div>
      </div>
    </section>
  );
}

export function Breadcrumbs({ items, tone = "light" }: { items: { href?: string; label: string }[]; tone?: "light" | "dark" }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className={`flex flex-wrap items-center gap-1.5 text-sm ${tone === "light" ? "text-white/55" : "text-muted"}`}>
        {items.map((item, i) => (
          <li key={item.label} className="flex items-center gap-1.5">
            {i > 0 && <ChevronRight className="size-3.5 opacity-60" aria-hidden />}
            {item.href ? (
              <Link href={item.href} className={tone === "light" ? "hover:text-white" : "hover:text-ink"}>
                {item.label}
              </Link>
            ) : (
              <span aria-current="page" className={tone === "light" ? "text-white" : "text-ink"}>
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
