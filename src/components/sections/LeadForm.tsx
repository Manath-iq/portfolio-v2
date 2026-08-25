'use client'

import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { SITE } from '@/data/site'
import { W } from '@/components/SectionHead'
import { Reveal } from '@/components/Reveal'
import { goal } from '@/lib/metrika'
import { asset } from '@/lib/asset'

type State = 'idle' | 'sending' | 'success' | 'error'

/**
 * Куда уходит заявка.
 *
 * Основной источник — SITE.leadEndpoint: адрес Cloudflare Worker для статики
 * (см. workers/lead.js). Переменная сборки NEXT_PUBLIC_LEAD_ENDPOINT главнее —
 * ею хостинг с PHP подставляет свой '/api/lead.php'.
 *
 * Пока адреса нет, поля не рендерятся вовсе: форма, которая молча ничего
 * не отправляет, хуже её отсутствия — человек пишет задачу, жмёт кнопку
 * и теряет написанное. Вместо неё прямые контакты.
 */
const ENDPOINT = process.env.NEXT_PUBLIC_LEAD_ENDPOINT || SITE.leadEndpoint || ''
const LIVE = ENDPOINT !== ''

export function LeadForm() {
  const [state, setState] = useState<State>('idle')
  const [error, setError] = useState('')
  /** Цель на первый фокус в форме: «до формы не доходят» и «доходят,
      но бросают» — это два разных диагноза и два разных лечения. */
  const started = useRef(false)
  /** Тариф, с карточки которого человек пришёл. Ставится делегированием,
      чтобы прайс остался серверным компонентом. */
  const [plan, setPlan] = useState<string | null>(null)
  /**
   * Поля, которые человек уже покинул пустыми. Проверка по blur, а не по вводу:
   * подсвечивать «неправильно» посреди набора — это ругаться на недописанное.
   * Правило .field[aria-invalid='true'] в globals.css до сих пор существовало
   * само по себе, выставить его было некому.
   */
  const [invalid, setInvalid] = useState<ReadonlySet<string>>(new Set())
  const successRef = useRef<HTMLDivElement>(null)

  function checkOnBlur(e: React.FocusEvent<HTMLInputElement>) {
    const { name, value } = e.currentTarget
    setInvalid((prev) => {
      const next = new Set(prev)
      if (value.trim()) next.delete(name)
      else next.add(name)
      return next
    })
  }

  // Успех подменяет карточку целиком: фокус надо перенести руками.
  useEffect(() => {
    if (state === 'success') successRef.current?.focus()
  }, [state])

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement | null)?.closest?.('a[data-plan]')
      if (a) setPlan(a.getAttribute('data-plan'))
    }

    document.addEventListener('click', onClick, { capture: true })
    return () => document.removeEventListener('click', onClick, { capture: true })
  }, [])

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (state === 'sending') return

    const form = e.currentTarget
    const fd = new FormData(form)
    const payload = {
      name: String(fd.get('name') ?? '').trim(),
      contact: String(fd.get('contact') ?? '').trim(),
      task: String(fd.get('task') ?? '').trim(),
      // Тариф, если человек пришёл с карточки прайса. Без него заявки
      // с трёх разных кнопок неотличимы друг от друга.
      plan: plan ?? '',
      // honeypot: живой человек это поле не видит и не заполняет
      company: String(fd.get('company') ?? ''),
      page: typeof window !== 'undefined' ? window.location.href : '',
    }

    if (!payload.name || !payload.contact) {
      setError('Заполните имя и способ связи.')
      return
    }

    setState('sending')
    setError('')

    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error(String(res.status))

      setState('success')
      goal('lead_sent')
      toast.success('Заявка отправлена', {
        description: 'Отвечу в течение пары часов.',
      })
    } catch {
      setState('error')
      setError(
        'Не отправилось. Похоже, что-то с сетью — напишите в Telegram, там точно дойдёт.',
      )
      toast.error('Заявка не ушла', { description: 'Попробуйте Telegram.' })
    }
  }

  return (
    <section id="zayavka" className="section relative overflow-hidden" aria-labelledby="zayavka-h">
      {/* Второе и последнее свечение на странице. Маска гасит нижнюю кромку:
          секция режет градиент в самой яркой точке, и на границе с подвалом
          получалась поперечная полоса. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(760px 520px at 50% 100%, rgba(255,77,46,.26), transparent 70%)',
          WebkitMaskImage: 'linear-gradient(to bottom, #000 0%, #000 72%, transparent 100%)',
          maskImage: 'linear-gradient(to bottom, #000 0%, #000 72%, transparent 100%)',
        }}
      />

      <div className="container relative">
        <Reveal>
          <div className="glass mx-auto max-w-[820px] p-6 sm:p-10">
            {state === 'success' ? (
              /* Форма исчезает целиком, и фокус вместе с ней — без переноса
                 незрячий человек остаётся на пропавшей кнопке и не узнаёт,
                 что заявка ушла. tabIndex -1 делает блок принимающим фокус,
                 не попадая при этом в обход по Tab. */
              <div ref={successRef} tabIndex={-1} className="py-8 text-center outline-none">
                <h2 id="zayavka-h" className="t-h2 text-[clamp(1.6rem,3vw,2.2rem)]">
                  Готово.
                </h2>
                <p className="t-lead measure mx-auto mt-4">
                  Я получил заявку и напишу в течение пары часов. Если срочно — пишите в
                  Telegram, там отвечаю быстрее.
                </p>
                <a
                  href={SITE.telegram}
                  target="_blank"
                  rel="noopener"
                  onClick={() => goal('tg_click')}
                  className="btn btn-glass mt-7"
                >
                  Написать в Telegram
                </a>
              </div>
            ) : (
              <>
                <h2 id="zayavka-h" className="t-h2 text-[clamp(1.9rem,3.4vw,2.75rem)]">
                  Расскажите про <W>свой</W> проект
                </h2>
                <p className="t-body measure mt-4">
                  Отвечу в течение пары часов. Если пойму, что мой формат не подходит,
                  скажу прямо и подскажу, к кому идти.
                </p>

                {/* Подтверждение выбора: человек, пришедший с карточки тарифа,
                    должен видеть, что его выбор доехал, — иначе он объясняет
                    заново то, на что уже нажал. */}
                {plan ? (
                  <p className="t-micro mt-5 inline-flex items-center gap-2 rounded-[var(--r-pill)] border border-hairline bg-[var(--surface)] px-3.5 py-1.5">
                    формат: <span className="text-text">{plan}</span>
                  </p>
                ) : null}

                {!LIVE ? (
                  /* Приёмника нет — вместо мёртвых полей прямые контакты. */
                  <div className="mt-8 flex flex-wrap items-center gap-3">
                    <a
                      href={SITE.telegram}
                      target="_blank"
                      rel="noopener"
                      onClick={() => goal('tg_click')}
                      className="btn btn-accent"
                    >
                      Написать в Telegram
                    </a>
                    <a href={SITE.whatsapp} target="_blank" rel="noopener" className="btn btn-glass">
                      WhatsApp
                    </a>
                    <a href={SITE.phoneHref} className="btn btn-glass">
                      {SITE.phone}
                    </a>
                  </div>
                ) : (
                <form
                  onSubmit={onSubmit}
                  noValidate
                  onFocusCapture={() => {
                    if (started.current) return
                    started.current = true
                    goal('form_start')
                  }}
                  className="mt-8 flex flex-col gap-4"
                >
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="flex flex-col gap-2">
                      <label htmlFor="name" className="t-micro">
                        как вас зовут
                      </label>
                      <input
                        id="name"
                        name="name"
                        className="field"
                        autoComplete="name"
                        required
                        aria-invalid={invalid.has('name') || undefined}
                        onBlur={checkOnBlur}
                        placeholder="Марат"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label htmlFor="contact" className="t-micro">
                        телефон или telegram
                      </label>
                      <input
                        id="contact"
                        name="contact"
                        className="field"
                        autoComplete="tel"
                        required
                        aria-invalid={invalid.has('contact') || undefined}
                        onBlur={checkOnBlur}
                        placeholder="+7 917 … или @username"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label htmlFor="task" className="t-micro">
                      коротко о задаче
                    </label>
                    <textarea
                      id="task"
                      name="task"
                      className="field"
                      rows={4}
                      placeholder="Автомойка в Нижнекамске, сайта нет, нужны заявки"
                    />
                  </div>

                  {/* honeypot */}
                  <input
                    type="text"
                    name="company"
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden
                    className="absolute left-[-9999px] size-px opacity-0"
                  />

                  {/* Галочки согласия нет: правовых страниц у сайта нет, а чекбокс,
                      ссылающийся в никуда, — это лишний шаг и обещание документа,
                      которого не существует. Вместо него строка о том, что реально
                      происходит с данными: они уходят мне в Telegram и всё. */}
                  <p className="t-micro mt-1">
                    Заявка уходит мне в Telegram. Никому не передаю и в рассылки
                    не добавляю.
                  </p>

                  {error ? (
                    <p role="alert" className="text-[0.875rem] text-[var(--accent)]">
                      {error}
                    </p>
                  ) : null}

                  <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-3">
                    <button
                      type="submit"
                      className="btn btn-accent"
                      disabled={state === 'sending'}
                    >
                      {state === 'sending' ? (
                        <>
                          <Loader2
                            size={16}
                            strokeWidth={1.5}
                            className="animate-spin"
                            aria-hidden
                          />
                          Отправляю
                        </>
                      ) : (
                        'Отправить'
                      )}
                    </button>

                    <p className="t-micro">
                      Или сразу —{' '}
                      <a
                        href={SITE.telegram}
                        target="_blank"
                        rel="noopener"
                        onClick={() => goal('tg_click')}
                        className="text-text-2 underline underline-offset-4 hover:text-text"
                      >
                        Telegram
                      </a>{' '}
                      ·{' '}
                      <a
                        href={SITE.whatsapp}
                        target="_blank"
                        rel="noopener"
                        className="text-text-2 underline underline-offset-4 hover:text-text"
                      >
                        WhatsApp
                      </a>{' '}
                      ·{' '}
                      <a
                        href={SITE.phoneHref}
                        className="text-text-2 underline underline-offset-4 hover:text-text"
                      >
                        {SITE.phone}
                      </a>
                    </p>
                  </div>
                </form>
                )}
              </>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
