import {ImagesIcon} from '@sanity/icons/Images'
import type {StructureResolver} from 'sanity/structure'

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Contenido')
    .items([
      ...S.documentTypeListItems().filter((item) => item.getId() !== 'medios'),
      S.divider(),
      S.listItem()
        .title('Medios')
        .id('medios')
        .icon(ImagesIcon)
        .child(S.document().schemaType('medios').documentId('medios')),
    ])
