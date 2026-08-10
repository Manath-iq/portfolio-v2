'use client'

import { useState } from 'react'
import { ArrowRight, ArrowUpRight, Send } from 'lucide-react'
import { PROJECTS } from '@/data/projects'
import { Carousel } from '@/components/showcase/Carousel'
import { W } from '@/components/SectionHead'
import { Reveal } from '@/components/Reveal'
import { goal } from '@/lib/metrika'
import { cn } from '@/lib/utils'

const pad = (n: number) => String(n).padStart(2, '0')

export function Showcase() {
  const [active, setActive] = useState(0)
  const n = PROJECTS.length

  return (
    <section
      id="raboty"
      className="relative overflow-hidden bg-bg-2 py-[var(--section-y)]"
      aria-labelledby="raboty-h"
    >
      {/* растворение в основной фон сверху и снизу */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-[var(--bg)] to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[var(--bg)] to-transparent"
      />

      <div className="container-wide relative">
        <Reveal className="flex flex-col gap-4">
          <span className="t-eyebrow">работы</span>
          <h2 id="raboty-h" className="t-h2 max-w-[20ch]">
            Каждый собран под свой бизнес. Ни один — под <W>шаблон</W>.
          </h2>
        </Reveal>

        <div className="mt-12 grid items-center gap-8 lg:mt-16 lg:grid-cols-[45fr_55fr] lg:gap-10">
          {/* панель описания. Все тексты лежат в DOM сразу — переключается видимость. */}
          <div className="glass-flat relative order-2 min-w-0 rounded-[var(--r-lg)] p-6 pb-14 sm:p-8 sm:pb-16 lg:order-1 lg:min-h-[380px]">
            {PROJECTS.map((p, i) => {
              const on = i === active
              const primary = p.caseUrl
                ? { href: p.caseUrl, label: 'Разбор проекта', external: false }
                : p.liveUrl
                  ? {
                      href: p.liveUrl,
                      label: p.isDemo ? 'Открыть демо' : 'Открыть сайт',
                      external: true,
                    }
                  : null

              return (
                <div
                  key={p.id}
                  aria-hidden={!on}
                  className={cn(
                    'flex flex-col gap-4 transition-[opacity,transform,filter] ease-[var(--ease)]',
                    on
                      ? 'opacity-100'
                      : 'pointer-events-none absolute inset-0 -translate-y-3 p-6 opacity-0 blur-[6px] sm:p-8',
                  )}
                  style={{
                    transitionDuration: on ? '220ms' : '180ms',
                    transitionDelay: on ? '120ms' : '0ms',
                  }}
                >
                  <p className="t-eyebrow">
                    {p.niche.toLowerCase()} · {p.city.toLowerCase()}
                  </p>

                  <h3 className="t-h3">{p.title}</h3>

                  <p className="t-body measure">{p.desc}</p>

                  {p.metric ? <p className="t-micro">{p.metric}</p> : null}

                  <div
                    className="mt-2 flex flex-wrap items-center gap-3 transition-[opacity] ease-[var(--ease)]"
                    style={{
                      opacity: on ? 1 : 0,
                      transitionDuration: on ? '220ms' : '120ms',
                      transitionDelay: on ? '200ms' : '0ms',
                    }}
                  >
                    {primary ? (
                      <a
                        href={primary.href}
                        target={primary.external ? '_blank' : undefined}
                        rel={primary.external ? 'noopener' : undefined}
                        tabIndex={on ? undefined : -1}
                        onClick={() => goal('open_site')}
                        className="btn btn-accent"
                      >
                        {primary.label}
                        {primary.external ? (
                          <ArrowUpRight size={16} strokeWidth={1.5} aria-hidden />
                        ) : (
                          <ArrowRight size={16} strokeWidth={1.5} aria-hidden />
                        )}
                      </a>
                    ) : null}

                    {p.tgPost ? (
                      <a
                        href={p.tgPost}
                        target="_blank"
                        rel="noopener"
                        tabIndex={on ? undefined : -1}
                        onClick={() => goal('tg_post')}
                        className="btn btn-glass"
                      >
                        <Send size={16} strokeWidth={1.5} aria-hidden />
                        Пост в Telegram
                      </a>
                    ) : null}

                    {p.caseUrl && p.liveUrl ? (
                      <a
                        href={p.liveUrl}
                        target="_blank"
                        rel="noopener"
                        tabIndex={on ? undefined : -1}
                        onClick={() => goal('open_site')}
                        className="inline-flex items-center gap-1 text-[0.9375rem] text-text-2 transition-colors hover:text-text"
                      >
                        Открыть сайт
                        <ArrowUpRight size={15} strokeWidth={1.5} aria-hidden />
                      </a>
                    ) : null}
                  </div>
                </div>
              )
            })}

            <p className="t-micro absolute right-6 bottom-6 sm:right-8 sm:bottom-8">
              {pad(active + 1)} / {pad(n)}
            </p>
          </div>

          {/* карусель */}
          {/* min-w-0 обязателен: без него горизонтальный скроллер каруcели
              распирает грид-колонку и вся секция уезжает за край экрана */}
          <div className="relative order-1 -mx-[var(--gutter)] min-w-0 lg:order-2 lg:mx-0 lg:h-[min(78vh,760px)]">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 hidden lg:block"
              style={{
                background:
                  'radial-gradient(520px 340px at 50% 50%, rgba(255,77,46,.10), transparent 70%)',
              }}
            />
            <Carousel onActiveChange={setActive} />
          </div>
        </div>
      </div>
    </section>
  )
}
