import { ArrowRight, ArrowUpRight } from 'lucide-react'
import type { NichePage } from '@/data/niche-pages'
import { NICHE_PAGES } from '@/data/niche-pages'
import { CITIES } from '@/data/cities'
import { PROJECTS } from '@/data/projects'
import { SITE } from '@/data/site'
import { SectionHead, W } from '@/components/SectionHead'
import { Reveal } from '@/components/Reveal'
import { asset } from '@/lib/asset'

export function NicheHero({ niche }: { niche: NichePage }) {
  return (
    <section id="top" className="relative overflow-hidden pt-28 pb-14 sm:pt-32 sm:pb-20">
      <div className="container relative flex flex-col items-center text-center">
        <Reveal>
          <nav aria-label="Хлебные крошки" className="t-micro">
            <a href={asset('/')} className="transition-colors hover:text-text-2">
              Главная
            </a>
            <span className="mx-2" aria-hidden>
              /
            </span>
            <span className="text-text-2">{niche.label}</span>
          </nav>
        </Reveal>

        <Reveal delay={60}>
          <h1 className="t-h1 mt-6 max-w-[16ch]">{niche.h1}</h1>
        </Reveal>

        <Reveal delay={120}>
          <p className="t-lead measure mx-auto mt-6 text-balance">{niche.lead}</p>
        </Reveal>

        <Reveal delay={180}>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <a href="#zayavka" className="btn btn-accent">
              Обсудить проект
            </a>
            <a href="#raboty" className="btn btn-glass">
              Смотреть работы
            </a>
          </div>
        </Reveal>

        <Reveal delay={240}>
          <p className="t-micro mt-5">от 45 000 ₽ · 7–10 дней · предоплата 50%</p>
        </Reveal>
      </div>
    </section>
  )
}

/** Как в этой нише принимается решение. Два-три абзаца. */
export function NicheIntro({ niche }: { niche: NichePage }) {
  return (
    <section className="section pt-0" aria-labelledby="reshenie-h">
      <div className="container">
        <Reveal className="flex flex-col gap-4">
          <span className="t-eyebrow">как здесь выбирают</span>
          <h2 id="reshenie-h" className="t-h2 max-w-[18ch]">
            Что <W>решает</W> в этой нише
          </h2>
        </Reveal>

        <div className="mt-10 flex max-w-[68ch] flex-col gap-5">
          {niche.intro.map((p, i) => (
            <Reveal key={i} delay={Math.min(i, 3) * 60}>
              <p className="t-body">{p}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/**
 * Структура страницы под нишу — ядро всей посадочной.
 * Нумерация ведётся списком <ol>, а не рисуется: порядок здесь и есть смысл.
 */
export function NicheBlocks({ niche }: { niche: NichePage }) {
  return (
    <section id="struktura" className="section pt-0" aria-labelledby="struktura-h">
      <div className="container">
        <SectionHead eyebrow="структура" id="struktura-h">
          В каком порядке идут <W>экраны</W>
        </SectionHead>

        <p className="t-body measure mt-8">
          Это скелет, а не шаблон: под конкретный бизнес блоки двигаются, что-то
          выпадает, что-то добавляется после брифа. Но порядок ответов на вопросы
          человека меняется редко — он и определяет, дочитает он до формы или нет.
        </p>

        <ol className="mt-10 flex flex-col gap-3">
          {niche.blocks.map((b, i) => (
            <Reveal key={b.n} delay={Math.min(i, 5) * 50}>
              <li className="glass-flat flex gap-4 rounded-[var(--r-md)] p-5 sm:gap-6 sm:p-6">
                <span className="t-micro shrink-0 pt-1 tabular-nums">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="min-w-0">
                  <h3 className="t-h3 text-[1.0625rem] sm:text-[1.1875rem]">{b.n}</h3>
                  <p className="t-body mt-2 text-[0.9375rem]">{b.why}</p>
                </div>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}

/** Возражения парами: что думает человек — чем это снимается. */
export function NicheObjections({ niche }: { niche: NichePage }) {
  return (
    <section className="section pt-0" aria-labelledby="vozrazheniya-h">
      <div className="container">
        <SectionHead eyebrow="возражения" id="vozrazheniya-h">
          О чём человек думает <W>молча</W>
        </SectionHead>

        <dl className="mt-10 grid gap-3 sm:grid-cols-2">
          {niche.objections.map(([q, a], i) => (
            <Reveal key={q} delay={Math.min(i, 4) * 50}>
              <div className="glass-flat h-full rounded-[var(--r-md)] p-5">
                <dt className="text-[1.0625rem] font-medium">{q}</dt>
                <dd className="t-body mt-2 text-[0.9375rem]">{a}</dd>
              </div>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  )
}

/** Работы этой ниши. Страницы без единой работы не заводятся вовсе. */
export function NicheWorks({ niche }: { niche: NichePage }) {
  const works = niche.projectIds
    .map((id) => PROJECTS.find((p) => p.id === id))
    .filter((p): p is (typeof PROJECTS)[number] => Boolean(p))

  return (
    <section
      id="raboty"
      className="relative overflow-hidden bg-bg-2 py-[var(--section-y)]"
      aria-labelledby="raboty-h"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-[var(--bg)] to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[var(--bg)] to-transparent"
      />

      <div className="container-wide relative">
        <SectionHead eyebrow="работы" id="raboty-h">
          Как это выглядит <W>вживую</W>
        </SectionHead>

        <div className="mt-10 grid gap-4 lg:mt-14 lg:grid-cols-2">
          {works.map((p, i) => (
            <Reveal key={p.id} delay={i * 60}>
              <article className="glass-flat flex h-full flex-col overflow-hidden rounded-[var(--r-lg)]">
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-black">
                  <img
                    src={asset(p.poster)}
                    alt={p.alt}
                    width={1600}
                    height={1000}
                    loading={i === 0 ? 'eager' : 'lazy'}
                    className="size-full object-cover object-top"
                  />
                  {p.isDemo ? (
                    <span className="absolute top-3 left-3 rounded-[var(--r-pill)] border border-hairline bg-black/60 px-2.5 py-1 font-mono text-[0.6875rem] text-text-2 backdrop-blur-sm">
                      демо-концепт
                    </span>
                  ) : null}
                </div>

                <div className="flex flex-1 flex-col gap-3 p-5 sm:p-6">
                  <p className="t-eyebrow">
                    {p.niche.toLowerCase()} · {p.city.toLowerCase()}
                  </p>
                  <h3 className="t-h3">{p.title}</h3>
                  <p className="t-body text-[0.9375rem]">{p.desc}</p>

                  {p.liveUrl ? (
                    <a
                      href={p.liveUrl}
                      target="_blank"
                      rel="noopener"
                      className="btn btn-accent mt-auto w-fit"
                    >
                      {p.isDemo ? 'Открыть демо' : 'Открыть сайт'}
                      <ArrowUpRight size={16} strokeWidth={1.5} aria-hidden />
                    </a>
                  ) : null}
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/** Перелинковка: соседние ниши, все ниши и города. */
export function NicheLinks({ niche }: { niche: NichePage }) {
  const related = niche.related
    .map((s) => NICHE_PAGES.find((n) => n.slug === s))
    .filter((n): n is NichePage => Boolean(n))

  const rest = NICHE_PAGES.filter(
    (n) => n.slug !== niche.slug && !niche.related.includes(n.slug),
  )

  return (
    <section className="section" aria-labelledby="eshe-h">
      <div className="container">
        <SectionHead eyebrow="другие ниши" id="eshe-h">
          Под что ещё <W>собираю</W>
        </SectionHead>

        <div className="mt-10 grid gap-3 sm:grid-cols-2">
          {related.map((n, i) => (
            <Reveal key={n.slug} delay={i * 60}>
              <a
                href={asset(`/${n.slug}/`)}
                className="glass-flat glass-hover flex h-full flex-col rounded-[var(--r-md)] p-5"
              >
                <h3 className="t-h3 text-[1.1875rem]">{n.label}</h3>
                <p className="t-body mt-2 text-[0.9375rem]">{n.lead}</p>
                <span className="mt-auto inline-flex items-center gap-1.5 pt-4 text-[0.9375rem] text-text-2">
                  Подробнее
                  <ArrowRight size={15} strokeWidth={1.5} aria-hidden />
                </span>
              </a>
            </Reveal>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {rest.map((n) => (
            <a key={n.slug} href={asset(`/${n.slug}/`)} className="btn btn-glass h-10 text-sm">
              {n.label}
            </a>
          ))}
        </div>

        <p className="t-body measure mt-10">
          Работаю по всему Татарстану — {SITE.city}, {CITIES.map((c) => c.name).join(', ')}{' '}
          и дальше. Ниша важнее географии: она задаёт структуру, а город на неё
          не влияет.
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          <a href={asset('/')} className="btn btn-glass h-10 text-sm">
            {SITE.city}
          </a>
          {CITIES.map((c) => (
            <a
              key={c.slug}
              href={asset(`/${c.slug}/`)}
              className="btn btn-glass h-10 text-sm"
            >
              {c.name}
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
