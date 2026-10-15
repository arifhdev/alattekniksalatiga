import type { Metadata } from "next";
import { CtaBand } from "@/components/cta-band";
import { SanityImage } from "@/components/sanity-image";
import { Eyebrow, PageHero, SectionHeading } from "@/components/ui";
import { getAbout, getSettings } from "@/sanity/fetch";

export async function generateMetadata(): Promise<Metadata> {
  const about = await getAbout();
  return {
    title: "Tentang Kami",
    description: about?.hero?.description ?? undefined,
    alternates: { canonical: "/tentang-kami" },
  };
}

export default async function AboutPage() {
  const [about, settings] = await Promise.all([getAbout(), getSettings()]);
  if (!about) throw new Error('Sanity document "aboutPage" is missing');
  const brands = settings.brands ?? [];

  return (
    <>
      <PageHero
        eyebrow={about.hero?.eyebrow}
        title={about.hero?.title ?? ""}
        accent={about.hero?.accent}
        description={about.hero?.description}
        sanityImage={about.hero?.image}
        crumbs={[{ href: "/", label: "Beranda" }, { label: "Tentang Kami" }]}
      />

      <section className="mx-auto max-w-6xl px-4 py-24 sm:px-6 sm:py-32">
        <div className="grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div className="reveal lg:sticky lg:top-32">
              <Eyebrow>Cerita Kami</Eyebrow>
              {about.quote && (
                <p className="mt-4 text-[clamp(1.5rem,3vw,2.25rem)] leading-snug font-light text-ink italic">
                  “{about.quote}”
                </p>
              )}
              <dl className="mt-10 grid grid-cols-2 gap-6 border-t border-line pt-8">
                {settings.since && (
                  <div>
                    <dt className="text-sm text-muted">Berdiri</dt>
                    <dd className="mt-1 text-3xl font-semibold tracking-tight text-ink">{settings.since}</dd>
                  </div>
                )}
                {settings.address?.city && (
                  <div>
                    <dt className="text-sm text-muted">Lokasi</dt>
                    <dd className="mt-1 text-3xl font-semibold tracking-tight text-ink">{settings.address.city}</dd>
                  </div>
                )}
              </dl>
            </div>
          </div>
          <div className="space-y-14 lg:col-span-7">
            {about.story?.map((s, i) => (
              <article key={s._key} className="reveal border-t border-line pt-8">
                <span className="font-mono text-xs text-brand">{String(i + 1).padStart(2, "0")}</span>
                <h2 className="mt-3 text-2xl font-semibold tracking-tight text-ink sm:text-3xl">{s.question}</h2>
                <p className="mt-4 text-lg leading-relaxed whitespace-pre-line text-muted">{s.answer}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {!!about.photos?.length && (
        <section className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid gap-4 md:grid-cols-3">
            {about.photos.map((img, i) => (
              <div
                key={img._key}
                className={`reveal relative aspect-[3/4] overflow-hidden rounded-3xl bg-paper-2 ${i === 1 ? "md:-mt-10" : "md:mt-10"}`}
              >
                <SanityImage image={img} fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover" />
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="grain relative mt-24 overflow-hidden bg-ink py-24 text-white sm:mt-32 sm:py-32">
        <div className="hairline-grid absolute inset-0" aria-hidden />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          <SectionHeading tone="light" {...about.rangeHeading} />
          {!!about.productRange?.length && (
            <ul className="mt-12 flex flex-wrap gap-2.5">
              {about.productRange.map((r) => (
                <li key={r} className="reveal rounded-sm border border-white/15 px-5 py-2.5 text-white/85">
                  {r}
                </li>
              ))}
              <li className="reveal rounded-sm bg-white/10 px-5 py-2.5 text-white/60">…dan masih banyak lagi</li>
            </ul>
          )}
          {brands.length > 0 && (
            <div className="mt-20 border-t border-white/10 pt-10">
              <p className="font-mono text-[11px] tracking-[0.28em] text-white/45 uppercase">Merek ternama</p>
              <div className="mt-6 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
                <ul className="marquee flex w-max gap-14">
                  {[...brands, ...brands].map((b, i) => (
                    <li
                      key={`${b}-${i}`}
                      aria-hidden={i >= brands.length}
                      className="text-[clamp(2rem,4vw,3.5rem)] font-semibold tracking-tight text-white/80"
                    >
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </section>

      <CtaBand />
    </>
  );
}
