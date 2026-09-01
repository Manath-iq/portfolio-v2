import type { Metadata } from 'next'
import { ArrowRight } from 'lucide-react'
import { CASES, projectOf } from '@/data/cases'
import { SITE } from '@/data/site'
import { Header } from '@/components/sections/Header'
import { Footer } from '@/components/sections/Footer'
import { MobileBar } from '@/components/sections/MobileBar'
import { LeadForm } from '@/components/sections/LeadForm'
import { CaseIndexJsonLd } from '@/components/case/CaseJsonLd'
import { SectionHead, W } from '@/components/SectionHead'
import { Reveal } from '@/components/Reveal'
import { Spotlight } from '@/components/ui/Spotlight'
import { asset } from '@/lib/asset'
import { cap, numeral, numeralOf } from '@/lib/numeral'

/**
 * Витрина разборов.
 *
 * Нужна не ради поискового трафика — по запросу «работы» никто не ищет.
 * Нужна как настоящий родитель для страниц разборов: без неё хлебные крошки
 * врали бы, а разборы висели бы на одних только карточках витрины.
 */
/** Сколько работ из витрины — демо-концепты, а не клиентские заказы. */
const DEMOS = CASES.filter((c) => projectOf(c).isDemo).length

const TITLE = `Работы с разбором — сайты для бизнеса | ${SITE.brand}`
const DESCRIPTION =
  `${cap(numeral(CASES.length))} сайтов и разбор каждого: под какую задачу собрана структура, почему блоки стоят в таком порядке и что убрано намеренно.`

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${SITE.url}/raboty/` },
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    url: `${SITE.url}/raboty/`,
    siteName: `${SITE.brand} — сайты для бизнеса`,
    title: TITLE,
    description: DESCRIPTION,
    images: [{ url: `${SITE.url}/og.png`, width: 1200, height: 630, alt: 'Работы' }],
  },
  robots: { index: true, follow: true },
}

export default function CaseIndex() {
  return (
    <div className="relative isolate">
      <CaseIndexJsonLd cases={CASES} />
      <Spotlight />
      <Header
        nav={[
          { label: 'Цены', href: '/#tseny' },
          { label: 'Ниши', href: '/#nishi' },
          { label: 'Вопросы', href: '/#voprosy' },
        ]}
        logoHref={asset('/')}
      />

      <main className="relative">
        <section className="pt-28 pb-8 sm:pt-32" aria-labelledby="raboty-h">
          <div className="container">
            <Reveal>
              <nav aria-label="Хлебные крошки" className="t-micro">
                <a href={asset('/')} className="transition-colors hover:text-text-2">
                  Главная
                </a>
                <span className="mx-2" aria-hidden>
                  /
                </span>
                <span className="text-text-2">Работы</span>
              </nav>
            </Reveal>

            <SectionHead eyebrow="работы" id="raboty-h" className="mt-6">
              {cap(numeral(CASES.length))} сайтов. У каждого — <W>разбор</W>.
            </SectionHead>

            <p className="t-body measure mt-8">
              Не галерея картинок: у каждой работы своя страница с тем, под какую задачу
              собрана структура, почему блоки идут в таком порядке и что убрано намеренно.{' '}
              {cap(numeral(DEMOS))} из {numeralOf(CASES.length)} — демо-концепты, и это написано
              на каждой странице прямо, а не мелким шрифтом внизу.
            </p>
          </div>
        </section>

        <section className="section pt-8">
          <div className="container-wide">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {CASES.map((c, i) => {
                const p = projectOf(c)
                return (
                  <Reveal key={c.slug} delay={Math.min(i, 5) * 50}>
                    <a
                      href={asset(`/raboty/${c.slug}/`)}
                      className="glass-flat glass-hover flex h-full flex-col overflow-hidden rounded-[var(--r-lg)]"
                    >
                      <div className="relative aspect-[16/10] w-full overflow-hidden bg-black">
                        <img
                          src={asset(p.poster)}
                          alt={p.alt}
                          width={1600}
                          height={1000}
                          loading={i < 3 ? 'eager' : 'lazy'}
                          className="size-full object-cover object-top"
                        />
                        {p.isDemo ? (
                          <span className="absolute top-3 left-3 rounded-[var(--r-pill)] border border-hairline bg-black/60 px-2.5 py-1 font-mono text-[0.6875rem] text-text-2 backdrop-blur-sm">
                            демо-концепт
                          </span>
                        ) : null}
                      </div>

                      <div className="flex flex-1 flex-col gap-3 p-5">
                        <p className="t-eyebrow">
                          {p.niche.toLowerCase()} · {p.city.toLowerCase()}
                        </p>
                        <h2 className="t-h3 text-[1.1875rem]">{c.h1}</h2>
                        <p className="t-body text-[0.9375rem]">{c.lead}</p>
                        <span className="mt-auto inline-flex w-fit items-center gap-1.5 pt-2 text-[0.9375rem] text-text-2">
                          Читать разбор
                          <ArrowRight size={15} strokeWidth={1.5} aria-hidden />
                        </span>
                      </div>
                    </a>
                  </Reveal>
                )
              })}
            </div>
          </div>
        </section>

        <LeadForm />
      </main>

      <Footer />
      <MobileBar />
    </div>
  )
}
