import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { CITIES, getCity } from '@/data/cities'
import { NICHE_PAGES, getNiche } from '@/data/niche-pages'
import { SITE } from '@/data/site'
import { Header } from '@/components/sections/Header'
import { Footer } from '@/components/sections/Footer'
import { MobileBar } from '@/components/sections/MobileBar'
import { Pricing } from '@/components/sections/Pricing'
import { Faq } from '@/components/sections/Faq'
import { LeadForm } from '@/components/sections/LeadForm'
import { StickyFeatures } from '@/components/sections/StickyFeatures'
import { CityHero, CityIntro } from '@/components/city/CityHero'
import { CityWorks, CityLinks } from '@/components/city/CityWorks'
import { CityJsonLd } from '@/components/city/CityJsonLd'
import {
  NicheHero,
  NicheIntro,
  NicheBlocks,
  NicheObjections,
  NicheWorks,
  NicheLinks,
} from '@/components/niche/NicheSections'
import { NicheJsonLd } from '@/components/niche/NicheJsonLd'
import { Spotlight } from '@/components/ui/Spotlight'
import { asset } from '@/lib/asset'

/**
 * Городские и нишевые посадочные живут в корне: /kazan/ и
 * /sayt-dlya-stomatologii/. Два динамических сегмента на одном уровне Next
 * не разрешает, поэтому маршрут один, а тип страницы определяется по слагу.
 * Слаги заведомо не пересекаются — это города и фразы вида «сайт-для-…».
 */
type Props = { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return [
    ...CITIES.map((c) => ({ slug: c.slug })),
    ...NICHE_PAGES.map((n) => ({ slug: n.slug })),
  ]
}

export const dynamicParams = false

/** На городской странице нет бегущей строки ниш, на нишевой — есть структура. */
const CITY_NAV = [
  { label: 'Работы', href: '#raboty' },
  { label: 'Цены', href: '#tseny' },
  { label: 'Вопросы', href: '#voprosy' },
] as const

const NICHE_NAV = [
  { label: 'Структура', href: '#struktura' },
  { label: 'Работы', href: '#raboty' },
  { label: 'Цены', href: '#tseny' },
  { label: 'Вопросы', href: '#voprosy' },
] as const

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const city = getCity(slug)
  const niche = city ? null : getNiche(slug)

  const page = city
    ? { title: city.title, description: city.description, alt: `Разработка сайтов ${city.inCity}` }
    : niche
      ? { title: niche.title, description: niche.description, alt: niche.h1 }
      : null

  if (!page) return {}

  const url = `${SITE.url}/${slug}/`

  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      locale: 'ru_RU',
      url,
      siteName: `${SITE.brand} — сайты для бизнеса`,
      title: page.title,
      description: page.description,
      images: [{ url: `${SITE.url}/og.png`, width: 1200, height: 630, alt: page.alt }],
    },
    twitter: {
      card: 'summary_large_image',
      title: page.title,
      description: page.description,
      images: [`${SITE.url}/og.png`],
    },
    robots: { index: true, follow: true },
  }
}

export default async function LandingPage({ params }: Props) {
  const { slug } = await params
  const city = getCity(slug)
  const niche = city ? null : getNiche(slug)

  if (!city && !niche) notFound()

  return (
    <div className="relative isolate">
      {city ? <CityJsonLd city={city} /> : null}
      {niche ? <NicheJsonLd niche={niche} /> : null}
      <Spotlight />
      <Header nav={city ? CITY_NAV : NICHE_NAV} logoHref={asset('/')} />

      <main className="relative">
        {city ? (
          <>
            <CityHero city={city} />
            <CityIntro city={city} />
            <CityWorks city={city} />
            <StickyFeatures />
            <Pricing />
            <Faq />
            <CityLinks city={city} />
          </>
        ) : niche ? (
          <>
            <NicheHero niche={niche} />
            <NicheIntro niche={niche} />
            <NicheBlocks niche={niche} />
            <NicheWorks niche={niche} />
            <NicheObjections niche={niche} />
            <Pricing />
            <Faq />
            <NicheLinks niche={niche} />
          </>
        ) : null}

        <LeadForm />
      </main>

      <Footer />
      <MobileBar />
    </div>
  )
}
