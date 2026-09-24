import {defineField, defineType} from 'sanity'
import {CaseIcon} from '@sanity/icons/Case'

/** Versión de API del cliente de validación — la comparten las dos reglas del logo. */
const API_VERSION = '2026-09-21'

/**
 * Fracción mínima del lienzo que tiene que ocupar el arte, por lado.
 *
 * La franja de marcas del Home escala el logo por su ALTURA (h-11: 44 px) y deja el
 * ancho a la proporción del archivo, así que el margen transparente de arriba y abajo
 * se come ese presupuesto: un arte que cubre el 23% del alto se dibuja a 10 px y
 * desaparece al lado de uno recortado, por más que el archivo mida 1000 px de lado.
 *
 * 0.55 sale de medir los sponsors reales del dataset. Los sanos van de 86% a 100%
 * (UCACUE 86, Adidas 98, Pichincha 100) y los rotos de 19% a 34% (Spa Novaqua 19,
 * Fybeca 23, Bike Shop 27, Hyundai 34). El caso más ajustado que SÍ pasa es Gold
 * Nutrition, con 61% de alto porque es un logo vertical legítimo. El umbral queda
 * entonces con holgura a los dos lados —21 puntos sobre el peor sano, 21 bajo el
 * mejor roto— y no hay que reajustarlo cada vez que entra una marca nueva.
 */
const COBERTURA_MINIMA = 0.55

/**
 * Lado máximo al que se pide la imagen para medirla. No hace falta el archivo entero:
 * la caja de tinta es una medida gruesa y a 128 px el error es de ±1 px (±0.8%), muy
 * por debajo de los 21 puntos que separan un logo sano de uno roto. Bajar un
 * 2048x2048 a esto es leer 16 mil píxeles en vez de 4 millones.
 */
const LADO_MUESTREO = 128

/**
 * Alpha a partir del cual un píxel cuenta como tinta. No es 0 a propósito: los bordes
 * suavizados del arte y el halo que deja el redimensionado del CDN siembran píxeles
 * casi transparentes bastante más allá del logo, y con umbral 0 la caja de tinta se
 * estiraría hasta el borde del lienzo y no detectaría nada.
 */
const ALPHA_TINTA = 16

/**
 * Corte para no colgar la validación si el CDN no responde. Sanity espera la promesa
 * que devuelve Rule.custom: sin esto, una imagen que nunca carga deja el campo en
 * "validando" para siempre.
 */
const ESPERA_MAXIMA_MS = 8000

/**
 * Carga la imagen de forma que se le puedan leer los píxeles.
 *
 * `crossOrigin = 'anonymous'` es obligatorio: sin él el canvas queda contaminado y
 * getImageData lanza SecurityError. Con él el navegador manda cabecera Origin, y
 * cdn.sanity.io sólo responde si ese origen está en la lista CORS del proyecto
 * (localhost:3333 lo está por defecto; el Studio desplegado, tras `sanity deploy`).
 * Desde un origen que no esté en la lista devuelve 403 y la imagen no carga — por eso
 * todo fallo resuelve en null y la regla se calla, en vez de inventar una advertencia.
 */
function cargarImagen(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const imagen = new Image()
    const temporizador = setTimeout(() => resolve(null), ESPERA_MAXIMA_MS)
    const terminar = (resultado: HTMLImageElement | null) => {
      clearTimeout(temporizador)
      resolve(resultado)
    }
    imagen.crossOrigin = 'anonymous'
    imagen.onload = () => terminar(imagen)
    imagen.onerror = () => terminar(null)
    imagen.src = src
  })
}

/**
 * Fracción del lienzo que ocupa el arte, por lado: se busca la caja que encierra todos
 * los píxeles con alpha por encima del umbral y se la compara con el lienzo entero.
 *
 * Devuelve null —y no ceros— cuando no se pudo medir. Son casos distintos: "no hay
 * arte" y "no pude mirar" no se parecen en nada, y confundirlos llenaría el Studio de
 * advertencias falsas cada vez que el CDN falle o la validación corra sin navegador.
 */
async function medirCobertura(url: string): Promise<{ancho: number; alto: number} | null> {
  // La validación también corre fuera del navegador (`sanity documents validate`),
  // donde no hay DOM ni canvas que valgan. Ahí no se mide y no se avisa.
  if (typeof document === 'undefined') return null

  const imagen = await cargarImagen(`${url}?w=${LADO_MUESTREO}&h=${LADO_MUESTREO}&fit=max`)
  if (!imagen) return null

  const anchoLienzo = imagen.naturalWidth
  const altoLienzo = imagen.naturalHeight
  if (!anchoLienzo || !altoLienzo) return null

  const lienzo = document.createElement('canvas')
  lienzo.width = anchoLienzo
  lienzo.height = altoLienzo
  const contexto = lienzo.getContext('2d', {willReadFrequently: true})
  if (!contexto) return null
  contexto.drawImage(imagen, 0, 0)

  let datos: Uint8ClampedArray
  try {
    datos = contexto.getImageData(0, 0, anchoLienzo, altoLienzo).data
  } catch {
    // Canvas contaminado pese al crossOrigin (respuesta del CDN sin cabecera CORS).
    return null
  }

  let izquierda = anchoLienzo
  let derecha = -1
  let arriba = altoLienzo
  let abajo = -1
  for (let y = 0; y < altoLienzo; y++) {
    for (let x = 0; x < anchoLienzo; x++) {
      if (datos[(y * anchoLienzo + x) * 4 + 3] <= ALPHA_TINTA) continue
      if (x < izquierda) izquierda = x
      if (x > derecha) derecha = x
      if (y < arriba) arriba = y
      if (y > abajo) abajo = y
    }
  }
  // Lienzo enteramente transparente: no hay arte que medir, y avisar de "0%" sería
  // señalar un problema distinto del que busca esta regla.
  if (derecha < 0) return null

  return {
    ancho: (derecha - izquierda + 1) / anchoLienzo,
    alto: (abajo - arriba + 1) / altoLienzo,
  }
}

const porcentaje = (fraccion: number) => `${Math.round(fraccion * 100)}%`

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
        'PNG con fondo transparente. El logo debe leerse sobre fondo oscuro (#131313) — si el arte original es negro, sube la versión blanca o clara. Lado mayor: entre 600 y 1500 px. Preferir horizontal. Recorta el archivo ajustado al arte del logo — evita lienzos con mucho margen transparente alrededor, aunque el archivo en sí tenga buena resolución.',
      fields: [
        defineField({
          name: 'alt',
          title: 'Texto alternativo',
          type: 'string',
          validation: (Rule) => Rule.required(),
        }),
      ],
      // Dos reglas separadas a propósito. La primera mira los METADATOS del asset y
      // corre en cualquier parte; la segunda mira los PÍXELES y sólo puede correr en el
      // navegador. Fundirlas ataría la comprobación de resolución y proporción al DOM
      // sin necesidad: así la primera sigue avisando en `sanity documents validate`,
      // donde la segunda no tiene canvas y se abstiene.
      validation: (Rule) => [
        // El valor del campo solo trae el _ref del asset: las dimensiones viven en el
        // documento sanity.imageAsset, así que hay que pedirlas con el cliente que Sanity
        // expone en el contexto de validación.
        Rule.custom(async (value, context) => {
          const assetRef = (value as {asset?: {_ref?: string}} | undefined)?.asset?._ref
          if (!assetRef) return true

          const dimensiones = await context
            .getClient({apiVersion: API_VERSION})
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

        // Margen transparente: un archivo puede cumplir resolución y proporción y aun
        // así verse diminuto, porque el arte ocupa una porción del lienzo. Eso no está
        // en los metadatos —el asset mide 1000x1000 igual— y hay que ir a los píxeles.
        Rule.custom(async (value, context) => {
          const assetRef = (value as {asset?: {_ref?: string}} | undefined)?.asset?._ref
          if (!assetRef) return true

          const asset = await context
            .getClient({apiVersion: API_VERSION})
            .fetch<{url?: string; extension?: string} | null>('*[_id == $id][0]{url, extension}', {
              id: assetRef,
            })
          if (!asset?.url) return true
          // Un SVG es vectorial y el CDN no lo rasteriza: no hay lienzo fijo del que
          // sobre o falte margen, así que la pregunta no aplica.
          if (asset.extension === 'svg') return true

          const cobertura = await medirCobertura(asset.url)
          if (!cobertura) return true

          const escasos: string[] = []
          if (cobertura.alto < COBERTURA_MINIMA) {
            escasos.push(`el ${porcentaje(cobertura.alto)} del alto`)
          }
          if (cobertura.ancho < COBERTURA_MINIMA) {
            escasos.push(`el ${porcentaje(cobertura.ancho)} del ancho`)
          }
          if (escasos.length === 0) return true

          // La consecuencia depende del lado que falle: sobra alto y el logo se encoge;
          // sobra sólo ancho y lo que crece es el hueco entre marcas.
          const consecuencia =
            cobertura.alto < COBERTURA_MINIMA
              ? 'La franja de marcas escala el logo por su altura, así que se verá mucho más chico que los demás aunque el archivo sea grande.'
              : 'Ese margen se suma al espacio entre marcas y deja la franja más vacía de lo que debería.'

          return `Recorta el logo ajustado al arte: hoy ocupa solo ${escasos.join(' y ')} del lienzo; el resto es margen transparente. ${consecuencia}`
        }).warning(),
      ],
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
