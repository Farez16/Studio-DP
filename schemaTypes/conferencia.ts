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
      /**
       * Solo se pueden elegir talentos que ofrezcan conferencias. Va como filtro del
       * selector y no como validación a propósito: la idea es que un talento que no
       * las ofrece ni siquiera aparezca en la lista, en vez de dejar elegirlo y
       * rechazarlo después.
       *
       * La expresión cubre los tres casos de "no ofrece" —flag en false, objeto
       * `conferencista` vacío y documento sin ese objeto—, porque en GROQ leer un
       * campo de algo indefinido da null y `null == true` es falso.
       *
       * El filtro solo interviene al buscar: una referencia ya guardada se resuelve
       * por su `_ref`, así que si un talento deja de ofrecer conferencias, las
       * conferencias que ya lo apuntaban siguen abriéndose y editándose igual.
       */
      options: {
        filter: 'conferencista.ofrece == true',
      },
      description:
        'Solo aparecen los talentos con "¿Ofrece conferencias?" activado. Si no encuentras a alguien, actívalo primero en su ficha de Talento.',
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
