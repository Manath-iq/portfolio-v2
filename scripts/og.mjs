/**
 * Собирает OG-картинки 1200×630 из настоящих превью работ.
 * Рендерит HTML в headless Chrome и снимает кадр — так превью в OG
 * это те же скриншоты, что и на странице, а не отдельная нарисованная картинка.
 *
 *   public/og.png            — главная
 *   public/og/<slug>.jpg     — по одной на каждую нишу
 *
 * Зачем отдельные картинки нишам. Ссылку на такую страницу кидают в WhatsApp
 * и Telegram — там превью и есть первое, что видит человек. С общей картинкой
 * все девять ниш выглядят одинаково, и «сайт для стоматологии» ничем не
 * отличается от «сайта для кофейни». Заголовок и работы здесь берутся из тех
 * же данных, что и сама страница: расходиться им неоткуда.
 *
 * Нишевые в JPEG, а не PNG: скриншоты фотографичны, разницы в превью не видно,
 * а девять файлов весят вчетверо меньше.
 *
 *   node scripts/og.mjs
 */
import { spawn } from 'node:child_process'
import { writeFile, readFile, mkdir } from 'node:fs/promises'
import path from 'node:path'

const { NICHE_PAGES } = await import('../src/data/niche-pages.ts')
const { PROJECTS } = await import('../src/data/projects.ts')

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const PORT = 9444
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

const HOME_PICKS = ['massage-nk', 'uzi-ayaz', 'baobab', 'dom-proekt']

const posterCache = new Map()
const poster = async (id) => {
  if (!posterCache.has(id)) {
    const p = PROJECTS.find((x) => x.id === id)
    const buf = await readFile(path.resolve('public', p.poster.replace(/^\//, '')))
    posterCache.set(id, `data:image/webp;base64,${buf.toString('base64')}`)
  }
  return posterCache.get(id)
}

const fontCyr = (await readFile(path.resolve('public/fonts/onest-cyrillic.woff2'))).toString('base64')
const fontLat = (await readFile(path.resolve('public/fonts/onest-latin.woff2'))).toString('base64')
const monoCyr = (await readFile(path.resolve('public/fonts/jetbrains-mono-cyrillic.woff2'))).toString('base64')

/**
 * Разметка кадра. Одна на все картинки — меняются заголовок, лид и превью.
 *
 * Лид нужен именно нишевым: у них заголовок в одну строку против трёх у
 * главной, и без него кадр разваливается на надпись сверху и полосу
 * скриншотов снизу с дырой посередине.
 */
const makeHtml = (title, sub, previews, lead = '') => `<!doctype html><meta charset="utf-8"><style>
@font-face{font-family:Onest;src:url(data:font/woff2;base64,${fontCyr}) format('woff2');unicode-range:U+0301,U+0400-045F,U+0490-0491,U+04B0-04B1,U+2116}
@font-face{font-family:Onest;src:url(data:font/woff2;base64,${fontLat}) format('woff2')}
@font-face{font-family:JB;src:url(data:font/woff2;base64,${monoCyr}) format('woff2')}
*{margin:0;padding:0;box-sizing:border-box}
body{width:1200px;height:630px;background:#0A0A0C;color:#F6F5F3;font-family:Onest,sans-serif;overflow:hidden;position:relative}
.glow{position:absolute;inset:0;background:radial-gradient(680px 420px at 50% -10%,rgba(255,77,46,.20),transparent 70%)}
.wrap{position:relative;height:100%;display:flex;flex-direction:column;justify-content:space-between;padding:56px 64px 0}
h1{font-size:${title.length > 70 ? 52 : 64}px;font-weight:600;line-height:1.02;letter-spacing:-.04em;max-width:19ch}
.i{font-family:Georgia,serif;font-style:italic;font-size:.96em}
.lead{margin-top:22px;font-size:26px;line-height:1.45;color:#A3A19C;letter-spacing:-.011em;max-width:34ch}
.sub{margin-top:20px;font-family:JB,monospace;font-size:19px;color:#85827C;letter-spacing:.01em}
.row{display:flex;gap:18px;margin-top:36px}
.row img{width:270px;height:169px;object-fit:cover;object-position:top;border-radius:14px;border:1px solid rgba(255,255,255,.12);box-shadow:0 30px 60px -24px rgba(0,0,0,.9)}
</style>
<div class=glow></div>
<div class=wrap>
  <div>
    <h1>${title}</h1>
    ${lead ? `<p class=lead>${lead}</p>` : ''}
    <p class=sub>${sub}</p>
  </div>
  <div class=row>${previews.map((s) => `<img src="${s}">`).join('')}</div>
</div>`

// ── Chrome ────────────────────────────────────────────────────────────────
const chrome = spawn(
  CHROME,
  ['--headless=new', `--remote-debugging-port=${PORT}`, '--hide-scrollbars', '--disable-gpu',
   '--no-first-run', '--user-data-dir=/tmp/og-profile', 'about:blank'],
  { stdio: 'ignore' },
)
for (let i = 0; i < 60; i++) {
  try { await fetch(`http://127.0.0.1:${PORT}/json/version`); break } catch { await sleep(250) }
}

const t = await (await fetch(`http://127.0.0.1:${PORT}/json/new?about:blank`, { method: 'PUT' })).json()
const ws = new WebSocket(t.webSocketDebuggerUrl)
await new Promise((r) => ws.addEventListener('open', r, { once: true }))

let id = 0
const pending = new Map()
ws.addEventListener('message', (e) => {
  const m = JSON.parse(e.data)
  const p = pending.get(m.id)
  if (p) { pending.delete(m.id); p(m.result) }
})
const send = (method, params = {}) => {
  const i = ++id
  ws.send(JSON.stringify({ id: i, method, params }))
  return new Promise((res) => pending.set(i, res))
}

await send('Page.enable')
await send('Emulation.setDeviceMetricsOverride', { width: 1200, height: 630, deviceScaleFactor: 1, mobile: false })

/** Один кадр: пишем html во временный файл, ждём шрифты и картинки, снимаем. */
async function shoot(html, out, format) {
  const tmp = '/tmp/og-frame.html'
  await writeFile(tmp, html)
  await send('Page.navigate', { url: `file://${tmp}?v=${Date.now()}` })
  await sleep(1400)
  const shot = await send('Page.captureScreenshot',
    format === 'jpeg' ? { format: 'jpeg', quality: 82 } : { format: 'png' })
  await writeFile(path.resolve(out), Buffer.from(shot.data, 'base64'))
  const kb = (Buffer.from(shot.data, 'base64').length / 1024).toFixed(0)
  console.log(`${out}  ${kb} КБ`)
}

// ── Главная ───────────────────────────────────────────────────────────────
await shoot(
  makeHtml(
    'Я делаю сайты для бизнеса в Нижнекамске. Вот <span class=i>все</span>, которые я сделал.',
    'от 45 000 ₽ · 7–10 дней · без агентства',
    await Promise.all(HOME_PICKS.map(poster)),
  ),
  'public/og.png',
  'png',
)

// ── Ниши ──────────────────────────────────────────────────────────────────
await mkdir(path.resolve('public/og'), { recursive: true })

for (const n of NICHE_PAGES) {
  // Работ у ниши бывает одна-две — добираем до четырёх остальными, иначе
  // нижний ряд обрывается на середине и кадр выглядит недоделанным.
  const ids = [...n.projectIds, ...PROJECTS.map((p) => p.id).filter((id) => !n.projectIds.includes(id))]
  const previews = await Promise.all(ids.slice(0, 4).map(poster))

  // Лид обрезается по границе предложения: половина фразы в превью читается
  // как оборванная мысль, а не как анонс.
  const lead = n.lead.split(/(?<=\.)\s/)[0]

  await shoot(
    makeHtml(n.h1, 'от 45 000 ₽ · 7–10 дней · без агентства', previews, lead),
    `public/og/${n.slug}.jpg`,
    'jpeg',
  )
}

chrome.kill()
console.log(`\nготово: главная + ${NICHE_PAGES.length} ниш`)
