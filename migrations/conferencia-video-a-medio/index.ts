import {at, defineMigration, patch, set, unset} from 'sanity/migrate'

/**
 * `conferencia.video` (un objeto `videoBunny`) → `conferencia.medio[]` (array de un
 * elemento, imagen o video). Mueve el objeto tal cual —`archivo`, `videoId`, `miniatura`,
 * `dimensiones` y lo que traiga— dentro del array, le agrega el `_key` que exige un
 * miembro de array, y borra `video`.
 *
 * Correr SIEMPRE primero en modo simulación, que es el modo por defecto de la CLI:
 *
 *   npx sanity migration run conferencia-video-a-medio --dataset <dataset>
 *
 * y recién después, revisada la salida, con `--no-dry-run`.
 *
 * Protecciones:
 * - Solo toca documentos con `video` definido (`filter`). Una vez migrado, el documento
 *   ya no tiene `video` y deja de coincidir: correrla dos veces no hace nada la segunda.
 * - Saltea —sin escribir y avisando por consola— los documentos cuyo `video` no sea un
 *   objeto `videoBunny`, o que ya tengan un `medio` con contenido: ahí no hay una sola
 *   respuesta correcta y no se pisa lo que el editor haya elegido.
 * - Cada patch lleva `ifRevision` con el `_rev` leído: si el documento cambió entre la
 *   lectura y la escritura (alguien editando en el Studio), la API rechaza el patch en
 *   vez de escribir sobre una versión que la migración no vio.
 */

/** Fijo y no aleatorio: así la simulación y la ejecución real producen el mismo patch. */
const KEY_MEDIO = 'videoMigrado'

export default defineMigration({
  title: 'Conferencia: video → medio[] (array de un elemento)',
  documentTypes: ['conferencia'],
  filter: 'defined(video)',

  migrate: {
    document(doc) {
      const video = doc.video
      const medio = doc.medio

      if (!video || typeof video !== 'object' || Array.isArray(video)) {
        console.warn(`SALTEADO ${doc._id}: "video" no es un objeto.`)
        return undefined
      }
      if ((video as {_type?: unknown})._type !== 'videoBunny') {
        console.warn(`SALTEADO ${doc._id}: "video" no es de tipo videoBunny.`)
        return undefined
      }
      // Un array vacío cuenta como "sin medio": es lo que deja el Studio cuando el editor
      // agrega y quita un elemento.
      if (medio !== undefined && !(Array.isArray(medio) && medio.length === 0)) {
        console.warn(`SALTEADO ${doc._id}: ya tiene "medio" con contenido; no se pisa.`)
        return undefined
      }

      return patch(
        doc._id,
        [at('medio', set([{...video, _key: KEY_MEDIO}])), at('video', unset())],
        {ifRevision: doc._rev},
      )
    },
  },
})
