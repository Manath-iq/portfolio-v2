import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { Reveal } from './Reveal'

type Props = {
  eyebrow: string
  /** Заголовок целиком. Акцентное слово оборачивается в <AccentWord>. */
  children: ReactNode
  className?: string
  id?: string
  /**
   * Уровень заголовка. По умолчанию h2 — блок и задуман как заголовок секции
   * внутри страницы, у которой h1 уже есть.
   *
   * h1 нужен витринам /raboty/ и /stati/: там этот же блок — заголовок всей
   * страницы, а не секции. Без него страница уходила в индекс вообще без h1,
   * и её собственная тема стояла на одном уровне с тринадцатью заголовками
   * карточек. Размер задаёт класс t-h2, а не тег, поэтому вид не меняется:
   * у h1 и h2 в globals.css одинаковая база.
   */
  as?: 'h1' | 'h2'
}

export function SectionHead({ eyebrow, children, className, id, as: Tag = 'h2' }: Props) {
  return (
    <Reveal className={cn('flex flex-col gap-4', className)}>
      <span className="t-eyebrow">{eyebrow}</span>
      <Tag id={id} className="t-h2 max-w-[18ch]">
        {children}
      </Tag>
    </Reveal>
  )
}

/** Ровно одно слово в заголовке. Один способ на весь сайт — курсивный сериф. */
export function W({ children }: { children: ReactNode }) {
  return <span className="accent-word">{children}</span>
}
