import type { ReactNode } from 'react'
import { ArrowUpRight, Lock } from 'lucide-react'
import { cn } from '@/lib/utils'

type Props = {
  /** Что набрано в адресной строке прямо сейчас. */
  address: ReactNode
  href?: string | null
  children: ReactNode
  className?: string
  /** Подпись кнопки справа в хроме. */
  openLabel?: string
  onOpenClick?: () => void
}

/**
 * Макет окна браузера. Хром перерисован под сайт: адрес в моно,
 * справа не «звёздочка», а рабочая кнопка «Открыть».
 */
export function BrowserFrame({
  address,
  href,
  children,
  className,
  openLabel = 'Открыть',
  onOpenClick,
}: Props) {
  return (
    <div
      className={cn(
        'glass overflow-hidden rounded-[var(--r-xl)]',
        'shadow-[inset_0_1px_0_rgba(255,255,255,.10),0_60px_120px_-40px_rgba(0,0,0,.95)]',
        className,
      )}
    >
      {/* хром */}
      <div className="flex items-center gap-3 border-b border-hairline px-3 py-2.5 sm:gap-4 sm:px-4 sm:py-3">
        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2" aria-hidden>
          <span className="size-2.5 rounded-full bg-white/15" />
          <span className="size-2.5 rounded-full bg-white/15" />
          <span className="size-2.5 rounded-full bg-white/15" />
        </div>

        <div className="flex min-w-0 flex-1 items-center gap-2 rounded-[var(--r-pill)] border border-hairline bg-black/25 px-3 py-1.5">
          <Lock size={13} strokeWidth={1.5} className="shrink-0 text-text-3" aria-hidden />
          <span className="truncate font-mono text-[0.75rem] text-text-2 sm:text-[0.8125rem]">
            {address}
          </span>
        </div>

        {href ? (
          <a
            href={href}
            target="_blank"
            rel="noopener"
            onClick={onOpenClick}
            className="btn btn-glass h-9 shrink-0 px-3 text-[0.8125rem] sm:px-4"
          >
            <span className="hidden sm:inline">{openLabel}</span>
            <ArrowUpRight size={16} strokeWidth={1.5} aria-hidden />
          </a>
        ) : null}
      </div>

      {/* тело */}
      <div className="relative aspect-[16/10] w-full bg-black">{children}</div>
    </div>
  )
}
