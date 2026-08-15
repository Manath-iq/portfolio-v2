'use client'

import { useState, type FormEvent } from 'react'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { SITE } from '@/data/site'
import { W } from '@/components/SectionHead'
import { Reveal } from '@/components/Reveal'
import { goal } from '@/lib/metrika'
import { asset } from '@/lib/asset'

type State = 'idle' | 'sending' | 'success' | 'error'

/**
 * Куда уходит заявка. На хостинге с PHP — в лежащий рядом api/lead.php,
 * на статике (GitHub Pages) — в Cloudflare Worker, адрес которого приходит
 * переменной сборки LEAD_ENDPOINT (см. workers/lead.js).
 *
 * Пока приёмника нет, переменная пустая. Тогда поля не рендерятся вовсе:
 * форма, которая молча ничего не отправляет, хуже её отсутствия — человек
 * пишет задачу, жмёт кнопку и теряет написанное. Вместо неё прямые контакты.
 */
const ENDPOINT = process.env.NEXT_PUBLIC_LEAD_ENDPOINT ?? '/api/lead.php'
const LIVE = ENDPOINT !== ''

export function LeadForm() {
  const [state, setState] = useState<State>('idle')
  const [error, setError] = useState('')

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (state === 'sending') return

    const form = e.currentTarget
    const fd = new FormData(form)
    const payload = {
      name: String(fd.get('name') ?? '').trim(),
      contact: String(fd.get('contact') ?? '').trim(),
      task: String(fd.get('task') ?? '').trim(),
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
              <div className="py-8 text-center">
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
                  Расскажи про <W>свой</W> проект
                </h2>
                <p className="t-body measure mt-4">
                  Отвечу в течение пары часов. Если пойму, что мой формат не подходит,
                  скажу прямо и подскажу, к кому идти.
                </p>

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
                <form onSubmit={onSubmit} noValidate className="mt-8 flex flex-col gap-4">
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

                  <label className="mt-1 flex cursor-pointer items-start gap-3 text-[0.875rem] text-text-2">
                    <input
                      type="checkbox"
                      name="consent"
                      required
                      className="mt-0.5 size-[18px] shrink-0 accent-[var(--accent)]"
                    />
                    <span>
                      Согласен на обработку персональных данных согласно{' '}
                      <a href={asset("/policy/")} className="text-text underline underline-offset-4">
                        политике конфиденциальности
                      </a>
                    </span>
                  </label>

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
