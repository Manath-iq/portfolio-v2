import type { City } from '@/data/cities'
import { FAQ } from '@/data/faq'
import { SITE } from '@/data/site'
import { baseGraph, ld, offersFor } from '@/lib/schema'

/**
 * Микроразметка городской страницы.
 *
 * Общие узлы повторяются из lib/schema.ts, чтобы ссылки по @id разрешались
 * внутри одного документа. Города здесь нет как LocalBusiness: филиала в нём
 * не существует, и заявлять адрес было бы подлогом. Присутствие выражено
 * через areaServed у услуги — это ровно то, что есть на самом деле.
 */
export function CityJsonLd({ city }: { city: City }) {
  const url = `${SITE.url}/${city.slug}/`

  const graph = [
    ...baseGraph(),
    {
      '@type': 'WebPage',
      '@id': `${url}#page`,
      url,
      name: city.title,
      description: city.description,
      inLanguage: 'ru-RU',
      isPartOf: { '@id': `${SITE.url}/#website` },
      about: { '@id': `${SITE.url}/#business` },
      breadcrumb: { '@id': `${url}#breadcrumbs` },
    },
    {
      '@type': 'BreadcrumbList',
      '@id': `${url}#breadcrumbs`,
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Главная', item: `${SITE.url}/` },
        { '@type': 'ListItem', position: 2, name: city.name, item: url },
      ],
    },
    {
      '@type': 'Service',
      '@id': `${url}#service`,
      name: `Разработка сайтов ${city.inCity}`,
      description: city.description,
      serviceType: 'Разработка сайтов и лендингов',
      provider: { '@id': `${SITE.url}/#business` },
      areaServed: { '@type': 'City', name: city.name },
      offers: offersFor(url),
    },
    {
      // Городские вопросы идут первыми и в том же порядке, что на странице:
      // разметка обязана совпадать с видимым текстом — поэтому общий гео-вопрос
      // выключен здесь ровно так же, как в <Faq omit={['geo']}>. Без городских
      // вопросов FAQPage был бы дословно одинаковым на всех тринадцати страницах.
      '@type': 'FAQPage',
      '@id': `${url}#faq`,
      mainEntity: [...city.faq, ...FAQ.filter((f) => f.id !== 'geo')].map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    },
  ]

  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: ld(graph) }} />
  )
}
