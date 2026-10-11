import {defineField, defineType} from 'sanity'
import {TagIcon} from '@sanity/icons/Tag'

export const category = defineType({
  name: 'category',
  title: 'Kategori',
  type: 'document',
  icon: TagIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Judul',
      type: 'string',
      description: 'Contoh: "Produk Besi"',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'name',
      title: 'Nama singkat',
      type: 'string',
      description: 'Dipakai di label & tombol filter. Contoh: "Besi"',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      options: {source: 'name'},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Deskripsi',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.required().max(220),
    }),
    defineField({
      name: 'image',
      title: 'Foto kategori',
      type: 'imageWithAlt',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'order',
      title: 'Urutan tampil',
      type: 'number',
      initialValue: 10,
    }),
  ],
  orderings: [{title: 'Urutan', name: 'order', by: [{field: 'order', direction: 'asc'}]}],
  preview: {select: {title: 'title', subtitle: 'description', media: 'image'}},
})
