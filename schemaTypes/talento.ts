import {defineArrayMember, defineField, defineType} from 'sanity'
import {UserIcon} from '@sanity/icons/User'

export const talento = defineType({
  name: 'talento',
  title: 'Talento',
  type: 'document',
  icon: UserIcon,
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
      name: 'disciplina',
      title: 'Disciplina',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'ubicacion',
      title: 'Ubicación',
      type: 'string',
      description:
        'Ciudad base o de entrenamiento. Se publica públicamente solo si el deportista autoriza mostrarla.',
    }),
    defineField({
      name: 'fechaNacimiento',
      title: 'Fecha de nacimiento',
      type: 'date',
      description: 'La edad pública se calcula y se muestra siempre a partir de este dato.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'fotografiaPrincipal',
      title: 'Fotografía principal',
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
      name: 'bioCorta',
      title: 'Biografía corta',
      type: 'text',
      rows: 4,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'bioAmpliada',
      title: 'Biografía ampliada',
      type: 'array',
      of: [defineArrayMember({type: 'block'})],
    }),
    defineField({
      name: 'frase',
      title: 'Frase / filosofía',
      type: 'string',
      description:
        'Cita corta que define su carrera, ej. "Ganar antes de ganar." Opcional.',
    }),
    defineField({
      name: 'hitos',
      title: 'Hitos',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'hito',
          fields: [
            defineField({
              name: 'categoria',
              title: 'Categoría',
              type: 'string',
              options: {
                list: [
                  {title: 'Ranking', value: 'ranking'},
                  {title: 'Medallas o podios', value: 'medallas'},
                  {title: 'Récords', value: 'records'},
                  {title: 'Participaciones destacadas', value: 'participaciones'},
                  {title: 'Otro', value: 'otro'},
                ],
              },
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'medalla',
              title: 'Medalla',
              type: 'string',
              description: 'Aplica principalmente si la categoría es "Medallas o podios".',
              options: {
                list: [
                  {title: 'Oro', value: 'oro'},
                  {title: 'Plata', value: 'plata'},
                  {title: 'Bronce', value: 'bronce'},
                  {title: 'Finalista', value: 'finalista'},
                  {title: 'Participación', value: 'participacion'},
                ],
              },
            }),
            defineField({
              name: 'competencia',
              title: 'Competencia',
              type: 'string',
            }),
            defineField({
              name: 'evento',
              title: 'Evento',
              type: 'string',
            }),
            defineField({
              name: 'ciudad',
              title: 'Ciudad',
              type: 'string',
            }),
            defineField({
              name: 'anio',
              title: 'Año',
              type: 'number',
            }),
            defineField({
              name: 'descripcion',
              title: 'Descripción',
              type: 'text',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'destacado',
              title: 'Destacado',
              type: 'boolean',
              initialValue: false,
            }),
          ],
          preview: {
            select: {title: 'descripcion', subtitle: 'categoria'},
          },
        }),
      ],
      validation: (Rule) => Rule.min(1).warning('Se recomienda registrar al menos un hito.'),
    }),
    defineField({
      name: 'redesSociales',
      title: 'Redes sociales',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'redSocial',
          fields: [
            defineField({
              name: 'red',
              title: 'Red social',
              type: 'string',
              description:
                'Ej: Instagram, TikTok, YouTube. Usar el mismo nombre de forma consistente entre talentos.',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'url',
              title: 'URL',
              type: 'url',
              validation: (Rule) => Rule.required().uri({scheme: ['http', 'https']}),
            }),
            defineField({
              name: 'handle',
              title: 'Usuario / handle',
              type: 'string',
            }),
            defineField({
              name: 'metricas',
              title: 'Métricas históricas',
              type: 'array',
              of: [
                defineArrayMember({
                  type: 'object',
                  name: 'metricaRed',
                  fields: [
                    defineField({
                      name: 'fechaReferencia',
                      title: 'Fecha de referencia',
                      type: 'date',
                      validation: (Rule) => Rule.required(),
                    }),
                    defineField({
                      name: 'seguidores',
                      title: 'Seguidores',
                      type: 'number',
                      validation: (Rule) => Rule.min(0),
                    }),
                    defineField({
                      name: 'visualizaciones',
                      title: 'Visualizaciones',
                      type: 'number',
                      validation: (Rule) => Rule.min(0),
                    }),
                    defineField({
                      name: 'interacciones',
                      title: 'Interacciones',
                      type: 'number',
                      validation: (Rule) => Rule.min(0),
                    }),
                    defineField({
                      name: 'meGusta',
                      title: 'Me gusta',
                      type: 'number',
                      validation: (Rule) => Rule.min(0),
                    }),
                  ],
                  preview: {
                    select: {title: 'fechaReferencia', subtitle: 'seguidores'},
                  },
                }),
              ],
            }),
          ],
          preview: {
            select: {title: 'red', subtitle: 'handle'},
          },
        }),
      ],
      validation: (Rule) =>
        Rule.min(1).warning('Se recomienda registrar al menos una red social.'),
    }),
    defineField({
      name: 'sponsors',
      title: 'Sponsors',
      type: 'array',
      of: [defineArrayMember({type: 'reference', to: [{type: 'sponsor'}]})],
    }),
    defineField({
      name: 'galeria',
      title: 'Galería',
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
        defineArrayMember({type: 'videoBunny'}),
      ],
    }),
    defineField({
      name: 'valores',
      title: 'Valores',
      type: 'array',
      of: [defineArrayMember({type: 'string'})],
    }),
    defineField({
      name: 'conferencista',
      title: 'Conferencista',
      type: 'object',
      fields: [
        defineField({
          name: 'ofrece',
          title: '¿Ofrece conferencias?',
          type: 'boolean',
          initialValue: false,
        }),
        defineField({
          name: 'experienciaPrevia',
          title: 'Experiencia previa',
          type: 'text',
          description: 'Aplica si "¿Ofrece conferencias?" está activo.',
        }),
      ],
    }),
    defineField({
      name: 'destacadoEnInicio',
      title: 'Destacado en Inicio',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'orden',
      title: 'Orden de aparición',
      type: 'number',
      description:
        'Solo se usa si hay más de 4 talentos marcados "Destacado en Inicio" a la vez, para decidir cuáles 4 se muestran. Menor número aparece primero. Opcional.',
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo',
    }),
  ],
  preview: {
    select: {
      title: 'nombre',
      subtitle: 'disciplina',
      media: 'fotografiaPrincipal',
    },
  },
})
