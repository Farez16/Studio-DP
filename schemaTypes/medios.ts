import {defineArrayMember, defineField, defineType} from 'sanity'
import {ImagesIcon} from '@sanity/icons/Images'

export const medios = defineType({
  name: 'medios',
  title: 'Medios',
  type: 'document',
  icon: ImagesIcon,
  fields: [
    defineField({
      name: 'galeriaPrensa',
      title: 'Galería de prensa',
      type: 'array',
      of: [
        defineArrayMember({
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
        }),
      ],
    }),
    defineField({
      name: 'archivosDescargables',
      title: 'Archivos descargables',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'archivoDescargable',
          fields: [
            defineField({
              name: 'titulo',
              title: 'Título',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'archivo',
              title: 'Archivo',
              type: 'file',
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: {title: 'titulo'},
          },
        }),
      ],
    }),
    // mediaKitMetricas[] no se implementa: riesgo/pregunta #17 sigue abierto (02_DECISIONES.md)
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo',
    }),
  ],
  preview: {
    prepare() {
      return {title: 'Medios'}
    },
  },
})
