import {defineField, defineType} from 'sanity'
import {CaseIcon} from '@sanity/icons/Case'

export const sponsor = defineType({
  name: 'sponsor',
  title: 'Sponsor',
  type: 'document',
  icon: CaseIcon,
  fields: [
    defineField({
      name: 'nombre',
      title: 'Nombre',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'nombre', maxLength: 96},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'tier',
      title: 'Nivel',
      type: 'string',
      options: {
        list: [
          {title: 'Principal', value: 'principal'},
          {title: 'Suplementación', value: 'suplementacion'},
          {title: 'Aliado', value: 'aliado'},
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'url',
      title: 'Sitio o red social',
      type: 'url',
      validation: (Rule) => Rule.uri({scheme: ['http', 'https']}),
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
      fields: [
        defineField({
          name: 'alt',
          title: 'Texto alternativo',
          type: 'string',
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'nombre',
      subtitle: 'tier',
      media: 'logo',
    },
  },
})
