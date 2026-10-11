import { cacheLife } from "next/cache";
import { client } from "./client";
import { CONTENT_TAG, sanityFetch } from "./live";
import {
  ABOUT_QUERY,
  CATEGORIES_QUERY,
  CATEGORY_QUERY,
  CATEGORY_SLUGS_QUERY,
  HOME_QUERY,
  PRODUCT_QUERY,
  PRODUCT_SLUGS_QUERY,
  PRODUCTS_QUERY,
  SETTINGS_QUERY,
} from "./queries";

// Every read goes through a 'use cache' boundary so pages stay prerendered; the cache is
// refreshed by <SanityLive /> and the publish webhook (see app/api/revalidate).

export async function getSettings() {
  "use cache";
  cacheLife("max");
  const { data } = await sanityFetch({ query: SETTINGS_QUERY, tags: [CONTENT_TAG], stega: false });
  if (!data) throw new Error('Sanity document "siteSettings" is missing');
  return data;
}

export async function getCategories() {
  "use cache";
  cacheLife("max");
  const { data } = await sanityFetch({ query: CATEGORIES_QUERY, tags: [CONTENT_TAG], stega: false });
  return data;
}

export async function getProducts() {
  "use cache";
  cacheLife("max");
  const { data } = await sanityFetch({ query: PRODUCTS_QUERY, tags: [CONTENT_TAG], stega: false });
  return data;
}

export async function getProduct(slug: string) {
  "use cache";
  cacheLife("max");
  const { data } = await sanityFetch({ query: PRODUCT_QUERY, params: { slug }, tags: [CONTENT_TAG], stega: false });
  return data;
}

export async function getCategory(slug: string) {
  "use cache";
  cacheLife("max");
  const { data } = await sanityFetch({ query: CATEGORY_QUERY, params: { slug }, tags: [CONTENT_TAG], stega: false });
  return data;
}

export async function getHome() {
  "use cache";
  cacheLife("max");
  const { data } = await sanityFetch({ query: HOME_QUERY, tags: [CONTENT_TAG], stega: false });
  return data;
}

export async function getAbout() {
  "use cache";
  cacheLife("max");
  const { data } = await sanityFetch({ query: ABOUT_QUERY, tags: [CONTENT_TAG], stega: false });
  return data;
}

// Static params read straight from the API (not the CDN) so a fresh build sees fresh slugs.
export async function getProductSlugs() {
  const rows = await client.withConfig({ useCdn: false }).fetch(PRODUCT_SLUGS_QUERY);
  return rows.flatMap((r) => (r.slug ? [{ slug: r.slug }] : []));
}

export async function getCategorySlugs() {
  const rows = await client.withConfig({ useCdn: false }).fetch(CATEGORY_SLUGS_QUERY);
  return rows.flatMap((r) => (r.slug ? [{ slug: r.slug }] : []));
}
