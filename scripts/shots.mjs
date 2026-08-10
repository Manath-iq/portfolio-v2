/**
 * Скриншоты собственной страницы для визуальной проверки.
 * Прокручивает медленно, чтобы отработали IntersectionObserver'ы.
 *
 *   node scripts/shots.mjs [url] [width] [height] [prefix]
 */
import { spawn } from 'node:child_process'
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'

const URL_ = process.argv[2] || 'http://localhost:3000/'
const W = Number(process.argv[3] || 1440)
const H = Number(process.argv[4] || 900)
const PREFIX = process.argv[5] || 'desk'
const OUT = process.env.SHOTS_DIR || '/tmp/shots'
const PORT = 9333
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

class S {
  constructor(ws) { this.ws = ws; this.id = 0; this.p = new Map()
    ws.addEventListener('message', (e) => { const m = JSON.parse(e.data); const q = this.p.get(m.id)
      if (q) { this.p.delete(m.id); m.error ? q.rej(new Error(m.error.message)) : q.res(m.result) } }) }
  send(method, params = {}) { const id = ++this.id
    this.ws.send(JSON.stringify({ id, method, params }))
    return new Promise((res, rej) => this.p.set(id, { res, rej })) }
}

const chrome = spawn(CHROME, ['--headless=new', `--remote-debugging-port=${PORT}`,
  '--hide-scrollbars', '--disable-gpu', '--no-first-run',
  '--user-data-dir=/tmp/shots-profile', 'about:blank'], { stdio: 'ignore' })

for (let i = 0; i < 60; i++) { try { await fetch(`http://127.0.0.1:${PORT}/json/version`); break } catch { await sleep(250) } }

const t = await (await fetch(`http://127.0.0.1:${PORT}/json/new?${encodeURIComponent(URL_)}`, { method: 'PUT' })).json()
const ws = new WebSocket(t.webSocketDebuggerUrl)
await new Promise((r) => ws.addEventListener('open', r, { once: true }))
const s = new S(ws)

await s.send('Page.enable')
// NOJS=1 — проверка «отключить JS: страница читается, ссылки на месте, FAQ раскрыт»
if (process.env.NOJS) {
  await s.send('Emulation.setScriptExecutionDisabled', { value: true })
  await s.send('Page.reload', { ignoreCache: true })
}
await s.send('Emulation.setDeviceMetricsOverride', { width: W, height: H, deviceScaleFactor: 1, mobile: W < 768 })
await sleep(4000)

const { result } = await s.send('Runtime.evaluate', { expression: 'document.body.scrollHeight' })
const full = result.value
await mkdir(OUT, { recursive: true })

// медленная прокрутка, чтобы reveal успел отработать
for (let y = 0; y < full; y += Math.round(H / 3)) {
  await s.send('Runtime.evaluate', { expression: `window.scrollTo(0, ${y})` })
  await sleep(70)
}
await s.send('Runtime.evaluate', { expression: 'window.scrollTo(0,0)' })
await sleep(900)

let i = 0
for (let y = 0; y < full; y += H) {
  await s.send('Runtime.evaluate', { expression: `window.scrollTo(0, ${y})` })
  await sleep(750)
  const shot = await s.send('Page.captureScreenshot', { format: 'png' })
  const f = path.join(OUT, `${PREFIX}-${String(i).padStart(2, '0')}.png`)
  await writeFile(f, Buffer.from(shot.data, 'base64'))
  console.log(f)
  i++
}
chrome.kill()
