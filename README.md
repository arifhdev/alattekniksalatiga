# Duta Teknik Salatiga — alattekniksalatiga.com

Rebuild situs WordPress/WooCommerce lama **Duta Teknik Salatiga** (toko alat teknik, besi & safety).

| Folder | Isi |
|---|---|
| `web/` | Situs Next.js 16 (App Router, Cache Components, Tailwind v4) |
| `studio/` | Sanity Studio (admin), di-build statis ke `web/public/admin` → tampil di **`/admin`** |

Konten (produk, kategori, foto, teks Beranda/Tentang Kami, kontak & WhatsApp) disimpan di **Sanity** — project `v7qqo7r0`, dataset `production`.

## Development

```bash
# terminal 1 — situs (http://localhost:3000)
cd web && npm install && npm run dev

# terminal 2 — admin (http://localhost:3333/admin)
cd studio && npm install && npm run dev
```

Setelah mengubah skema atau query GROQ: `cd studio && npm run typegen` (menulis `web/sanity.types.ts`).

## Deploy (Vercel)

Project Vercel `alattekniksalatiga` dengan **Root Directory `web`**. `npm run build` di `web/` membangun Studio dulu (`build:admin`) lalu Next.js.

Env var di Vercel: `SANITY_REVALIDATE_SECRET` (sama dengan secret webhook Sanity).

## Alur update konten

1. Edit & **Publish** di `/admin`.
2. Webhook Sanity → `POST /api/revalidate` → cache halaman di-refresh (±5 detik).
3. Pengunjung yang sedang membuka situs juga langsung dapat update via `<SanityLive />`.

Saat pindah ke domain sendiri, tambahkan domainnya di Vercel, lalu `cd studio && npx sanity cors add https://<domain> --credentials` dan ubah URL webhook di sanity.io/manage.

## Arsip WordPress

Konten awal diimpor dari dump WordPress: `web/scripts/wp-import/*.py` (SQL → JSON) lalu `studio/scripts/import-wordpress.ts` (JSON → Sanity, idempoten).

---

Developed by [Revelation Soft](https://revelation.co.id) · Built with Next.js & Claude
