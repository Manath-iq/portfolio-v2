import { Check, Minus } from 'lucide-react'
import { SectionHead, W } from '@/components/SectionHead'
import { Reveal } from '@/components/Reveal'
import { cn } from '@/lib/utils'

type Row = { label: string; values: (string | true | false)[] }

const PLANS = [
  { name: 'Лендинг', price: '45 000', term: '7–10 дней' },
  { name: 'Лендинг+', price: '75 000', term: '12–18 дней', featured: true },
  { name: 'Многостраничник', price: '120 000', term: 'от 25 дней' },
]

const ROWS: Row[] = [
  {
    label: 'Объём',
    values: ['8–10 блоков', 'То же + анимации, калькулятор', '5–15 страниц'],
  },
  { label: 'Дизайн и тексты', values: [true, true, true] },
  { label: 'Адаптив', values: [true, true, true] },
  { label: 'Заявки в Telegram', values: [true, true, true] },
  {
    label: 'SEO под запросы',
    values: ['базовая структура', '10–15 запросов', 'полная структура'],
  },
  { label: 'Яндекс.Бизнес', values: [false, true, true] },
  { label: 'Панель редактирования', values: [false, false, true] },
]

function Value({ v }: { v: string | true | false }) {
  if (v === true)
    return <Check size={20} strokeWidth={1.5} className="text-text" aria-label="есть" />
  if (v === false)
    return <Minus size={20} strokeWidth={1.5} className="text-text-3" aria-label="нет" />
  return <span className="text-[0.9375rem] text-text-2">{v}</span>
}

export function Pricing() {
  return (
    <section id="tseny" className="section" aria-labelledby="tseny-h">
      <div className="container-wide">
        <SectionHead eyebrow="цены" id="tseny-h">
          Три формата. Цифры настоящие, <W>не «от»</W> в никуда.
        </SectionHead>

        <div className="mt-12 grid gap-4 lg:grid-cols-3">
          {PLANS.map((plan, i) => (
            <Reveal key={plan.name} delay={i * 60}>
              <div
                className={cn(
                  'relative flex h-full flex-col overflow-hidden rounded-[var(--r-lg)] p-6 sm:p-7',
                  'border border-hairline bg-[var(--surface)]',
                  'shadow-[inset_0_1px_0_rgba(255,255,255,.10),0_24px_60px_-24px_rgba(0,0,0,.85)]',
                  plan.featured && 'border-hairline-2',
                )}
              >
                {/* BorderBeam — один из трёх эффектных компонентов на странице */}
                {plan.featured ? <span aria-hidden className="beam-ring" /> : null}

                {/* строка под пилюлю есть у всех — иначе цены не встанут в одну линию */}
                <div className="mb-5 h-[26px]">
                  {plan.featured ? (
                    <span className="inline-flex items-center rounded-[var(--r-pill)] border border-hairline bg-black/30 px-3 py-1 font-mono text-[0.6875rem] text-text-2">
                      Чаще всего берут
                    </span>
                  ) : null}
                </div>

                <h3 className="t-h3">{plan.name}</h3>

                <p className="mt-5 flex items-baseline gap-1.5">
                  <span className="text-[clamp(2.4rem,3vw,3.2rem)] leading-none font-semibold tracking-[-0.04em]">
                    {plan.price}
                  </span>
                  <span className="text-[clamp(2.4rem,3vw,3.2rem)] leading-none font-semibold text-text-3">
                    ₽
                  </span>
                </p>

                <p className="t-micro mt-3">срок {plan.term}</p>

                <dl className="mt-7 flex flex-col gap-3 border-t border-hairline pt-6">
                  {ROWS.map((row) => (
                    <div key={row.label} className="flex items-center justify-between gap-4">
                      <dt className="text-[0.9375rem] text-text-3">{row.label}</dt>
                      <dd className="text-right">
                        <Value v={row.values[i]} />
                      </dd>
                    </div>
                  ))}
                </dl>

                {/* data-plan подхватывает форма (см. LeadForm): человек, нажавший
                    на конкретном тарифе, должен увидеть его в заявке, а не
                    объяснять заново то, что уже выбрал. Секция остаётся
                    серверной — ловится делегированием, а не onClick. */}
                <a href="#zayavka" data-plan={plan.name} className="btn btn-accent mt-8 w-full">
                  Обсудить проект
                </a>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={180}>
          <p className="t-body measure mt-8 text-[0.9375rem]">
            Домен и хостинг — 2 500–5 000 ₽ в год, платятся напрямую провайдеру и остаются
            вашими, я на этом не зарабатываю. Правки 30 дней после запуска бесплатно.
            Домен, хостинг и исходники оформляются на вас — уйти к другому разработчику
            можно в любой момент, ничего не выкупая.
          </p>
        </Reveal>
      </div>
    </section>
  )
}
