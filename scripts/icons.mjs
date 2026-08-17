/**
 * Собирает public/apple-touch-icon.png 180×180 из того же favicon.svg.
 *
 * Зачем отдельный файл. Safari на iOS понимает в apple-touch-icon только
 * растр: SVG он игнорирует и при добавлении сайта на экран «Домой» рисует
 * вместо иконки уменьшенный скриншот страницы. Один PNG закрывает вопрос.
 *
 * Рендер через тот же headless Chrome, что и OG, — чтобы иконка собиралась
 * из единственного источника, а не рисовалась руками во второй раз.
 *
 *   node scripts/icons.mjs
 */
import { spawn } from 'node:child_process'
import { writeFile, readFile } from 'node:fs/promises'
import path from 'node:path'

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const PORT = 9445
const SIZE = 180
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

const svg = await readFile(path.resolve('public/favicon.svg'), 'utf8')

// Скругление углов Apple рисует сам поверх иконки, поэтому у растра оно
// лишнее: со скруглением поверх скругления получается сдвоенная кромка.
const flat = svg.replace(/\srx="\d+"/, '')

const html = `<!doctype html><meta charset="utf-8"><style>
*{margin:0;padding:0}
body{width:${SIZE}px;height:${SIZE}px;overflow:hidden;background:#0A0A0C}
svg{width:${SIZE}px;height:${SIZE}px;display:block}
</style>${flat}`

const tmp = '/tmp/apple-touch-icon.html'
await writeFile(tmp, html)

const chrome = spawn(
  CHROME,
  ['--headless=new', `--remote-debugging-port=${PORT}`, '--hide-scrollbars', '--disable-gpu',
   '--no-first-run', '--user-data-dir=/tmp/icons-profile', 'about:blank'],
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

await send('Emulation.setDeviceMetricsOverride', { width: SIZE, height: SIZE, deviceScaleFactor: 1, mobile: false })
await sleep(800)
const shot = await send('Page.captureScreenshot', { format: 'png' })
await writeFile(path.resolve('public/apple-touch-icon.png'), Buffer.from(shot.data, 'base64'))
chrome.kill()
console.log(`public/apple-touch-icon.png готов — ${SIZE}×${SIZE}`)
