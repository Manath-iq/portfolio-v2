import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { CITIES, getCity } from '@/data/cities'
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
import { Spotlight } from '@/components/ui/Spotlight'
import { asset } from '@/lib/asset'

type Props = { params: Promise<{ city: string }> }

/** На городской странице бегущей строки с нишами нет — пункт «Ниши» убран. */
const CITY_NAV = [
  { label: 'Работы', href: '#raboty' },
  { label: 'Цены', href: '#tseny' },
  { label: 'Вопросы', href: '#voprosy' },
] as const

/** Статический экспорт: генерируются ровно те города, что перечислены в данных. */
export function generateStaticParams() {
  return CITIES.map((c) => ({ city: c.slug }))
}

export const dynamicParams = false

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const city = getCity((await params).city)
  if (!city) return {}

  const url = `${SITE.url}/${city.slug}/`

  return {
    title: city.title,
    description: city.description,
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      locale: 'ru_RU',
      url,
      siteName: `${SITE.brand} — сайты для бизнеса`,
      title: city.title,
      description: city.description,
      images: [
        {
          url: `${SITE.url}/og.png`,
          width: 1200,
          height: 630,
          alt: `Разработка сайтов ${city.inCity}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: city.title,
      description: city.description,
      images: [`${SITE.url}/og.png`],
    },
    robots: { index: true, follow: true },
  }
}

export default async function CityPage({ params }: Props) {
  const city = getCity((await params).city)
  if (!city) notFound()

  return (
    <div className="relative isolate">
      <CityJsonLd city={city} />
      <Spotlight />
      <Header nav={CITY_NAV} logoHref={asset('/')} />
      <main className="relative">
        <CityHero city={city} />
        <CityIntro city={city} />
        <CityWorks city={city} />
        <StickyFeatures />
        <Pricing />
        <Faq />
        <CityLinks city={city} />
        <LeadForm />
      </main>
      <Footer />
      <MobileBar />
    </div>
  )
}
