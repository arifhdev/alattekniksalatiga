"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { waLink } from "@/lib/site";
import type { Settings } from "@/sanity/types";

const field =
  "mt-2 block w-full rounded-xl bg-paper px-4 py-3 text-[15px] text-ink ring-1 ring-line outline-none transition placeholder:text-muted/70 focus:bg-card focus:ring-2 focus:ring-brand";

export function ContactForm({ storeName, accounts }: { storeName: string; accounts: NonNullable<Settings["whatsapp"]> }) {
  const [error, setError] = useState<string | null>(null);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();
    if (!name || !message) {
      setError("Mohon isi nama dan pesan Anda.");
      return;
    }
    setError(null);
    const company = String(data.get("company") ?? "").trim();
    const phone = String(data.get("phone") ?? "").trim();
    const details = [`Nama: ${name}`];
    if (company) details.push(`Perusahaan/Proyek: ${company}`);
    if (phone) details.push(`No. HP: ${phone}`);
    const text = [`Halo ${storeName},`, "", message, "", ...details].join("\n");
    window.open(waLink(String(data.get("to") ?? accounts[0]?.number), text), "_blank", "noopener,noreferrer");
  }

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-5 sm:grid-cols-2">
      <label className="block text-sm font-medium text-ink">
        Nama <span className="text-brand">*</span>
        <input name="name" required autoComplete="name" className={field} placeholder="Nama lengkap" />
      </label>
      <label className="block text-sm font-medium text-ink">
        No. HP / WhatsApp
        <input name="phone" type="tel" autoComplete="tel" inputMode="tel" className={field} placeholder="08xx-xxxx-xxxx" />
      </label>
      <label className="block text-sm font-medium text-ink sm:col-span-2">
        Perusahaan / Proyek
        <input name="company" autoComplete="organization" className={field} placeholder="Opsional" />
      </label>
      <label className="block text-sm font-medium text-ink sm:col-span-2">
        Pesan <span className="text-brand">*</span>
        <textarea
          name="message"
          required
          rows={5}
          className={field}
          placeholder="Contoh: Butuh besi beton 10mm sebanyak 100 batang, mohon info harga dan ongkir ke Semarang."
          aria-describedby={error ? "form-error" : undefined}
        />
      </label>
      <fieldset className="sm:col-span-2">
        <legend className="text-sm font-medium text-ink">Kirim ke</legend>
        <div className="mt-2 grid gap-3 sm:grid-cols-2">
          {accounts.map((w, i) => (
            <label
              key={w._key}
              className="flex cursor-pointer items-center gap-3 rounded-xl px-4 py-3 text-sm ring-1 ring-line has-[:checked]:bg-ink has-[:checked]:text-white has-[:checked]:ring-ink"
            >
              <input type="radio" name="to" value={w.number ?? ""} defaultChecked={i === 0} className="accent-brand" />
              <span>
                <span className="block font-medium">{w.label}</span>
                <span className="block opacity-70">{w.display}</span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>
      {error && (
        <p id="form-error" role="alert" className="text-sm font-medium text-red-600 sm:col-span-2">
          {error}
        </p>
      )}
      <div className="flex flex-col gap-3 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted">Pesan akan dibuka di WhatsApp agar dibalas lebih cepat.</p>
        <button
          type="submit"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-ink px-7 py-3.5 font-medium text-white transition hover:bg-brand"
        >
          Kirim Pesan <Send className="size-4" aria-hidden />
        </button>
      </div>
    </form>
  );
}
