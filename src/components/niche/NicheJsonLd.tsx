import type { NichePage } from '@/data/niche-pages'
import { FAQ } from '@/data/faq'
import { SITE } from '@/data/site'
import { AREA_SERVED, baseGraph, ld, offersFor } from '@/lib/schema'

/**
 * Микроразметка нишевой страницы.
 *
 * Возражения из данных отдаются как FAQPage вместе с общими вопросами: это
 * настоящие вопросы с настоящими ответами, ровно то, чем FAQPage и должен быть.
 * Блок «структура» размечен как HowTo не нарочно — HowTo описывает действия
 * пользователя, а здесь описан состав страницы, и натягивать один тип на
 * другой ради сниппета значит врать разметкой.
 */
export function NicheJsonLd({ niche }: { niche: NichePage }) {
  const url = `${SITE.url}/${niche.slug}/`

  const graph = [
    ...baseGraph(),
    {
      '@type': 'WebPage',
      '@id': `${url}#page`,
      url,
      name: niche.title,
      description: niche.description,
      inLanguage: 'ru-RU',
      isPartOf: { '@id': `${SITE.url}/#website` },
      about: { '@id': `${url}#service` },
      breadcrumb: { '@id': `${url}#breadcrumbs` },
    },
    {
      '@type': 'BreadcrumbList',
      '@id': `${url}#breadcrumbs`,
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Главная', item: `${SITE.url}/` },
        { '@type': 'ListItem', position: 2, name: niche.label, item: url },
      ],
    },
    {
      '@type': 'Service',
      '@id': `${url}#service`,
      name: niche.h1,
      description: niche.description,
      serviceType: 'Разработка сайтов и лендингов',
      category: niche.label,
      provider: { '@id': `${SITE.url}/#business` },
      areaServed: AREA_SERVED,
      offers: offersFor(url),
    },
    {
      '@type': 'FAQPage',
      '@id': `${url}#faq`,
      mainEntity: [
        ...niche.objections.map(([q, a]) => ({
          '@type': 'Question',
          name: q.replace(/^«|»$/g, ''),
          acceptedAnswer: { '@type': 'Answer', text: a },
        })),
        ...FAQ.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      ],
    },
  ]

  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: ld(graph) }} />
  )
}
