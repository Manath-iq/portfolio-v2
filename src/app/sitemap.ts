import type { MetadataRoute } from 'next'
import { CITIES } from '@/data/cities'
import { NICHE_PAGES } from '@/data/niche-pages'
import { PROJECTS } from '@/data/projects'
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
    // У нишевых страниц перечислены их же работы: по запросам вида
    // «сайт для стоматологии» львиная доля переходов идёт из Картинок,
    // а робот сам скриншоты внутри страницы находит не всегда.
    ...NICHE_PAGES.map((n) => ({
      url: `${SITE.url}/${n.slug}/`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
      images: n.projectIds
        .map((id) => PROJECTS.find((p) => p.id === id))
        .filter((p): p is (typeof PROJECTS)[number] => Boolean(p))
        .map((p) => `${SITE.url}${p.poster}`),
    })),
  ]
}
