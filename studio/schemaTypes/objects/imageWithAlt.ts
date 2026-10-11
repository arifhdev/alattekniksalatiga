import {defineField, defineType} from 'sanity'

export const imageWithAlt = defineType({
  name: 'imageWithAlt',
  title: 'Gambar',
  type: 'image',
  options: {hotspot: true},
  fields: [
    defineField({
      name: 'alt',
      title: 'Teks alternatif',
      type: 'string',
      description: 'Deskripsi singkat isi gambar, untuk aksesibilitas & SEO.',
    }),
  ],
})
