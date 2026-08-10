'use client'

import { useEffect, useRef, type ElementType, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

type Props = {
  children: ReactNode
  className?: string
  /** Стаггер между соседями в секции. 60 мс по спеке. */
  delay?: number
  as?: ElementType
}

/**
 * Появление снизу с расфокусом. IntersectionObserver на 20%, один раз.
 * Само движение — в .reveal / .is-in, здесь только переключение класса,
 * чтобы без JS содержимое осталось видимым (класс .reveal ставится из JS).
 */
export function Reveal({ children, className, delay = 0, as: Tag = 'div' }: Props) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    el.classList.add('reveal')
    if (delay) el.style.setProperty('--reveal-delay', `${delay}ms`)

    // Порог по площади не годится: секция выше экрана никогда не наберёт 20%
    // видимости и останется невидимой навсегда. Считаем по кромке.
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('is-in')
          io.disconnect()
        }
      },
      { threshold: 0, rootMargin: '0px 0px -12% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [delay])

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  )
}
