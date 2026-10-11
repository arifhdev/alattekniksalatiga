"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { WhatsAppLogo } from "@/components/brand-icons";
import { defaultInquiry, waLink } from "@/lib/site";
import type { Settings } from "@/sanity/types";

export function WhatsAppFab({ accounts }: { accounts: Settings["whatsapp"] }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  if (!accounts?.length) return null;

  return (
    <div ref={ref} className="fixed right-4 bottom-4 z-40 flex flex-col items-end gap-3 sm:right-6 sm:bottom-6">
      {open && (
        <div
          id="wa-panel"
          role="dialog"
          aria-label="Hubungi via WhatsApp"
          className="w-[min(20rem,calc(100vw-2rem))] overflow-hidden rounded-2xl bg-card shadow-[0_30px_80px_-20px_rgb(11_13_17/0.45)] ring-1 ring-line"
        >
          <div className="bg-[#128C7E] px-5 py-4 text-white">
            <p className="font-semibold">Butuh bantuan?</p>
            <p className="text-sm text-white/80">Chat langsung dengan tim kami.</p>
          </div>
          <ul className="p-2">
            {accounts?.map((w) => (
              <li key={w._key}>
                <a
                  href={waLink(w.number, defaultInquiry)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-xl px-3 py-3 transition hover:bg-paper"
                >
                  <span className="grid size-10 place-items-center rounded-full bg-[#25D366]/15 text-[#128C7E]">
                    <WhatsAppLogo className="size-5" />
                  </span>
                  <span>
                    <span className="block text-sm font-medium text-ink">{w.label}</span>
                    <span className="block text-sm text-muted">{w.display}</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="wa-panel"
        aria-label={open ? "Tutup panel WhatsApp" : "Chat via WhatsApp"}
        className="grid size-14 place-items-center rounded-full bg-[#25D366] text-white shadow-[0_15px_40px_-10px_rgb(37_211_102/0.7)] transition hover:scale-105 active:scale-95"
      >
        {open ? <X className="size-6" /> : <WhatsAppLogo className="size-7" />}
      </button>
    </div>
  );
}
