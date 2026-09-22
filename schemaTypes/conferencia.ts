import {defineArrayMember, defineField, defineType} from 'sanity'
import {MicrophoneIcon} from '@sanity/icons/Microphone'

export const conferencia = defineType({
  name: 'conferencia',
  title: 'Conferencia',
  type: 'document',
  icon: MicrophoneIcon,
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
      description: 'Preventivo: la ruta pública de detalle todavía no está confirmada (decisión abierta #11).',
    }),
    defineField({
      name: 'descripcion',
      title: 'Descripción',
      type: 'array',
      of: [defineArrayMember({type: 'block'})],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'publicoObjetivo',
      title: 'Público objetivo',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'talento',
      title: 'Talento',
      type: 'reference',
      to: [{type: 'talento'}],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'apariciones',
      title: 'Apariciones',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'aparicion',
          fields: [
            defineField({
              name: 'fecha',
              title: 'Fecha',
              type: 'date',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'lugar',
              title: 'Lugar',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'ciudad',
              title: 'Ciudad',
              type: 'string',
            }),
          ],
          preview: {
            select: {title: 'lugar', subtitle: 'fecha'},
          },
        }),
      ],
    }),
    defineField({
      name: 'video',
      title: 'Video',
      type: 'videoBunny',
      description:
        'Video de la conferencia, alojado en Bunny Stream. Antes decisión abierta #12; queda resuelta: sí se admite un video por conferencia.',
    }),
    defineField({
      name: 'notaComercial',
      title: 'Nota comercial',
      type: 'string',
      description:
        'Texto corto, ej. "Cotización privada según formato, ciudad y requerimientos". Nunca un precio numérico fijo (decisión #30).',
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
      subtitle: 'publicoObjetivo',
    },
  },
})
