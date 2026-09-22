import {defineField, defineType} from 'sanity'
import {SearchIcon} from '@sanity/icons/Search'

export const seo = defineType({
  name: 'seo',
  title: 'SEO',
  type: 'object',
  icon: SearchIcon,
  fieldsets: [
    {
      name: 'avanzado',
      title: 'Avanzado',
      options: {collapsible: true, collapsed: true},
    },
  ],
  fields: [
    defineField({
      name: 'metaTitulo',
      title: 'Meta título',
      type: 'string',
      fieldset: 'avanzado',
    }),
    defineField({
      name: 'metaDescripcion',
      title: 'Meta descripción',
      type: 'text',
      rows: 3,
      fieldset: 'avanzado',
    }),
    defineField({
      name: 'imagenOG',
      title: 'Imagen Open Graph',
      type: 'image',
      options: {hotspot: true},
      description: 'Si se deja vacía, hereda la imagen principal del documento.',
      fieldset: 'avanzado',
    }),
  ],
})
