import type { MetadataRoute } from 'next'
import { SITE } from '@/data/site'

export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date('2026-08-10')

  return [
    { url: `${SITE.url}/`, lastModified: now, changeFrequency: 'monthly', priority: 1 },
    { url: `${SITE.url}/policy/`, lastModified: now, changeFrequency: 'yearly', priority: 0.1 },
    { url: `${SITE.url}/oferta/`, lastModified: now, changeFrequency: 'yearly', priority: 0.1 },
  ]
}
