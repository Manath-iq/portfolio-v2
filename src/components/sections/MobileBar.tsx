'use client'

import { useEffect, useState } from 'react'
import { MessageCircle, Phone } from 'lucide-react'
import { SITE } from '@/data/site'
import { goal } from '@/lib/metrika'
import { cn } from '@/lib/utils'

/**
 * Нижняя панель действий, только на телефоне.
 *
 * На мобильной вёрстке контакты жили в плавающей шапке, а она сама по себе
 * перекрывает текст и уезжает вверх при скролле вниз — то есть в момент, когда
 * человек дочитал до решения, связаться было нечем без прокрутки в конец.
 *
 * Появляется после первого экрана и прячется, когда форма заявки уже на виду:
 * кнопка «Обсудить проект» поверх самой формы — это шум, а не помощь.
 */
export function MobileBar() {
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      const pastHero = window.scrollY > window.innerHeight * 0.6
      const form = document.getElementById('zayavka')
      const formVisible = form
        ? form.getBoundingClientRect().top < window.innerHeight * 0.85
        : false
      setShown(pastHero && !formVisible)
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return (
    <div
      className={cn(
        'fixed inset-x-0 bottom-0 z-40 md:hidden',
        'px-[var(--gutter)] pt-2 pb-[max(12px,env(safe-area-inset-bottom))]',
        'bg-gradient-to-t from-[var(--bg)] via-[var(--bg)] to-transparent',
        'transition-[opacity,transform] duration-[var(--dur)] ease-[var(--ease)]',
        shown ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0',
      )}
    >
      <div className="flex items-center gap-2">
        <a href="#zayavka" className="btn btn-accent h-12 flex-1">
          Обсудить проект
        </a>
        <a
          href={SITE.telegram}
          target="_blank"
          rel="noopener"
          onClick={() => goal('tg_click')}
          aria-label="Написать в Telegram"
          className="btn btn-glass grid size-12 shrink-0 place-items-center px-0"
        >
          <MessageCircle size={20} strokeWidth={1.5} aria-hidden />
        </a>
        <a
          href={SITE.phoneHref}
          aria-label={`Позвонить ${SITE.phone}`}
          className="btn btn-glass grid size-12 shrink-0 place-items-center px-0"
        >
          <Phone size={20} strokeWidth={1.5} aria-hidden />
        </a>
      </div>
    </div>
  )
}
