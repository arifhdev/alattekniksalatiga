import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";
import { getCategories, getProducts } from "@/sanity/fetch";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [categories, products] = await Promise.all([getCategories(), getProducts()]);
  const pages = ["", "/produk", "/tentang-kami", "/hubungi-kami"].map((path) => ({
    url: `${siteUrl}${path}`,
    changeFrequency: "monthly" as const,
    priority: path === "" ? 1 : 0.8,
  }));
  return [
    ...pages,
    ...categories.map((c) => ({ url: `${siteUrl}/kategori/${c.slug}`, priority: 0.7 })),
    ...products.map((p) => ({
      url: `${siteUrl}/produk/${p.slug}`,
      lastModified: p.publishedAt ?? undefined,
      priority: 0.6,
      images: p.mainImage?.asset?.url ? [p.mainImage.asset.url] : undefined,
    })),
  ];
}
