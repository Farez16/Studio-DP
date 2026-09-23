import {defineConfig, isDev} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
import {structure} from './structure'

// Tipos singleton: una única entrada editable en el Desk, sin acción de crear
// documentos adicionales de ese tipo (decisión #39). Reutilizable para futuros
// singletons (ej. siteSettings) agregando su nombre aquí.
const singletonTypes = new Set(['medios'])

export default defineConfig({
  name: 'default',
  title: 'DP Agencia Deportiva',

  projectId: 'ugd8kors',
  dataset: 'production',

  // Vision ejecuta GROQ arbitrario contra el dataset, así que solo se registra en local.
  // `isDev` lo exporta Sanity y equivale a process.env.NODE_ENV !== 'production'. Ojo:
  // el bundler resuelve la condición y deja el array en [structureTool], pero el código
  // de Vision sigue viajando en el build — lo que desaparece es la herramienta, no el
  // peso. Para sacarlo del bundle haría falta un import dinámico.
  plugins: [structureTool({structure}), ...(isDev ? [visionTool()] : [])],

  schema: {
    types: schemaTypes,
  },

  document: {
    // Oculta los tipos singleton del menú global "Crear nuevo documento".
    newDocumentOptions: (prev, {creationContext}) => {
      if (creationContext.type === 'global') {
        return prev.filter((template) => !singletonTypes.has(template.templateId))
      }
      return prev
    },
    // Evita "Duplicar" en un singleton, que crearía un segundo documento del mismo tipo.
    actions: (prev, {schemaType}) =>
      singletonTypes.has(schemaType)
        ? prev.filter(({action}) => action !== 'duplicate')
        : prev,
  },
})
