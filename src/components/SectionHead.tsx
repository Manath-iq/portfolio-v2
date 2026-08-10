import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { Reveal } from './Reveal'

type Props = {
  eyebrow: string
  /** Заголовок целиком. Акцентное слово оборачивается в <AccentWord>. */
  children: ReactNode
  className?: string
  id?: string
}

export function SectionHead({ eyebrow, children, className, id }: Props) {
  return (
    <Reveal className={cn('flex flex-col gap-4', className)}>
      <span className="t-eyebrow">{eyebrow}</span>
      <h2 id={id} className="t-h2 max-w-[18ch]">
        {children}
      </h2>
    </Reveal>
  )
}

/** Ровно одно слово в заголовке. Один способ на весь сайт — курсивный сериф. */
export function W({ children }: { children: ReactNode }) {
  return <span className="accent-word">{children}</span>
}
