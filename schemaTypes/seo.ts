import {defineField, defineType} from 'sanity'
import {SearchIcon} from '@sanity/icons/Search'

export const seo = defineType({
  name: 'seo',
  title: 'SEO',
  type: 'object',
  icon: SearchIcon,
  fields: [
    defineField({
      name: 'metaTitulo',
      title: 'Meta título',
      type: 'string',
    }),
    defineField({
      name: 'metaDescripcion',
      title: 'Meta descripción',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'imagenOG',
      title: 'Imagen Open Graph',
      type: 'image',
      options: {hotspot: true},
      description: 'Si se deja vacía, hereda la imagen principal del documento.',
    }),
  ],
})
