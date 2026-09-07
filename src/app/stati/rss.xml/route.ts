import { ARTICLES } from '@/data/articles'
import { SITE } from '@/data/site'

export const dynamic = 'force-static'

/**
 * RSS раздела статей.
 *
 * Зачем при живом sitemap. Sitemap отвечает на вопрос «какие адреса есть»,
 * фид — на вопрос «что нового», и читают их разные вещи. Вебмастер умеет брать
 * фид отдельным источником, агрегаторы и читалки берут только его, а ссылку на
 * свежую статью удобно тянуть в Telegram-канал автоматикой, а не руками.
 * Стоит он ноль: собирается из тех же ARTICLES, что и страницы.
 *
 * Отдаём лид, а не текст статьи. Полный текст в фиде — это второй адрес, по
 * которому лежит то же самое, и повод для агрегатора показать статью у себя
 * вместо сайта. Смысл раздела в том, чтобы человек пришёл на manath.site.
 *
 * Порядок обратный порядку в ARTICLES: там новые дописываются в конец, а в
 * фиде первым должно идти свежее.
 */

/** RFC 822 — формат даты, которого требует спецификация RSS 2.0. */
const rfc822 = (iso: string) => new Date(iso).toUTCString()

const escape = (s: string) =>
  s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

export function GET() {
  const self = `${SITE.url}/stati/rss.xml`
  const items = [...ARTICLES].reverse()

  // lastBuildDate — дата самой свежей статьи, а не времени сборки: сборка идёт
  // на каждый пуш, и живая дата означала бы «раздел меняется ежедневно».
  const latest = items[0]?.date

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
<title>Статьи о сайтах для бизнеса — ${escape(SITE.brand)}</title>
<link>${SITE.url}/stati/</link>
<description>Разборы вопросов, которые задают до заказа сайта: сколько он стоит, лендинг или многостраничник, почему сайта нет в поиске.</description>
<language>ru</language>
<atom:link href="${self}" rel="self" type="application/rss+xml"/>
${latest ? `<lastBuildDate>${rfc822(latest)}</lastBuildDate>` : ''}
${items
  .map((a) => {
    const url = `${SITE.url}/stati/${a.slug}/`
    return `<item>
<title>${escape(a.h1)}</title>
<link>${url}</link>
<guid isPermaLink="true">${url}</guid>
<description>${escape(a.lead)}</description>
<pubDate>${rfc822(a.date)}</pubDate>
</item>`
  })
  .join('\n')}
</channel>
</rss>
`

  return new Response(body, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  })
}
