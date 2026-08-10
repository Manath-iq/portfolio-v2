'use client'

import { useEffect, useRef } from 'react'
import { W } from '@/components/SectionHead'
import { Reveal } from '@/components/Reveal'
import { PROJECTS } from '@/data/projects'

type Feature = {
  id: string
  title: React.ReactNode
  points: [string, string][]
  projectId: string
}

const FEATURES: Feature[] = [
  {
    id: 'struktura',
    title: (
      <>
        Человек читает сверху вниз. Страница <W>отвечает</W> в том же порядке.
      </>
    ),
    points: [
      ['Первый экран отвечает «что это»', 'за две секунды, без прокрутки, без загадок.'],
      [
        'Дальше по одному возражению за экран',
        'цена, сроки, «а вдруг не получится», «а кто вы такие».',
      ],
      ['Кнопка там, где созрело решение', 'не одна внизу, а на каждом переломе.'],
    ],
    projectId: 'uzi-ayaz',
  },
  {
    id: 'skorost',
    title: (
      <>
        Половина заходов с телефона. Половина уходит, если <W>тормозит</W>.
      </>
    ),
    points: [
      [
        'Картинки в WebP, видео до 600 КБ',
        'грузится то, что видно, остальное ждёт своей очереди.',
      ],
      [
        'Шрифты локально',
        'без обращения к чужим серверам, которые из России отвечают через раз.',
      ],
      ['Проверяю на реальном телефоне', 'не в эмуляторе, а на своём и на чужом.'],
    ],
    projectId: 'sportpit-sostav',
  },
  {
    id: 'zayavki',
    title: (
      <>
        Заявка приходит в Telegram. Через <W>восемь секунд</W>, а не завтра.
      </>
    ),
    points: [
      ['Форма без перезагрузки', 'человек видит ответ там же, где нажал.'],
      [
        'Ничего не хранится на сайте',
        'заявка уходит в бота и всё, базы для утечки просто нет.',
      ],
      [
        'Цели в Метрике настроены сразу',
        'видно, откуда пришёл каждый, а не «трафик вырос».',
      ],
    ],
    projectId: 'massage-nk',
  },
]

/** Видео стартует, только когда блок в кадре, и встаёт при уходе. */
function StickyVideo({ projectId }: { projectId: string }) {
  const p = PROJECTS.find((x) => x.id === projectId) ?? PROJECTS[0]
  const ref = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const v = ref.current
    if (!v) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) v.play().catch(() => {})
        else v.pause()
      },
      { threshold: 0.25 },
    )
    io.observe(v)
    return () => io.disconnect()
  }, [])

  return (
    <div className="glass-flat overflow-hidden rounded-[var(--r-lg)] p-2">
      <div className="overflow-hidden rounded-[var(--r-md)] bg-black">
        {p.video ? (
          <video
            ref={ref}
            poster={p.poster}
            muted
            loop
            playsInline
            preload="none"
            width={1152}
            height={720}
            className="aspect-[16/10] w-full object-cover object-top"
          >
            <source src={p.video} type="video/webm" />
            <source src={p.video.replace('.webm', '.mp4')} type="video/mp4" />
          </video>
        ) : (
          <img
            src={p.poster}
            alt={p.alt}
            width={1600}
            height={1000}
            loading="lazy"
            className="aspect-[16/10] w-full object-cover object-top"
          />
        )}
      </div>
      <p className="t-micro px-2 pt-2.5 pb-1">{p.title}</p>
    </div>
  )
}

export function StickyFeatures() {
  return (
    <div className="flex flex-col">
      {FEATURES.map((f) => (
        <section key={f.id} className="section pt-0" aria-labelledby={`${f.id}-h`}>
          <div className="container-wide">
            <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
              <Reveal className="lg:py-10">
                <h2 id={`${f.id}-h`} className="t-h2 max-w-[16ch]">
                  {f.title}
                </h2>

                <ul className="mt-9 flex flex-col gap-6">
                  {f.points.map(([strong, rest]) => (
                    <li key={strong} className="measure">
                      <span className="font-medium">{strong}</span>
                      <span className="text-text-2"> — {rest}</span>
                    </li>
                  ))}
                </ul>
              </Reveal>

              {/* картинка стоит на месте, пока текст проходит мимо */}
              <div className="lg:sticky lg:top-28">
                <Reveal delay={80}>
                  <StickyVideo projectId={f.projectId} />
                </Reveal>
              </div>
            </div>
          </div>
        </section>
      ))}
    </div>
  )
}
