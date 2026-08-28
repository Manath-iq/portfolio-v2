import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ArrowRight } from 'lucide-react'
import { ARTICLES, getArticle, readMinutes } from '@/data/articles'
import { CASES, projectOf } from '@/data/cases'
import { NICHE_PAGES } from '@/data/niche-pages'
import { SITE } from '@/data/site'
import { Header } from '@/components/sections/Header'
import { Footer } from '@/components/sections/Footer'
import { MobileBar } from '@/components/sections/MobileBar'
import { LeadForm } from '@/components/sections/LeadForm'
import { ArticleBody } from '@/components/article/ArticleBody'
import { AiSummary } from '@/components/article/AiSummary'
import { ArticleVisual } from '@/components/article/ArticleVisual'
import { ArticleJsonLd } from '@/components/article/ArticleJsonLd'
import { SectionHead, W } from '@/components/SectionHead'
import { Reveal } from '@/components/Reveal'
import { Spotlight } from '@/components/ui/Spotlight'
import { asset } from '@/lib/asset'

type Props = { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return ARTICLES.map((a) => ({ slug: a.slug }))
}

export const dynamicParams = false

/**
 * В шапке у «Статей» раскрывается список: из статьи в статью человек иначе
 * ходит только через витрину. Пять свежих, а не все десять, — длинный список
 * в шапке перестаёт читаться и начинает пролистываться. Текущая статья из
 * списка выброшена: ссылка на страницу, на которой стоишь, — мёртвый пункт.
 */
const navFor = (slug: string) => [
  {
    label: 'Статьи',
    href: '/stati/',
    items: [...ARTICLES]
      .reverse()
      .filter((x) => x.slug !== slug)
      .slice(0, 5)
      .map((x) => ({ label: x.h1, href: `/stati/${x.slug}/` })),
  },
  { label: 'Работы', href: '/raboty/' },
  { label: 'Цены', href: '/#tseny' },
]

const DATE_FMT = new Intl.DateTimeFormat('ru-RU', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const a = getArticle(slug)
  if (!a) return {}

  const url = `${SITE.url}/stati/${a.slug}/`

  // Своя картинка на каждую статью: ссылку кидают в Telegram и WhatsApp,
  // и с общей все шесть выглядели одинаково — «12 проверок» ничем не
  // отличались от «сколько стоит сайт». Собирается scripts/og.mjs
  // из заголовка и лида самой статьи, расходиться им неоткуда.
  const image = `${SITE.url}/og/stati-${a.slug}.jpg`

  return {
    title: a.title,
    description: a.description,
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      locale: 'ru_RU',
      url,
      siteName: `${SITE.brand} — сайты для бизнеса`,
      title: a.title,
      description: a.description,
      publishedTime: a.date,
      authors: [SITE.name],
      images: [{ url: image, width: 1200, height: 630, alt: a.h1 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: a.title,
      description: a.description,
      images: [image],
    },
    robots: { index: true, follow: true },
  }
}

export default async function ArticleRoute({ params }: Props) {
  const { slug } = await params
  const a = getArticle(slug)
  if (!a) notFound()

  const niches = a.relatedNiches
    .map((s) => NICHE_PAGES.find((n) => n.slug === s))
    .filter((n): n is (typeof NICHE_PAGES)[number] => Boolean(n))
  const cases = a.relatedCases
    .map((s) => CASES.find((c) => c.slug === s))
    .filter((c): c is (typeof CASES)[number] => Boolean(c))

  // Следующая статья по кругу: последняя ведёт на первую, тупиков нет.
  const i = ARTICLES.findIndex((x) => x.slug === a.slug)
  const next = ARTICLES[(i + 1) % ARTICLES.length]

  return (
    <div className="relative isolate">
      <ArticleJsonLd a={a} />
      <Spotlight />
      <Header nav={navFor(a.slug)} logoHref={asset('/')} />

      <main className="relative">
        <article>
          <header className="pt-28 pb-4 sm:pt-32">
            <div className="container">
              <Reveal>
                <nav aria-label="Хлебные крошки" className="t-micro">
                  <a href={asset('/')} className="transition-colors hover:text-text-2">
                    Главная
                  </a>
                  <span className="mx-2" aria-hidden>
                    /
                  </span>
                  <a href={asset('/stati/')} className="transition-colors hover:text-text-2">
                    Статьи
                  </a>
                </nav>
              </Reveal>

              <Reveal delay={60}>
                <h1 className="t-h1 mt-6 max-w-[20ch] text-[clamp(2rem,4.4vw,3.25rem)]">
                  {a.h1}
                </h1>
              </Reveal>

              <Reveal delay={120}>
                <p className="t-lead measure mt-6">{a.lead}</p>
              </Reveal>

              <Reveal delay={180}>
                <p className="t-micro mt-6 flex flex-wrap items-center gap-x-2 gap-y-1">
                  <time dateTime={a.date}>{DATE_FMT.format(new Date(a.date))}</time>
                  <span aria-hidden>·</span>
                  <span>{readMinutes(a)} мин чтения</span>
                  <span aria-hidden>·</span>
                  <span>{SITE.name}</span>
                </p>
              </Reveal>
            </div>
          </header>

          {/* Обложка после шапки, а не над заголовком: сверху человек ищет,
              туда ли попал, и картинка на этом месте только отодвигает ответ.
              Схема идёт следом и уже подкрепляет заголовок, а не спорит с ним. */}
          {a.visual && (
            <div className="container pt-8">
              <Reveal delay={220}>
                <ArticleVisual kind={a.visual} variant="cover" />
              </Reveal>
            </div>
          )}

          <div className="container pt-10 pb-[var(--section-y)]">
            {a.summary && (
              <div className="mb-10">
                <Reveal>
                  <AiSummary points={a.summary} />
                </Reveal>
              </div>
            )}

            <ArticleBody blocks={a.blocks} />
          </div>
        </article>

        <section className="section pt-0" aria-labelledby="dalshe-h">
          <div className="container">
            <SectionHead eyebrow="дальше" id="dalshe-h">
              По теме <W>рядом</W>
            </SectionHead>

            <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <Reveal>
                <a
                  href={asset(`/stati/${next.slug}/`)}
                  className="glass-flat glass-hover flex h-full flex-col rounded-[var(--r-md)] p-5"
                >
                  <p className="t-eyebrow">следующая статья</p>
                  <h3 className="t-h3 mt-3 text-[1.0625rem]">{next.h1}</h3>
                  <p className="t-body mt-2 text-[0.9375rem]">{next.lead}</p>
                </a>
              </Reveal>

              {niches.slice(0, 1).map((n) => (
                <Reveal key={n.slug} delay={60}>
                  <a
                    href={asset(`/${n.slug}/`)}
                    className="glass-flat glass-hover flex h-full flex-col rounded-[var(--r-md)] p-5"
                  >
                    <p className="t-eyebrow">ниша</p>
                    <h3 className="t-h3 mt-3 text-[1.0625rem]">{n.h1}</h3>
                    <p className="t-body mt-2 text-[0.9375rem]">{n.lead}</p>
                  </a>
                </Reveal>
              ))}

              {cases.slice(0, 1).map((c) => (
                <Reveal key={c.slug} delay={120}>
                  <a
                    href={asset(`/raboty/${c.slug}/`)}
                    className="glass-flat glass-hover flex h-full flex-col rounded-[var(--r-md)] p-5"
                  >
                    <p className="t-eyebrow">разбор работы</p>
                    <h3 className="t-h3 mt-3 text-[1.0625rem]">{c.h1}</h3>
                    <p className="t-body mt-2 text-[0.9375rem]">{projectOf(c).desc}</p>
                  </a>
                </Reveal>
              ))}
            </div>

            <div className="mt-8">
              <a href={asset('/stati/')} className="btn btn-glass">
                Все статьи
                <ArrowRight size={16} strokeWidth={1.5} aria-hidden />
              </a>
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
