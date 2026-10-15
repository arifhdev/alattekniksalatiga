import Link from "next/link";
import { ArrowRight, CircleCheck } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import { SanityImage } from "@/components/sanity-image";
import { SectionHeading } from "@/components/ui";
import { getHome } from "@/sanity/fetch";

export default async function Home() {
  const home = await getHome();
  if (!home) throw new Error('Sanity document "homePage" is missing');
  const { hero } = home;

  return (
    <>
      {/* Hero */}
      <section className="relative isolate flex min-h-[460px] items-center overflow-hidden bg-ink text-white lg:min-h-[620px]">
        <SanityImage image={hero?.image} fill priority sizes="100vw" className="-z-20 object-cover object-left" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-l from-black/80 via-black/50 to-black/10" aria-hidden />
        <div className="absolute inset-0 -z-10 bg-black/45 md:hidden" aria-hidden />

        <div className="mx-auto w-full max-w-6xl px-4 pt-14 pb-12 sm:px-6 md:pt-20 md:pb-14">
          <div className="hero-in ml-auto max-w-xl md:w-1/2">
            {hero?.eyebrow && <p className="text-base text-spark sm:text-xl">{hero.eyebrow}</p>}
            <h1 className="mt-3 text-[clamp(2.25rem,5.5vw,3.75rem)] leading-[1.05] font-bold text-balance uppercase">
              {hero?.title} {hero?.accent}
            </h1>
            {hero?.description && <p className="mt-5 text-[15px] leading-relaxed text-white/90 sm:text-base">{hero.description}</p>}
            <Link
              href="/hubungi-kami"
              className="mt-8 inline-block bg-brand px-7 py-3.5 text-sm font-semibold transition hover:bg-brand-dark"
            >
              Hubungi Kami
            </Link>
          </div>
        </div>
      </section>

      {/* Pillars strip */}
      {!!home.pillars?.length && (
        <section className="bg-brand text-white">
          <ul className="mx-auto grid max-w-6xl gap-6 px-4 py-7 sm:px-6 md:grid-cols-3">
            {home.pillars.map(({ _key, title, text }) => (
              <li key={_key} className="flex items-start gap-3">
                <CircleCheck className="mt-0.5 size-6 shrink-0" strokeWidth={1.5} aria-hidden />
                <div>
                  <h2 className="font-semibold">{title}</h2>
                  <p className="mt-0.5 text-[13px] leading-snug text-white/85">{text}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Products per category */}
      <div className="mx-auto max-w-6xl space-y-16 px-4 py-14 sm:space-y-20 sm:px-6 sm:py-20">
        {home.latest.map((c) => (
          <section key={c._id}>
            <SectionHeading title={c.title} />
            <div className="mt-8 grid grid-cols-2 gap-3 sm:mt-10 sm:gap-6 lg:grid-cols-4">
              {c.products.map((p) => (
                <div key={p._id} className="reveal">
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
            <div className="mt-8 text-center">
              <Link
                href={`/kategori/${c.slug}`}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand hover:underline"
              >
                Lihat semua {c.title} <ArrowRight className="size-4" aria-hidden />
              </Link>
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
