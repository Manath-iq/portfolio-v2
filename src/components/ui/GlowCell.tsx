'use client'

import { useRef, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

/**
 * Ячейка бенто с подсветкой границы под курсором.
 * Это Glowing Effect из Aceternity, урезанный до одного свечения по краю —
 * вращающийся луч выключен, он показывает сам себя, а не работу.
 */
export function GlowCell({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)

  return (
    <div
      ref={ref}
      onPointerMove={(e) => {
        const el = ref.current
        if (!el) return
        const r = el.getBoundingClientRect()
        el.style.setProperty('--mx', `${e.clientX - r.left}px`)
        el.style.setProperty('--my', `${e.clientY - r.top}px`)
      }}
      className={cn(
        'group relative isolate overflow-hidden rounded-[var(--r-md)]',
        'border border-hairline bg-[var(--surface)]',
        'shadow-[inset_0_1px_0_rgba(255,255,255,.08),0_24px_60px_-30px_rgba(0,0,0,.8)]',
        'transition-colors duration-[var(--dur)] ease-[var(--ease)] hover:border-hairline-2',
        className,
      )}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-[var(--dur)] group-hover:opacity-100"
        style={{
          background:
            'radial-gradient(240px 240px at var(--mx,50%) var(--my,50%), rgba(255,77,46,.14), transparent 70%)',
        }}
      />
      {children}
    </div>
  )
}
