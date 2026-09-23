import {CogIcon} from '@sanity/icons/Cog'
import {ImagesIcon} from '@sanity/icons/Images'
import type {StructureResolver} from 'sanity/structure'

/**
 * Tipos con un único documento de _id fijo (decisión #39). Se exporta desde aquí y
 * sanity.config.ts lo reutiliza para ocultarlos del menú "Crear nuevo documento" y
 * quitarles la acción de duplicar — así la lista vive en un solo lugar y no hay que
 * acordarse de actualizar dos archivos al agregar el siguiente singleton.
 */
export const SINGLETON_TYPES = new Set(['medios', 'configuracionSitio'])

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Contenido')
    .items([
      // Un singleton listado como tipo sería una lista de un solo elemento: se saca de
      // la lista genérica y abajo se le da una entrada que abre el documento directo.
      ...S.documentTypeListItems().filter((item) => !SINGLETON_TYPES.has(item.getId() ?? '')),
      S.divider(),
      S.listItem()
        .title('Medios')
        .id('medios')
        .icon(ImagesIcon)
        .child(S.document().schemaType('medios').documentId('medios')),
      S.listItem()
        .title('Configuración del sitio')
        .id('configuracionSitio')
        .icon(CogIcon)
        .child(S.document().schemaType('configuracionSitio').documentId('configuracionSitio')),
    ])
