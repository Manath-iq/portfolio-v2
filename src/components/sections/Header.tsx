'use client'

import { useEffect, useRef, useState } from 'react'
import { ChevronDown, MessageCircle, Phone } from 'lucide-react'
import { NAV, SITE } from '@/data/site'
import { Monogram } from '@/components/Monogram'
import { asset } from '@/lib/asset'
import { cn } from '@/lib/utils'

/**
 * Плавающая шапка-пилюля. Не полоса во всю ширину, а стеклянная капсула
 * в 16px от верха. После 80px скролла паддинг ужимается, фон темнеет.
 *
 * Пилюля висит поверх контента, а не отодвигает его, и на узком экране она
 * закрывала собой строку текста под собой на каждом экране прокрутки.
 * Поэтому при движении вниз она уезжает за верхнюю кромку и возвращается,
 * как только человек потянул страницу вверх, — то есть ровно тогда, когда
 * навигация ему и понадобилась.
 */
export type NavItem = {
  label: string
  href: string
  /**
   * Вложенный список. Нужен разделу «Статьи»: из статьи в статью человек
   * иначе ходит только через витрину, а это лишний экран на каждый переход.
   * Раскрывается по наведению и по фокусу с клавиатуры, на мобильном пунктов
   * меню нет вовсе — там и список не появляется.
   */
  items?: readonly { label: string; href: string }[]
}

type Props = {
  /**
   * Пункты меню. На городской странице раздел «Ниши» отсутствует, а пункт,
   * который никуда не прокручивает, хуже, чем его отсутствие.
   */
  nav?: readonly NavItem[]
  /** Куда ведёт логотип. На главной — наверх, на внутренней — на главную. */
  logoHref?: string
}

export function Header({ nav = NAV, logoHref = '#top' }: Props) {
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [open, setOpen] = useState<string | null>(null)
  const lastY = useRef(0)

  useEffect(() => {
    lastY.current = window.scrollY

    const onScroll = () => {
      const y = window.scrollY
      setScrolled(y > 80)

      // Порог в 6px гасит дрожание от инерционного скролла на iOS.
      const dy = y - lastY.current
      if (Math.abs(dy) > 6) {
        setHidden(dy > 0 && y > 160)
        lastY.current = y
      }
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div
      className={cn(
        'pointer-events-none sticky top-0 z-50 flex justify-center px-[var(--gutter)] pt-4',
        'transition-transform duration-300 ease-[var(--ease)]',
        hidden && '-translate-y-[calc(100%+8px)]',
      )}
    >
      <header
        className={cn(
          'pointer-events-auto flex max-w-full items-center rounded-[var(--r-pill)] border border-hairline',
          'backdrop-blur-2xl backdrop-saturate-150',
          'transition-[padding,background-color,box-shadow] duration-200 ease-[var(--ease)]',
          scrolled
            ? 'gap-2 bg-[rgba(10,10,12,.82)] py-1.5 pr-1.5 pl-4 shadow-[0_18px_50px_-20px_rgba(0,0,0,.9)] sm:gap-3'
            : 'gap-3 bg-[rgba(10,10,12,.5)] py-2.5 pr-2.5 pl-5 shadow-[0_10px_40px_-24px_rgba(0,0,0,.8)] sm:gap-4',
        )}
      >
        <a
          href={logoHref}
          className="flex shrink-0 items-center gap-2.5"
          aria-label={logoHref === '#top' ? 'Наверх' : 'На главную'}
        >
          <Monogram className="size-6" />
          <span className="text-[0.9375rem] font-medium tracking-[-0.01em]">{SITE.brand}</span>
        </a>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Разделы страницы">
          {nav.map((item) =>
            item.items?.length ? (
              <div
                key={item.href}
                className="relative"
                onMouseEnter={() => setOpen(item.href)}
                onMouseLeave={() => setOpen(null)}
                onFocus={() => setOpen(item.href)}
                onBlur={(e) => {
                  if (!e.currentTarget.contains(e.relatedTarget as Node)) setOpen(null)
                }}
              >
                <a
                  href={item.href}
                  aria-expanded={open === item.href}
                  className="flex items-center gap-1 rounded-[var(--r-pill)] px-3 py-1.5 text-[0.9375rem] text-text-2 transition-colors duration-[var(--dur)] hover:text-text"
                >
                  {item.label}
                  <ChevronDown
                    size={14}
                    strokeWidth={1.5}
                    aria-hidden
                    className={cn(
                      'transition-transform duration-[var(--dur)]',
                      open === item.href && 'rotate-180',
                    )}
                  />
                </a>

                {/* Мостик до панели: между пилюлей и списком есть зазор, и без
                    него список закрывается ровно в тот момент, когда курсор
                    идёт к нему. */}
                <div
                  className={cn(
                    'absolute top-full left-1/2 w-[min(23rem,80vw)] -translate-x-1/2 pt-3',
                    open === item.href
                      ? 'pointer-events-auto opacity-100'
                      : 'pointer-events-none opacity-0',
                    'transition-opacity duration-[var(--dur)] ease-[var(--ease)]',
                  )}
                >
                  <div className="flex flex-col gap-0.5 rounded-[var(--r-md)] border border-hairline bg-[rgba(10,10,12,.97)] p-2 shadow-[0_24px_60px_-24px_rgba(0,0,0,.95)] backdrop-blur-2xl">
                    {item.items.map((sub) => (
                      <a
                        key={sub.href}
                        href={sub.href}
                        tabIndex={open === item.href ? 0 : -1}
                        className="rounded-[calc(var(--r-md)-12px)] px-3 py-2 text-[0.9375rem] leading-snug text-text-2 transition-colors duration-[var(--dur)] hover:bg-white/[.05] hover:text-text"
                      >
                        {sub.label}
                      </a>
                    ))}
                    <a
                      href={item.href}
                      tabIndex={open === item.href ? 0 : -1}
                      className="mt-1 border-t border-hairline px-3 pt-3 pb-1.5 text-[0.875rem] text-text-3 transition-colors duration-[var(--dur)] hover:text-text"
                    >
                      Все статьи →
                    </a>
                  </div>
                </div>
              </div>
            ) : (
              <a
                key={item.href}
                href={item.href}
                className="rounded-[var(--r-pill)] px-3 py-1.5 text-[0.9375rem] text-text-2 transition-colors duration-[var(--dur)] hover:text-text"
              >
                {item.label}
              </a>
            ),
          )}
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
