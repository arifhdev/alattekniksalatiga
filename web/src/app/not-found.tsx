import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <section className="grain relative flex min-h-[80svh] items-center overflow-hidden bg-ink px-4 pt-20 pb-20 text-white sm:px-6">
      <div className="hairline-grid absolute inset-0" aria-hidden />
      <div className="relative mx-auto max-w-3xl text-center">
        <p className="font-mono text-sm tracking-[0.3em] text-white/50">404</p>
        <h1 className="mt-6 text-[clamp(2.5rem,7vw,5rem)] leading-[0.98] font-semibold tracking-[-0.04em]">
          Halaman <span className="text-brand-bright">tidak ditemukan.</span>
        </h1>
        <p className="mx-auto mt-6 max-w-lg text-lg text-white/60">
          Halaman yang Anda cari mungkin sudah dipindahkan. Silakan kembali ke beranda atau jelajahi katalog produk kami.
        </p>
        <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/" className="inline-flex items-center justify-center gap-2 rounded-sm bg-white px-6 py-3.5 font-medium text-ink">
            <ArrowLeft className="size-4" aria-hidden /> Ke Beranda
          </Link>
          <Link href="/produk" className="inline-flex items-center justify-center rounded-sm border border-white/20 px-6 py-3.5 font-medium">
            Lihat Produk
          </Link>
        </div>
      </div>
    </section>
  );
}
