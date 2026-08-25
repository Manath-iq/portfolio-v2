import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { CASES, getCase, projectOf } from '@/data/cases'
import { SITE } from '@/data/site'
import { Header } from '@/components/sections/Header'
import { Footer } from '@/components/sections/Footer'
import { MobileBar } from '@/components/sections/MobileBar'
import { Pricing } from '@/components/sections/Pricing'
import { Process } from '@/components/sections/Process'
import { LeadForm } from '@/components/sections/LeadForm'
import {
  CaseHero,
  CaseTask,
  CaseDecisions,
  CaseOmitted,
  CaseLinks,
} from '@/components/case/CaseSections'
import { CaseJsonLd } from '@/components/case/CaseJsonLd'
import { Spotlight } from '@/components/ui/Spotlight'
import { asset } from '@/lib/asset'

/**
 * Разборы работ: /raboty/<slug>/.
 *
 * Отдельная ветка маршрута, а не общий корневой [slug]: статический сегмент
 * `raboty` в Next главнее динамического, поэтому городские и нишевые страницы
 * в корне продолжают работать как работали, и слаги разборов с ними не спорят.
 */
type Props = { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return CASES.map((c) => ({ slug: c.slug }))
}

export const dynamicParams = false

/** Своей секции FAQ здесь нет, поэтому и пункта «Вопросы» в меню нет. */
const CASE_NAV = [
  { label: 'Решения', href: '#resheniya' },
  { label: 'Цены', href: '#tseny' },
  { label: 'Работы', href: '/raboty/' },
] as const

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const c = getCase(slug)
  if (!c) return {}

  const p = projectOf(c)
  const url = `${SITE.url}/raboty/${c.slug}/`

  // Превью — сам скриншот работы, а не общая картинка сайта: ссылку на разбор
  // кидают в мессенджер, и там первым делом смотрят, как выглядит сделанное.
  const image = `${SITE.url}${p.poster}`

  return {
    title: c.title,
    description: c.description,
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      locale: 'ru_RU',
      url,
      siteName: `${SITE.brand} — сайты для бизнеса`,
      title: c.title,
      description: c.description,
      images: [{ url: image, width: 1600, height: 1000, alt: p.alt }],
    },
    twitter: {
      card: 'summary_large_image',
      title: c.title,
      description: c.description,
      images: [image],
    },
    robots: { index: true, follow: true },
  }
}

export default async function CaseRoute({ params }: Props) {
  const { slug } = await params
  const c = getCase(slug)
  if (!c) notFound()

  return (
    <div className="relative isolate">
      <CaseJsonLd c={c} />
      <Spotlight />
      <Header nav={CASE_NAV} logoHref={asset('/')} />

      <main className="relative">
        <CaseHero c={c} />
        <CaseTask c={c} />
        <CaseDecisions c={c} />
        <CaseOmitted c={c} />
        {/* Прайс и порядок работы — то, что спрашивают сразу после «а мне
            так же можно». Витрина работ идёт после них, чтобы человек уходил
            дальше по сайту, а не с сайта. */}
        <Pricing />
        <Process />
        <CaseLinks c={c} />
        <LeadForm />
      </main>

      <Footer />
      <MobileBar />
    </div>
  )
}
