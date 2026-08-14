/**
 * Рисует курсоры-значки: белый кружок со знаком manath и его акцентный
 * вариант для кликабельного. Рендерит SVG в headless Chrome и снимает PNG.
 *
 * Почему PNG, а не SVG прямо в CSS: Safari курсоры в SVG не поддерживает,
 * и там курсор молча откатывался бы к системному. PNG понимают все.
 *
 * Почему две плотности: cursor умеет image-set(), и без варианта 2x значок
 * на ретине мылит — это единственная картинка, которую видно всегда.
 *
 * Горячая точка — 5,5 при кружке 1..32. Она лежит ровно на верхне-левой
 * кромке кружка, поэтому значок висит вниз-вправо от точки нажатия, как тело
 * обычной стрелки. Курсор с точкой в центре закрывал бы собой то, на что
 * наводят, — по кнопке было бы не видно, куда жмёшь.
 *
 *   node scripts/cursor.mjs
 */
import { spawn } from 'node:child_process'
import { writeFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const PORT = 9445
const OUT = path.resolve('public')
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

const LOGO =
  'M242.547 177.5L333 215.217L289.091 292.406L208.297 228.374L222.348 331H134.53L147.703 231.006L67.7875 293.283L23.8782 216.094L121.357 178.377L23 138.906L66.9093 62.5943L147.703 122.24L134.53 24H222.348L209.176 124.871L288.212 61.7171L332.122 137.151L242.547 177.5Z'

/** Кружок 30px в коробке 32 + знак внутри. Ring нужен, чтобы белый кружок
    не пропадал в светлой секции «о себе». */
const svg = ({ disc, ring, mark }) => `
<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
  <circle cx="16.5" cy="16.5" r="14.5" fill="${disc}" stroke="${ring}" stroke-width="1"/>
  <g transform="translate(16.5 16.5) scale(0.0475) translate(-178 -178)">
    <path d="${LOGO}" fill="${mark}"/>
  </g>
</svg>`

const VARIANTS = [
  // обычный: белый кружок, тёмный знак
  { name: 'cursor', disc: '#F6F5F3', ring: 'rgba(10,10,12,.30)', mark: '#0A0A0C' },
  // кликабельное: акцентный кружок, светлый знак
  { name: 'cursor-link', disc: '#FF4D2E', ring: 'rgba(255,255,255,.34)', mark: '#FFFFFF' },
]

class Session {
  constructor(ws) {
    this.ws = ws
    this.id = 0
    this.pending = new Map()
    ws.addEventListener('message', (e) => {
      const m = JSON.parse(e.data)
      const p = this.pending.get(m.id)
      if (p) {
        this.pending.delete(m.id)
        m.error ? p.rej(new Error(m.error.message)) : p.res(m.result)
      }
    })
  }
  send(method, params = {}) {
    const id = ++this.id
    this.ws.send(JSON.stringify({ id, method, params }))
    return new Promise((res, rej) => this.pending.set(id, { res, rej }))
  }
}

const chrome = spawn(
  CHROME,
  [
    '--headless=new',
    `--remote-debugging-port=${PORT}`,
    '--hide-scrollbars',
    '--disable-gpu',
    '--no-first-run',
    '--force-color-profile=srgb',
    '--user-data-dir=/tmp/cursor-profile',
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

for (const v of VARIANTS) {
  for (const scale of [1, 2]) {
    // через файл, а не data:-URL: длинный data:-URL Chrome по /json/new
    // молча не открывает и отдаёт пустую вкладку
    const tmp = path.join(tmpdir(), `cursor-${v.name}-${scale}.html`)
    await writeFile(
      tmp,
      `<!doctype html><meta charset="utf-8">
<style>html,body{margin:0;padding:0;background:transparent}svg{display:block}</style>
${svg(v)}`,
    )

    const t = await (
      await fetch(`http://127.0.0.1:${PORT}/json/new?${encodeURIComponent('file://' + tmp)}`, {
        method: 'PUT',
      })
    ).json()

    const ws = new WebSocket(t.webSocketDebuggerUrl)
    await new Promise((r) => ws.addEventListener('open', r, { once: true }))
    const s = new Session(ws)

    await s.send('Page.enable')
    await s.send('Emulation.setDeviceMetricsOverride', {
      width: 32,
      height: 32,
      deviceScaleFactor: scale,
      mobile: false,
    })
    // фон документа прозрачный, иначе кружок приедет на белом квадрате
    await s.send('Emulation.setDefaultBackgroundColorOverride', {
      color: { r: 0, g: 0, b: 0, a: 0 },
    })
    await sleep(400)

    const shot = await s.send('Page.captureScreenshot', {
      format: 'png',
      captureBeyondViewport: false,
    })

    const file = path.join(OUT, scale === 1 ? `${v.name}.png` : `${v.name}@2x.png`)
    await writeFile(file, Buffer.from(shot.data, 'base64'))
    console.log(`↳ ${file}`)

    ws.close()
    await fetch(`http://127.0.0.1:${PORT}/json/close/${t.id}`)
    await rm(tmp, { force: true })
  }
}

chrome.kill()
process.exit(0)
