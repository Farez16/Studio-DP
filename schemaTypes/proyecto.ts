import {defineArrayMember, defineField, defineType} from 'sanity'
import {RocketIcon} from '@sanity/icons/Rocket'

export const proyecto = defineType({
  name: 'proyecto',
  title: 'Proyecto',
  type: 'document',
  icon: RocketIcon,
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
      name: 'descripcion',
      title: 'Descripción',
      type: 'array',
      of: [defineArrayMember({type: 'block'})],
      validation: (Rule) => Rule.required(),
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
    defineField({
      name: 'url',
      title: 'Sitio o red social',
      type: 'url',
      validation: (Rule) => Rule.uri({scheme: ['http', 'https']}),
    }),
    defineField({
      name: 'redesSociales',
      title: 'Redes sociales',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'redSocialSimple',
          fields: [
            defineField({
              name: 'red',
              title: 'Red social',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'url',
              title: 'URL',
              type: 'url',
              validation: (Rule) => Rule.required().uri({scheme: ['http', 'https']}),
            }),
          ],
          preview: {
            select: {title: 'red', subtitle: 'url'},
          },
        }),
      ],
    }),
    defineField({
      name: 'talentosVinculados',
      title: 'Talentos vinculados',
      type: 'array',
      of: [defineArrayMember({type: 'reference', to: [{type: 'talento'}]})],
    }),
    defineField({
      name: 'notaRelacionAgencia',
      title: 'Relación con DP Agencia Deportiva',
      type: 'text',
      rows: 3,
      description:
        'Declaración corta (1-2 frases) sobre la relación del proyecto con DP Agencia Deportiva. El frontend la muestra de forma visible cuando tiene contenido (decisión #34). Para DP Team debe completarse antes de publicar.',
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo',
    }),
  ],
  preview: {
    select: {
      title: 'nombre',
      media: 'logo',
    },
  },
})
