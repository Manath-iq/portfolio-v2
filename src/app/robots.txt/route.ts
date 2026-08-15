import { SITE } from '@/data/site'

export const dynamic = 'force-static'

/**
 * robots.txt пишется руками, а не через MetadataRoute.Robots, из-за одной
 * строки: Clean-param. Next её не умеет, а для Яндекса она здесь главное.
 *
 * Clean-param говорит роботу, что адреса, отличающиеся только рекламными
 * метками, — это одна и та же страница. Без неё первый же запуск рекламы
 * плодит десятки дублей вида /kazan/?utm_source=…, и Яндекс начинает решать,
 * какой из них считать основным, вместо того чтобы ранжировать один.
 *
 * Директивы Host здесь нет намеренно: Яндекс отменил её в 2018 году, а
 * канонический хост задают 301-редирект (public/.htaccess) и rel=canonical.
 */
const PARAMS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
  'yclid',
  'ymclid',
  'gclid',
  'fbclid',
  '_openstat',
  'from',
  'roistat',
].join('&')

export function GET() {
  const body = `User-agent: *
Allow: /
Disallow: /api/

# Адреса с рекламными метками — это та же страница, а не дубль.
Clean-param: ${PARAMS}

Sitemap: ${SITE.url}/sitemap.xml
`

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
