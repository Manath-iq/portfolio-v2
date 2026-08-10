/**
 * На GitHub Pages сайт живёт по подпути (/portfolio-v2/), на боевом домене —
 * в корне. Абсолютные пути в raw-разметке Next сам не префиксует, поэтому
 * все ссылки на файлы и внутренние страницы проходят через эту функцию.
 *
 * Префикс задаётся один раз в next.config.mjs через NEXT_PUBLIC_BASE_PATH.
 */
export const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? ''

export function asset(path: string) {
  if (!path.startsWith('/')) return path
  return `${BASE}${path}`
}
