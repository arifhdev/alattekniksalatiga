import type { Metadata } from "next";
import { CatalogBrowser } from "@/components/catalog-browser";
import { CtaBand } from "@/components/cta-band";
import { PageHero } from "@/components/ui";
import { staticImages } from "@/lib/site";
import { getCategories, getProducts } from "@/sanity/fetch";

export const metadata: Metadata = {
  title: "Produk",
  description:
    "Katalog lengkap produk besi, alat teknik, dan perlengkapan safety Duta Teknik Salatiga — IWF, pipa, besi beton, bondek, gerinda, bor, helm, sepatu safety, sewa genset, dan lainnya.",
  alternates: { canonical: "/produk" },
};

export default async function ProductsPage() {
  const [products, categories] = await Promise.all([getProducts(), getCategories()]);
  return (
    <>
      <PageHero
        eyebrow="Katalog"
        title="Semua produk"
        accent="& layanan."
        description="Besi konstruksi, perkakas teknik, perlengkapan safety, hingga penyewaan alat. Hubungi kami untuk harga dan ketersediaan stok terbaru."
        image={staticImages.productsHero}
        crumbs={[{ href: "/", label: "Beranda" }, { label: "Produk" }]}
      />
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <CatalogBrowser products={products} categories={categories} />
      </section>
      <CtaBand />
    </>
  );
}
