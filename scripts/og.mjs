/**
 * Собирает OG-картинку 1200×630 из настоящих превью работ.
 * Рендерит HTML в headless Chrome и снимает кадр — так превью в OG
 * это те же скриншоты, что и на странице, а не отдельная нарисованная картинка.
 */
import { spawn } from 'node:child_process'
import { writeFile, readFile } from 'node:fs/promises'
import path from 'node:path'

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const PORT = 9444
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

const PICKS = ['massage-nk', 'uzi-ayaz', 'baobab', 'dom-proekt']

const b64 = async (p) => (await readFile(path.resolve('public/works', p))).toString('base64')

const previews = await Promise.all(
  PICKS.map(async (id) => `data:image/webp;base64,${await b64(`${id}.webp`)}`),
)

const fontCyr = (await readFile(path.resolve('public/fonts/onest-cyrillic.woff2'))).toString('base64')
const fontLat = (await readFile(path.resolve('public/fonts/onest-latin.woff2'))).toString('base64')
const monoCyr = (await readFile(path.resolve('public/fonts/jetbrains-mono-cyrillic.woff2'))).toString('base64')

const html = `<!doctype html><meta charset="utf-8"><style>
@font-face{font-family:Onest;src:url(data:font/woff2;base64,${fontCyr}) format('woff2');unicode-range:U+0301,U+0400-045F,U+0490-0491,U+04B0-04B1,U+2116}
@font-face{font-family:Onest;src:url(data:font/woff2;base64,${fontLat}) format('woff2')}
@font-face{font-family:JB;src:url(data:font/woff2;base64,${monoCyr}) format('woff2')}
*{margin:0;padding:0;box-sizing:border-box}
body{width:1200px;height:630px;background:#0A0A0C;color:#F6F5F3;font-family:Onest,sans-serif;overflow:hidden;position:relative}
.glow{position:absolute;inset:0;background:radial-gradient(680px 420px at 50% -10%,rgba(255,77,46,.20),transparent 70%)}
.wrap{position:relative;height:100%;display:flex;flex-direction:column;justify-content:space-between;padding:56px 64px 0}
h1{font-size:64px;font-weight:600;line-height:1.02;letter-spacing:-.04em;max-width:19ch}
.i{font-family:Georgia,serif;font-style:italic;font-size:.96em}
.sub{margin-top:20px;font-family:JB,monospace;font-size:19px;color:#6C6A65;letter-spacing:.01em}
.row{display:flex;gap:18px;margin-top:36px}
.row img{width:270px;height:169px;object-fit:cover;object-position:top;border-radius:14px;border:1px solid rgba(255,255,255,.12);box-shadow:0 30px 60px -24px rgba(0,0,0,.9)}
</style>
<div class=glow></div>
<div class=wrap>
  <div>
    <h1>Я делаю сайты для бизнеса в Нижнекамске. Вот <span class=i>все</span>, которые я сделал.</h1>
    <p class=sub>от 45 000 ₽ · 7–10 дней · без агентства</p>
  </div>
  <div class=row>${previews.map((s) => `<img src="${s}">`).join('')}</div>
</div>`

const tmp = '/tmp/og.html'
await writeFile(tmp, html)

const chrome = spawn(
  CHROME,
  ['--headless=new', `--remote-debugging-port=${PORT}`, '--hide-scrollbars', '--disable-gpu',
   '--no-first-run', '--user-data-dir=/tmp/og-profile', 'about:blank'],
  { stdio: 'ignore' },
)
for (let i = 0; i < 60; i++) {
  try { await fetch(`http://127.0.0.1:${PORT}/json/version`); break } catch { await sleep(250) }
}

const t = await (await fetch(`http://127.0.0.1:${PORT}/json/new?${encodeURIComponent('file://' + tmp)}`, { method: 'PUT' })).json()
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

await send('Emulation.setDeviceMetricsOverride', { width: 1200, height: 630, deviceScaleFactor: 1, mobile: false })
await sleep(2500)
const shot = await send('Page.captureScreenshot', { format: 'png' })
await writeFile(path.resolve('public/og.png'), Buffer.from(shot.data, 'base64'))
chrome.kill()
console.log('public/og.png готов')
