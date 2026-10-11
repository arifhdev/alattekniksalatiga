import Image from "next/image";
import Link from "next/link";
import { staticImages } from "@/lib/site";

export function Logo({ tone = "dark", since }: { tone?: "dark" | "light"; since?: number | null }) {
  const mark = staticImages.mark;
  return (
    <Link href="/" className="group flex items-center gap-3" aria-label="Duta Teknik Salatiga — Beranda">
      <span className="grid size-10 place-items-center rounded-xl bg-white shadow-sm ring-1 ring-black/5">
        <Image src={mark.src} width={mark.width} height={mark.height} alt="" className="size-7" priority />
      </span>
      <span className="leading-none">
        <span
          className={`block text-[15px] font-semibold tracking-[0.08em] ${tone === "light" ? "text-white" : "text-ink"}`}
        >
          DUTA TEKNIK
        </span>
        <span
          className={`mt-1 block font-mono text-[10px] tracking-[0.28em] uppercase ${tone === "light" ? "text-white/55" : "text-muted"}`}
        >
          {since ? `Salatiga · Sejak ${since}` : "Salatiga"}
        </span>
      </span>
    </Link>
  );
}
