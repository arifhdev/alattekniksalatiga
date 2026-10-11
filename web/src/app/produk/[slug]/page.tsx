import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Phone, ShieldCheck, Truck, Warehouse } from "lucide-react";
import { WhatsAppLogo } from "@/components/brand-icons";
import { CtaBand } from "@/components/cta-band";
import { RichText } from "@/components/portable-text";
import { ProductCard } from "@/components/product-card";
import { ProductGallery } from "@/components/product-gallery";
import { Breadcrumbs } from "@/components/ui";
import { siteUrl, telLink, waLink } from "@/lib/site";
import { getProduct, getProductSlugs, getSettings } from "@/sanity/fetch";

export async function generateStaticParams() {
  return getProductSlugs();
}

export async function generateMetadata({ params }: PageProps<"/produk/[slug]">): Promise<Metadata> {
  const [product, settings] = await Promise.all([getProduct((await params).slug), getSettings()]);
  if (!product) return {};
  return {
    title: `${product.title} Salatiga`,
    description: product.excerpt,
    alternates: { canonical: `/produk/${product.slug}` },
    openGraph: {
      title: `${product.title} — ${settings.name}`,
      description: product.excerpt ?? undefined,
      images: product.mainImage?.asset?.url ? [`${product.mainImage.asset.url}?w=1200&h=630&fit=crop`] : undefined,
    },
  };
}

const assurances = [
  { icon: ShieldCheck, text: "Kualitas terjamin" },
  { icon: Warehouse, text: "Eceran & grosir" },
  { icon: Truck, text: "Kirim seluruh Indonesia" },
];

export default function ProductPage({ params }: PageProps<"/produk/[slug]">) {
  return (
    <Suspense fallback={<ProductSkeleton />}>
      <ProductDetail params={params} />
    </Suspense>
  );
}

function ProductSkeleton() {
  return (
    <section aria-busy="true" className="mx-auto max-w-7xl px-4 pt-32 pb-16 sm:px-6 sm:pt-36">
      <div className="h-4 w-64 animate-pulse rounded bg-paper-2" />
      <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="aspect-square animate-pulse rounded-3xl bg-paper-2" />
        <div className="space-y-5">
          <div className="h-3 w-24 animate-pulse rounded bg-paper-2" />
          <div className="h-14 w-3/4 animate-pulse rounded-xl bg-paper-2" />
          <div className="h-24 animate-pulse rounded-xl bg-paper-2" />
          <div className="h-44 animate-pulse rounded-2xl bg-paper-2" />
        </div>
      </div>
    </section>
  );
}

async function ProductDetail({ params }: { params: PageProps<"/produk/[slug]">["params"] }) {
  const [product, settings] = await Promise.all([getProduct((await params).slug), getSettings()]);
  if (!product) notFound();
  const category = product.category;
  const message = `Halo ${settings.name}, saya tertarik dengan produk "${product.title}". Mohon info harga dan ketersediaannya.`;
  const phone = settings.phones?.[0];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.excerpt,
    category: category?.title,
    image: product.mainImage?.asset?.url ?? undefined,
    url: `${siteUrl}/produk/${product.slug}`,
    brand: { "@type": "Brand", name: settings.legalName ?? settings.name },
  };

  return (
    <>
      <section className="mx-auto max-w-7xl px-4 pt-32 pb-16 sm:px-6 sm:pt-36">
        <Breadcrumbs
          tone="dark"
          items={[
            { href: "/", label: "Beranda" },
            { href: "/produk", label: "Produk" },
            ...(category ? [{ href: `/kategori/${category.slug}`, label: category.name ?? "" }] : []),
            { label: product.title ?? "" },
          ]}
        />

        <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="hero-in">
            <ProductGallery product={product} gallery={product.gallery ?? []} />
          </div>

          <div className="lg:sticky lg:top-28 lg:self-start">
            {category && (
              <Link
                href={`/kategori/${category.slug}`}
                className="font-mono text-[11px] tracking-[0.28em] text-brand uppercase hover:underline"
              >
                {category.title}
              </Link>
            )}
            <h1 className="mt-4 text-[clamp(2.25rem,5vw,4rem)] leading-[1] font-semibold tracking-[-0.04em] text-balance text-ink">
              {product.title}
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-muted">{product.excerpt}</p>

            <div className="mt-8 rounded-2xl bg-card p-6 ring-1 ring-line">
              <p className="text-sm text-muted">Harga</p>
              <p className="mt-1 text-xl font-semibold tracking-tight text-ink">Hubungi kami untuk penawaran terbaik</p>
              <p className="mt-1 text-sm text-muted">Harga menyesuaikan ukuran, spesifikasi, dan jumlah pesanan.</p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <a
                  href={waLink(settings.whatsapp?.[0]?.number, message)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-3.5 font-medium text-ink transition hover:bg-[#3be07a]"
                >
                  <WhatsAppLogo className="size-5" /> Tanya via WhatsApp
                </a>
                {phone && (
                  <a
                    href={telLink(phone)}
                    className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 font-medium text-ink ring-1 ring-line transition hover:bg-paper-2"
                  >
                    <Phone className="size-4" aria-hidden /> Telepon
                  </a>
                )}
              </div>
            </div>

            <ul className="mt-6 grid grid-cols-3 gap-3">
              {assurances.map(({ icon: Icon, text }) => (
                <li key={text} className="flex flex-col items-start gap-2 rounded-xl p-3 text-sm text-ink ring-1 ring-line">
                  <Icon className="size-4 text-brand" aria-hidden />
                  {text}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="border-t border-line bg-card">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <span className="font-mono text-[11px] tracking-[0.28em] text-muted uppercase">Deskripsi Produk</span>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-ink">
              Tentang <span className="font-display font-normal text-brand italic">{product.title}</span>
            </h2>
            <Link href="/produk" className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-ink hover:text-brand">
              <ArrowLeft className="size-4" aria-hidden /> Kembali ke katalog
            </Link>
          </div>
          <article className="prose-product lg:col-span-8">
            <RichText value={product.body} />
            {!!product.specs?.length && (
              <>
                <h3>Spesifikasi Teknis (umum)</h3>
                <table>
                  <thead>
                    <tr>
                      <th scope="col">Parameter</th>
                      <th scope="col">Detail</th>
                    </tr>
                  </thead>
                  <tbody>
                    {product.specs.map((s) => (
                      <tr key={s._key}>
                        <td>{s.label}</td>
                        <td>{s.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}
          </article>
        </div>
      </section>

      {product.related.length > 0 && category && (
        <section className="mx-auto max-w-7xl px-4 pt-20 sm:px-6 sm:pt-28">
          <div className="flex items-baseline justify-between gap-4 border-b border-line pb-4">
            <h2 className="text-2xl font-semibold tracking-tight text-ink">Produk terkait</h2>
            <Link
              href={`/kategori/${category.slug}`}
              className="inline-flex items-center gap-1 text-sm font-medium text-brand hover:underline"
            >
              Lihat {category.title} <ArrowUpRight className="size-3.5" aria-hidden />
            </Link>
          </div>
          <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {product.related.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </section>
      )}

      <CtaBand title={`Tertarik dengan ${product.title}?`} message={message} />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
    </>
  );
}
