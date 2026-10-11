"use client";

import { useState } from "react";
import { ProductVisual } from "@/components/product-card";
import { SanityImage, type SanityImageData } from "@/components/sanity-image";
import type { ProductCardData } from "@/sanity/types";

type GalleryImage = NonNullable<SanityImageData> & { _key: string };

export function ProductGallery({
  product,
  gallery,
}: {
  product: Pick<ProductCardData, "title" | "mainImage" | "category">;
  gallery: GalleryImage[];
}) {
  const images: GalleryImage[] = product.mainImage?.asset?.url
    ? [{ ...product.mainImage, _key: "main" }, ...gallery.filter((g) => g.asset?.url)]
    : [];
  const [active, setActive] = useState(0);

  if (images.length === 0) {
    return (
      <div className="relative aspect-square overflow-hidden rounded-3xl">
        <ProductVisual product={product} sizes="(min-width: 1024px) 50vw, 100vw" priority />
      </div>
    );
  }

  const current = images[active];
  return (
    <div>
      <div className="relative aspect-square overflow-hidden rounded-3xl bg-card ring-1 ring-line">
        <SanityImage
          key={current._key}
          image={current}
          alt={current.alt ?? (active === 0 ? product.title ?? "" : `${product.title} — foto ${active + 1}`)}
          fill
          priority={active === 0}
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover"
        />
      </div>
      {images.length > 1 && (
        <ul className="mt-3 grid grid-cols-4 gap-3" aria-label="Foto produk">
          {images.map((img, i) => (
            <li key={img._key}>
              <button
                type="button"
                onClick={() => setActive(i)}
                aria-label={`Tampilkan foto ${i + 1}`}
                aria-pressed={i === active}
                className={`relative block aspect-square w-full overflow-hidden rounded-xl ring-2 transition ${
                  i === active ? "ring-brand" : "ring-transparent opacity-70 hover:opacity-100"
                }`}
              >
                <SanityImage image={img} alt="" fill sizes="120px" className="object-cover" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
