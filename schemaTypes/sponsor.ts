import {defineField, defineType} from 'sanity'
import {CaseIcon} from '@sanity/icons/Case'

export const sponsor = defineType({
  name: 'sponsor',
  title: 'Sponsor',
  type: 'document',
  icon: CaseIcon,
  fields: [
    defineField({
      name: 'nombre',
      title: 'Nombre',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'nombre', maxLength: 96},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'tier',
      title: 'Nivel',
      type: 'string',
      options: {
        list: [
          {title: 'Principal', value: 'principal'},
          {title: 'Suplementación', value: 'suplementacion'},
          {title: 'Aliado', value: 'aliado'},
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'url',
      title: 'Sitio o red social',
      type: 'url',
      validation: (Rule) => Rule.uri({scheme: ['http', 'https']}),
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
      description:
        'PNG con fondo transparente. El logo debe leerse sobre fondo oscuro (#131313) — si el arte original es negro, sube la versión blanca o clara. Lado mayor: entre 600 y 1500 px. Preferir horizontal.',
      fields: [
        defineField({
          name: 'alt',
          title: 'Texto alternativo',
          type: 'string',
          validation: (Rule) => Rule.required(),
        }),
      ],
      // El valor del campo solo trae el _ref del asset: las dimensiones viven en el
      // documento sanity.imageAsset, así que hay que pedirlas con el cliente que Sanity
      // expone en el contexto de validación.
      validation: (Rule) =>
        Rule.custom(async (value, context) => {
          const assetRef = (value as {asset?: {_ref?: string}} | undefined)?.asset?._ref
          if (!assetRef) return true

          const dimensiones = await context
            .getClient({apiVersion: '2026-09-21'})
            .fetch<{width: number; height: number} | null>(
              '*[_id == $id][0].metadata.dimensions{width, height}',
              {id: assetRef},
            )
          if (!dimensiones?.width || !dimensiones?.height) return true

          const ladoMayor = Math.max(dimensiones.width, dimensiones.height)
          const proporcion = dimensiones.width / dimensiones.height
          const avisos: string[] = []

          if (ladoMayor < 600) {
            avisos.push(
              `su lado mayor mide ${ladoMayor} px y se verá borroso en pantallas de alta densidad (mínimo 600)`,
            )
          } else if (ladoMayor > 1500) {
            avisos.push(
              `su lado mayor mide ${ladoMayor} px y pesa de más para el tamaño en que se muestra (máximo 1500)`,
            )
          }

          if (proporcion < 1 || proporcion > 4) {
            avisos.push(
              `su proporción ancho/alto es ${proporcion.toFixed(2)} y el espacio reservado para el logo es horizontal (se espera entre 1 y 4)`,
            )
          }

          return avisos.length > 0 ? `Revisa el logo: ${avisos.join('; ')}.` : true
        }).warning(),
    }),
  ],
  preview: {
    select: {
      title: 'nombre',
      subtitle: 'tier',
      media: 'logo',
    },
  },
})
