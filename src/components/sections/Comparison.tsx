'use client'

import { useEffect, useRef, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { SectionHead, W } from '@/components/SectionHead'
import { Reveal } from '@/components/Reveal'
import { TemplateSite, type SpotId } from '@/components/comparison/TemplateSite'
import { cn } from '@/lib/utils'

type Row = { id: SpotId; label: string; bad: string; good: string }

/**
 * Порядок — сверху вниз по макету, а не по важности: список работает как
 * легенда к картинке, и номера должны идти в том же направлении, в каком
 * человек ведёт по ней глазами.
 */
const ROWS: Row[] = [
  {
    id: 'seo',
    label: 'Позиции в Яндексе',
    bad: 'Заголовок страницы — «Главная». По названию услуги сайт не находится ничем: искать его нечем.',
    good: 'В заголовке услуга, город и цена. Структура и техчасть под поиск с первого дня, а не «потом закажете SEO».',
  },
  {
    id: 'domain',
    label: 'Исходники и домен',
    bad: 'Адрес на поддомене конструктора. Домен и файлы оформлены на студию — уйти с ними нельзя.',
    good: 'Домен, хостинг и исходники оформляются на вас. Уйти к другому разработчику можно в любой день.',
  },
  {
    id: 'text',
    label: 'Тексты',
    bad: 'Рыба с автозаменой города. Ровно такой же заголовок стоит ещё у трёх компаний в этом же Нижнекамске.',
    good: 'Пишу сам по брифу: заголовок вырастает из фразы владельца и отвечает на вопрос «сколько это стоит».',
  },
  {
    id: 'lead',
    label: 'Заявки',
    bad: 'Уходят на почту, которую открывают раз в неделю. Часть оседает в спаме, и об этом никто не узнаёт.',
    good: 'Приходят в Telegram за восемь секунд. Отвечать можно из той же переписки, с телефона, не открывая ноутбук.',
  },
  {
    id: 'struct',
    label: 'Структура',
    bad: 'Универсальные плитки «Качество · Опыт · Гарантия». Ни одна ничего не сообщает и ни одно возражение не снимает.',
    good: 'Под конкретный бизнес и его возражения: срок, цифра, гарантия — вместо слов, которые подходят кому угодно.',
  },
  {
    id: 'mobile',
    label: 'Мобильная версия',
    bad: 'Разъезжается на половине экранов: заголовок вылезает за край, кнопка уходит в горизонтальную прокрутку.',
    good: 'Отдельная вёрстка под телефон и кнопка звонка внизу экрана. Проверяю на реальных устройствах, а не в эмуляторе.',
  },
  {
    id: 'author',
    label: 'Кто делает',
    bad: 'Менеджер, потом фрилансер, потом верстальщик. В подвале — чужая студия, вопросы через тикеты.',
    good: 'Я, один, напрямую. Правки 30 дней после запуска — сообщением, а не заявкой в поддержку.',
  },
]

const NUMBERS = Object.fromEntries(ROWS.map((r, i) => [r.id, i + 1])) as Record<SpotId, number>

const MODES = [
  { id: 'bad', tab: 'Шаблон', price: '15 000 ₽' },
  { id: 'good', tab: 'Сайт от меня', price: 'от 45 000 ₽' },
] as const

/**
 * Ответ на вопрос секции показывается, а не описывается.
 *
 * Раньше здесь стояла таблица, спрятанная за переключателем: семь строк про
 * шаблон, семь строк про меня, и человек должен был сличать описания. Он их
 * не сличал. Теперь в кадре стоит сам сайт за пятнадцать тысяч, собранный
 * вёрсткой — с «широким спектром услуг», плитками «Качество · Опыт · Гарантия»
 * и заявкой на почту. Семь мест на нём отмечены; клик по метке или по строке
 * списка обводит место и раскрывает, что с ним не так. Тумблер сверху
 * превращает этот же макет в нормальный, не трогая обводку: выбрал «Тексты»,
 * переключил — и видно, как меняется ровно тот заголовок, который обведён.
 *
 * Без JS ни тумблера, ни меток нет: макет стоит в шаблонном состоянии, а
 * список раскрыт целиком — весь текст на месте. Управляет этим data-js на
 * обёртке и правила .cmp-* в globals.css, тот же приём, что у Reveal.
 */
export function Comparison() {
  const [mode, setMode] = useState<'bad' | 'good'>('bad')
  const [spot, setSpot] = useState<SpotId>('text')
  const [touched, setTouched] = useState(false)
  const wrap = useRef<HTMLDivElement>(null)
  const modeBtns = useRef<(HTMLButtonElement | null)[]>([])

  useEffect(() => {
    wrap.current?.setAttribute('data-js', '')
  }, [])

  function pick(id: SpotId) {
    setSpot(id)
    setTouched(true)
  }

  // стрелками между состояниями — того же ждут от radiogroup
  function onModeKey(e: React.KeyboardEvent) {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return
    e.preventDefault()
    const next = mode === 'bad' ? 1 : 0
    setMode(MODES[next].id)
    modeBtns.current[next]?.focus()
  }

  const active = MODES.findIndex((m) => m.id === mode)

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
            запросу и работает ровно до тех пор, пока за него платят рекламу. Вот такой
            сайт целиком — и семь мест, из-за которых он не приносит заявок.
          </p>
        </Reveal>

        {/* data-mode нужен и списку: активная сторона в раскрытой строке
            подсвечивается тем же состоянием, что показано на макете */}
        <div ref={wrap} data-mode={mode}>
          {/* ── тумблер состояния. Без JS скрыт — переключать нечем ── */}
          <Reveal delay={100}>
            {/* display задаётся только в .cmp-modes: утилита flex стояла бы
                в слое utilities и перебила бы скрытие без JS */}
            <div className="cmp-modes mt-10 justify-center">
              <div
                role="radiogroup"
                aria-label="Какой сайт показан на макете"
                onKeyDown={onModeKey}
                className="relative grid grid-cols-2 gap-1 rounded-[var(--r-pill)] border border-hairline bg-[var(--bg-2)] p-1"
              >
                <span
                  aria-hidden
                  className="absolute inset-y-1 left-1 rounded-[var(--r-pill)] bg-[color-mix(in_srgb,var(--accent)_16%,transparent)] ring-1 ring-[color-mix(in_srgb,var(--accent)_45%,transparent)] transition-transform duration-[var(--dur)] ease-[var(--ease)]"
                  style={{ width: 'calc(50% - 0.25rem)', transform: `translateX(${active * 100}%)` }}
                />
                {MODES.map((m, i) => (
                  <button
                    key={m.id}
                    ref={(el) => {
                      modeBtns.current[i] = el
                    }}
                    type="button"
                    role="radio"
                    aria-checked={m.id === mode}
                    tabIndex={m.id === mode ? 0 : -1}
                    onClick={() => setMode(m.id)}
                    className={cn(
                      'relative z-10 flex min-h-11 flex-col items-center justify-center rounded-[var(--r-pill)] px-4 py-1.5 transition-colors duration-[var(--dur)] sm:px-6',
                      m.id === mode ? 'text-text' : 'text-text-3 hover:text-text-2',
                    )}
                  >
                    <span className="text-[0.9375rem] font-medium">{m.tab}</span>
                    <span className="font-mono text-[0.75rem] opacity-70">{m.price}</span>
                  </button>
                ))}
              </div>
            </div>
          </Reveal>

          <div className="mt-8 grid items-start gap-8 lg:grid-cols-12 lg:gap-10">
            {/* ── макет ── */}
            <Reveal delay={140} className="lg:col-span-7">
              <TemplateSite
                mode={mode}
                spot={spot}
                numbers={NUMBERS}
                onPick={pick}
                touched={touched}
              />
              <p className="cmp-hint t-micro mt-3 text-center lg:text-left">
                нажмите на любую метку — или выберите строку в списке
              </p>
            </Reveal>

            {/* ── легенда ── */}
            <Reveal delay={200} className="lg:col-span-5">
              <ul className="glass-flat overflow-hidden rounded-[var(--r-lg)]">
                {ROWS.map((row, i) => {
                  const open = row.id === spot
                  return (
                    <li
                      key={row.id}
                      className={cn(
                        'cmp-item',
                        i < ROWS.length - 1 && 'border-b border-hairline',
                      )}
                      data-open={open}
                    >
                      <button
                        type="button"
                        aria-expanded={open}
                        aria-controls={`cmp-d-${row.id}`}
                        onClick={() => pick(row.id)}
                        className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors duration-[var(--dur)] hover:bg-[rgba(255,255,255,.03)] sm:px-5"
                      >
                        <span className="cmp-num" aria-hidden>
                          {i + 1}
                        </span>
                        <span className="cmp-label flex-1 text-[0.9375rem] font-medium">
                          {row.label}
                        </span>
                      </button>

                      <div id={`cmp-d-${row.id}`} className="cmp-detail">
                        <div>
                          <div className="flex flex-col gap-3 px-4 pb-4 sm:px-5 sm:pb-5">
                            <p className="cmp-side" data-side="bad">
                              <span className="t-micro block">шаблон за 15 000</span>
                              <span className="mt-1 block text-[0.9375rem] text-text-2">
                                {row.bad}
                              </span>
                            </p>
                            <p className="cmp-side" data-side="good">
                              <span className="t-micro block">сайт от меня</span>
                              <span className="mt-1 block text-[0.9375rem]">{row.good}</span>
                            </p>
                          </div>
                        </div>
                      </div>
                    </li>
                  )
                })}
              </ul>
            </Reveal>
          </div>
        </div>

        <Reveal delay={240}>
          <a
            href="#raboty"
            className="mt-8 inline-flex items-center gap-1.5 text-[0.9375rem] text-text-2 transition-colors hover:text-text"
          >
            Посмотреть, как это выглядит на деле
            <ArrowRight size={15} strokeWidth={1.5} aria-hidden />
          </a>
        </Reveal>
      </div>
    </section>
  )
}
