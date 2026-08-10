import { FAQ } from '@/data/faq'
import { SITE } from '@/data/site'

/**
 * Микроразметка. LocalBusiness через areaServed — офиса с приёмом нет,
 * поэтому адреса в разметке тоже нет: выдумывать его нельзя.
 */
export function JsonLd() {
  const graph = [
    {
      '@type': 'Organization',
      '@id': `${SITE.url}/#org`,
      name: SITE.name,
      url: SITE.url,
      telephone: SITE.phone,
      areaServed: [
        { '@type': 'City', name: SITE.city },
        { '@type': 'AdministrativeArea', name: SITE.region },
      ],
      founder: { '@type': 'Person', name: SITE.name },
      sameAs: [SITE.channelUrl],
    },
    {
      '@type': 'ProfessionalService',
      '@id': `${SITE.url}/#business`,
      name: `${SITE.name} — разработка сайтов`,
      description:
        'Разработка лендингов и многостраничных сайтов для бизнеса в Нижнекамске и Татарстане.',
      url: SITE.url,
      telephone: SITE.phone,
      priceRange: '45000–120000 ₽',
      areaServed: [
        { '@type': 'City', name: SITE.city },
        { '@type': 'AdministrativeArea', name: SITE.region },
      ],
      parentOrganization: { '@id': `${SITE.url}/#org` },
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Форматы сайтов',
        itemListElement: [
          { name: 'Лендинг', price: '45000' },
          { name: 'Лендинг+', price: '75000' },
          { name: 'Многостраничник', price: '120000' },
        ].map((o) => ({
          '@type': 'Offer',
          itemOffered: { '@type': 'Service', name: o.name },
          price: o.price,
          priceCurrency: 'RUB',
        })),
      },
    },
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
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }),
      }}
    />
  )
}
