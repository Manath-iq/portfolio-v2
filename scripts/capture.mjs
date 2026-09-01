/**
 * Снимает реальные скриншоты и покадровые записи скролла живых сайтов
 * через Chrome DevTools Protocol. Без зависимостей — нативный WebSocket Node 22+.
 *
 *   node scripts/capture.mjs            все работы
 *   node scripts/capture.mjs kitchen    только одну
 */
import { spawn } from 'node:child_process'
import { mkdir, writeFile, rm, readdir } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'

// Путь к Chrome по умолчанию маковский. На другой машине он передаётся
// окружением, а не правится в файле: CHROME=/путь/к/chromium node scripts/capture.mjs
const CHROME = process.env.CHROME ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const PORT = 9222
const OUT = path.resolve('public/works')
const TMP = path.resolve('.capture-tmp')

// poster — ретина 16:10, video — 720p 16:10
// Бюджет на работу: постер до 200 КБ, каждое видео до 900 КБ. Сайт, который
// в него не укладывается на общих настройках, получает свои в SITES —
// молча выпускать файл вдвое тяжелее остальных нельзя.
const QUALITY = { webp: 82, vp9: 38, h264: 30 }
const POSTER = { w: 1600, h: 1000, dsf: 2 }
const FRAME = { w: 1152, h: 720, dsf: 1 }
const FPS = 25
const SECONDS = 6
const FRAMES = FPS * SECONDS

const SITES = [
  { id: 'kuhni-mera', url: 'https://manath-iq.github.io/kitchen-template/' },
  { id: 'sportpit-sostav', url: 'https://manath-iq.github.io/sports-nutrition-/' },
  { id: 'brekety', url: 'https://manath-iq.github.io/braces_stomat/' },
  { id: 'stomatologiya-ulybka', url: 'https://manath-iq.github.io/stomatologya_template/' },
  { id: 'dom-proekt', url: 'https://manath-iq.github.io/stroika-template/' },
  { id: 'uzi-ayaz', url: 'https://manath-iq.github.io/clinic-template/' },
  { id: 'baobab', url: 'https://manath-iq.github.io/baobab-template/' },
  { id: 'alice-tour', url: 'https://manath-iq.github.io/alice_tour_template/' },
  { id: 'stary-ambar', url: 'https://manath-iq.github.io/old-ambar-site/' },
  { id: 'massage-nk', url: 'https://massage-niznek.ru/' },
  { id: 'grand-house', url: 'https://grandhouse.manath.site/' },
  // Единственный сайт со своими настройками сжатия: 12 238 px сплошной
  // фотографии и заливок в лоб. На общих 82/38/30 постер весил 254 КБ,
  // а mp4 — 1,02 МБ, то есть оба мимо бюджета.
  { id: 'dobrovet', url: 'https://manath-iq.github.io/dobrovet/',
    quality: { webp: 74, vp9: 38, h264: 32 } },
]

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const sh = (cmd, args) =>
  new Promise((res, rej) => {
    const p = spawn(cmd, args, { stdio: ['ignore', 'ignore', 'pipe'] })
    let err = ''
    p.stderr.on('data', (d) => (err += d))
    p.on('close', (c) => (c === 0 ? res() : rej(new Error(`${cmd} ${c}\n${err.slice(-800)}`))))
  })

/** Тонкая обёртка над CDP-сессией одной вкладки. */
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

async function launchChrome() {
  const proc = spawn(
    CHROME,
    [
      '--headless=new',
      `--remote-debugging-port=${PORT}`,
      '--hide-scrollbars',
      '--disable-gpu',
      '--no-first-run',
      '--force-device-scale-factor=1',
      '--user-data-dir=' + path.join(TMP, 'profile'),
      'about:blank',
    ],
    { stdio: 'ignore', detached: false },
  )
  for (let i = 0; i < 60; i++) {
    try {
      await fetch(`http://127.0.0.1:${PORT}/json/version`)
      return proc
    } catch {
      await sleep(250)
    }
  }
  throw new Error('Chrome не поднялся')
}

/** Гасит анимации и отложенную загрузку, чтобы кадры были детерминированными. */
const FREEZE = `
  (() => {
    const st = document.createElement('style');
    st.textContent = '*,*::before,*::after{animation-play-state:paused!important;transition:none!important;scroll-behavior:auto!important}';
    document.head.appendChild(st);
    document.querySelectorAll('img[loading="lazy"]').forEach(i => i.loading = 'eager');
    document.querySelectorAll('video').forEach(v => { v.pause(); v.currentTime = 0.1; });
    return document.documentElement.scrollHeight;
  })()
`

async function capture(site) {
  const s = await Session.open(site.url)
  await s.send('Page.enable')
  await s.send('Runtime.enable')

  // ждём load
  await new Promise((res) => {
    const t = setTimeout(res, 25000)
    s.ws.addEventListener('message', function h(e) {
      if (JSON.parse(e.data).method === 'Page.loadEventFired') {
        clearTimeout(t)
        s.ws.removeEventListener('message', h)
        res()
      }
    })
  })

  // --- постер, ретина
  await s.send('Emulation.setDeviceMetricsOverride', {
    width: POSTER.w,
    height: POSTER.h,
    deviceScaleFactor: POSTER.dsf,
    mobile: false,
  })
  await s.send('Runtime.evaluate', { expression: FREEZE })
  await sleep(2500)
  const shot = await s.send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false })
  await writeFile(path.join(TMP, `${site.id}.png`), Buffer.from(shot.data, 'base64'))

  // --- кадры скролла
  await s.send('Emulation.setDeviceMetricsOverride', {
    width: FRAME.w,
    height: FRAME.h,
    deviceScaleFactor: FRAME.dsf,
    mobile: false,
  })
  await s.send('Runtime.evaluate', { expression: FREEZE })
  await sleep(1200)

  const { result } = await s.send('Runtime.evaluate', {
    expression: 'Math.max(document.body.scrollHeight, document.documentElement.scrollHeight)',
  })
  const full = result.value
  // не проматываем весь сайт целиком — три-четыре экрана читаются лучше
  const travel = Math.max(0, Math.min(full - FRAME.h, FRAME.h * 3.2))
  const dir = path.join(TMP, site.id)
  await mkdir(dir, { recursive: true })

  for (let i = 0; i < FRAMES; i++) {
    // ease-in-out, чтобы прокрутка трогалась и останавливалась мягко
    const t = i / (FRAMES - 1)
    const e = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
    await s.send('Runtime.evaluate', { expression: `window.scrollTo(0, ${Math.round(travel * e)})` })
    const f = await s.send('Page.captureScreenshot', { format: 'jpeg', quality: 92 })
    await writeFile(path.join(dir, String(i).padStart(4, '0') + '.jpg'), Buffer.from(f.data, 'base64'))
  }

  await s.close()
  return { full, travel }
}

async function encode(site) {
  const dir = path.join(TMP, site.id)
  const glob = path.join(dir, '%04d.jpg')
  const q = { ...QUALITY, ...site.quality }

  await sh('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', String(FPS), '-i', glob,
    '-c:v', 'libvpx-vp9', '-b:v', '0', '-crf', String(q.vp9), '-row-mt', '1', '-pix_fmt', 'yuv420p',
    '-an', path.join(OUT, `${site.id}.webm`)])

  await sh('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', String(FPS), '-i', glob,
    '-c:v', 'libx264', '-crf', String(q.h264), '-preset', 'slow', '-profile:v', 'main',
    '-pix_fmt', 'yuv420p', '-movflags', '+faststart', '-an', path.join(OUT, `${site.id}.mp4`)])

  // постер: ретина ×2 -> webp
  await sh('cwebp', ['-q', String(q.webp), '-m', '6', '-quiet',
    path.join(TMP, `${site.id}.png`), '-o', path.join(OUT, `${site.id}.webp`)])
}

const only = process.argv[2]
const list = only ? SITES.filter((s) => s.id.includes(only)) : SITES

await mkdir(OUT, { recursive: true })
await mkdir(TMP, { recursive: true })
const chrome = await launchChrome()
try {
  for (const site of list) {
    const t0 = Date.now()
    process.stdout.write(`→ ${site.id} … `)
    try {
      const info = await capture(site)
      await encode(site)
      await rm(path.join(TMP, site.id), { recursive: true, force: true })
      console.log(`ok  ${((Date.now() - t0) / 1000).toFixed(0)}s  страница ${info.full}px`)
    } catch (e) {
      console.log(`ОШИБКА: ${e.message}`)
    }
  }
} finally {
  chrome.kill()
}

const files = await readdir(OUT)
console.log(`\n${files.length} файлов в public/works`)
