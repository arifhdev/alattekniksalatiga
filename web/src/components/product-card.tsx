import Link from "next/link";
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
      <span className="relative text-[clamp(1.5rem,3.5vw,2.25rem)] leading-[1.05] font-semibold text-balance">
        {product.title}
      </span>
    </div>
  );
}

export function ProductCard({ product, priority }: { product: ProductCardData; priority?: boolean }) {
  return (
    <Link
      href={`/produk/${product.slug}`}
      className="group flex flex-col border border-line bg-card transition duration-300 hover:border-brand/40 hover:shadow-[0_12px_30px_-15px_rgb(0_0_0/0.3)]"
    >
      <div className="relative aspect-square overflow-hidden bg-paper-2">
        <ProductVisual
          product={product}
          priority={priority}
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          className="transition duration-500 ease-out group-hover:scale-[1.04]"
        />
      </div>
      <h3 className="px-3 py-3 text-sm leading-snug font-semibold sm:px-4 sm:py-3.5 sm:text-[15px] text-ink transition-colors group-hover:text-brand">
        {product.title}
      </h3>
    </Link>
  );
}
