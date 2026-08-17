'use client'

import { useEffect } from 'react'
import { goal } from '@/lib/metrika'

/**
 * Цели на клики по контактам и по кнопкам «Обсудить проект» — одним
 * делегированным слушателем на документе.
 *
 * Телефон стоит в шапке, в подвале, в мобильной панели и под формой; кнопка
 * заявки — в герое, в трёх карточках прайса и в мобильной панели. Половина
 * этих мест — серверные компоненты, и ставить им 'use client' ради одного
 * onClick дороже, чем один слушатель здесь.
 *
 * capture: true, потому что якорные ссылки уводят прокрутку, а внешние —
 * страницу целиком: цель должна успеть уйти до того, как обработчик ссылки
 * что-то сделает.
 */
export function ClickGoals() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement | null)?.closest?.('a')
      if (!a) return

      const href = a.getAttribute('href') ?? ''

      if (href.startsWith('tel:')) goal('phone_click')
      else if (href.includes('wa.me')) goal('wa_click')
      else if (href.startsWith('#zayavka')) goal('cta_click')
    }

    document.addEventListener('click', onClick, { capture: true })
    return () => document.removeEventListener('click', onClick, { capture: true })
  }, [])

  return null
}
