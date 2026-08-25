import type { Article } from '@/data/articles'
import { SITE } from '@/data/site'
import { baseGraph, ld } from '@/lib/schema'

/**
 * Разметка статьи.
 *
 * dateModified равен dateCreated: правки в статьи вносятся редко, а поднимать
 * дату при каждой пересборке нельзя — сборка идёт на каждый пуш, и поисковик
 * увидел бы, что раздел переписывают ежедневно. Появится настоящая правка —
 * дата меняется руками в articles.ts, вместе с текстом.
 */
export function ArticleJsonLd({ a }: { a: Article }) {
  const url = `${SITE.url}/stati/${a.slug}/`

  const graph = [
    ...baseGraph(),
    {
      '@type': 'WebPage',
      '@id': `${url}#page`,
      url,
      name: a.title,
      description: a.description,
      inLanguage: 'ru-RU',
      isPartOf: { '@id': `${SITE.url}/#website` },
      breadcrumb: { '@id': `${url}#breadcrumbs` },
    },
    {
      '@type': 'BreadcrumbList',
      '@id': `${url}#breadcrumbs`,
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Главная', item: `${SITE.url}/` },
        { '@type': 'ListItem', position: 2, name: 'Статьи', item: `${SITE.url}/stati/` },
        { '@type': 'ListItem', position: 3, name: a.h1, item: url },
      ],
    },
    {
      '@type': 'Article',
      '@id': `${url}#article`,
      headline: a.h1,
      description: a.description,
      url,
      mainEntityOfPage: { '@id': `${url}#page` },
      inLanguage: 'ru-RU',
      datePublished: a.date,
      dateModified: a.date,
      author: { '@id': `${SITE.url}/#person` },
      publisher: { '@id': `${SITE.url}/#org` },
      image: `${SITE.url}/og/stati-${a.slug}.jpg`,
    },
  ]

  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: ld(graph) }} />
  )
}

/** Разметка витрины /stati/. */
export function ArticleIndexJsonLd({ articles }: { articles: Article[] }) {
  const url = `${SITE.url}/stati/`

  const graph = [
    ...baseGraph(),
    {
      '@type': 'CollectionPage',
      '@id': `${url}#page`,
      url,
      name: `Статьи — ${SITE.brand}`,
      description:
        'Разборы вопросов, которые задают до заказа сайта: цена, формат, поиск, выбор подрядчика.',
      inLanguage: 'ru-RU',
      isPartOf: { '@id': `${SITE.url}/#website` },
      breadcrumb: { '@id': `${url}#breadcrumbs` },
    },
    {
      '@type': 'BreadcrumbList',
      '@id': `${url}#breadcrumbs`,
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Главная', item: `${SITE.url}/` },
        { '@type': 'ListItem', position: 2, name: 'Статьи', item: url },
      ],
    },
    {
      '@type': 'ItemList',
      '@id': `${url}#list`,
      itemListOrder: 'https://schema.org/ItemListOrderAscending',
      numberOfItems: articles.length,
      itemListElement: articles.map((a, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: a.h1,
        url: `${SITE.url}/stati/${a.slug}/`,
      })),
    },
  ]

  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: ld(graph) }} />
  )
}
