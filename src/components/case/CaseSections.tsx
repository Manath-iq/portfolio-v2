import { ArrowUpRight } from 'lucide-react'
import type { CasePage } from '@/data/cases'
import { CASES, projectOf } from '@/data/cases'
import { NICHE_PAGES } from '@/data/niche-pages'
import { SITE } from '@/data/site'
import { SectionHead, W } from '@/components/SectionHead'
import { Reveal } from '@/components/Reveal'
import { asset } from '@/lib/asset'
import { numeral } from '@/lib/numeral'

/**
 * Первый экран разбора.
 *
 * Подпись «демо-концепт» стоит здесь, а не в подвале страницы: почти все
 * работы — не клиентские заказы, и человек должен узнать это до того, как
 * прочитает разбор, а не после. Спрятать это вниз было бы выгоднее и нечестно.
 * Работа, собранная под конкретный названный бизнес, подписывается своей
 * строкой из statusLabel: «демо-концепт» для неё — неточность в обе стороны.
 */
export function CaseHero({ c }: { c: CasePage }) {
  const p = projectOf(c)

  return (
    <section id="top" className="relative overflow-hidden pt-28 pb-12 sm:pt-32 sm:pb-16">
      <div className="container relative flex flex-col items-center text-center">
        <Reveal>
          <nav aria-label="Хлебные крошки" className="t-micro">
            <a href={asset('/')} className="transition-colors hover:text-text-2">
              Главная
            </a>
            <span className="mx-2" aria-hidden>
              /
            </span>
            <a href={asset('/raboty/')} className="transition-colors hover:text-text-2">
              Работы
            </a>
            <span className="mx-2" aria-hidden>
              /
            </span>
            <span className="text-text-2">{p.title.split(' — ')[0]}</span>
          </nav>
        </Reveal>

        <Reveal delay={60}>
          <h1 className="t-h1 mt-6 max-w-[17ch]">{c.h1}</h1>
        </Reveal>

        <Reveal delay={120}>
          <p className="t-lead measure mx-auto mt-6 text-balance">{c.lead}</p>
        </Reveal>

        <Reveal delay={180}>
          <p className="t-micro mt-6 flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
            <span>{p.niche.toLowerCase()}</span>
            <span aria-hidden>·</span>
            <span>{p.city.toLowerCase()}</span>
            <span aria-hidden>·</span>
            <span className={p.isDemo ? undefined : 'font-medium text-text-2'}>
              {p.statusLabel ?? (p.isDemo ? 'демо-концепт' : 'работающий сайт клиента')}
            </span>
          </p>
        </Reveal>

        <Reveal delay={240}>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            {p.liveUrl ? (
              <a href={p.liveUrl} target="_blank" rel="noopener" className="btn btn-glass">
                {p.isDemo ? 'Открыть демо' : 'Открыть сайт'}
                <ArrowUpRight size={16} strokeWidth={1.5} aria-hidden />
              </a>
            ) : null}
            <a href="#zayavka" className="btn btn-accent">
              Хочу такой же
            </a>
          </div>
        </Reveal>
      </div>

      <div className="container-wide relative mt-10 sm:mt-14">
        <Reveal delay={120}>
          <div className="glass-flat overflow-hidden rounded-[var(--r-lg)] p-2">
            <img
              src={asset(p.poster)}
              alt={p.alt}
              width={1600}
              height={1000}
              // Единственная картинка первого экрана — грузим сразу, это LCP.
              loading="eager"
              className="w-full rounded-[var(--r-md)] object-cover object-top"
            />
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/** Кто приходит на страницу и чего боится. Два-три абзаца. */
export function CaseTask({ c }: { c: CasePage }) {
  return (
    <section className="section pt-0" aria-labelledby="zadacha-h">
      <div className="container">
        <Reveal className="flex flex-col gap-4">
          <span className="t-eyebrow">задача</span>
          <h2 id="zadacha-h" className="t-h2 max-w-[18ch]">
            Кто сюда <W>приходит</W>
          </h2>
        </Reveal>

        <div className="mt-10 flex max-w-[68ch] flex-col gap-5">
          {c.task.map((t, i) => (
            <Reveal key={i} delay={Math.min(i, 3) * 60}>
              <p className="t-body">{t}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/** Что решено и почему. Ядро разбора. */
export function CaseDecisions({ c }: { c: CasePage }) {
  return (
    <section id="resheniya" className="section pt-0" aria-labelledby="resheniya-h">
      <div className="container">
        <SectionHead eyebrow="решения" id="resheniya-h">
          Что сделано и <W>почему</W>
        </SectionHead>

        <ol className="mt-10 flex flex-col gap-3">
          {c.decisions.map((d, i) => (
            <Reveal key={d.n} delay={Math.min(i, 5) * 50}>
              <li className="glass-flat flex gap-4 rounded-[var(--r-md)] p-5 sm:gap-6 sm:p-6">
                <span className="t-micro shrink-0 pt-1 tabular-nums">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="min-w-0">
                  <h3 className="t-h3 text-[1.0625rem] sm:text-[1.1875rem]">{d.n}</h3>
                  <p className="t-body mt-2 text-[0.9375rem]">{d.why}</p>
                </div>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}

/**
 * Чего на странице нет намеренно.
 *
 * Секция не декоративная: половина отличий этих работ от шаблона — в том,
 * чего на них не поставили. Список того, что убрано и почему, показывает
 * способ думать лучше, чем ещё пять пунктов про то, что добавлено.
 */
export function CaseOmitted({ c }: { c: CasePage }) {
  return (
    <section className="section pt-0" aria-labelledby="net-h">
      <div className="container">
        <SectionHead eyebrow="чего здесь нет" id="net-h">
          Убрано <W>намеренно</W>
        </SectionHead>

        <p className="t-body measure mt-8">
          Каждый пункт ниже стоит на большинстве сайтов этой ниши. Здесь его нет — и это
          решение, а не забывчивость.
        </p>

        <ul className="mt-10 grid gap-3 sm:grid-cols-2">
          {c.omitted.map((o, i) => (
            <Reveal key={o.n} delay={Math.min(i, 3) * 60}>
              <li className="glass-flat h-full rounded-[var(--r-md)] p-5 sm:p-6">
                <h3 className="t-h3 text-[1.0625rem] sm:text-[1.125rem]">{o.n}</h3>
                <p className="t-body mt-2 text-[0.9375rem]">{o.why}</p>
              </li>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}

/**
 * Чего не хватает, чтобы страница стала живым сайтом.
 *
 * Секция есть только у работ, собранных под конкретный названный бизнес,
 * который их ещё не купил. Она делает две вещи сразу: честно называет, что
 * на демо стоит вместо настоящих данных, и превращает разбор в понятный
 * следующий шаг — вместо «напишите мне» человек видит короткий список того,
 * что может собрать сам, и понимает, сколько до запуска осталось.
 */
export function CaseLaunch({ c }: { c: CasePage }) {
  if (!c.launch?.length) return null

  return (
    <section id="zapusk" className="section pt-0" aria-labelledby="zapusk-h">
      <div className="container">
        <SectionHead eyebrow="что нужно для запуска" id="zapusk-h">
          Осталось <W>собрать данные</W>
        </SectionHead>

        <p className="t-body measure mt-8">
          Страница готова и работает — её можно открыть с телефона прямо сейчас. Не
          готовы только те данные, которые есть лишь у самого бизнеса. Пока их нет, на
          их местах стоят пометки прямо в коде, а сайт закрыт от индексации: демо
          с выдуманным прайсом в поиске навредило бы сильнее, чем отсутствие сайта.
        </p>

        <ol className="mt-10 flex flex-col gap-3">
          {c.launch.map((l, i) => (
            <Reveal key={l.n} delay={Math.min(i, 5) * 50}>
              <li className="glass-flat flex gap-4 rounded-[var(--r-md)] p-5 sm:gap-6 sm:p-6">
                <span className="t-micro shrink-0 pt-1 tabular-nums">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="min-w-0">
                  <h3 className="t-h3 text-[1.0625rem] sm:text-[1.1875rem]">{l.n}</h3>
                  <p className="t-body mt-2 text-[0.9375rem]">{l.why}</p>
                </div>
              </li>
            </Reveal>
          ))}
        </ol>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <a href="#zayavka" className="btn btn-accent">
            Обсудить запуск
          </a>
          <a href={SITE.telegram} target="_blank" rel="noopener" className="btn btn-glass">
            Написать в Telegram
            <ArrowUpRight size={16} strokeWidth={1.5} aria-hidden />
          </a>
        </div>
      </div>
    </section>
  )
}

/**
 * Перелинковка: нишевая страница этой работы и два соседних разбора.
 * Соседей берём по кругу от текущего — так каждый разбор получает входящие
 * ссылки, и ни один не остаётся тупиком в конце списка.
 */
export function CaseLinks({ c }: { c: CasePage }) {
  const p = projectOf(c)
  const niche = NICHE_PAGES.find((n) => n.slug === p.nicheSlug) ?? null

  const i = CASES.findIndex((x) => x.slug === c.slug)
  const neighbours = [CASES[(i + 1) % CASES.length], CASES[(i + 2) % CASES.length]]

  return (
    <section className="section pt-0" aria-labelledby="dalshe-h">
      <div className="container">
        <SectionHead eyebrow="дальше" id="dalshe-h">
          Куда смотреть <W>ещё</W>
        </SectionHead>

        <div className="mt-10 grid gap-3 sm:grid-cols-3">
          {niche ? (
            <Reveal>
              <a
                href={asset(`/${niche.slug}/`)}
                className="glass-flat glass-hover flex h-full flex-col rounded-[var(--r-md)] p-5"
              >
                <p className="t-eyebrow">ниша целиком</p>
                <h3 className="t-h3 mt-3 text-[1.0625rem]">{niche.h1}</h3>
                <p className="t-body mt-2 text-[0.9375rem]">{niche.lead}</p>
              </a>
            </Reveal>
          ) : null}

          {neighbours.map((n, k) => {
            const np = projectOf(n)
            return (
              <Reveal key={n.slug} delay={(k + 1) * 60}>
                <a
                  href={asset(`/raboty/${n.slug}/`)}
                  className="glass-flat glass-hover flex h-full flex-col rounded-[var(--r-md)] p-5"
                >
                  <p className="t-eyebrow">разбор работы</p>
                  <h3 className="t-h3 mt-3 text-[1.0625rem]">{n.h1}</h3>
                  <p className="t-body mt-2 text-[0.9375rem]">{np.desc}</p>
                </a>
              </Reveal>
            )
          })}
        </div>

        <div className="mt-8">
          <a href={asset('/raboty/')} className="btn btn-glass">
            Все {numeral(CASES.length)} работ
          </a>
        </div>
      </div>
    </section>
  )
}
