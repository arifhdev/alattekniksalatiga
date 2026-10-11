import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SanityImage } from "@/components/sanity-image";
import type { ProductCardData } from "@/sanity/types";

/** Product visual; products without a photo yet get a typographic plate. */
export function ProductVisual({
  product,
  sizes,
  priority,
  className = "",
}: {
  product: Pick<ProductCardData, "title" | "mainImage" | "category">;
  sizes: string;
  priority?: boolean;
  className?: string;
}) {
  if (product.mainImage?.asset?.url) {
    return (
      <SanityImage
        image={product.mainImage}
        alt={product.mainImage.alt ?? product.title ?? ""}
        fill
        sizes={sizes}
        priority={priority}
        className={`object-cover ${className}`}
      />
    );
  }
  return (
    <div
      role="img"
      aria-label={product.title ?? ""}
      className={`grain relative flex h-full w-full flex-col justify-between overflow-hidden bg-ink p-6 text-white ${className}`}
    >
      <div className="hairline-grid absolute inset-0" aria-hidden />
      <div aria-hidden className="absolute -right-1/4 -bottom-1/3 size-[90%] rounded-full bg-brand/40 blur-3xl" />
      <span className="relative font-mono text-[10px] tracking-[0.3em] text-white/50 uppercase">
        {product.category?.title}
      </span>
      <span className="relative font-display text-[clamp(1.75rem,4vw,2.75rem)] leading-[1.02] text-balance">
        {product.title}
      </span>
    </div>
  );
}

export function ProductCard({ product, priority }: { product: ProductCardData; priority?: boolean }) {
  return (
    <Link
      href={`/produk/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl bg-card ring-1 ring-line transition duration-500 hover:-translate-y-1 hover:shadow-[0_30px_60px_-30px_rgb(11_13_17/0.35)]"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-paper-2">
        <ProductVisual
          product={product}
          priority={priority}
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          className="transition duration-700 ease-out group-hover:scale-[1.04]"
        />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <span className="font-mono text-[10px] tracking-[0.25em] text-brand uppercase">{product.category?.name}</span>
        <h3 className="mt-2 text-lg font-semibold tracking-tight text-ink">{product.title}</h3>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted">{product.excerpt}</p>
        <span className="mt-auto inline-flex items-center gap-1 pt-5 text-sm font-medium text-ink">
          Lihat detail
          <ArrowUpRight
            className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            aria-hidden
          />
        </span>
      </div>
    </Link>
  );
}
