import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { CtaBand } from "@/components/cta-band";
import { ProductCard } from "@/components/product-card";
import { PageHero } from "@/components/ui";
import { getCategories, getCategory, getCategorySlugs } from "@/sanity/fetch";

export async function generateStaticParams() {
  return getCategorySlugs();
}

export async function generateMetadata({ params }: PageProps<"/kategori/[slug]">): Promise<Metadata> {
  const category = await getCategory((await params).slug);
  if (!category) return {};
  return {
    title: `${category.title} Salatiga`,
    description: category.description,
    alternates: { canonical: `/kategori/${category.slug}` },
    openGraph: { images: category.image?.asset?.url ? [category.image.asset.url] : undefined },
  };
}

export default function CategoryPage({ params }: PageProps<"/kategori/[slug]">) {
  return (
    <Suspense fallback={<div aria-busy="true" className="min-h-[50svh] animate-pulse bg-paper-2" />}>
      <CategoryContent params={params} />
    </Suspense>
  );
}

async function CategoryContent({ params }: { params: PageProps<"/kategori/[slug]">["params"] }) {
  const [category, categories] = await Promise.all([getCategory((await params).slug), getCategories()]);
  if (!category) notFound();

  return (
    <>
      <PageHero
        eyebrow={`Kategori · ${category.products.length} produk`}
        title={category.title ?? ""}
        accent="pilihan."
        description={category.description}
        sanityImage={category.image}
        crumbs={[{ href: "/", label: "Beranda" }, { href: "/produk", label: "Produk" }, { label: category.name ?? "" }]}
      />
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <nav aria-label="Kategori lain" className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <Link
              key={c._id}
              href={`/kategori/${c.slug}`}
              aria-current={c.slug === category.slug ? "page" : undefined}
              className={`rounded-sm px-4 py-2.5 text-sm font-medium transition ${
                c.slug === category.slug ? "bg-ink text-white" : "bg-card text-ink ring-1 ring-line hover:ring-ink/30"
              }`}
            >
              {c.title}
            </Link>
          ))}
        </nav>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {category.products.map((p, i) => (
            <ProductCard key={p._id} product={p} priority={i < 4} />
          ))}
        </div>
      </section>
      <CtaBand />
    </>
  );
}
