'use client'

import { useEffect, useRef, useState } from 'react'
import { ArrowRight, Check, Minus } from 'lucide-react'
import { SectionHead, W } from '@/components/SectionHead'
import { Reveal } from '@/components/Reveal'
import { cn } from '@/lib/utils'

/** [что сравниваем, как у шаблона, как у меня] */
const ROWS: [string, string, string][] = [
  ['Структура', 'Универсальная, как у всех', 'Под конкретный бизнес и его возражения'],
  ['Тексты', 'Рыба или автозамена города', 'Пишу сам по брифу'],
  ['Позиции в Яндексе', 'Не индексируется толком', 'Структура и техчасть под поиск с первого дня'],
  ['Мобильная версия', 'Разъезжается на половине экранов', 'Проверяю на реальных устройствах'],
  ['Заявки', 'На почту, которую никто не читает', 'В Telegram, мгновенно'],
  ['Кто делает', 'Менеджер, потом фрилансер, потом верстальщик', 'Я, один, с тобой напрямую'],
  ['Исходники и домен', 'Остаются у студии', 'Оформляются на тебя'],
]

const PLANS = [
  {
    id: 'shablon',
    price: '15 000',
    tab: 'Шаблон за 15 000',
    caption: 'Шаблон за 15 000 ₽',
    summary: 'Сайт, который уже стоит у трёх конкурентов в этом же городе.',
  },
  {
    id: 'moy',
    price: '45 000',
    tab: 'Сайт от меня',
    caption: 'Сайт от меня, от 45 000 ₽',
    summary: 'Структура под бизнес, тексты по брифу, исходники и домен на тебя.',
  },
] as const

/**
 * Сравнение через переключатель цены, а не таблицей.
 *
 * Таблица здесь была честная, но нечитаемая: три колонки на семь строк — это
 * двадцать одна ячейка, которые надо сличать глазами. Их никто не сличает.
 * Переключатель оставляет на экране семь строк вместо двадцати одной, а само
 * сравнение делает движением: подписи слева стоят на месте, ответы справа
 * меняются целиком. Разницу видно, а не вычитывают.
 *
 * Без JS переключателя нет и обе колонки просто стоят одна под другой со
 * своими заголовками — весь текст на месте. Управляет этим data-js на
 * обёртке и правила .cmp-* в globals.css: тот же приём, что у Reveal.
 */
export function Comparison() {
  const [active, setActive] = useState(1)
  const wrap = useRef<HTMLDivElement>(null)
  const tabs = useRef<(HTMLButtonElement | null)[]>([])

  useEffect(() => {
    wrap.current?.setAttribute('data-js', '')
  }, [])

  // стрелками между вкладками — того же поведения ждут от role="tablist"
  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return
    e.preventDefault()
    const next = e.key === 'ArrowRight' ? (active + 1) % PLANS.length : (active + PLANS.length - 1) % PLANS.length
    setActive(next)
    tabs.current[next]?.focus()
  }

  return (
    <section className="section" aria-labelledby="sravnenie-h">
      <div className="container">
        <SectionHead eyebrow="честный вопрос" id="sravnenie-h">
          А чем это лучше сайта <W>за 15 тысяч</W>?
        </SectionHead>

        <Reveal delay={60}>
          <p className="t-body measure mt-7">
            Открой любой сайт нижнекамской компании — почти наверняка увидишь одно из двух.
            Либо шаблон, у которого город подставлен автозаменой, и такой же стоит у трёх
            конкурентов. Либо одностраничник, который не находится в поиске ни по одному
            запросу и работает ровно до тех пор, пока за него платят рекламу. Цены на них
            обычно нет, и человек уходит к тому, кто цифру написал.
          </p>
        </Reveal>

        <Reveal delay={120}>
          <div ref={wrap} className="glass-flat mt-12 overflow-hidden rounded-[var(--r-lg)]">
            {/* переключатель. Без JS скрыт — переключать нечем */}
            <div className="cmp-tabs border-b border-hairline p-3 sm:p-4">
              <div
                role="tablist"
                aria-label="Что входит в цену"
                onKeyDown={onKeyDown}
                className="relative grid grid-cols-2 gap-1 rounded-[var(--r-pill)] border border-hairline bg-[var(--bg)] p-1"
              >
                {/* бегунок под активной вкладкой */}
                <span
                  aria-hidden
                  className="absolute inset-y-1 left-1 rounded-[var(--r-pill)] bg-[color-mix(in_srgb,var(--accent)_16%,transparent)] ring-1 ring-[color-mix(in_srgb,var(--accent)_45%,transparent)] transition-transform duration-[var(--dur)] ease-[var(--ease)]"
                  style={{
                    width: 'calc(50% - 0.25rem)',
                    transform: `translateX(${active * 100}%)`,
                  }}
                />
                {PLANS.map((p, i) => (
                  <button
                    key={p.id}
                    ref={(el) => {
                      tabs.current[i] = el
                    }}
                    type="button"
                    role="tab"
                    id={`cmp-tab-${p.id}`}
                    aria-selected={i === active}
                    aria-controls={`cmp-panel-${p.id}`}
                    tabIndex={i === active ? 0 : -1}
                    onClick={() => setActive(i)}
                    className={cn(
                      'relative z-10 flex min-h-11 flex-col items-center justify-center rounded-[var(--r-pill)] px-3 py-1.5 transition-colors duration-[var(--dur)]',
                      i === active ? 'text-text' : 'text-text-3 hover:text-text-2',
                    )}
                  >
                    <span className="text-[0.9375rem] font-medium">{p.tab}</span>
                    <span className="font-mono text-[0.75rem] opacity-70">{p.price} ₽</span>
                  </button>
                ))}
              </div>
            </div>

            {PLANS.map((p, i) => {
              const mine = i === 1
              return (
                <div
                  key={p.id}
                  id={`cmp-panel-${p.id}`}
                  role="tabpanel"
                  aria-labelledby={`cmp-tab-${p.id}`}
                  aria-hidden={i !== active}
                  className="cmp-panel"
                >
                  {/* заголовок нужен только когда переключателя нет */}
                  <p className="cmp-caption border-b border-hairline p-5 text-[0.9375rem] font-medium">
                    {p.caption}
                  </p>

                  <ul>
                    {ROWS.map(([label, a, b], r) => (
                      <li
                        key={label}
                        className={cn(
                          'cmp-row flex items-start gap-4 p-5',
                          r < ROWS.length - 1 && 'border-b border-hairline',
                        )}
                        style={{ animationDelay: `${r * 28}ms` }}
                      >
                        <span
                          aria-hidden
                          className={cn(
                            'mt-0.5 grid size-5 shrink-0 place-items-center rounded-full',
                            mine
                              ? 'bg-[color-mix(in_srgb,var(--accent)_18%,transparent)] text-[var(--accent)]'
                              : 'bg-[rgba(255,255,255,.05)] text-text-3',
                          )}
                        >
                          {mine ? (
                            <Check size={13} strokeWidth={2} />
                          ) : (
                            <Minus size={13} strokeWidth={2} />
                          )}
                        </span>

                        <div className="min-w-0 flex-1 sm:flex sm:items-baseline sm:gap-5">
                          <span className="t-micro block sm:w-[11rem] sm:shrink-0">{label}</span>
                          <span
                            className={cn(
                              'mt-1.5 block text-[0.9375rem] sm:mt-0',
                              mine ? 'text-text' : 'text-text-2',
                            )}
                          >
                            {mine ? b : a}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>

                  <p
                    className={cn(
                      'cmp-row border-t border-hairline p-5 text-[0.9375rem]',
                      mine ? 'text-text' : 'text-text-2',
                    )}
                    style={{ animationDelay: `${ROWS.length * 28}ms` }}
                  >
                    {p.summary}
                  </p>
                </div>
              )
            })}
          </div>
        </Reveal>

        <Reveal delay={180}>
          <a
            href="#raboty"
            className="mt-7 inline-flex items-center gap-1.5 text-[0.9375rem] text-text-2 transition-colors hover:text-text"
          >
            Посмотреть, как это выглядит на деле
            <ArrowRight size={15} strokeWidth={1.5} aria-hidden />
          </a>
        </Reveal>
      </div>
    </section>
  )
}
