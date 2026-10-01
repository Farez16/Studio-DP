import {defineField, defineType} from 'sanity'
import {PlayIcon} from '@sanity/icons/Play'

/**
 * Video alojado en Bunny Stream.
 *
 * Se usa en tres lugares —`conferencia.medio[]` (máximo un elemento, imagen o video),
 * `talento.galeria[]` (mezclado con fotos) y `noticia.video[]` (máximo un elemento, solo
 * video)—, los tres como miembro de array, así que cualquier cambio acá toca los tres.
 *
 * El editor ya no escribe el GUID a mano: sube el archivo en `archivo` y una Sanity
 * Function (repo `DP-Infra`, blueprint `dp-agencia-deportiva`) se lo pasa a Bunny por
 * `POST /library/{id}/videos/fetch` y escribe el `videoId` que Bunny devuelve.
 *
 * Detalle importante de por qué esto funciona: `readOnly` es una restricción de la
 * interfaz del Studio, no del dataset. La Function escribe con su propio token y no la
 * ve, así que puede llenar `videoId` aunque el editor no pueda.
 */
export const videoBunny = defineType({
  name: 'videoBunny',
  title: 'Video (Bunny Stream)',
  type: 'object',
  icon: PlayIcon,
  fields: [
    defineField({
      name: 'archivo',
      title: 'Archivo de video',
      type: 'file',
      options: {accept: 'video/*'},
      description:
        'Subí el archivo acá y listo: al publicar se copia solo a Bunny Stream y el "ID del video" de abajo se llena por su cuenta. El archivo queda guardado también en Sanity a propósito, para poder rehacer la copia el día que se pase a la cuenta de Bunny del cliente. Para cambiar un video ya copiado no alcanza con reemplazar el archivo: borrá el bloque de video completo y creá uno nuevo.',
    }),
    defineField({
      name: 'videoId',
      title: 'ID del video en Bunny Stream',
      type: 'string',
      readOnly: true,
      /**
       * Antes era `validation: Rule.required()` y lo escribía el editor. Ya no:
       * exigirlo bloquearía publicar justamente en el momento en que todavía no puede
       * existir, porque la Function corre *después* de publicar. El campo queda visible
       * aunque no se pueda editar porque es el único indicador de que la automatización
       * corrió: si después de publicar sigue vacío, algo falló.
       */
      description:
        'Se llena automáticamente al publicar; no se escribe a mano. Si después de publicar sigue vacío, la copia a Bunny Stream falló — avisá a quien mantiene el sitio.',
    }),
    defineField({
      name: 'dimensiones',
      title: 'Dimensiones del video',
      type: 'object',
      readOnly: true,
      /**
       * Oculto, al revés que `videoId`. Ese se muestra porque es el indicador de que la
       * automatización corrió y le sirve al editor; esto es dato de máquina puro —lo usa
       * el sitio para darle al reproductor la proporción real en vez de forzar 16:9— y
       * mostrarlo solo agregaría ruido a la ficha.
       *
       * Puede estar vacío por un rato: Bunny recién sabe el ancho y el alto cuando
       * termina de codificar, y eso tarda minutos. Ver la function `bunny-stream-dimensiones`
       * en el repo DP-Infra, que las completa después. Mientras tanto el sitio cae a 16:9.
       */
      hidden: true,
      fields: [
        defineField({name: 'ancho', title: 'Ancho', type: 'number'}),
        defineField({name: 'alto', title: 'Alto', type: 'number'}),
      ],
    }),
    defineField({
      name: 'titulo',
      title: 'Título',
      type: 'string',
      description:
        'Uso interno: accesibilidad y contexto. No necesariamente se muestra como encabezado visible.',
    }),
    defineField({
      name: 'miniatura',
      title: 'Miniatura',
      type: 'image',
      options: {hotspot: true},
      /**
       * Opcional de verdad: no lleva `required`, y el `alt` obligatorio de abajo solo se
       * valida si hay imagen. Sin ella el sitio arma la miniatura automática de Bunny
       * (`https://<hostname del CDN>/<videoId>/thumbnail.jpg`, un fotograma del video) a
       * partir del `videoId`, así que hasta que la Function lo escribe no hay miniatura
       * automática y el sitio cae a su respaldo (la foto del talento en la conferencia, el
       * recuadro con el ícono de play en la galería). En la noticia no hace falta respaldo:
       * el reproductor recién se dibuja cuando hay `videoId`.
       */
      description:
        'Opcional. Si no subís una imagen, el sitio usa la miniatura automática que genera Bunny Stream (un fotograma del video). Subila solo si querés mostrar otra imagen en lugar de esa.',
      fields: [
        defineField({
          name: 'alt',
          title: 'Texto alternativo',
          type: 'string',
          validation: (Rule) => Rule.required(),
        }),
      ],
    }),
  ],
  preview: {
    select: {title: 'titulo', media: 'miniatura', videoId: 'videoId', archivo: 'archivo.asset'},
    prepare({title, media, videoId, archivo}) {
      // El subtítulo es el mismo indicador que la descripción de `videoId` promete, pero
      // legible desde la lista de la galería de talento, donde los campos no se ven.
      const estado = videoId
        ? 'en Bunny Stream'
        : archivo
          ? 'pendiente de copiar a Bunny Stream'
          : 'sin archivo'
      return {title: title || 'Video (Bunny Stream)', subtitle: estado, media}
    },
  },
})
