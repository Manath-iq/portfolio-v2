/**
 * Скачивает woff2 из Google Fonts и раскладывает локально.
 * Из России fonts.googleapis.com отдаётся нестабильно, поэтому в рантайме
 * к чужим серверам обращений нет — только /fonts/ со своего хостинга.
 *
 * Берём ровно два сабсета: cyrillic и latin. Остальное на сайте не встречается.
 */
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'

const UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'
const OUT = path.resolve('public/fonts')
const KEEP = new Set(['cyrillic', 'latin'])

const FAMILIES = [
  { css: 'Onest:wght@400..700', family: 'Onest', slug: 'onest', weight: '400 700', style: 'normal' },
  { css: 'JetBrains+Mono:wght@400..500', family: 'JetBrains Mono', slug: 'jetbrains-mono', weight: '400 500', style: 'normal' },
  { css: 'Playfair+Display:ital,wght@1,500', family: 'Playfair Display', slug: 'playfair-italic', weight: '500', style: 'italic' },
]

await mkdir(OUT, { recursive: true })
const blocks = []

for (const f of FAMILIES) {
  const res = await fetch(`https://fonts.googleapis.com/css2?family=${f.css}&display=swap`, {
    headers: { 'User-Agent': UA },
  })
  const css = await res.text()

  // блоки идут как «/* subset */ @font-face {...}»
  const chunks = css.split('/*').slice(1)
  for (const chunk of chunks) {
    const subset = chunk.slice(0, chunk.indexOf('*/')).trim()
    if (!KEEP.has(subset)) continue
    const url = chunk.match(/url\((https:[^)]+)\)/)?.[1]
    const range = chunk.match(/unicode-range:\s*([^;]+);/)?.[1]
    if (!url || !range) continue

    const file = `${f.slug}-${subset}.woff2`
    const buf = Buffer.from(await (await fetch(url)).arrayBuffer())
    await writeFile(path.join(OUT, file), buf)
    console.log(`${file}  ${(buf.length / 1024).toFixed(1)} КБ`)

    blocks.push(
      `  {\n` +
        `    family: '${f.family}',\n` +
        `    style: '${f.style}',\n` +
        `    weight: '${f.weight}',\n` +
        `    file: '${file}',\n` +
        `    range:\n      '${range.trim()}',\n` +
        `  },`,
    )
  }
}

// Данными, а не готовым CSS: правила инлайнятся в <head> из layout.tsx, где
// путь к файлу собирается через asset() и подпуть GitHub Pages сохраняется.
// Отдельным public/fonts.css это было второй блокирующей рендер таблицей
// стилей, о которой браузер узнавал только разобрав HTML.
await writeFile(
  path.resolve('src/data/fonts.ts'),
  `/**\n` +
    ` * Сгенерировано scripts/fonts.mjs — руками не править.\n` +
    ` *\n` +
    ` * Правила инлайнятся в <head> (см. app/layout.tsx). Отдельным файлом они\n` +
    ` * были второй блокирующей рендер таблицей стилей, которую браузер\n` +
    ` * обнаруживал лишь разобрав HTML.\n` +
    ` */\n\n` +
    `export type FontFace = {\n` +
    `  family: string\n` +
    `  style: string\n` +
    `  weight: string\n` +
    `  /** Имя файла внутри /fonts/. Префикс подставляет asset(). */\n` +
    `  file: string\n` +
    `  range: string\n` +
    `}\n\n` +
    `export const FONT_FACES: FontFace[] = [\n${blocks.join('\n')}\n]\n`,
)
console.log(`\n${blocks.length} @font-face → src/data/fonts.ts`)
