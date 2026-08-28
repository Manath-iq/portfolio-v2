'use client'

import { useEffect, useRef, useState } from 'react'
import { Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * Пересказ статьи от ИИ. Свёрнут по умолчанию и раскрывается по кнопке.
 *
 * Почему не открыт сразу. Готовые выводы над текстом снимают повод читать
 * сам текст: человек забирает четыре строки и уходит. Кнопка оставляет выбор
 * за ним и заодно честно говорит, что это машинный пересказ, а не врезка от
 * автора — на сайте, который продаёт то, что человек разбирается сам, это
 * различие стоит проговаривать, а не заминать.
 *
 * Почему текст печатается. Это не украшение: пауза и набор показывают, что
 * ответ собирается сейчас, а не лежал готовым. Мгновенно появившийся абзац
 * читался бы как заранее написанная врезка, то есть ровно как то, чем он не
 * является.
 *
 * Текста нет в разметке, пока кнопку не нажали, и это намеренно: пересказ —
 * производная от статьи, и отдавать поисковику второй раз тот же смысл на той
 * же странице незачем.
 */

/** Пауза перед первым словом. Столько «думает» ответ, прежде чем пойти. */
const THINK_MS = 700
/** Шаг набора. 24 мс на порцию в 2–5 знаков — около 150 знаков в секунду. */
const TICK_MS = 24

export function AiSummary({ points }: { points: string[] }) {
  const [state, setState] = useState<'idle' | 'thinking' | 'typing' | 'done'>('idle')
  const [shown, setShown] = useState(0)
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)
  // Счётчик знаков живёт в ref, а не только в состоянии: планировать
  // следующий шаг внутри setState нельзя — в StrictMode обновление
  // вызывается дважды, цепочка таймеров раздваивается, и текст набирается
  // вдвое быстрее заданного.
  const count = useRef(0)

  const total = points.reduce((n, p) => n + p.length, 0)

  useEffect(() => () => clearTimeout(timer.current), [])

  const start = () => {
    if (state !== 'idle') return

    // Уважение к системной настройке: если человек просил меньше движения,
    // и пауза, и набор для него — не эффект, а задержка ответа.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setShown(total)
      setState('done')
      return
    }

    setState('thinking')
    timer.current = setTimeout(() => {
      setState('typing')

      const step = () => {
        // Порция переменной длины: ровный посимвольный набор читается как
        // заставка из фильма, а не как приходящий поток.
        count.current += 2 + Math.floor(Math.random() * 4)

        if (count.current >= total) {
          setShown(total)
          setState('done')
          return
        }

        setShown(count.current)
        timer.current = setTimeout(step, TICK_MS)
      }
      step()
    }, THINK_MS)
  }

  if (state === 'idle') {
    return (
      <button
        type="button"
        onClick={start}
        className="glass-flat glass-hover inline-flex h-11 items-center gap-2.5 rounded-[var(--r-pill)] border-hairline-2 pr-5 pl-4 text-[0.9375rem] text-text-2 transition-colors duration-[var(--dur)] hover:text-text"
      >
        <Sparkles size={16} strokeWidth={1.5} aria-hidden className="text-[var(--accent)]" />
        Пересказ от ИИ
      </button>
    )
  }

  // Сколько знаков досталось каждому пункту на текущем шаге.
  let left = shown
  const sliced = points.map((p) => {
    const take = Math.max(0, Math.min(p.length, left))
    left -= take
    return p.slice(0, take)
  })

  return (
    <aside
      aria-label="Пересказ статьи от ИИ"
      className="glass-flat relative isolate max-w-[68ch] overflow-hidden rounded-[var(--r-md)] border-hairline-2 px-5 py-5 sm:px-6 sm:py-6"
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 w-px bg-[var(--accent)]/60"
      />

      <p className="t-eyebrow mb-4 flex items-center gap-2">
        <Sparkles size={13} strokeWidth={1.5} aria-hidden className="text-[var(--accent)]" />
        пересказ от ии
      </p>

      {state === 'thinking' ? (
        <p className="flex items-center gap-1.5 py-1" aria-label="Готовится">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="size-1.5 animate-pulse rounded-full bg-text-3"
              style={{ animationDelay: `${i * 160}ms` }}
            />
          ))}
        </p>
      ) : (
        // aria-live только на время набора: иначе скринридер зачитывает
        // каждую порцию заново. По завершении блок становится обычным текстом.
        <ol className="flex flex-col gap-3" aria-live={state === 'typing' ? 'polite' : 'off'}>
          {sliced.map((text, i) =>
            text ? (
              <li key={points[i]} className="flex gap-3">
                <span
                  aria-hidden
                  className="mt-[0.15em] grid size-5 shrink-0 place-items-center rounded-full border border-hairline-2 font-mono text-[0.6875rem] text-text-3"
                >
                  {i + 1}
                </span>
                <span className="text-[1rem] leading-[1.55] text-text-2">
                  {text}
                  {state === 'typing' && i === sliced.findLastIndex((s) => s.length > 0) && (
                    <span
                      aria-hidden
                      className="ml-0.5 inline-block h-[1.05em] w-[2px] translate-y-[0.18em] bg-[var(--accent)]"
                    />
                  )}
                </span>
              </li>
            ) : null,
          )}
        </ol>
      )}

      <p
        className={cn(
          't-micro mt-4 transition-opacity duration-[var(--dur)]',
          state === 'done' ? 'opacity-100' : 'opacity-0',
        )}
      >
        Пересказ собран нейросетью по тексту статьи. Подробности и оговорки — ниже.
      </p>
    </aside>
  )
}
