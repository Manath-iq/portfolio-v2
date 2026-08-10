'use client'

import { useEffect, useRef, useState } from 'react'
import { PAGESPEED } from '@/data/measurements'
import { PROJECTS } from '@/data/projects'
import { cn } from '@/lib/utils'
import { asset } from '@/lib/asset'

/** Запускает колбэк один раз, когда блок появился в кадре. */
function useOnce<T extends HTMLElement>(cb: () => void) {
  const ref = useRef<T>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          cb()
          io.disconnect()
        }
      },
      { threshold: 0.4 },
    )
    io.observe(el)
    return () => io.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return ref
}

/* ── Дизайн под нишу: три реальных первых экрана веером ───────── */

export function FanPreviews() {
  const picks = ['uzi-ayaz', 'baobab', 'dom-proekt']
    .map((id) => PROJECTS.find((p) => p.id === id))
    .filter(Boolean) as typeof PROJECTS

  return (
    <div className="relative h-full min-h-[240px] w-full">
      {picks.map((p, i) => (
        <img
          key={p.id}
          src={asset(p.poster)}
          alt={p.alt}
          width={1600}
          height={1000}
          loading="lazy"
          className="absolute w-[76%] rounded-[14px] border border-white/10 shadow-[0_30px_60px_-24px_rgba(0,0,0,.9)]"
          style={{
            left: `${6 + i * 10}%`,
            top: `${10 + i * 16}%`,
            transform: `rotate(${(i - 1) * 3.2}deg)`,
            zIndex: i,
          }}
        />
      ))}
    </div>
  )
}

/* ── Тексты по брифу: строка брифа и получившийся заголовок ───── */

export function BriefToHeadline() {
  return (
    <div className="flex flex-col gap-3">
      <div className="rounded-[var(--r-sm)] border border-hairline bg-black/25 p-4">
        <p className="t-micro">бриф · строка 4</p>
        <p className="mt-2 text-[0.9375rem] text-text-2">
          «Клиенты вечно спрашивают цену, а её нельзя назвать без замера. Из-за
          этого половина не доходит до заявки».
        </p>
      </div>

      <div className="flex items-center gap-2 pl-1 text-text-3" aria-hidden>
        <span className="h-px w-6 bg-hairline-2" />
        <span className="t-micro">заголовок</span>
      </div>

      <div className="rounded-[var(--r-sm)] border border-hairline bg-black/25 p-4">
        <p className="text-[1.0625rem] leading-snug font-medium">
          Покажем вашу кухню до замера — с ценой, сроком и составом.
        </p>
      </div>
    </div>
  )
}

/* ── Заявки в Telegram: уведомление приезжает один раз ────────── */

export function PhoneNotification() {
  const [shown, setShown] = useState(false)
  const ref = useOnce<HTMLDivElement>(() => setShown(true))

  return (
    <div ref={ref} className="relative mx-auto w-[190px]">
      <div className="rounded-[28px] border border-white/12 bg-[#0d0d10] p-2 shadow-[0_30px_60px_-30px_rgba(0,0,0,.9)]">
        <div className="relative h-[190px] overflow-hidden rounded-[22px] bg-gradient-to-b from-[#15151a] to-[#0a0a0c]">
          <div className="mx-auto mt-2 h-1.5 w-14 rounded-full bg-white/12" aria-hidden />

          <p className="mt-6 text-center font-mono text-[1.75rem] leading-none text-white/85">
            9:41
          </p>

          <div
            className={cn(
              'absolute inset-x-2.5 bottom-3 rounded-[16px] border border-white/12 bg-white/[.07] p-3 backdrop-blur-md',
              'transition-[opacity,transform] duration-[var(--dur-slow)] ease-[var(--ease)]',
              shown ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0',
            )}
          >
            <p className="t-micro text-white/60">Telegram · сейчас</p>
            <p className="mt-1 text-[0.8125rem] leading-snug font-medium">
              Новая заявка с сайта
            </p>
            <p className="mt-0.5 text-[0.75rem] leading-snug text-text-2">
              Марат · +7 917 … · «Нужен сайт для автомойки»
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Скорость: полоса заполняется до реально измеренного значения ─ */

export function SpeedBar() {
  const [on, setOn] = useState(false)
  const ref = useOnce<HTMLDivElement>(() => setOn(true))

  return (
    <div ref={ref} className="flex flex-col gap-4">
      <div className="flex items-baseline gap-2">
        <span className="font-mono text-[3rem] leading-none">{on ? PAGESPEED.score : 0}</span>
        <span className="t-micro">из 100</span>
      </div>

      <div className="h-2 w-full overflow-hidden rounded-full bg-white/[.07]">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)] transition-[width] duration-[1200ms] ease-[var(--ease)]"
          style={{ width: on ? `${PAGESPEED.score}%` : '0%' }}
        />
      </div>

      <p className="t-micro leading-relaxed">
        {PAGESPEED.tool} · {PAGESPEED.url} · LCP {PAGESPEED.lcp} · CLS {PAGESPEED.cls}
      </p>
    </div>
  )
}

/* ── Адаптив: один экран в трёх ширинах, по кругу ─────────────── */

const WIDTHS = [
  { label: '1440', w: 'w-full', ratio: 'aspect-[16/10]' },
  { label: '834', w: 'w-[62%]', ratio: 'aspect-[4/5]' },
  { label: '390', w: 'w-[34%]', ratio: 'aspect-[9/16]' },
]

export function ResponsiveCycle() {
  const [i, setI] = useState(0)
  const [run, setRun] = useState(false)
  const ref = useOnce<HTMLDivElement>(() => setRun(true))
  const project = PROJECTS.find((p) => p.id === 'massage-nk') ?? PROJECTS[0]

  useEffect(() => {
    if (!run) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const t = setInterval(() => setI((v) => (v + 1) % WIDTHS.length), 2600)
    return () => clearInterval(t)
  }, [run])

  const cur = WIDTHS[i]

  return (
    <div ref={ref} className="flex h-full flex-col items-center justify-end gap-3">
      <div className="flex h-[190px] w-full items-end justify-center">
        <div
          className={cn(
            'overflow-hidden rounded-[10px] border border-white/12 bg-black transition-[width] duration-[var(--dur-slow)] ease-[var(--ease)]',
            cur.w,
            cur.ratio,
          )}
        >
          <img
            src={asset(project.poster)}
            alt={project.alt}
            width={1600}
            height={1000}
            loading="lazy"
            className="size-full object-cover object-top"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        {WIDTHS.map((w, k) => (
          <span
            key={w.label}
            className={cn(
              'font-mono text-[0.6875rem] transition-colors duration-[var(--dur)]',
              k === i ? 'text-text' : 'text-text-3',
            )}
          >
            {w.label}
          </span>
        ))}
      </div>
    </div>
  )
}

/* ── Фото нейросетью: до/после ползунком ─────────────────────── */

export function BeforeAfter({
  before,
  after,
  beforeAlt,
  afterAlt,
  ready,
}: {
  before: string
  after: string
  beforeAlt: string
  afterAlt: string
  ready: boolean
}) {
  const [pos, setPos] = useState(50)

  if (!ready) {
    return (
      <div className="grid h-full min-h-[200px] place-items-center rounded-[var(--r-sm)] border border-dashed border-hairline-2 p-6 text-center">
        <p className="t-micro max-w-[40ch] leading-relaxed">
          здесь встанет пара «типовой кадр / студийный свет».
          <br />
          пока ассета нет — плейсхолдер, а не выдуманная картинка. список в
          assets-todo.md
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="relative w-full overflow-hidden rounded-[var(--r-sm)] border border-hairline">
        {/* ячейка низкая по спеке — держим высоту, а не пропорцию */}
        <div className="relative h-[clamp(170px,24vw,300px)] w-full">
          <img
            src={asset(after)}
            alt={afterAlt}
            width={1915}
            height={821}
            loading="lazy"
            className="absolute inset-0 size-full object-cover"
          />
          <div
            className="absolute inset-0 overflow-hidden"
            style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
          >
            <img
              src={asset(before)}
              alt={beforeAlt}
              width={1915}
              height={821}
              loading="lazy"
              className="size-full object-cover"
            />
          </div>

          <div
            aria-hidden
            className="absolute inset-y-0 w-px bg-white/70"
            style={{ left: `${pos}%` }}
          />

          <span className="t-micro absolute top-3 left-3 rounded-[var(--r-pill)] bg-black/60 px-2.5 py-1 text-white/80">
            типовой кадр
          </span>
          <span className="t-micro absolute top-3 right-3 rounded-[var(--r-pill)] bg-black/60 px-2.5 py-1 text-white/80">
            студийный свет
          </span>
        </div>

        <label className="sr-only" htmlFor="ba">
          Сдвиньте, чтобы сравнить типовой и студийный кадр
        </label>
        <input
          id="ba"
          type="range"
          min={0}
          max={100}
          value={pos}
          onChange={(e) => setPos(Number(e.target.value))}
          className="absolute inset-0 size-full cursor-ew-resize opacity-0"
        />
      </div>

      {/* Оба кадра сгенерированы — и это ровно то, что здесь показывается:
          разница не в инструменте, а в постановке света. */}
      <p className="t-micro">
        оба кадра — одно и то же помещение, сгенерированное нейросетью. слева
        типовая съёмка, справа поставленный свет
      </p>
    </div>
  )
}
