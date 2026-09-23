import {defineField, defineType} from 'sanity'
import {CogIcon} from '@sanity/icons/Cog'

/**
 * Singleton (mismo patrón que `medios`, decisión #39): _id fijo
 * "configuracionSitio", oculto del menú de crear y con entrada propia en el Desk.
 *
 * Existe solo para poder sobrescribir el SEO de las páginas que no son un documento
 * —Inicio y el listado /talentos—. Todo es opcional a propósito: si se deja vacío, el
 * frontend arma título, descripción e imagen a partir de los talentos publicados, así
 * que la configuración por defecto es "no tocar nada".
 */
export const configuracionSitio = defineType({
  name: 'configuracionSitio',
  title: 'Configuración del sitio',
  type: 'document',
  icon: CogIcon,
  fields: [
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo',
      description:
        'Solo para sobrescribir el SEO de Inicio y del listado de Talentos. Si se deja vacío, ambas páginas se describen solas a partir de los talentos publicados y se actualizan al agregar o quitar talentos.',
    }),
  ],
  preview: {
    prepare() {
      return {title: 'Configuración del sitio'}
    },
  },
})
