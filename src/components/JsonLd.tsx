import { FAQ } from '@/data/faq'
import { SITE } from '@/data/site'
import { baseGraph, ld } from '@/lib/schema'

/**
 * Микроразметка главной. Общие узлы (сайт, автор, организация, услуга)
 * живут в lib/schema.ts — их же берут городские страницы.
 *
 * LocalBusiness с адресом здесь нет: офиса с приёмом не существует, а
 * выдуманный адрес — это не приём продвижения, а ложные данные в разметке.
 * География выражена единственным честным способом — через areaServed.
 */
export function JsonLd() {
  const graph = [
    ...baseGraph(),
    {
      '@type': 'FAQPage',
      '@id': `${SITE.url}/#faq`,
      mainEntity: FAQ.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    },
    {
      '@type': 'BreadcrumbList',
      '@id': `${SITE.url}/#breadcrumbs`,
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Главная', item: `${SITE.url}/` },
      ],
    },
  ]

  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: ld(graph) }} />
  )
}
