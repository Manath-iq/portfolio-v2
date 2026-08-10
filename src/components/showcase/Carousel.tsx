'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { PROJECTS } from '@/data/projects'
import { ProjectCard } from './ProjectCard'
import { goal } from '@/lib/metrika'

const AUTOPLAY_STEP = 0.0016
const RESUME_MS = 3000
/** Степень магнитной паузы. Без неё это просто крутилка. */
const MAGNET = 4.2

type Mode = '3d' | 'row'

/** Ремап доли прогресса: плоско у 0 и 1 — карточка замирает по центру. */
function magnetic(frac: number) {
  return frac < 0.5
    ? 0.5 * Math.pow(frac * 2, MAGNET)
    : 1 - 0.5 * Math.pow((1 - frac) * 2, MAGNET)
}

/** Кратчайшая разница по кольцу из n карточек. */
function wrap(diff: number, n: number) {
  const half = n / 2
  return ((((diff + half) % n) + n) % n) - half
}

export function Carousel({
  onActiveChange,
}: {
  onActiveChange: (index: number) => void
}) {
  const n = PROJECTS.length
  const [mode, setMode] = useState<Mode>('row')
  const [active, setActive] = useState(0)

  const stageRef = useRef<HTMLDivElement>(null)
  const rowRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([])

  const progress = useRef(0)
  const target = useRef(0)
  const raf = useRef(0)
  const idleAt = useRef(0)
  const visible = useRef(false)
  const auto = useRef(true)

  // --- режим: 3D только на широком экране, указателе-мыши и без reduced-motion
  useEffect(() => {
    const mq = window.matchMedia(
      '(min-width: 768px) and (prefers-reduced-motion: no-preference)',
    )
    const apply = () => setMode(mq.matches ? '3d' : 'row')
    apply()
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [])

  const setActiveIdx = useCallback(
    (i: number) => {
      setActive(i)
      onActiveChange(i)
    },
    [onActiveChange],
  )

  // ─────────────────────────────────────────────────────────
  // 3D-режим: раскладка карточек и цикл rAF
  // ─────────────────────────────────────────────────────────
  const layout = useCallback(() => {
    const stage = stageRef.current
    if (!stage || mode !== '3d') return

    const p = progress.current
    const eff = Math.floor(p) + magnetic(p - Math.floor(p))
    const step = stage.clientHeight * 0.3

    for (let i = 0; i < n; i++) {
      const el = cardRefs.current[i]
      if (!el) continue
      const d = wrap(i - eff, n)
      const a = Math.abs(d)

      const y = d * step
      const rotX = -d * 11
      const z = -a * 150
      const scale = Math.max(0.6, 1 - a * 0.07)
      const opacity = a > 2.6 ? 0 : a > 1.7 ? 1 - (a - 1.7) / 0.9 : 1

      el.style.transform = `translate3d(-50%, calc(-50% + ${y.toFixed(1)}px), ${z.toFixed(1)}px) rotateX(${rotX.toFixed(2)}deg) scale(${scale.toFixed(3)})`
      el.style.opacity = String(opacity)
      el.style.zIndex = String(200 - Math.round(a * 10))
      el.style.pointerEvents = opacity < 0.15 ? 'none' : 'auto'
      // will-change только на видимых, снимается при уходе из вида
      el.style.willChange = opacity > 0.15 ? 'transform' : 'auto'
    }

    const idx = ((Math.round(p) % n) + n) % n
    if (idx !== active) setActiveIdx(idx)
  }, [mode, n, active, setActiveIdx])

  useEffect(() => {
    if (mode !== '3d') return
    const stage = stageRef.current
    if (!stage) return

    const tick = () => {
      if (visible.current) {
        if (auto.current && performance.now() > idleAt.current) {
          target.current += AUTOPLAY_STEP
        }
        // догоняем цель мягко — так драг и колесо не дёргают карточки
        progress.current += (target.current - progress.current) * 0.12
        layout()
      }
      raf.current = requestAnimationFrame(tick)
    }

    const io = new IntersectionObserver(
      ([e]) => {
        visible.current = e.isIntersecting
        if (!e.isIntersecting) {
          videoRefs.current.forEach((v) => v?.pause())
        }
      },
      { threshold: 0.15 },
    )
    io.observe(stage)

    layout()
    raf.current = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(raf.current)
      io.disconnect()
    }
  }, [mode, layout])

  // --- колесо, драг, клавиатура
  useEffect(() => {
    if (mode !== '3d') return
    const stage = stageRef.current
    if (!stage) return

    const nudge = () => {
      idleAt.current = performance.now() + RESUME_MS
    }

    // страница при этом не блокируется — никакого scroll-hijack
    const onWheel = (e: WheelEvent) => {
      target.current += e.deltaY * 0.0016
      nudge()
    }

    let dragging = false
    let lastY = 0
    let moved = 0

    const onDown = (e: PointerEvent) => {
      if (e.pointerType === 'mouse' && e.button !== 0) return
      dragging = true
      lastY = e.clientY
      moved = 0
      nudge()
    }
    const onMove = (e: PointerEvent) => {
      if (!dragging) return
      const dy = e.clientY - lastY
      lastY = e.clientY
      moved += Math.abs(dy)
      target.current -= dy / (stage.clientHeight * 0.3)
      nudge()
    }
    const onUp = () => {
      if (!dragging) return
      dragging = false
      // отпустили — доводим до ближайшей карточки
      if (moved > 6) target.current = Math.round(target.current)
      nudge()
    }

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        target.current = Math.round(target.current) + 1
        nudge()
      } else if (e.key === 'ArrowUp') {
        target.current = Math.round(target.current) - 1
        nudge()
      } else return
      e.preventDefault()
    }

    stage.addEventListener('wheel', onWheel, { passive: true })
    stage.addEventListener('pointerdown', onDown)
    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerup', onUp)
    stage.addEventListener('keydown', onKey)

    return () => {
      stage.removeEventListener('wheel', onWheel)
      stage.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      stage.removeEventListener('keydown', onKey)
    }
  }, [mode])

  // --- фокус на карточке доводит её до центра
  const focusToCenter = useCallback(
    (i: number) => {
      if (mode !== '3d') return
      const cur = target.current
      target.current = cur + wrap(i - Math.round(cur), n) + (Math.round(cur) - cur)
      idleAt.current = performance.now() + RESUME_MS
    },
    [mode, n],
  )

  // ─────────────────────────────────────────────────────────
  // Режим ряда: свайп вбок со снапом, активная по позиции скролла
  // ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (mode !== 'row') return
    const row = rowRef.current
    if (!row) return

    let t = 0
    const onScroll = () => {
      clearTimeout(t)
      t = window.setTimeout(() => {
        const center = row.scrollLeft + row.clientWidth / 2
        let best = 0
        let bestD = Infinity
        cardRefs.current.forEach((el, i) => {
          if (!el) return
          const c = el.offsetLeft + el.offsetWidth / 2
          const d = Math.abs(c - center)
          if (d < bestD) {
            bestD = d
            best = i
          }
        })
        if (best !== active) setActiveIdx(best)
      }, 90)
    }

    row.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      row.removeEventListener('scroll', onScroll)
      clearTimeout(t)
    }
  }, [mode, active, setActiveIdx])

  // --- играет центральная и две соседние; в ряду — только центральная
  const playing = useMemo(() => {
    const set = new Set<number>()
    if (mode === '3d') {
      set.add(active)
      set.add((active + 1) % n)
      set.add((active - 1 + n) % n)
    } else {
      set.add(active)
    }
    return set
  }, [active, mode, n])

  useEffect(() => {
    videoRefs.current.forEach((v, i) => {
      if (!v) return
      if (playing.has(i) && mode === '3d') {
        v.play().catch(() => {})
      } else {
        v.pause()
      }
    })
  }, [playing, mode])

  const layers = mode === '3d' ? 5 : 3

  const cards = PROJECTS.map((p, i) => (
    <div
      key={p.id}
      ref={(el) => {
        cardRefs.current[i] = el
      }}
      onFocusCapture={() => focusToCenter(i)}
      className={
        mode === '3d'
          ? 'absolute top-1/2 left-1/2 w-[min(560px,88%)] [transform-style:preserve-3d]'
          : 'w-[min(560px,82vw)] shrink-0 snap-center'
      }
      style={
        mode === 'row' && i !== active
          ? { transform: 'scale(0.88)', transition: 'transform var(--dur) var(--ease)' }
          : mode === 'row'
            ? { transform: 'scale(1)', transition: 'transform var(--dur) var(--ease)' }
            : undefined
      }
    >
      <ProjectCard
        project={p}
        layers={layers}
        playVideo={playing.has(i) && mode === '3d'}
        active={i === active}
        onActivate={() => {
          if (mode === '3d') focusToCenter(i)
          else cardRefs.current[i]?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
        }}
        href={p.caseUrl ?? p.liveUrl ?? '#raboty'}
        videoRef={(el) => {
          videoRefs.current[i] = el
        }}
      />
    </div>
  ))

  if (mode === '3d') {
    return (
      <div
        ref={stageRef}
        tabIndex={-1}
        aria-roledescription="карусель"
        aria-label="Работы"
        className="relative h-full min-h-[520px] w-full [perspective:1400px] [perspective-origin:50%_50%] outline-none"
      >
        {cards}
      </div>
    )
  }

  return (
    <div
      ref={rowRef}
      aria-roledescription="карусель"
      aria-label="Работы"
      className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto px-[var(--gutter)] py-4"
    >
      {cards}
    </div>
  )
}

export { PROJECTS }
