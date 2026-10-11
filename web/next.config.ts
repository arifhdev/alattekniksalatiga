import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  // Sanity Studio is built into public/admin (see "build:admin"); serve its SPA shell for deep links
  async rewrites() {
    return {
      beforeFiles: [],
      afterFiles: [],
      fallback: [
        { source: "/admin", destination: "/admin/index.html" },
        { source: "/admin/:path*", destination: "/admin/index.html" },
      ],
    };
  },
  // keep links from the old WordPress/WooCommerce site working
  async redirects() {
    return [
      { source: "/beranda", destination: "/", permanent: true },
      { source: "/shop", destination: "/produk", permanent: true },
      { source: "/product/:slug", destination: "/produk/:slug", permanent: true },
      { source: "/product-category/:slug", destination: "/kategori/:slug", permanent: true },
      { source: "/contact", destination: "/hubungi-kami", permanent: true },
      { source: "/about-us", destination: "/tentang-kami", permanent: true },
    ];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
