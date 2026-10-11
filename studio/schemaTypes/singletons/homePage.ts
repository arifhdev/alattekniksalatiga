import {defineArrayMember, defineField, defineType} from 'sanity'
import {HomeIcon} from '@sanity/icons/Home'

export const homePage = defineType({
  name: 'homePage',
  title: 'Beranda',
  type: 'document',
  icon: HomeIcon,
  groups: [
    {name: 'hero', title: 'Hero', default: true},
    {name: 'sections', title: 'Bagian'},
    {name: 'about', title: 'Tentang'},
  ],
  fields: [
    defineField({name: 'hero', title: 'Hero', type: 'pageHero', group: 'hero'}),
    defineField({
      name: 'stats',
      title: 'Angka di hero',
      type: 'array',
      group: 'hero',
      of: [
        defineArrayMember({
          name: 'stat',
          type: 'object',
          fields: [
            defineField({name: 'value', title: 'Angka', type: 'string'}),
            defineField({name: 'label', title: 'Keterangan', type: 'string'}),
          ],
          preview: {select: {title: 'value', subtitle: 'label'}},
        }),
      ],
      validation: (rule) => rule.max(4),
    }),
    defineField({
      name: 'pillars',
      title: 'Keunggulan',
      type: 'array',
      group: 'sections',
      of: [
        defineArrayMember({
          name: 'pillar',
          type: 'object',
          fields: [
            defineField({name: 'title', title: 'Judul', type: 'string'}),
            defineField({name: 'text', title: 'Teks', type: 'text', rows: 2}),
          ],
          preview: {select: {title: 'title', subtitle: 'text'}},
        }),
      ],
      validation: (rule) => rule.max(3),
    }),
    defineField({name: 'categoriesHeading', title: 'Judul: Kategori', type: 'sectionHeading', group: 'sections'}),
    defineField({name: 'latestHeading', title: 'Judul: Produk Terbaru', type: 'sectionHeading', group: 'sections'}),
    defineField({name: 'servicesHeading', title: 'Judul: Sewa & Bengkel', type: 'sectionHeading', group: 'sections'}),
    defineField({
      name: 'services',
      title: 'Layanan sewa & bengkel',
      type: 'array',
      group: 'sections',
      of: [defineArrayMember({type: 'reference', to: [{type: 'product'}]})],
      validation: (rule) => rule.max(5).unique(),
    }),
    defineField({name: 'aboutHeading', title: 'Judul: Tentang', type: 'sectionHeading', group: 'about'}),
    defineField({name: 'aboutImage', title: 'Foto tentang', type: 'imageWithAlt', group: 'about'}),
  ],
  preview: {prepare: () => ({title: 'Beranda'})},
})
