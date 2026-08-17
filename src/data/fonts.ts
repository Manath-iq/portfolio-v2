/**
 * Сгенерировано scripts/fonts.mjs — руками не править.
 *
 * Раньше эти же правила лежали в public/fonts.css отдельным файлом. Он был
 * второй блокирующей рендер таблицей стилей, и браузер узнавал о нём только
 * разобрав HTML — то есть на круг это лишний запрос перед тем, как вообще
 * станет известно, какие шрифты нужны. Данными правила переезжают в <head>
 * инлайном, а путь собирается через asset(): подпуть GitHub Pages при этом
 * никуда не девается.
 */

export type FontFace = {
  family: string
  style: string
  weight: string
  /** Имя файла внутри /fonts/. Префикс подставляет asset(). */
  file: string
  range: string
}

export const FONT_FACES: FontFace[] = [
  {
    family: 'Onest',
    style: 'normal',
    weight: '400 700',
    file: 'onest-cyrillic.woff2',
    range:
      'U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116',
  },
  {
    family: 'Onest',
    style: 'normal',
    weight: '400 700',
    file: 'onest-latin.woff2',
    range:
      'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD',
  },
  {
    family: 'JetBrains Mono',
    style: 'normal',
    weight: '400 500',
    file: 'jetbrains-mono-cyrillic.woff2',
    range:
      'U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116',
  },
  {
    family: 'JetBrains Mono',
    style: 'normal',
    weight: '400 500',
    file: 'jetbrains-mono-latin.woff2',
    range:
      'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD',
  },
  {
    family: 'Playfair Display',
    style: 'italic',
    weight: '500',
    file: 'playfair-italic-cyrillic.woff2',
    range:
      'U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116',
  },
  {
    family: 'Playfair Display',
    style: 'italic',
    weight: '500',
    file: 'playfair-italic-latin.woff2',
    range:
      'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD',
  },
]
