// Business content (contact info, texts, products) lives in Sanity; this file only holds
// code-level constants and helpers.

export const siteUrl = "https://alattekniksalatiga.com";

export const nav = [
  { href: "/", label: "Beranda" },
  { href: "/produk", label: "Produk" },
  { href: "/tentang-kami", label: "Tentang Kami" },
  { href: "/hubungi-kami", label: "Hubungi Kami" },
] as const;

/** Decorative page banners shipped with the site (not editorial content). */
export const staticImages = {
  productsHero: { src: "/images/site/banner-tools.jpg", width: 1600, height: 500 },
  contactHero: { src: "/images/site/banner-helmet.jpg", width: 1600, height: 800 },
  ctaBackground: { src: "/images/site/banner-welding.jpg", width: 1600, height: 500 },
  ogDefault: { src: "/images/site/warehouse.jpg", width: 1600, height: 1067 },
  mark: { src: "/images/site/mark.png", width: 40, height: 40 },
  logo: { src: "/images/site/logo.png", width: 250, height: 40 },
} as const;

export const defaultInquiry = "Halo Duta Teknik Salatiga, saya ingin bertanya tentang produk.";

export function waLink(number: string | null | undefined, text?: string) {
  const q = text ? `?text=${encodeURIComponent(text)}` : "";
  return `https://wa.me/${number ?? ""}${q}`;
}

export function telLink(display: string) {
  return `tel:${display.replace(/[^\d+]/g, "")}`;
}

export function mapLink(geo: { lat: number | null; lng: number | null } | null | undefined, query: string) {
  const q = geo?.lat != null && geo?.lng != null ? `${geo.lat},${geo.lng}` : query;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
}
