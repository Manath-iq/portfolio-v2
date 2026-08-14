import type { MetadataRoute } from 'next'
import { CITIES } from '@/data/cities'
import { NICHE_PAGES } from '@/data/niche-pages'
import { SITE } from '@/data/site'

export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  // Дата статическая: сборка идёт на каждый пуш, и new Date() каждый раз
  // сдвигал бы lastmod у всех страниц сразу. Поисковик такое видит как
  // «сайт целиком переписали», и доверие к полю падает.
  const now = new Date('2026-08-15')

  return [
    { url: `${SITE.url}/`, lastModified: now, changeFrequency: 'monthly', priority: 1 },
    ...CITIES.map((c) => ({
      url: `${SITE.url}/${c.slug}/`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
    ...NICHE_PAGES.map((n) => ({
      url: `${SITE.url}/${n.slug}/`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
    { url: `${SITE.url}/policy/`, lastModified: now, changeFrequency: 'yearly', priority: 0.1 },
    { url: `${SITE.url}/oferta/`, lastModified: now, changeFrequency: 'yearly', priority: 0.1 },
  ]
}
