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
      hidden: ({document}) => (document as {categoria?: string} | undefined)?.categoria !== 'Otro',
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
      name: 'video',
      title: 'Video',
      type: 'array',
      description:
        'Opcional. Un video (Bunny Stream) que se muestra debajo de la portada; la portada sigue siendo obligatoria. Para quitarlo o cambiarlo, borra el elemento.',
      /**
       * Array de un solo elemento y no un objeto `videoBunny` suelto, aunque una noticia
       * lleve un único video. El motivo es poder borrarlo: el Studio no le da a un campo
       * objeto ninguna acción para vaciarlo (las únicas por defecto son copiar y pegar), y
       * `videoId` es de solo lectura. Con un objeto suelto, una vez que la Function escribe
       * el `videoId` el editor ya no puede quitar ese video ni cambiarlo — reemplazar el
       * archivo no vuelve a disparar la copia (ver `archivo` en videoBunny.ts). Borrar el
       * elemento del array es lo que sí funciona, igual que en `conferencia.medio[]`.
       *
       * A diferencia de `medio[]`, acá no hay opción de imagen: la portada es un campo
       * aparte y obligatorio porque la usan la tarjeta, el detalle y la imagen OG.
       *
       * `disableActions` por lo mismo que en `medio[]`: "duplicar" y "copiar" se saltan el
       * `max(1)`.
       */
      options: {disableActions: ['duplicate', 'copy']},
      validation: (Rule) => Rule.max(1).error('Solo se admite un video por noticia.'),
      of: [defineArrayMember({type: 'videoBunny'})],
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
