import {defineField, defineType} from 'sanity'

const headingFields = [
  defineField({name: 'eyebrow', title: 'Label kecil', type: 'string'}),
  defineField({
    name: 'title',
    title: 'Judul',
    type: 'string',
    validation: (rule) => rule.required(),
  }),
  defineField({
    name: 'accent',
    title: 'Judul aksen (miring, biru)',
    type: 'string',
    description: 'Lanjutan judul yang tampil dengan huruf serif miring.',
  }),
  defineField({name: 'description', title: 'Deskripsi', type: 'text', rows: 3}),
]

export const sectionHeading = defineType({
  name: 'sectionHeading',
  title: 'Judul bagian',
  type: 'object',
  fields: headingFields,
  options: {collapsible: true, collapsed: false},
})

export const pageHero = defineType({
  name: 'pageHero',
  title: 'Hero',
  type: 'object',
  fields: [
    ...headingFields,
    defineField({
      name: 'image',
      title: 'Foto latar',
      type: 'imageWithAlt',
      validation: (rule) => rule.required(),
    }),
  ],
})
