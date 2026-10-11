/**
 * One-off import of the old WordPress/WooCommerce content (already converted to JSON in
 * web/src/data by web/scripts/wp-import) into the Sanity dataset.
 *
 * Idempotent: products and categories are upserted by slug, singletons by their fixed id,
 * and identical images are de-duplicated by Sanity's asset hashing.
 *
 *   npx sanity exec scripts/import-wordpress.ts --with-user-token
 */
import {createReadStream, readFileSync} from 'node:fs'
import path from 'node:path'
import {htmlToBlocks} from '@portabletext/block-tools'
import {Schema} from '@sanity/schema'
import {JSDOM} from 'jsdom'
import {getCliClient} from 'sanity/cli'
import {schemaTypes} from '../schemaTypes'

type Img = {src: string; width: number; height: number}
type LegacyProduct = {
  slug: string
  title: string
  category: string
  date: string
  excerpt: string
  html: string
  image: Img | null
  gallery: Img[]
}

const client = getCliClient({apiVersion: '2026-10-11'})
const WEB = path.resolve(process.cwd(), '../web')
const products: LegacyProduct[] = JSON.parse(
  readFileSync(path.join(WEB, 'src/data/products.json'), 'utf8'),
).products

const richTextType = Schema.compile({name: 'import', types: schemaTypes}).get('richText')

const assetCache = new Map<string, string>()
async function image(src: string, alt?: string) {
  let id = assetCache.get(src)
  if (!id) {
    const file = path.join(WEB, 'public', src)
    const asset = await client.assets.upload('image', createReadStream(file), {
      filename: path.basename(file),
    })
    id = asset._id
    assetCache.set(src, id)
  }
  return {
    _type: 'imageWithAlt',
    asset: {_type: 'reference', _ref: id},
    ...(alt ? {alt} : {}),
  }
}

const key = () => Math.random().toString(36).slice(2, 12)
const withKeys = <T extends object>(items: T[]) => items.map((item) => ({_key: key(), ...item}))

/** Pull spec tables out of the description: Portable Text has no tables. */
function splitSpecs(html: string) {
  const dom = new JSDOM(`<body>${html}</body>`)
  const doc = dom.window.document
  const specs: {label: string; value: string}[] = []
  for (const table of Array.from(doc.querySelectorAll('table'))) {
    for (const row of Array.from(table.querySelectorAll('tbody tr'))) {
      const [label, value] = Array.from(row.querySelectorAll('td')).map((td) => td.textContent?.trim() ?? '')
      if (label) specs.push({label, value})
    }
    // drop the "Spesifikasi Teknis:" lead-in paragraph that introduced the table
    const prev = table.previousElementSibling
    if (prev && /spesifikasi/i.test(prev.textContent ?? '')) prev.remove()
    table.remove()
  }
  return {html: doc.body.innerHTML, specs}
}

async function upsert(type: string, slug: string, doc: Record<string, unknown>) {
  const existing = await client.fetch<string | null>(
    `*[_type == $type && slug.current == $slug && !(_id in path("drafts.**"))][0]._id`,
    {type, slug},
  )
  const body = {_type: type, slug: {_type: 'slug', current: slug}, ...doc}
  if (existing) {
    await client.createOrReplace({_id: existing, ...body})
    return existing
  }
  const created = await client.create(body)
  return created._id
}

async function run() {
  // categories
  const categoryDefs = [
    {
      slug: 'besi',
      name: 'Besi',
      title: 'Produk Besi',
      order: 1,
      image: ['/images/site/warehouse.jpg', 'Gudang stok besi hollow dan pipa'],
      description:
        'Berbagai produk besi berkualitas untuk kebutuhan konstruksi dan industri dengan harga bersaing dan pelayanan terpercaya.',
    },
    {
      slug: 'teknik',
      name: 'Teknik',
      title: 'Produk Teknik',
      order: 2,
      image: ['/images/site/grinder-sparks.jpg', 'Memotong besi dengan gerinda'],
      description:
        'Beragam perlengkapan teknik dan peralatan industri yang andal untuk mendukung berbagai kebutuhan proyek dan usaha.',
    },
    {
      slug: 'safety',
      name: 'Safety',
      title: 'Produk Safety',
      order: 3,
      image: ['/images/site/safety-flatlay.jpg', 'Perlengkapan safety: helm, sarung tangan, sepatu'],
      description:
        'Perlengkapan safety lengkap seperti helm, rompi, sepatu, dan alat pelindung diri lainnya untuk menjamin keselamatan kerja.',
    },
  ]
  const categoryIds: Record<string, string> = {}
  for (const c of categoryDefs) {
    categoryIds[c.slug] = await upsert('category', c.slug, {
      title: c.title,
      name: c.name,
      description: c.description,
      order: c.order,
      image: await image(c.image[0], c.image[1]),
    })
    console.log('category', c.slug)
  }

  // products
  const productIds: Record<string, string> = {}
  for (const p of products) {
    const {html, specs} = splitSpecs(p.html)
    const body = htmlToBlocks(html, richTextType as never, {
      parseHtml: (h) => new JSDOM(h).window.document,
    })
    productIds[p.slug] = await upsert('product', p.slug, {
      title: p.title,
      category: {_type: 'reference', _ref: categoryIds[p.category]},
      excerpt: p.excerpt,
      publishedAt: p.date,
      mainImage: p.image ? await image(p.image.src, p.title) : undefined,
      gallery: withKeys(
        await Promise.all(p.gallery.map((g, i) => image(g.src, `${p.title} — foto ${i + 2}`))),
      ),
      body,
      specs: specs.length ? withKeys(specs.map((s) => ({_type: 'spec', ...s}))) : undefined,
    })
    console.log('product', p.slug, specs.length ? `(${specs.length} specs)` : '')
  }

  // singletons
  await client.createOrReplace({
    _id: 'siteSettings',
    _type: 'siteSettings',
    name: 'Duta Teknik Salatiga',
    legalName: 'DUTA TEKNIK SALATIGA',
    description:
      'Duta Teknik Salatiga — toko alat teknik, besi, dan perlengkapan safety terlengkap di Salatiga sejak 2000. Harga kompetitif, kualitas terjamin, eceran hingga grosir.',
    footerText:
      'Toko alat teknik, besi & safety di Salatiga. Siap melayani kebutuhan Anda dengan harga kompetitif dan kualitas yang terjamin — eceran hingga grosir.',
    since: 2000,
    brands: ['Bosch', 'Makita', 'Maktec', 'Nachi', 'Nippon', 'Einhill', 'Ryota', 'Yokohama'],
    phones: ['(0298) 321329', '(0298) 326391', '(0298) 3435685'],
    whatsapp: withKeys([
      {_type: 'whatsappAccount', label: 'Customer Service 1', number: '6285745624062', display: '0857-4562-4062'},
      {_type: 'whatsappAccount', label: 'Customer Service 2', number: '6281904838998', display: '0819-0483-8998'},
    ]),
    email: 'melita.saputra@gmail.com',
    address: {street: 'Jl. Jend. Sudirman No. 340', city: 'Salatiga', region: 'Jawa Tengah'},
    geo: {_type: 'geopoint', lat: -7.340599, lng: 110.506789},
    mapEmbedUrl:
      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3957.1183974332466!2d110.50678921387926!3d-7.340598974241849!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7a79cd843d9337%3A0x465acd93906b0434!2sJl.+Jend.+Sudirman+No.340%2C+Kota+Salatiga%2C+Jawa+Tengah!5e0!3m2!1sen!2sid!4v1465618489166',
    cta: {
      _type: 'sectionHeading',
      eyebrow: 'Respon cepat · Eceran & Grosir',
      title: 'Butuh penawaran untuk proyek Anda?',
      accent: 'Kami siap bantu.',
      description:
        'Konsultasikan spesifikasi, ketersediaan stok, dan harga terbaik langsung dengan tim kami. Pengiriman ke Salatiga dan seluruh Indonesia.',
    },
  })
  console.log('siteSettings')

  const services = ['sewa-genset', 'sewa-stamper', 'sewa-jack-hammer', 'sewa-pompa-air', 'bengkel-bubut-dan-las']
  await client.createOrReplace({
    _id: 'homePage',
    _type: 'homePage',
    hero: {
      _type: 'pageHero',
      eyebrow: 'Alat Teknik · Toko Besi · Safety — Salatiga',
      title: 'Material & perkakas yang',
      accent: 'bisa diandalkan.',
      description:
        'DUTA TEKNIK SALATIGA menyediakan besi konstruksi, alat teknik, dan perlengkapan safety berkualitas dengan harga kompetitif — melayani Salatiga hingga seluruh Indonesia sejak 2000.',
      image: await image('/images/site/grinder-sparks.jpg', 'Pekerja memotong besi dengan gerinda, percikan api'),
    },
    stats: withKeys([
      {_type: 'stat', value: '25+', label: 'Tahun melayani'},
      {_type: 'stat', value: '55+', label: 'Lini produk & jasa'},
      {_type: 'stat', value: '3', label: 'Kategori utama'},
      {_type: 'stat', value: 'Eceran–Grosir', label: 'Kirim seluruh Indonesia'},
    ]),
    pillars: withKeys([
      {_type: 'pillar', title: 'Produk Lengkap', text: 'Wide product selection — besi, perkakas teknik, hingga APD dalam satu toko.'},
      {_type: 'pillar', title: 'Terpercaya', text: 'Trusted & professional, melayani ribuan pelanggan sejak tahun 2000.'},
      {_type: 'pillar', title: 'Harga & Kualitas Terbaik', text: 'Competitive price & quality untuk eceran maupun grosir.'},
    ]),
    categoriesHeading: {
      _type: 'sectionHeading',
      eyebrow: 'Kategori',
      title: 'Tiga lini utama,',
      accent: 'satu tempat.',
      description:
        'Dari struktur baja hingga alat pelindung diri — semua kebutuhan proyek dan bengkel Anda tersedia di Duta Teknik Salatiga.',
    },
    latestHeading: {_type: 'sectionHeading', eyebrow: 'Produk Terbaru', title: 'Pilihan terbaru', accent: 'dari gudang kami.'},
    servicesHeading: {
      _type: 'sectionHeading',
      eyebrow: 'Sewa & Bengkel',
      title: 'Lebih dari toko —',
      accent: 'mitra proyek Anda.',
      description:
        'Selain penjualan, kami melayani penyewaan alat berat ringan dan jasa bengkel bubut & las untuk mendukung pekerjaan Anda.',
    },
    services: services.map((slug) => ({_key: key(), _type: 'reference', _ref: productIds[slug]})),
    aboutHeading: {
      _type: 'sectionHeading',
      eyebrow: 'Tentang Kami',
      title: 'Pusat perkakas',
      accent: 'terlengkap di Salatiga.',
      description:
        'DUTA TEKNIK SALATIGA adalah toko perkakas dan alat teknik terkemuka di Kota Salatiga. Sebagai distributor terpercaya, kami menyediakan gerinda, bor, mesin las, genset, kompresor, molen beton, hingga beragam profil besi — dengan kualitas terbaik dan harga sangat bersaing.',
    },
    aboutImage: await image('/images/products/cnp-3.jpg', 'Tumpukan stok besi hollow'),
  })
  console.log('homePage')

  await client.createOrReplace({
    _id: 'aboutPage',
    _type: 'aboutPage',
    hero: {
      _type: 'pageHero',
      eyebrow: 'Tentang Kami',
      title: 'Melayani Salatiga',
      accent: 'sejak 2000.',
      description:
        'Toko perkakas, besi, dan alat safety yang tumbuh bersama para kontraktor, bengkel, dan rumah tangga di Salatiga dan sekitarnya.',
      image: await image('/images/site/banner-workbench.jpg', 'Perkakas di atas meja kerja'),
    },
    quote: 'Perkakas berkualitas, harga yang jujur, dan pelayanan yang membuat pelanggan kembali.',
    story: withKeys([
      {
        _type: 'storyItem',
        question: 'Siapa itu Duta Teknik Salatiga?',
        answer:
          'DUTA TEKNIK SALATIGA adalah toko perkakas dan alat teknik terkemuka yang berlokasi di Kota Salatiga. Sebagai distributor alat teknik terpercaya, kami menyediakan berbagai jenis perkakas dengan kualitas terbaik dan harga yang sangat kompetitif. Kami telah melayani pelanggan dari Salatiga hingga seluruh Indonesia, menjadi solusi utama bagi kebutuhan alat teknik Anda — dengan pelayanan yang ramah dan profesional.',
      },
      {
        _type: 'storyItem',
        question: 'Apa yang kami tawarkan?',
        answer:
          'Kami menjual dan mendistribusikan beragam perkakas dan alat teknik yang memenuhi berbagai kebutuhan industri dan rumah tangga. Kami juga menyediakan berbagai merek perkakas ternama. Di sini Anda bisa menemukan perkakas sesuai kebutuhan, dengan kualitas terbaik dan harga yang sangat bersaing.',
      },
      {
        _type: 'storyItem',
        question: 'Mengapa memilih kami?',
        answer:
          'Sejak berdiri pada tahun 2000, kami telah melayani ribuan pelanggan di Kota Salatiga dan sekitarnya. Kami selalu mengutamakan kualitas produk dan harga yang terjangkau, dengan fokus utama pada kepuasan pelanggan. Kami berkomitmen menjadi pusat perbelanjaan perkakas terbesar dan terlengkap di Kota Salatiga.',
      },
    ]),
    photos: withKeys([
      await image('/images/site/banner-helmet.jpg', 'Pekerja memegang helm safety'),
      await image('/images/gallery/molen-beton.jpg', 'Molen beton di lokasi proyek'),
      await image('/images/site/banner-flatlay.jpg', 'Perkakas dan perlengkapan safety'),
    ]),
    rangeHeading: {_type: 'sectionHeading', eyebrow: 'Ragam Produk', title: 'Apa pun pekerjaannya,', accent: 'alatnya ada di sini.'},
    productRange: [
      'Gerinda Duduk', 'Bor', 'Mesin Las', 'Genset', 'Gerinda', 'Bor Listrik', 'Mesin Bubut',
      'Kompresor', 'Dongkrak', 'Katrol', 'Spray Gun', 'Mesin Pemotong Besi', 'Molen Beton', 'Jigsaw',
    ],
  })
  console.log('aboutPage')
  console.log(`done: ${products.length} products, ${assetCache.size} images`)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
