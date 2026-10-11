import {defineArrayMember, defineField, defineType} from 'sanity'

export const richText = defineType({
  name: 'richText',
  title: 'Teks',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      styles: [
        {title: 'Paragraf', value: 'normal'},
        {title: 'Subjudul', value: 'h3'},
      ],
      lists: [
        {title: 'Poin', value: 'bullet'},
        {title: 'Nomor', value: 'number'},
      ],
      marks: {
        decorators: [
          {title: 'Tebal', value: 'strong'},
          {title: 'Miring', value: 'em'},
        ],
        annotations: [
          defineArrayMember({
            name: 'link',
            title: 'Tautan',
            type: 'object',
            fields: [
              defineField({
                name: 'href',
                title: 'URL',
                type: 'url',
                validation: (rule) =>
                  rule.uri({scheme: ['http', 'https', 'mailto', 'tel'], allowRelative: true}),
              }),
            ],
          }),
        ],
      },
    }),
  ],
})
