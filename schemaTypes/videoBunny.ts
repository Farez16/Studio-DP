import {defineField, defineType} from 'sanity'
import {PlayIcon} from '@sanity/icons/Play'

export const videoBunny = defineType({
  name: 'videoBunny',
  title: 'Video (Bunny Stream)',
  type: 'object',
  icon: PlayIcon,
  fields: [
    defineField({
      name: 'videoId',
      title: 'ID del video',
      type: 'string',
      description:
        'GUID del video en Bunny Stream (Dashboard → biblioteca de video → el video → "Video ID").',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'titulo',
      title: 'Título',
      type: 'string',
      description: 'Uso interno: accesibilidad y contexto. No necesariamente se muestra como encabezado visible.',
    }),
    defineField({
      name: 'miniatura',
      title: 'Miniatura',
      type: 'image',
      options: {hotspot: true},
      description: 'Opcional. Solo si se necesita una miniatura distinta a la que genera Bunny Stream automáticamente.',
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
  preview: {
    select: {title: 'titulo', media: 'miniatura'},
    prepare({title, media}) {
      return {title: title || 'Video (Bunny Stream)', media}
    },
  },
})
