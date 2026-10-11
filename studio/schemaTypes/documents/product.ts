import {defineArrayMember, defineField, defineType} from 'sanity'
import {PackageIcon} from '@sanity/icons/Package'

export const product = defineType({
  name: 'product',
  title: 'Produk',
  type: 'document',
  icon: PackageIcon,
  groups: [
    {name: 'main', title: 'Utama', default: true},
    {name: 'media', title: 'Foto'},
    {name: 'content', title: 'Deskripsi'},
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Nama produk',
      type: 'string',
      group: 'main',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      group: 'main',
      options: {source: 'title'},
      description: 'Alamat halaman produk: /produk/<slug>',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Kategori',
      type: 'reference',
      to: [{type: 'category'}],
      group: 'main',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'excerpt',
      title: 'Ringkasan',
      type: 'text',
      rows: 3,
      group: 'main',
      description: 'Tampil di kartu produk dan hasil pencarian Google.',
      validation: (rule) => rule.required().max(200).warning('Usahakan di bawah 200 karakter'),
    }),
    defineField({
      name: 'publishedAt',
      title: 'Tanggal terbit',
      type: 'date',
      group: 'main',
      description: 'Produk terbaru tampil lebih dulu.',
      initialValue: () => new Date().toISOString().slice(0, 10),
    }),
    defineField({
      name: 'mainImage',
      title: 'Foto utama',
      type: 'imageWithAlt',
      group: 'media',
    }),
    defineField({
      name: 'gallery',
      title: 'Foto tambahan',
      type: 'array',
      group: 'media',
      of: [defineArrayMember({type: 'imageWithAlt'})],
      options: {layout: 'grid'},
    }),
    defineField({
      name: 'body',
      title: 'Deskripsi lengkap',
      type: 'richText',
      group: 'content',
    }),
    defineField({
      name: 'specs',
      title: 'Spesifikasi',
      type: 'array',
      group: 'content',
      of: [
        defineArrayMember({
          name: 'spec',
          type: 'object',
          fields: [
            defineField({name: 'label', title: 'Parameter', type: 'string'}),
            defineField({name: 'value', title: 'Detail', type: 'string'}),
          ],
          preview: {select: {title: 'label', subtitle: 'value'}},
        }),
      ],
    }),
  ],
  orderings: [
    {title: 'Terbaru', name: 'newest', by: [{field: 'publishedAt', direction: 'desc'}]},
    {title: 'Nama A–Z', name: 'title', by: [{field: 'title', direction: 'asc'}]},
  ],
  preview: {
    select: {title: 'title', category: 'category.name', media: 'mainImage'},
    prepare: ({title, category, media}) => ({title, subtitle: category, media}),
  },
})
