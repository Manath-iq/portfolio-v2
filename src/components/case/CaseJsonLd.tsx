import type { CasePage } from '@/data/cases'
import { projectOf } from '@/data/cases'
import { SITE } from '@/data/site'
import { baseGraph, ld } from '@/lib/schema'
import { cap, numeral } from '@/lib/numeral'

/**
 * Микроразметка разбора работы.
 *
 * Тип узла — CreativeWork, а не Article: это описание сделанной работы,
 * а не статья. Offer здесь нет намеренно — на этой странице ничего не продаётся
 * по конкретной цене, продаётся она на прайсе, и дублировать офферы на каждом
 * разборе значит десять раз заявить один и тот же товар.
 *
 * Для демо-концептов не выставляется ни заказчик, ни дата запуска: заказчика
 * не существует, а придуманный `client` в разметке — это подлог, который
 * проверяется одним звонком.
 */
export function CaseJsonLd({ c }: { c: CasePage }) {
  const p = projectOf(c)
  const url = `${SITE.url}/raboty/${c.slug}/`

  const graph = [
    ...baseGraph(),
    {
      '@type': 'WebPage',
      '@id': `${url}#page`,
      url,
      name: c.title,
      description: c.description,
      inLanguage: 'ru-RU',
      isPartOf: { '@id': `${SITE.url}/#website` },
      breadcrumb: { '@id': `${url}#breadcrumbs` },
      primaryImageOfPage: { '@id': `${url}#image` },
    },
    {
      '@type': 'ImageObject',
      '@id': `${url}#image`,
      url: `${SITE.url}${p.poster}`,
      caption: p.alt,
    },
    {
      '@type': 'BreadcrumbList',
      '@id': `${url}#breadcrumbs`,
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Главная', item: `${SITE.url}/` },
        { '@type': 'ListItem', position: 2, name: 'Работы', item: `${SITE.url}/raboty/` },
        { '@type': 'ListItem', position: 3, name: c.h1, item: url },
      ],
    },
    {
      '@type': 'CreativeWork',
      '@id': `${url}#work`,
      name: p.title,
      headline: c.h1,
      description: c.description,
      url,
      image: `${SITE.url}${p.poster}`,
      inLanguage: 'ru-RU',
      creator: { '@id': `${SITE.url}/#person` },
      about: p.niche,
      genre: 'Веб-дизайн',
      isPartOf: { '@id': `${SITE.url}/#website` },
    },
  ]

  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: ld(graph) }} />
  )
}

/** Разметка витрины /raboty/: список всех разборов. */
export function CaseIndexJsonLd({ cases }: { cases: CasePage[] }) {
  const url = `${SITE.url}/raboty/`

  const graph = [
    ...baseGraph(),
    {
      '@type': 'CollectionPage',
      '@id': `${url}#page`,
      url,
      name: `Работы — ${SITE.brand}`,
      description:
        `${cap(numeral(cases.length))} сайтов с разбором: под какую задачу собрана структура и почему блоки стоят в таком порядке.`,
      inLanguage: 'ru-RU',
      isPartOf: { '@id': `${SITE.url}/#website` },
      breadcrumb: { '@id': `${url}#breadcrumbs` },
    },
    {
      '@type': 'BreadcrumbList',
      '@id': `${url}#breadcrumbs`,
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Главная', item: `${SITE.url}/` },
        { '@type': 'ListItem', position: 2, name: 'Работы', item: url },
      ],
    },
    {
      '@type': 'ItemList',
      '@id': `${url}#list`,
      itemListOrder: 'https://schema.org/ItemListOrderAscending',
      numberOfItems: cases.length,
      itemListElement: cases.map((c, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: c.h1,
        url: `${SITE.url}/raboty/${c.slug}/`,
      })),
    },
  ]

  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: ld(graph) }} />
  )
}
