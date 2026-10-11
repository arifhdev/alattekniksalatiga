import {defineArrayMember, defineField, defineType} from 'sanity'
import {UsersIcon} from '@sanity/icons/Users'

export const aboutPage = defineType({
  name: 'aboutPage',
  title: 'Tentang Kami',
  type: 'document',
  icon: UsersIcon,
  fields: [
    defineField({name: 'hero', title: 'Hero', type: 'pageHero'}),
    defineField({
      name: 'quote',
      title: 'Kutipan',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'story',
      title: 'Cerita',
      type: 'array',
      of: [
        defineArrayMember({
          name: 'storyItem',
          type: 'object',
          fields: [
            defineField({name: 'question', title: 'Judul', type: 'string'}),
            defineField({name: 'answer', title: 'Isi', type: 'text', rows: 5}),
          ],
          preview: {select: {title: 'question', subtitle: 'answer'}},
        }),
      ],
    }),
    defineField({
      name: 'photos',
      title: 'Foto',
      type: 'array',
      of: [defineArrayMember({type: 'imageWithAlt'})],
      options: {layout: 'grid'},
      validation: (rule) => rule.max(3),
    }),
    defineField({name: 'rangeHeading', title: 'Judul: Ragam produk', type: 'sectionHeading'}),
    defineField({
      name: 'productRange',
      title: 'Ragam produk',
      type: 'array',
      of: [defineArrayMember({type: 'string'})],
      options: {layout: 'tags'},
    }),
  ],
  preview: {prepare: () => ({title: 'Tentang Kami'})},
})
