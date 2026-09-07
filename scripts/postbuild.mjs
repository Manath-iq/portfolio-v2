/**
 * После next build: докладывает в out/ то, что статический экспорт не переносит,
 * и печатает вес первого экрана, чтобы бюджет из части 7 был виден сразу.
 */
import { cp, rm, stat, readdir, access, readFile } from 'node:fs/promises'
import { gzipSync } from 'node:zlib'
import path from 'node:path'

const OUT = path.resolve('out')
const PUB = path.resolve('public')

const exists = async (p) => {
  try {
    await access(p)
    return true
  } catch {
    return false
  }
}

// next export не переносит точечные файлы из public
for (const f of ['.htaccess']) {
  if (await exists(path.join(PUB, f))) {
    await cp(path.join(PUB, f), path.join(OUT, f))
    console.log(`↳ ${f} перенесён в out/`)
  }
}

/**
 * Страница 404.
 *
 * Своей not-found.tsx в проекте нет намеренно: рукописная public/404.html
 * весит 931 байт, не тянет ни React, ни шрифты — для страницы, на которую
 * попадают по ошибке, это ровно то, что нужно. Но статический экспорт всё
 * равно кладёт в out/ собственную заглушку Next и затирает ею рукописную,
 * поэтому её возвращаем на место после сборки, а не до.
 *
 * Заодно сносим out/404/ — при trailingSlash Next делает из заглушки
 * обычную страницу, и хостинг отдаёт /404/ с кодом 200. Внутри два <title>,
 * `robots: index, follow` рядом с noindex и canonical на главную: soft-404,
 * который канонизируется в самую важную страницу сайта. Проверено на боевом
 * 07.09.2026 — отдавалось именно так.
 */
if (await exists(path.join(PUB, '404.html'))) {
  await cp(path.join(PUB, '404.html'), path.join(OUT, '404.html'))
  console.log('↳ 404.html восстановлена из public/ (экспорт затирает её своей)')
}
await rm(path.join(OUT, '404'), { recursive: true, force: true })

const size = async (p) => (await exists(p) ? (await stat(p)).size : 0)
/** Сколько реально уедет по проводу: текст на хостинге отдаётся сжатым. */
const wire = async (p) => {
  if (!(await exists(p))) return 0
  const buf = await readFile(p)
  return /\.(js|css|html|svg|json|xml)$/.test(p) ? gzipSync(buf).length : buf.length
}
const kb = (n) => `${(n / 1024).toFixed(0)} КБ`

// --- бюджет первого экрана
const indexPath = path.join(OUT, 'index.html')
const html = await wire(indexPath)

// preload'ятся только кириллические сабсеты — латиница подтянется позже
const fontsDir = path.join(OUT, 'fonts')
let fonts = 0
if (await exists(fontsDir)) {
  for (const f of await readdir(fontsDir)) {
    if (f.includes('cyrillic')) fonts += await size(path.join(fontsDir, f))
  }
}

// считаем не все чанки подряд, а ровно то, на что ссылается index.html
let assets = 0
if (await exists(indexPath)) {
  const src = await readFile(indexPath, 'utf8')
  const refs = new Set(src.match(/\/_next\/static\/[^"')]+\.(?:js|css)/g) ?? [])
  for (const r of refs) assets += await wire(path.join(OUT, r.replace(/^\//, '')))
}

const hero =
  (await size(path.join(OUT, 'works/massage-nk.webp'))) +
  (await size(path.join(OUT, 'works/massage-nk.webm')))

const total = html + fonts + assets + hero

console.log('')
console.log('Первый экран, вес по проводу (текст в gzip):')
console.log(`  html      ${kb(html)}`)
console.log(`  шрифты    ${kb(fonts)}   preload, кириллица`)
console.log(`  js + css  ${kb(assets)}   то, на что ссылается index.html`)
console.log(`  медиа     ${kb(hero)}   постер + видео первой работы`)
console.log(`  ─────────────────`)
console.log(`  итого     ${kb(total)}   бюджет 900 КБ`)
if (total > 900 * 1024) console.log('  ⚠ бюджет превышен')
