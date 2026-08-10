'use client'

import { useEffect, useState } from 'react'
import { MessageCircle, Phone } from 'lucide-react'
import { NAV, SITE } from '@/data/site'
import { Monogram } from '@/components/Monogram'
import { cn } from '@/lib/utils'

/**
 * Плавающая шапка-пилюля. Не полоса во всю ширину, а стеклянная капсула
 * в 16px от верха. После 80px скролла паддинг ужимается, фон темнеет.
 */
export function Header() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="pointer-events-none sticky top-0 z-50 flex justify-center px-[var(--gutter)] pt-4">
      <header
        className={cn(
          'pointer-events-auto flex items-center rounded-[var(--r-pill)] border border-hairline',
          'backdrop-blur-2xl backdrop-saturate-150',
          'transition-[padding,background-color,box-shadow] duration-200 ease-[var(--ease)]',
          scrolled
            ? 'gap-3 bg-[rgba(10,10,12,.72)] py-1.5 pr-1.5 pl-4 shadow-[0_18px_50px_-20px_rgba(0,0,0,.9)]'
            : 'gap-4 bg-[var(--surface)] py-2.5 pr-2.5 pl-5 shadow-[0_10px_40px_-24px_rgba(0,0,0,.8)]',
        )}
      >
        <a href="#top" className="flex shrink-0 items-center gap-2.5" aria-label="Наверх">
          <Monogram className="size-6" />
          <span className="text-[0.9375rem] font-medium tracking-[-0.01em]">{SITE.brand}</span>
        </a>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Разделы страницы">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-[var(--r-pill)] px-3 py-1.5 text-[0.9375rem] text-text-2 transition-colors duration-[var(--dur)] hover:text-text"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Мобильный: телефон и Telegram иконками, пунктов меню нет. */}
        <div className="flex items-center gap-1 md:hidden">
          <a
            href={SITE.phoneHref}
            aria-label="Позвонить"
            className="grid size-11 place-items-center rounded-[var(--r-pill)] text-text-2 transition-colors hover:text-text"
          >
            <Phone size={20} strokeWidth={1.5} aria-hidden />
          </a>
          <a
            href={SITE.telegram}
            aria-label="Написать в Telegram"
            className="grid size-11 place-items-center rounded-[var(--r-pill)] text-text-2 transition-colors hover:text-text"
          >
            <MessageCircle size={20} strokeWidth={1.5} aria-hidden />
          </a>
        </div>

        <a href="#zayavka" className="btn btn-accent hidden h-9 px-4 text-sm md:inline-flex">
          Обсудить проект
        </a>
      </header>
    </div>
  )
}
