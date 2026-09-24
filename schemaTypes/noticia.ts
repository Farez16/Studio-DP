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
      // Array de reglas a propósito: encadenar .warning() sobre Rule.required() bajaría
      // también el required a advertencia.
      validation: (Rule) => [
        Rule.required(),
        Rule.max(90).warning(
          'Arriba de 90 caracteres el título desborda las tarjetas de noticias.',
        ),
      ],
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
        'Categoría de la noticia. Elige "Otro" y completa el campo siguiente si ninguna encaja.',
      options: {
        list: [
          {title: 'Deportes', value: 'Deportes'},
          {title: 'Conferencias', value: 'Conferencias'},
          {title: 'Proyectos', value: 'Proyectos'},
          {title: 'Institucional', value: 'Institucional'},
          {title: 'Otro', value: 'Otro'},
        ],
        layout: 'dropdown',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'categoriaPersonalizada',
      title: 'Nombre de la categoría',
      type: 'string',
      description: 'Nombre de la categoría, solo si elegiste Otro.',
      hidden: ({document}) =>
        (document as {categoria?: string} | undefined)?.categoria !== 'Otro',
      validation: (Rule) =>
        Rule.custom((valor, context) => {
          const doc = context.document as {categoria?: string} | undefined
          if (doc?.categoria === 'Otro' && !valor?.trim()) {
            return 'Escribe el nombre de la categoría cuando eliges "Otro".'
          }
          return true
        }),
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
      validation: (Rule) => [
        Rule.required(),
        Rule.max(130).error(
          'La tarjeta de noticias recorta el extracto a 3 líneas: arriba de 130 caracteres el final no se lee en el sitio.',
        ),
      ],
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
