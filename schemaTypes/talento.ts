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
      // Array de reglas a propósito: encadenar .warning() sobre Rule.required() bajaría
      // también el required a advertencia. Mismo motivo en el resto de los límites.
      validation: (Rule) => [
        Rule.required(),
        Rule.max(30).warning('Arriba de 30 caracteres el nombre desborda las tarjetas del roster.'),
      ],
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
      validation: (Rule) => [
        Rule.required(),
        Rule.max(40).warning(
          'Arriba de 40 caracteres la disciplina desborda las tarjetas del roster.',
        ),
      ],
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
      name: 'fotografiaHero',
      title: 'Fotografía del hero',
      type: 'image',
      options: {hotspot: true},
      description:
        'Foto de acción para el hero del perfil (apaisada). Si se deja vacía, el hero usa fotografiaPrincipal como respaldo.',
      fields: [
        defineField({
          name: 'alt',
          title: 'Texto alternativo',
          type: 'string',
          // La imagen es opcional, pero el alt deja de serlo en cuanto se carga.
          validation: (Rule) =>
            Rule.custom((alt, context) => {
              const imagen = context.parent as {asset?: {_ref?: string}} | undefined
              if (imagen?.asset?._ref && !alt) {
                return 'Escribe el texto alternativo de la foto del hero.'
              }
              return true
            }),
        }),
      ],
    }),
    defineField({
      name: 'bioCorta',
      title: 'Biografía corta',
      type: 'text',
      rows: 4,
      validation: (Rule) => [
        Rule.required(),
        Rule.max(400).warning(
          'Arriba de 400 caracteres la biografía corta deja de serlo; lo ideal es quedarse por debajo de 300.',
        ),
      ],
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
      validation: (Rule) =>
        Rule.max(120).warning('Arriba de 120 caracteres la frase deja de leerse como una cita.'),
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
              options: {
                list: [
                  {title: 'Instagram', value: 'Instagram'},
                  {title: 'TikTok', value: 'TikTok'},
                  {title: 'YouTube', value: 'YouTube'},
                  {title: 'Otro', value: 'Otro'},
                ],
                layout: 'dropdown',
              },
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'redPersonalizada',
              title: 'Nombre de la red',
              type: 'string',
              description: 'Nombre de la red, solo si elegiste Otro.',
              hidden: ({parent}) => (parent as {red?: string} | undefined)?.red !== 'Otro',
              validation: (Rule) =>
                Rule.custom((valor, context) => {
                  const hermanos = context.parent as {red?: string} | undefined
                  if (hermanos?.red === 'Otro' && !valor?.trim()) {
                    return 'Escribe el nombre de la red cuando eliges "Otro".'
                  }
                  return true
                }),
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
              description:
                'Agrega una entrada nueva cada vez que quieras actualizar los números, en vez de editar la anterior: el sitio siempre muestra la más reciente por fecha de referencia y las viejas quedan como histórico.',
              of: [
                defineArrayMember({
                  type: 'object',
                  name: 'metricaRed',
                  fields: [
                    defineField({
                      name: 'fechaReferencia',
                      title: 'Fecha de referencia',
                      type: 'date',
                      description:
                        'Fecha en la que tomaste esta captura de la métrica (ej. hoy). Es la que decide cuál entrada muestra el sitio: gana la más reciente.',
                      validation: (Rule) => Rule.required(),
                    }),
                    defineField({
                      name: 'seguidores',
                      title: 'Seguidores',
                      type: 'number',
                      description:
                        'Número completo, sin abreviar y sin separadores de miles. Ej. si tiene 82 mil seguidores, escribe 82000 — no 82, ni 82k, ni 82.661. El sitio lo abrevia solo al mostrarlo. Es el total acumulado de la cuenta, no el del período.',
                      validation: (Rule) => Rule.min(0),
                    }),
                    defineField({
                      name: 'visualizaciones',
                      title: 'Visualizaciones',
                      type: 'number',
                      description:
                        'Número completo, sin abreviar y sin separadores de miles. Ej. 2,38 millones se escribe 2380000 — no 2.38 ni 2,38M. A diferencia de los seguidores, cuenta solo el período de referencia: usa siempre el mismo (los últimos 90 días antes de la fecha de arriba) en esta cifra, en interacciones y en me gusta.',
                      validation: (Rule) => Rule.min(0),
                    }),
                    defineField({
                      name: 'interacciones',
                      title: 'Interacciones',
                      type: 'number',
                      description:
                        'Número completo, sin abreviar y sin separadores de miles. Ej. 103 mil interacciones se escribe 103000 — no 103 ni 103.136. Cuenta solo el período de referencia, el mismo que usaste en visualizaciones.',
                      validation: (Rule) => Rule.min(0),
                    }),
                    defineField({
                      name: 'meGusta',
                      title: 'Me gusta',
                      type: 'number',
                      description:
                        'Número completo, sin abreviar y sin separadores de miles. Ej. 42,8 mil me gusta se escribe 42800 — no 42.8 ni 42,8K. Cuenta solo el período de referencia, el mismo que usaste en visualizaciones.',
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
            select: {red: 'red', personalizada: 'redPersonalizada', handle: 'handle'},
            // Sin esto, toda entrada con red 'Otro' se listaría como "Otro".
            prepare: ({red, personalizada, handle}) => ({
              title: red === 'Otro' ? personalizada || red : red,
              subtitle: handle,
            }),
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
