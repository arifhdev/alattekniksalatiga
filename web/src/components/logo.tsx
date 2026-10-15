import Image from "next/image";
import Link from "next/link";
import { staticImages } from "@/lib/site";

export function Logo({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const mark = staticImages.mark;
  return (
    <Link href="/" className="flex items-center gap-2" aria-label="Duta Teknik Salatiga — Beranda">
      <Image src={mark.src} width={mark.width} height={mark.height} alt="" className="size-9 sm:size-10" priority />
      <span className="leading-none">
        <span
          className={`block text-[17px] font-bold tracking-tight sm:text-[19px] ${tone === "light" ? "text-white" : "text-ink"}`}
        >
          DUTA TEKNIK SALATIGA
        </span>
        <span className="mt-1 block text-[8.5px] font-semibold tracking-[0.02em] text-brand sm:text-[9.5px]">
          ALAT TEKNIK SALATIGA | TOKO BESI SALATIGA
        </span>
      </span>
    </Link>
  );
}
