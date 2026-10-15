"use client";

import { useDeferredValue, useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import type { CategoryData, ProductCardData } from "@/sanity/types";

type Filter = string;

export function CatalogBrowser({ products, categories }: { products: ProductCardData[]; categories: CategoryData[] }) {
  const [filter, setFilter] = useState<Filter>("semua");
  const [query, setQuery] = useState("");
  const q = useDeferredValue(query.trim().toLowerCase());

  const visible = useMemo(
    () =>
      products.filter(
        (p) =>
          (filter === "semua" || p.category?.slug === filter) &&
          (!q || `${p.title} ${p.excerpt}`.toLowerCase().includes(q)),
      ),
    [products, filter, q],
  );

  const tabs: { id: Filter; label: string; count: number }[] = [
    { id: "semua", label: "Semua", count: products.length },
    ...categories.map((c) => ({
      id: c.slug ?? c._id,
      label: c.name ?? "",
      count: products.filter((p) => p.category?.slug === c.slug).length,
    })),
  ];

  return (
    <div>
      <div className="sticky top-0 z-30 -mx-4 flex flex-col gap-3 bg-paper/85 px-4 py-4 backdrop-blur-xl sm:mx-0 sm:rounded-2xl sm:px-0 md:flex-row md:items-center md:justify-between">
        <div role="tablist" aria-label="Filter kategori" className="flex gap-1.5 overflow-x-auto">
          {tabs.map((t) => (
            <button
              key={t.id}
              role="tab"
              type="button"
              aria-selected={filter === t.id}
              onClick={() => setFilter(t.id)}
              className={`inline-flex shrink-0 items-center gap-2 rounded-sm px-4 py-2.5 text-sm font-medium transition ${
                filter === t.id ? "bg-ink text-white" : "bg-card text-ink ring-1 ring-line hover:ring-ink/30"
              }`}
            >
              {t.label}
              <span className={`text-xs ${filter === t.id ? "text-white/60" : "text-muted"}`}>{t.count}</span>
            </button>
          ))}
        </div>
        <label className="relative block md:w-80">
          <span className="sr-only">Cari produk</span>
          <Search className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted" aria-hidden />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari produk, mis. pipa, helm, genset…"
            className="h-11 w-full rounded-sm bg-card pr-10 pl-11 text-[15px] text-ink ring-1 ring-line outline-none placeholder:text-muted/80 focus:ring-2 focus:ring-brand"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Hapus pencarian"
              className="absolute top-1/2 right-2 grid size-8 -translate-y-1/2 place-items-center rounded-sm text-muted hover:bg-paper-2"
            >
              <X className="size-4" />
            </button>
          )}
        </label>
      </div>

      <p className="mt-6 text-sm text-muted" aria-live="polite">
        Menampilkan {visible.length} produk
      </p>

      {visible.length > 0 ? (
        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {visible.map((p, i) => (
            <ProductCard key={p._id} product={p} priority={i < 4} />
          ))}
        </div>
      ) : (
        <div className="mt-5 rounded-3xl border border-dashed border-line px-6 py-20 text-center">
          <p className="text-lg font-medium text-ink">Produk tidak ditemukan.</p>
          <p className="mt-2 text-muted">
            Coba kata kunci lain, atau tanyakan langsung via WhatsApp — stok kami lebih banyak dari yang tampil di sini.
          </p>
        </div>
      )}
    </div>
  );
}
