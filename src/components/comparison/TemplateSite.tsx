import type { ReactNode } from 'react'
import { Lock } from 'lucide-react'
import { cn } from '@/lib/utils'

/** Семь мест на макете, о которых идёт разговор. */
export type SpotId = 'seo' | 'domain' | 'text' | 'lead' | 'struct' | 'mobile' | 'author'

type Props = {
  mode: 'bad' | 'good'
  spot: SpotId
  /** Порядковый номер зоны в списке — рисуется на метке. */
  numbers: Record<SpotId, number>
  onPick: (id: SpotId) => void
  /** До первого касания метки медленно пульсируют — иначе их не замечают. */
  touched: boolean
}

/**
 * Оба текста лежат в разметке одновременно и переключаются прозрачностью:
 * .tpl-swap кладёт их в одну клетку грида, поэтому высота считается по
 * длинному варианту и макет не прыгает на переключении.
 */
function Swap({ bad, good, className }: { bad: ReactNode; good: ReactNode; className?: string }) {
  return (
    <span className={cn('tpl-swap', className)}>
      <span className="tpl-v tpl-v-bad">{bad}</span>
      <span className="tpl-v tpl-v-good">{good}</span>
    </span>
  )
}

/**
 * Зона разбора: кусок макета, который обводится и несёт номер.
 *
 * Кнопки здесь дублируют список рядом и потому убраны из обхода табом и от
 * скринридера — иначе человек прошёл бы одни и те же семь пунктов дважды.
 */
function Spot({
  id,
  spot,
  numbers,
  onPick,
  className,
  pin,
  children,
}: {
  id: SpotId
  spot: SpotId
  numbers: Record<SpotId, number>
  onPick: (id: SpotId) => void
  className?: string
  /** Где висит метка относительно зоны. */
  pin: string
  children: ReactNode
}) {
  return (
    <button
      type="button"
      tabIndex={-1}
      aria-hidden
      data-on={spot === id}
      onClick={() => onPick(id)}
      className={cn('tpl-spot', className)}
    >
      {children}
      <span className={cn('tpl-pin', pin)}>{numbers[id]}</span>
    </button>
  )
}

const LINKS_BAD = ['Главная', 'Услуги', 'О компании', 'Контакты']
const LINKS_GOOD = ['Цены', 'Работы', 'Как считаем', 'Отзывы']

const TILES_BAD = ['Качество', 'Опыт', 'Гарантия']

const TILES_GOOD: [string, string][] = [
  ['1 день', 'монтаж под ключ'],
  ['18 900 ₽', 'двушка 42 м²'],
  ['5 лет', 'гарантия по договору'],
]

/** Один и тот же сайт в двух состояниях. Иллюстрация: весь текст — в списке рядом. */
export function TemplateSite({ mode, spot, numbers, onPick, touched }: Props) {
  const pass = { spot, numbers, onPick }

  return (
    <div className="tpl-wrap" data-mode={mode} data-touched={touched} aria-hidden>
      <div className="tpl">
        {/* ── хром: вкладка и адрес — это тоже две зоны разбора ── */}
        <div className="tpl-chrome">
          <span className="tpl-dots">
            <i />
            <i />
            <i />
          </span>

          <Spot id="seo" {...pass} className="tpl-tab" pin="-top-1.5 -right-1.5">
            <Swap
              bad="Главная"
              good="Натяжные потолки в Нижнекамске — цена за м², монтаж за 1 день"
            />
          </Spot>
        </div>

        <div className="tpl-bar">
          <Spot id="domain" {...pass} className="tpl-url" pin="-top-2 right-1">
            <Lock className="tpl-lock" strokeWidth={1.5} />
            <Swap bad="potolki-nk.site-shablon.ru" good="potolki-nk.ru" />
          </Spot>
        </div>

        {/* ── страница ── */}
        <div className="tpl-body">
          <div className="tpl-nav">
            <Swap className="tpl-brand" bad="ООО «СТРОЙСЕРВИС»" good="Потолки НК" />

            <span className="tpl-links">
              {LINKS_BAD.map((l, i) => (
                <Swap key={l} bad={l} good={LINKS_GOOD[i]} />
              ))}
            </span>

            <Swap className="tpl-tel" bad="8 (8555) 00-00-00" good="+7 917 ··· ··-··" />
          </div>

          <div className="tpl-hero">
            <div className="tpl-photo" />

            <div className="tpl-copy">
              <Spot id="text" {...pass} className="tpl-zone" pin="-top-2.5 -right-2">
                <Swap
                  className="tpl-h"
                  bad="Широкий спектр услуг в городе Нижнекамск"
                  /* неразрывные пробелы в цене: иначе «₽» уезжает на свою строку */
                  good={'Потолок в двушке за день — от 18 900 ₽'}
                />
                <Swap
                  className="tpl-sub"
                  bad="Качественно, быстро, недорого. Индивидуальный подход к каждому клиенту."
                  good="Замер бесплатно. Цена в договоре не меняется после монтажа."
                />
              </Spot>

              <Spot id="lead" {...pass} className="tpl-zone tpl-zone-cta" pin="-top-2.5 -right-2">
                <span className="tpl-cta">
                  <Swap bad="Оставить заявку" good="Рассчитать за 30 секунд" />
                </span>
                <Swap
                  className="tpl-note"
                  bad="уйдёт на info@stroyservis-nk.mail.ru"
                  good="придёт в Telegram за 8 секунд"
                />
              </Spot>
            </div>
          </div>

          <Spot id="struct" {...pass} className="tpl-zone" pin="-top-2.5 -right-2">
            <span className="tpl-tiles">
              {TILES_BAD.map((k, i) => (
                <span key={k} className="tpl-tile">
                  <Swap className="tpl-tile-k" bad={k} good={TILES_GOOD[i][0]} />
                  <Swap
                    className="tpl-tile-v"
                    bad={
                      <>
                        <i className="tpl-fake" style={{ width: '100%' }} />
                        <i className="tpl-fake" style={{ width: '62%' }} />
                      </>
                    }
                    good={TILES_GOOD[i][1]}
                  />
                </span>
              ))}
            </span>
          </Spot>

          {/* метка подвала уходит влево: справа над ней стоит телефон */}
          <Spot id="author" {...pass} className="tpl-zone tpl-zone-foot" pin="-top-2.5 -left-2">
            <Swap
              className="tpl-foot"
              bad="© 2019 Все права защищены · Разработка сайта — веб-студия"
              good="© 2026 ИП Сафин Р. Р. · сделал Максим, напрямую"
            />
          </Spot>
        </div>
      </div>

      {/* ── телефон рядом с окном, своей колонкой: так он ничего не закрывает,
             а в шаблонном состоянии вёрстка на нём вылезает за экран ── */}
      <Spot id="mobile" {...pass} className="tpl-phone" pin="-top-2 -left-2">
        <span className="tpl-screen">
          <i className="tpl-pl tpl-pl-1" />
          <i className="tpl-pl tpl-pl-2" />
          <i className="tpl-pl tpl-pl-3" />
          <i className="tpl-pl-cta" />
          <i className="tpl-pl-tab" />
          <i className="tpl-pl-scroll" />
        </span>
      </Spot>
    </div>
  )
}
