import {defineArrayMember, defineField, defineType} from 'sanity'
import {CogIcon} from '@sanity/icons/Cog'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Pengaturan Situs',
  type: 'document',
  icon: CogIcon,
  groups: [
    {name: 'identity', title: 'Identitas', default: true},
    {name: 'contact', title: 'Kontak'},
    {name: 'location', title: 'Lokasi'},
    {name: 'cta', title: 'Ajakan'},
  ],
  fields: [
    defineField({
      name: 'name',
      title: 'Nama toko',
      type: 'string',
      group: 'identity',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'legalName',
      title: 'Nama resmi',
      type: 'string',
      group: 'identity',
      description: 'Tampil di footer & data Google. Contoh: DUTA TEKNIK SALATIGA',
    }),
    defineField({
      name: 'description',
      title: 'Deskripsi situs (SEO)',
      type: 'text',
      rows: 3,
      group: 'identity',
      validation: (rule) => rule.required().max(200).warning('Usahakan di bawah 200 karakter'),
    }),
    defineField({
      name: 'footerText',
      title: 'Teks singkat footer',
      type: 'text',
      rows: 3,
      group: 'identity',
    }),
    defineField({
      name: 'since',
      title: 'Tahun berdiri',
      type: 'number',
      group: 'identity',
      validation: (rule) => rule.integer().min(1900).max(2100),
    }),
    defineField({
      name: 'brands',
      title: 'Merek yang dijual',
      type: 'array',
      group: 'identity',
      of: [defineArrayMember({type: 'string'})],
      options: {layout: 'tags'},
    }),
    defineField({
      name: 'phones',
      title: 'Nomor telepon',
      type: 'array',
      group: 'contact',
      of: [defineArrayMember({type: 'string'})],
    }),
    defineField({
      name: 'whatsapp',
      title: 'WhatsApp',
      type: 'array',
      group: 'contact',
      of: [
        defineArrayMember({
          name: 'whatsappAccount',
          type: 'object',
          fields: [
            defineField({name: 'label', title: 'Label', type: 'string', initialValue: 'Customer Service'}),
            defineField({
              name: 'number',
              title: 'Nomor (format internasional)',
              type: 'string',
              description: 'Tanpa +, spasi, atau tanda hubung. Contoh: 6285745624062',
              validation: (rule) =>
                rule.required().regex(/^62\d{8,13}$/, {name: 'nomor WA 62xxxxxxxx'}),
            }),
            defineField({
              name: 'display',
              title: 'Tampilan nomor',
              type: 'string',
              description: 'Contoh: 0857-4562-4062',
            }),
          ],
          preview: {select: {title: 'label', subtitle: 'display'}},
        }),
      ],
      validation: (rule) => rule.min(1),
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      group: 'contact',
      validation: (rule) => rule.email(),
    }),
    defineField({
      name: 'address',
      title: 'Alamat',
      type: 'object',
      group: 'location',
      fields: [
        defineField({name: 'street', title: 'Jalan', type: 'string'}),
        defineField({name: 'city', title: 'Kota', type: 'string'}),
        defineField({name: 'region', title: 'Provinsi', type: 'string'}),
      ],
    }),
    defineField({name: 'geo', title: 'Titik peta', type: 'geopoint', group: 'location'}),
    defineField({
      name: 'mapEmbedUrl',
      title: 'URL embed Google Maps',
      type: 'url',
      group: 'location',
      description: 'Google Maps → Bagikan → Sematkan peta → salin URL di dalam src="…"',
    }),
    defineField({
      name: 'cta',
      title: 'Ajakan (banner bawah halaman)',
      type: 'sectionHeading',
      group: 'cta',
    }),
  ],
  preview: {prepare: () => ({title: 'Pengaturan Situs'})},
})
