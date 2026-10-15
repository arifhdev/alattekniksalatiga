import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import { SanityImage, type SanityImageData } from "@/components/sanity-image";

type StaticImg = { src: string; width: number; height: number };

export function Eyebrow({ children, tone = "dark" }: { children: ReactNode; tone?: "dark" | "light" }) {
  return (
    <span className={`text-sm font-medium tracking-wide ${tone === "light" ? "text-spark" : "text-brand"}`}>{children}</span>
  );
}

/** Centered section title with the short blue rule underneath, as in the draft. */
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
    <div className="reveal flex flex-col items-center text-center">
      {eyebrow && <Eyebrow tone={tone}>{eyebrow}</Eyebrow>}
      <h2
        className={`mt-2 text-[clamp(1.6rem,3vw,2rem)] leading-tight font-normal text-balance ${
          tone === "light" ? "text-white" : "text-ink"
        }`}
      >
        {title}
        {accent && <> {accent}</>}
      </h2>
      <span className="mt-4 block h-[3px] w-12 bg-brand" aria-hidden />
      {description && (
        <p className={`mt-5 max-w-2xl text-[15px] leading-relaxed ${tone === "light" ? "text-white/65" : "text-muted"}`}>
          {description}
        </p>
      )}
      {action && <div className="mt-6">{action}</div>}
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
    <section className="relative isolate overflow-hidden bg-ink pt-20 pb-14 text-white sm:pt-24 sm:pb-16">
      {sanityImage ? (
        <SanityImage image={sanityImage} alt="" fill priority sizes="100vw" className="-z-20 object-cover opacity-50" />
      ) : (
        image && <Image src={image.src} alt="" fill priority sizes="100vw" className="-z-20 object-cover opacity-50" />
      )}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/80 via-black/55 to-black/30" aria-hidden />
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="hero-in max-w-3xl">
          {eyebrow && <Eyebrow tone="light">{eyebrow}</Eyebrow>}
          <h1 className="mt-3 text-[clamp(2rem,5vw,3.25rem)] leading-[1.05] font-bold tracking-tight text-balance uppercase">
            {title}
            {accent && <> {accent}</>}
          </h1>
          {description && <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/80">{description}</p>}
        </div>
        <div className="mt-8">
          <Breadcrumbs items={crumbs} />
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
