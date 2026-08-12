/**
 * Снимает один живой сайт в трёх ширинах — для ячейки «Адаптив» в бенто.
 * Каждая ширина снимается по-настоящему, со своей вёрсткой: на 390px у сайта
 * бургер и кнопки в столбик, и обрезанный десктопный кадр это не покажет.
 *
 * Пропорции кадров совпадают с пропорциями рамки в ячейке (16/10, 4/5, 9/16),
 * поэтому картинка встаёт в рамку целиком, без кропа. Размер файла — вдвое
 * больше, чем рамка на экране (она не шире 560px), ретина экрана тут излишня.
 *
 *   node scripts/adaptive.mjs
 */
import { spawn } from 'node:child_process'
import { mkdir, writeFile, rm } from 'node:fs/promises'
import path from 'node:path'

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const PORT = 9223
const OUT = path.resolve('public/works')
const TMP = path.resolve('.capture-tmp')

const SITE = { id: 'massage-nk', url: 'https://massage-niznek.ru/' }

const SHOTS = [
  { label: '1440', w: 1440, h: 900, mobile: false, out: 1120 },
  { label: '834', w: 834, h: 1042, mobile: true, out: 700 },
  { label: '390', w: 390, h: 693, mobile: true, out: 400 },
]

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const sh = (cmd, args) =>
  new Promise((res, rej) => {
    const p = spawn(cmd, args, { stdio: ['ignore', 'ignore', 'pipe'] })
    let err = ''
    p.stderr.on('data', (d) => (err += d))
    p.on('close', (c) => (c === 0 ? res() : rej(new Error(`${cmd} ${c}\n${err.slice(-800)}`))))
  })

class Session {
  constructor(ws) {
    this.ws = ws
    this.id = 0
    this.pending = new Map()
    ws.addEventListener('message', (e) => {
      const msg = JSON.parse(e.data)
      const p = this.pending.get(msg.id)
      if (p) {
        this.pending.delete(msg.id)
        msg.error ? p.rej(new Error(msg.error.message)) : p.res(msg.result)
      }
    })
  }
  send(method, params = {}) {
    const id = ++this.id
    this.ws.send(JSON.stringify({ id, method, params }))
    return new Promise((res, rej) => this.pending.set(id, { res, rej }))
  }
  static async open(url) {
    const r = await fetch(`http://127.0.0.1:${PORT}/json/new?${encodeURIComponent(url)}`, {
      method: 'PUT',
    })
    const target = await r.json()
    const ws = new WebSocket(target.webSocketDebuggerUrl)
    await new Promise((res, rej) => {
      ws.addEventListener('open', res, { once: true })
      ws.addEventListener('error', rej, { once: true })
    })
    const s = new Session(ws)
    s.targetId = target.id
    return s
  }
  async close() {
    this.ws.close()
    await fetch(`http://127.0.0.1:${PORT}/json/close/${this.targetId}`)
  }
}

/** Гасит анимации и ленивую загрузку — кадр должен быть детерминированным. */
const FREEZE = `
  (() => {
    const st = document.createElement('style');
    st.textContent = '*,*::before,*::after{animation-play-state:paused!important;transition:none!important;scroll-behavior:auto!important}';
    document.head.appendChild(st);
    document.querySelectorAll('img[loading="lazy"]').forEach(i => i.loading = 'eager');
    document.querySelectorAll('video').forEach(v => { v.pause(); v.currentTime = 0.1; });
  })()
`

// прокрутка туда-обратно поднимает ленивые картинки первого экрана
const WARMUP = `
  (async () => {
    for (let y = 0; y < 2400; y += 300) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 60)); }
    window.scrollTo(0, 0);
  })()
`

const chrome = spawn(
  CHROME,
  [
    '--headless=new',
    `--remote-debugging-port=${PORT}`,
    '--hide-scrollbars',
    '--disable-gpu',
    '--no-first-run',
    '--force-device-scale-factor=1',
    '--user-data-dir=' + path.join(TMP, 'profile-adaptive'),
    'about:blank',
  ],
  { stdio: 'ignore' },
)
for (let i = 0; i < 60; i++) {
  try {
    await fetch(`http://127.0.0.1:${PORT}/json/version`)
    break
  } catch {
    await sleep(250)
  }
}

await mkdir(OUT, { recursive: true })
await mkdir(TMP, { recursive: true })

try {
  for (const s of SHOTS) {
    process.stdout.write(`→ ${SITE.id} ${s.label} … `)
    const sess = await Session.open(SITE.url)
    await sess.send('Page.enable')
    await sess.send('Runtime.enable')
    await new Promise((res) => {
      const t = setTimeout(res, 25000)
      sess.ws.addEventListener('message', function h(e) {
        if (JSON.parse(e.data).method === 'Page.loadEventFired') {
          clearTimeout(t)
          sess.ws.removeEventListener('message', h)
          res()
        }
      })
    })

    await sess.send('Emulation.setDeviceMetricsOverride', {
      width: s.w,
      height: s.h,
      deviceScaleFactor: 2,
      mobile: s.mobile,
      screenWidth: s.w,
      screenHeight: s.h,
    })
    if (s.mobile) {
      await sess.send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 })
    }
    await sess.send('Runtime.evaluate', { expression: FREEZE })
    await sess.send('Runtime.evaluate', { expression: WARMUP, awaitPromise: true })
    await sleep(2000)

    const shot = await sess.send('Page.captureScreenshot', {
      format: 'png',
      captureBeyondViewport: false,
    })
    const png = path.join(TMP, `${SITE.id}-${s.label}.png`)
    await writeFile(png, Buffer.from(shot.data, 'base64'))
    await sess.close()

    await sh('cwebp', [
      '-q', '82', '-m', '6', '-quiet',
      '-resize', String(s.out), '0',
      png, '-o', path.join(OUT, `${SITE.id}-${s.label}.webp`),
    ])
    await rm(png, { force: true })
    console.log(`ok  ${s.out}px по ширине`)
  }
} finally {
  chrome.kill()
}
