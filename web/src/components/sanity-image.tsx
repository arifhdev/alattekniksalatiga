import { Image } from "next-sanity/image";

export type SanityImageData = {
  alt?: string | null;
  hotspot?: { x?: number; y?: number } | null;
  asset?: {
    url?: string | null;
    metadata?: { lqip?: string | null; dimensions?: { width?: number | null; height?: number | null } | null } | null;
  } | null;
} | null;

type Props = {
  image: SanityImageData | undefined;
  alt?: string;
  sizes: string;
  fill?: boolean;
  priority?: boolean;
  className?: string;
};

/** next/image backed by the Sanity Image CDN, honouring the editor's hotspot and showing a blur-up LQIP. */
export function SanityImage({ image, alt, sizes, fill, priority, className }: Props) {
  const url = image?.asset?.url;
  if (!url) return null;
  const dims = image.asset?.metadata?.dimensions;
  const lqip = image.asset?.metadata?.lqip ?? undefined;
  const hotspot = image.hotspot;
  const objectPosition =
    hotspot?.x != null && hotspot?.y != null ? `${hotspot.x * 100}% ${hotspot.y * 100}%` : undefined;
  const altText = alt ?? image.alt ?? "";
  const common = {
    src: url,
    sizes,
    priority,
    className,
    placeholder: lqip ? ("blur" as const) : ("empty" as const),
    blurDataURL: lqip,
    style: objectPosition ? { objectPosition } : undefined,
  };
  if (fill) return <Image {...common} alt={altText} fill />;
  return <Image {...common} alt={altText} width={dims?.width ?? 1200} height={dims?.height ?? 900} />;
}
