import type { Metadata } from 'next'
import { ArrowRight } from 'lucide-react'
import { ARTICLES, readMinutes } from '@/data/articles'
import { SITE } from '@/data/site'
import { Header } from '@/components/sections/Header'
import { Footer } from '@/components/sections/Footer'
import { MobileBar } from '@/components/sections/MobileBar'
import { LeadForm } from '@/components/sections/LeadForm'
import { ArticleIndexJsonLd } from '@/components/article/ArticleJsonLd'
import { SectionHead, W } from '@/components/SectionHead'
import { Reveal } from '@/components/Reveal'
import { Spotlight } from '@/components/ui/Spotlight'
import { asset } from '@/lib/asset'

const TITLE = `Статьи о сайтах для бизнеса | ${SITE.brand}`
const DESCRIPTION =
  'Разборы вопросов, которые задают до заказа сайта: сколько он стоит и из чего складывается цена, лендинг или многостраничник, почему сайта нет в поиске.'

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${SITE.url}/stati/` },
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    url: `${SITE.url}/stati/`,
    siteName: `${SITE.brand} — сайты для бизнеса`,
    title: TITLE,
    description: DESCRIPTION,
    images: [{ url: `${SITE.url}/og.png`, width: 1200, height: 630, alt: 'Статьи' }],
  },
  robots: { index: true, follow: true },
}

const DATE_FMT = new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long' })

export default function ArticleIndex() {
  return (
    <div className="relative isolate">
      <ArticleIndexJsonLd articles={ARTICLES} />
      <Spotlight />
      <Header
        nav={[
          { label: 'Работы', href: '/raboty/' },
          { label: 'Цены', href: '/#tseny' },
          { label: 'Вопросы', href: '/#voprosy' },
        ]}
        logoHref={asset('/')}
      />

      <main className="relative">
        <section className="pt-28 pb-8 sm:pt-32" aria-labelledby="stati-h">
          <div className="container">
            <Reveal>
              <nav aria-label="Хлебные крошки" className="t-micro">
                <a href={asset('/')} className="transition-colors hover:text-text-2">
                  Главная
                </a>
                <span className="mx-2" aria-hidden>
                  /
                </span>
                <span className="text-text-2">Статьи</span>
              </nav>
            </Reveal>

            <SectionHead eyebrow="статьи" id="stati-h" className="mt-6">
              Вопросы, которые задают <W>до</W> заказа
            </SectionHead>

            <p className="t-body measure mt-8">
              Не блог ради блога. Здесь разобраны вопросы, на которые я всё равно отвечаю
              в переписке каждую неделю: сколько это стоит и почему, что выбрать, почему
              сайт не в поиске и что спросить у подрядчика, чтобы не попасть. Отвечаю так
              же, как ответил бы вам лично, — включая то, что мне невыгодно.
            </p>
          </div>
        </section>

        <section className="section pt-8">
          <div className="container">
            <div className="flex flex-col gap-3">
              {ARTICLES.map((a, i) => (
                <Reveal key={a.slug} delay={Math.min(i, 4) * 50}>
                  <a
                    href={asset(`/stati/${a.slug}/`)}
                    className="glass-flat glass-hover block rounded-[var(--r-md)] p-5 sm:p-7"
                  >
                    <p className="t-micro flex flex-wrap items-center gap-x-2 gap-y-1">
                      <time dateTime={a.date}>{DATE_FMT.format(new Date(a.date))}</time>
                      <span aria-hidden>·</span>
                      <span>{readMinutes(a)} мин</span>
                    </p>
                    <h2 className="t-h3 mt-3 max-w-[30ch] text-[1.1875rem] sm:text-[1.375rem]">
                      {a.h1}
                    </h2>
                    <p className="t-body measure mt-2 text-[0.9375rem]">{a.lead}</p>
                    <span className="mt-4 inline-flex items-center gap-1.5 text-[0.9375rem] text-text-2">
                      Читать
                      <ArrowRight size={15} strokeWidth={1.5} aria-hidden />
                    </span>
                  </a>
                </Reveal>
              ))}
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
