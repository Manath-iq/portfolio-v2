import type { MetadataRoute } from 'next'
import { ARTICLES } from '@/data/articles'
import { CASES, projectOf } from '@/data/cases'
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
    // Витрина разборов и сами разборы. У каждого своя картинка — скриншот
    // работы: по запросам вида «сайт для стоматологии пример» переходы идут
    // из Картинок, и робот должен знать, какая картинка к какой странице.
    { url: `${SITE.url}/raboty/`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    ...CASES.map((c) => ({
      url: `${SITE.url}/raboty/${c.slug}/`,
      lastModified: now,
      changeFrequency: 'yearly' as const,
      priority: 0.6,
      images: [`${SITE.url}${projectOf(c).poster}`],
    })),
    // Статьи. changeFrequency yearly честно: их правят редко, и обещать
    // роботу еженедельные изменения значит один раз соврать и потерять
    // доверие к полю на всём сайте.
    { url: `${SITE.url}/stati/`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    ...ARTICLES.map((a) => ({
      url: `${SITE.url}/stati/${a.slug}/`,
      lastModified: new Date(a.date),
      changeFrequency: 'yearly' as const,
      priority: 0.6,
    })),
  ]
}
