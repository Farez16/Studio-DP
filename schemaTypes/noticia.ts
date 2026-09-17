import {defineArrayMember, defineField, defineType} from 'sanity'
import {DocumentTextIcon} from '@sanity/icons/DocumentText'

export const noticia = defineType({
  name: 'noticia',
  title: 'Noticia',
  type: 'document',
  icon: DocumentTextIcon,
  fields: [
    defineField({
      name: 'titulo',
      title: 'Título',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'titulo', maxLength: 96},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'categoria',
      title: 'Categoría',
      type: 'string',
      description:
        'Texto libre, sin lista cerrada (categorías finales aún no confirmadas). Valores en uso hoy: Deportes, Conferencias.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'fecha',
      title: 'Fecha',
      type: 'date',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'extracto',
      title: 'Extracto',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'cuerpo',
      title: 'Cuerpo',
      type: 'array',
      of: [defineArrayMember({type: 'block'})],
    }),
    defineField({
      name: 'portada',
      title: 'Portada',
      type: 'image',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          title: 'Texto alternativo',
          type: 'string',
          validation: (Rule) => Rule.required(),
        }),
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'talentosRelacionados',
      title: 'Talentos relacionados',
      type: 'array',
      of: [defineArrayMember({type: 'reference', to: [{type: 'talento'}]})],
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo',
    }),
  ],
  preview: {
    select: {
      title: 'titulo',
      subtitle: 'categoria',
      media: 'portada',
    },
  },
})
