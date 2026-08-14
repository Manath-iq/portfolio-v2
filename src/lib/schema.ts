import { CITIES } from '@/data/cities'
import { CHANNEL_URL, SITE } from '@/data/site'

/**
 * Узлы микроразметки, общие для всех страниц.
 *
 * Их приходится повторять на каждой странице, а не ссылаться на @id с главной:
 * ссылка на узел, которого в этом же документе нет, формально разрешена, но
 * разбирается не всеми валидаторами — и в Яндекс.Вебмастере такая страница
 * приезжает с половиной пустых полей. Дешевле продублировать.
 */

/** Кого обслуживаю. Только города, под которые есть страницы, плюс республика. */
export const AREA_SERVED = [
  { '@type': 'City', name: SITE.city },
  ...CITIES.map((c) => ({ '@type': 'City', name: c.name })),
  { '@type': 'AdministrativeArea', name: SITE.region },
]

const OFFERS = [
  { name: 'Лендинг', price: '45000' },
  { name: 'Лендинг+', price: '75000' },
  { name: 'Многостраничник', price: '120000' },
]

export function baseGraph() {
  return [
    {
      '@type': 'WebSite',
      '@id': `${SITE.url}/#website`,
      url: `${SITE.url}/`,
      name: `${SITE.brand} — сайты для бизнеса`,
      inLanguage: 'ru-RU',
      publisher: { '@id': `${SITE.url}/#org` },
    },
    {
      '@type': 'Person',
      '@id': `${SITE.url}/#person`,
      name: SITE.name,
      alternateName: SITE.brand,
      jobTitle: 'Веб-разработчик',
      url: `${SITE.url}/`,
      telephone: SITE.phone,
      worksFor: { '@id': `${SITE.url}/#org` },
      knowsAbout: [
        'Разработка сайтов',
        'Лендинги',
        'Веб-дизайн',
        'SEO-структура сайта',
        'Next.js',
      ],
      sameAs: [SITE.telegram, CHANNEL_URL].filter(Boolean),
    },
    {
      '@type': 'Organization',
      '@id': `${SITE.url}/#org`,
      name: `${SITE.name} (${SITE.brand})`,
      url: `${SITE.url}/`,
      logo: `${SITE.url}/og.png`,
      image: `${SITE.url}/og.png`,
      telephone: SITE.phone,
      areaServed: AREA_SERVED,
      founder: { '@id': `${SITE.url}/#person` },
      sameAs: [SITE.telegram, CHANNEL_URL].filter(Boolean),
    },
    {
      '@type': 'ProfessionalService',
      '@id': `${SITE.url}/#business`,
      name: `${SITE.brand} — разработка сайтов`,
      description:
        'Разработка лендингов и многостраничных сайтов для бизнеса в Нижнекамске, Казани, Набережных Челнах и по всему Татарстану.',
      url: `${SITE.url}/`,
      image: `${SITE.url}/og.png`,
      telephone: SITE.phone,
      priceRange: '45000–120000 ₽',
      currenciesAccepted: 'RUB',
      areaServed: AREA_SERVED,
      parentOrganization: { '@id': `${SITE.url}/#org` },
      founder: { '@id': `${SITE.url}/#person` },
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Форматы сайтов',
        itemListElement: OFFERS.map((o) => ({
          '@type': 'Offer',
          itemOffered: { '@type': 'Service', name: o.name },
          price: o.price,
          priceCurrency: 'RUB',
          availability: 'https://schema.org/InStock',
        })),
      },
    },
  ]
}

/** Три тарифа как офферы конкретной услуги. Цены те же, что в прайсе на странице. */
export function offersFor(url: string) {
  return OFFERS.map((o) => ({
    '@type': 'Offer',
    name: o.name,
    price: o.price,
    priceCurrency: 'RUB',
    availability: 'https://schema.org/InStock',
    url,
  }))
}

/** Сериализация графа для <script type="application/ld+json">. */
export function ld(graph: unknown[]) {
  return JSON.stringify({ '@context': 'https://schema.org', '@graph': graph })
}
