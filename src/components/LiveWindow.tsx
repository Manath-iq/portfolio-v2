'use client'

import { useEffect, useRef, useState } from 'react'
import { HERO_PROJECTS } from '@/data/projects'
import { BrowserFrame } from '@/components/mockups/BrowserFrame'
import { goal } from '@/lib/metrika'
import { cn } from '@/lib/utils'
import { asset } from '@/lib/asset'

const TYPE_MS = 220
const FADE_MS = 260

/**
 * Сигнатурный блок: окно браузера с работающей адресной строкой.
 * Клик по табу перебирает адрес посимвольно и кроссфейдит содержимое.
 * Автопереключения нет — переключает только человек.
 */
export function LiveWindow() {
  const items = HERO_PROJECTS
  const [active, setActive] = useState(0)
  /**
   * Постер грузится только у тех вкладок, которые человек уже открывал.
   * Атрибут poster у <video> браузер тянет независимо от того, видно кадр
   * или нет, — четыре вкладки давали полмегабайта на первом экране ради
   * одного видимого кадра.
   */
  const [seen, setSeen] = useState<ReadonlySet<number>>(() => new Set([0]))
  const [typed, setTyped] = useState(items[0]?.domain ?? '')
  const wrapRef = useRef<HTMLDivElement>(null)
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([])
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])
  const timers = useRef<number[]>([])

  // --- набор адреса посимвольно
  useEffect(() => {
    const target = items[active]?.domain ?? ''
    timers.current.forEach(clearTimeout)
    timers.current = []

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setTyped(target)
      return
    }

    const step = TYPE_MS / Math.max(target.length, 1)
    setTyped('')
    for (let i = 1; i <= target.length; i++) {
      timers.current.push(
        window.setTimeout(() => setTyped(target.slice(0, i)), step * i),
      )
    }
    return () => timers.current.forEach(clearTimeout)
  }, [active, items])

  // --- играет только видимое и только активное
  useEffect(() => {
    const wrap = wrapRef.current
    if (!wrap) return

    let visible = false
    const sync = () => {
      videoRefs.current.forEach((v, i) => {
        if (!v) return
        if (i === active && visible) {
          v.play().catch(() => {})
        } else {
          v.pause()
        }
      })
    }

    const io = new IntersectionObserver(
      ([e]) => {
        visible = e.isIntersecting
        sync()
      },
      { threshold: 0.15 },
    )
    io.observe(wrap)
    sync()
    return () => io.disconnect()
  }, [active])

  // --- параллакс от курсора, ±8px, на пружине. На тач-устройствах выключен.
  useEffect(() => {
    const wrap = wrapRef.current
    if (!wrap) return
    if (window.matchMedia('(prefers-reduced-motion: reduce), (pointer: coarse)').matches) return

    let raf = 0
    let tx = 0, ty = 0, x = 0, y = 0, vx = 0, vy = 0

    const onMove = (e: PointerEvent) => {
      const r = wrap.getBoundingClientRect()
      tx = ((e.clientX - r.left) / r.width - 0.5) * 16
      ty = ((e.clientY - r.top) / r.height - 0.5) * 16
      if (!raf) raf = requestAnimationFrame(tick)
    }
    const onLeave = () => {
      tx = 0
      ty = 0
      if (!raf) raf = requestAnimationFrame(tick)
    }

    // пружина: stiffness 220, damping 30, mass 0.8 — как в токенах движения
    const tick = () => {
      const k = 220 / 1000, c = 30 / 1000, dt = 16
      vx += ((tx - x) * k - vx * c) * dt / 0.8
      vy += ((ty - y) * k - vy * c) * dt / 0.8
      x += vx * dt / 1000
      y += vy * dt / 1000
      wrap.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0)`
      if (Math.abs(tx - x) > 0.05 || Math.abs(vx) > 0.05 || Math.abs(ty - y) > 0.05 || Math.abs(vy) > 0.05) {
        raf = requestAnimationFrame(tick)
      } else {
        raf = 0
      }
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerleave', onLeave)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerleave', onLeave)
      cancelAnimationFrame(raf)
    }
  }, [])

  /** Показать вкладку: одна точка входа для клика и для стрелок. */
  function show(i: number) {
    setActive(i)
    setSeen((prev) => (prev.has(i) ? prev : new Set(prev).add(i)))
    goal('hero_tab')
  }

  /** Стрелки между вкладками — ровно то, чего ждут от role="tablist". */
  function onTabKeyDown(e: React.KeyboardEvent) {
    const n = items.length
    let next: number
    if (e.key === 'ArrowRight') next = (active + 1) % n
    else if (e.key === 'ArrowLeft') next = (active - 1 + n) % n
    else if (e.key === 'Home') next = 0
    else if (e.key === 'End') next = n - 1
    else return

    e.preventDefault()
    show(next)
    tabRefs.current[next]?.focus()
  }

  if (!items.length) return null
  const current = items[active]

  return (
    <div className="w-full">
      <div ref={wrapRef} className="will-change-transform">
        <BrowserFrame
          address={
            <>
              <span className="text-text-3">https://</span>
              {typed}
              <span className="ml-px inline-block h-[1em] w-px translate-y-[0.15em] bg-accent" aria-hidden />
            </>
          }
          href={current.liveUrl}
          openLabel="Открыть"
          onOpenClick={() => goal('open_site')}
        >
          {items.map((p, i) => (
            <div
              key={p.id}
              id={`live-panel-${p.id}`}
              role="tabpanel"
              aria-labelledby={`live-tab-${p.id}`}
              aria-hidden={i !== active}
              className={cn(
                'absolute inset-0 transition-opacity ease-[var(--ease)]',
                i === active ? 'opacity-100' : 'pointer-events-none opacity-0',
              )}
              style={{ transitionDuration: `${FADE_MS}ms` }}
            >
              {p.video ? (
                <video
                  ref={(el) => {
                    videoRefs.current[i] = el
                  }}
                  poster={seen.has(i) ? asset(p.poster) : undefined}
                  muted
                  loop
                  playsInline
                  preload={i === 0 ? 'metadata' : 'none'}
                  width={1152}
                  height={720}
                  className="size-full object-cover object-top"
                >
                  <source src={asset(p.video)} type="video/webm" />
                  <source src={asset(p.video.replace('.webm', '.mp4'))} type="video/mp4" />
                </video>
              ) : (
                <img
                  src={asset(p.poster)}
                  alt={p.alt}
                  width={1600}
                  height={1000}
                  className="size-full object-cover object-top"
                />
              )}
            </div>
          ))}
        </BrowserFrame>
      </div>

      {/* табы */}
      <div
        role="tablist"
        aria-label="Работы в окне"
        onKeyDown={onTabKeyDown}
        className="no-scrollbar mt-5 flex gap-2 overflow-x-auto px-[var(--gutter)] sm:justify-center sm:px-0"
      >
        {items.map((p, i) => (
          <button
            key={p.id}
            ref={(el) => {
              tabRefs.current[i] = el
            }}
            id={`live-tab-${p.id}`}
            role="tab"
            type="button"
            aria-selected={i === active}
            aria-controls={`live-panel-${p.id}`}
            /* Roving tabindex: у tablist один вход по Tab, дальше стрелки.
               Иначе четыре кнопки подряд стоят на пути к содержимому. */
            tabIndex={i === active ? 0 : -1}
            onClick={() => show(i)}
            className={cn(
              'btn h-11 shrink-0 border px-4 text-[0.875rem]',
              i === active
                ? 'border-accent bg-[color-mix(in_srgb,var(--accent)_12%,transparent)] text-text'
                : 'border-hairline bg-[var(--surface)] text-text-2 hover:border-hairline-2 hover:text-text',
            )}
          >
            {p.niche}
          </button>
        ))}
      </div>
    </div>
  )
}
