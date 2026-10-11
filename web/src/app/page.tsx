import Link from "next/link";
import { ArrowRight, ArrowUpRight, BadgeCheck, Boxes, HandCoins, MapPin, Wrench } from "lucide-react";
import { WhatsAppLogo } from "@/components/brand-icons";
import { CtaBand } from "@/components/cta-band";
import { ProductCard } from "@/components/product-card";
import { SanityImage } from "@/components/sanity-image";
import { Eyebrow, SectionHeading } from "@/components/ui";
import { defaultInquiry, mapLink, waLink } from "@/lib/site";
import { getCategories, getHome, getSettings } from "@/sanity/fetch";

const pillarIcons = [Boxes, BadgeCheck, HandCoins];

export default async function Home() {
  const [home, settings, categories] = await Promise.all([getHome(), getSettings(), getCategories()]);
  if (!home) throw new Error('Sanity document "homePage" is missing');
  const { hero } = home;
  const addressLine = [settings.address?.street, settings.address?.city, settings.address?.region]
    .filter(Boolean)
    .join(", ");

  return (
    <>
      {/* Hero */}
      <section className="grain relative isolate flex min-h-[100svh] flex-col justify-end overflow-hidden bg-ink text-white">
        <SanityImage
          image={hero?.image}
          fill
          priority
          sizes="100vw"
          className="hero-zoom -z-20 object-cover object-[60%_center] opacity-70"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink via-ink/55 to-ink/20" aria-hidden />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ink/80 via-transparent to-transparent" aria-hidden />

        <div className="mx-auto w-full max-w-7xl px-4 pt-36 pb-10 sm:px-6 sm:pb-14">
          <div className="hero-in max-w-4xl">
            {hero?.eyebrow && <Eyebrow tone="light">{hero.eyebrow}</Eyebrow>}
            <h1 className="mt-6 text-[clamp(2.75rem,8vw,6.75rem)] leading-[0.92] font-semibold tracking-[-0.045em] text-balance">
              {hero?.title}{" "}
              {hero?.accent && <span className="font-display font-normal text-brand-bright italic">{hero.accent}</span>}
            </h1>
            {hero?.description && (
              <p className="mt-7 max-w-xl text-lg leading-relaxed text-white/70 sm:text-xl">{hero.description}</p>
            )}
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/produk"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-4 font-medium text-ink transition hover:bg-brand-bright hover:text-white"
              >
                Jelajahi Produk <ArrowRight className="size-4" aria-hidden />
              </Link>
              <a
                href={waLink(settings.whatsapp?.[0]?.number, defaultInquiry)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 bg-white/5 px-7 py-4 font-medium text-white backdrop-blur transition hover:bg-white/15"
              >
                <WhatsAppLogo className="size-5 text-[#25D366]" /> Konsultasi Gratis
              </a>
            </div>
          </div>

          {!!home.stats?.length && (
            <dl className="mt-16 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 backdrop-blur-md sm:mt-24 lg:grid-cols-4">
              {home.stats.map((s) => (
                <div key={s._key} className="bg-ink/60 px-5 py-5 sm:px-7 sm:py-6">
                  <dt className="sr-only">{s.label}</dt>
                  <dd className="text-2xl font-semibold tracking-tight sm:text-3xl">{s.value}</dd>
                  <dd className="mt-1 text-sm text-white/55">{s.label}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      </section>

      {/* Pillars */}
      {!!home.pillars?.length && (
        <section className="border-b border-line bg-paper">
          <div className="mx-auto grid max-w-7xl gap-px px-4 sm:px-6 md:grid-cols-3">
            {home.pillars.map(({ _key, title, text }, i) => {
              const Icon = pillarIcons[i % pillarIcons.length];
              return (
                <div
                  key={_key}
                  className={`reveal flex gap-5 py-10 md:px-8 ${i > 0 ? "border-t border-line md:border-t-0 md:border-l" : ""} ${i === 0 ? "md:pl-0" : ""}`}
                >
                  <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-ink text-brand-bright">
                    <Icon className="size-5" aria-hidden />
                  </span>
                  <div>
                    <h2 className="font-semibold tracking-tight text-ink">{title}</h2>
                    <p className="mt-1.5 text-[15px] leading-relaxed text-muted">{text}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32">
        <SectionHeading {...home.categoriesHeading} />
        <div className="mt-14 grid gap-4 md:grid-cols-3 md:grid-rows-2 lg:h-[640px]">
          {categories.map((c, i) => (
            <Link
              key={c._id}
              href={`/kategori/${c.slug}`}
              className={`group grain reveal relative isolate flex min-h-80 flex-col justify-end overflow-hidden rounded-3xl bg-ink p-7 text-white ${
                i === 0 ? "md:col-span-2 md:row-span-2" : ""
              }`}
            >
              <SanityImage
                image={c.image}
                alt=""
                fill
                sizes={i === 0 ? "(min-width: 768px) 66vw, 100vw" : "(min-width: 768px) 33vw, 100vw"}
                className="-z-20 object-cover opacity-75 transition duration-1000 ease-out group-hover:scale-105 group-hover:opacity-90"
              />
              <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink via-ink/35 to-ink/60" aria-hidden />
              <span className="absolute top-6 left-7 font-mono text-[11px] tracking-[0.28em] text-white/60 uppercase">
                0{i + 1} · {c.count} produk
              </span>
              <span className="absolute top-5 right-5 grid size-11 place-items-center rounded-full bg-white/10 backdrop-blur transition group-hover:bg-white group-hover:text-ink">
                <ArrowUpRight className="size-5" aria-hidden />
              </span>
              <h3 className={`font-semibold tracking-[-0.03em] ${i === 0 ? "text-4xl sm:text-5xl" : "text-3xl"}`}>{c.title}</h3>
              <p className={`mt-3 text-white/70 ${i === 0 ? "max-w-md text-lg" : "text-[15px]"}`}>{c.description}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Latest per category */}
      <section className="bg-paper-2/60 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading
            {...home.latestHeading}
            action={
              <Link
                href="/produk"
                className="inline-flex shrink-0 items-center gap-2 rounded-full bg-ink px-6 py-3.5 text-sm font-medium text-white transition hover:bg-brand"
              >
                Semua Produk <ArrowRight className="size-4" aria-hidden />
              </Link>
            }
          />
          <div className="mt-16 space-y-20">
            {home.latest.map((c) => (
              <div key={c._id}>
                <div className="reveal mb-7 flex items-baseline justify-between gap-4 border-b border-line pb-4">
                  <h3 className="text-2xl font-semibold tracking-tight text-ink">{c.title} Terbaru</h3>
                  <Link
                    href={`/kategori/${c.slug}`}
                    className="inline-flex items-center gap-1 text-sm font-medium text-brand hover:underline"
                  >
                    Lihat semua <ArrowRight className="size-3.5" aria-hidden />
                  </Link>
                </div>
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                  {c.products.map((p) => (
                    <div key={p._id} className="reveal">
                      <ProductCard product={p} />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Rentals & workshop */}
      {!!home.services?.length && (
        <section className="grain relative overflow-hidden bg-ink py-24 text-white sm:py-32">
          <div className="hairline-grid absolute inset-0" aria-hidden />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
            <SectionHeading tone="light" {...home.servicesHeading} />
            <ul className="mt-14 grid gap-px overflow-hidden rounded-3xl border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-5">
              {home.services.map((p, i) => (
                <li key={p._id} className="reveal bg-ink">
                  <Link href={`/produk/${p.slug}`} className="group flex h-full flex-col">
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <SanityImage
                        image={p.mainImage}
                        alt={p.title ?? ""}
                        fill
                        sizes="(min-width: 1024px) 20vw, (min-width: 640px) 50vw, 100vw"
                        className="object-cover opacity-80 transition duration-700 group-hover:scale-105 group-hover:opacity-100"
                      />
                    </div>
                    <div className="flex flex-1 items-start justify-between gap-3 p-5">
                      <div>
                        <span className="font-mono text-[10px] tracking-[0.25em] text-white/40">0{i + 1}</span>
                        <h3 className="mt-1 font-medium">{p.title}</h3>
                      </div>
                      <ArrowUpRight className="mt-5 size-4 shrink-0 text-white/40 transition group-hover:text-brand-bright" aria-hidden />
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* About teaser */}
      <section className="mx-auto grid max-w-7xl items-center gap-14 px-4 py-24 sm:px-6 sm:py-32 lg:grid-cols-2">
        <div className="reveal relative">
          <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-paper-2">
            <SanityImage image={home.aboutImage} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
          </div>
          {settings.since && (
            <div className="absolute -right-3 -bottom-6 w-56 rounded-2xl bg-ink p-5 text-white shadow-2xl sm:-right-6 sm:w-64">
              <Wrench className="size-5 text-brand-bright" aria-hidden />
              <p className="mt-3 font-display text-4xl italic">Sejak {settings.since}</p>
              <p className="mt-1 text-sm text-white/60">Melayani ribuan pelanggan di Salatiga &amp; sekitarnya.</p>
            </div>
          )}
        </div>
        <div className="reveal">
          {home.aboutHeading?.eyebrow && <Eyebrow>{home.aboutHeading.eyebrow}</Eyebrow>}
          <h2 className="mt-5 text-[clamp(2rem,4.6vw,3.5rem)] leading-[1.02] font-semibold tracking-[-0.035em] text-balance text-ink">
            {home.aboutHeading?.title}{" "}
            {home.aboutHeading?.accent && (
              <span className="font-display font-normal text-brand italic">{home.aboutHeading.accent}</span>
            )}
          </h2>
          {home.aboutHeading?.description && (
            <p className="mt-6 text-lg leading-relaxed text-muted">{home.aboutHeading.description}</p>
          )}
          {!!settings.brands?.length && (
            <div className="mt-8">
              <p className="font-mono text-[11px] tracking-[0.25em] text-muted uppercase">Merek yang kami sediakan</p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {settings.brands.map((b) => (
                  <li key={b} className="rounded-full border border-line bg-card px-4 py-1.5 text-sm font-medium text-ink">
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <Link
            href="/tentang-kami"
            className="mt-10 inline-flex items-center gap-2 font-medium text-ink underline decoration-brand decoration-2 underline-offset-8 transition hover:text-brand"
          >
            Baca selengkapnya <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
      </section>

      {/* Location strip */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="reveal grid overflow-hidden rounded-3xl bg-card ring-1 ring-line lg:grid-cols-5">
          <div className="p-8 sm:p-12 lg:col-span-2">
            <Eyebrow>Kunjungi Toko</Eyebrow>
            <h2 className="mt-5 text-3xl font-semibold tracking-tight text-ink">Lokasi kami</h2>
            <p className="mt-4 flex gap-3 text-lg text-muted">
              <MapPin className="mt-1 size-5 shrink-0 text-brand" aria-hidden />
              {addressLine}
            </p>
            <a
              href={mapLink(settings.geo, addressLine)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3.5 text-sm font-medium text-white transition hover:bg-brand"
            >
              Buka di Google Maps <ArrowUpRight className="size-4" aria-hidden />
            </a>
          </div>
          {settings.mapEmbedUrl && (
            <iframe
              title={`Peta lokasi ${settings.name}`}
              src={settings.mapEmbedUrl}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-80 w-full border-0 grayscale-[0.4] lg:col-span-3 lg:h-full lg:min-h-96"
            />
          )}
        </div>
      </section>

      <CtaBand />
    </>
  );
}
