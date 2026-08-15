/**
 * Приёмник заявки для статического хостинга — Cloudflare Worker.
 *
 * Зачем он нужен. На GitHub Pages нет ни PHP, ни любого другого сервера,
 * поэтому public/api/lead.php там мёртв. Отправлять в Telegram прямо из
 * браузера нельзя: токен бота попал бы в бандл, а бандл открыт всем.
 * Воркер — единственное место, где токен остаётся приватным. Бесплатного
 * тарифа Cloudflare хватает с большим запасом: 100 000 запросов в сутки.
 *
 * Контракт тот же, что у lead.php: POST с JSON
 * { name, contact, task, company, page } → { ok: true }.
 * Меняется только адрес, на который форма шлёт запрос, — фронтенд не трогаем.
 *
 * ── Как поднять ────────────────────────────────────────────────────────
 * 1. dash.cloudflare.com → Workers & Pages → Create → Worker → Deploy.
 * 2. Edit code → вставить этот файл целиком → Deploy.
 * 3. Settings → Variables and Secrets → добавить два секрета (тип Secret,
 *    не Text — тогда значение не видно даже в панели):
 *      BOT_TOKEN — выдаёт @BotFather
 *      CHAT_ID   — выдаёт @userinfobot, свой id
 * 4. Скопировать адрес воркера (…workers.dev).
 * 5. В репозитории: Settings → Secrets and variables → Actions → Variables →
 *    New variable, имя LEAD_ENDPOINT, значение — этот адрес.
 * 6. Любой пуш в main — и форма на сайте начинает отправлять по-настоящему.
 *
 * Ничего не хранится: заявка уходит в Telegram и всё, базы для утечки нет.
 * Это ровно то, что написано в политике на сайте.
 */

/** Домены, которым разрешено слать заявку. Чужой сайт форму не переиспользует. */
const ALLOWED = ['https://manath.site', 'https://www.manath.site']

const json = (body, status, origin) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'X-Content-Type-Options': 'nosniff',
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      Vary: 'Origin',
    },
  })

/** Обрезка и чистка поля: тот же набор правил, что в lead.php. */
const clean = (v, max) =>
  String(v ?? '')
    .replace(/[\r\0]/g, '')
    .trim()
    .slice(0, max)

/** Telegram parse_mode HTML: экранируем только то, что ломает разметку. */
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') ?? ''
    const allow = ALLOWED.includes(origin) ? origin : ALLOWED[0]

    if (request.method === 'OPTIONS') {
      return json({ ok: true }, 200, allow)
    }
    if (request.method !== 'POST') {
      return json({ ok: false, error: 'method' }, 405, allow)
    }
    if (origin && !ALLOWED.includes(origin)) {
      return json({ ok: false, error: 'origin' }, 403, allow)
    }

    const raw = await request.text()
    if (raw.length > 8000) {
      return json({ ok: false, error: 'size' }, 413, allow)
    }

    let data
    try {
      data = JSON.parse(raw)
    } catch {
      return json({ ok: false, error: 'json' }, 400, allow)
    }

    // honeypot: поле скрыто от человека, заполнить его может только бот.
    // Отвечаем успехом — боту незачем знать, что его отсеяли.
    if (clean(data.company, 100) !== '') {
      return json({ ok: true }, 200, allow)
    }

    const name = clean(data.name, 120)
    const contact = clean(data.contact, 120)
    const task = clean(data.task, 2000)
    const page = clean(data.page, 300)

    if (!name || !contact) {
      return json({ ok: false, error: 'empty' }, 422, allow)
    }

    if (!env.BOT_TOKEN || !env.CHAT_ID) {
      return json({ ok: false, error: 'config' }, 500, allow)
    }

    const text =
      '<b>Заявка с сайта</b>\n\n' +
      `<b>Имя:</b> ${esc(name)}\n` +
      `<b>Связь:</b> ${esc(contact)}\n` +
      (task ? `<b>Задача:</b> ${esc(task)}\n` : '') +
      `\n<i>${esc(page)}</i>`

    const res = await fetch(`https://api.telegram.org/bot${env.BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: env.CHAT_ID,
        text,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      }),
    })

    if (!res.ok) {
      return json({ ok: false, error: 'telegram' }, 502, allow)
    }

    return json({ ok: true }, 200, allow)
  },
}
