import { ArrowUpRight } from 'lucide-react'
import type { City } from '@/data/cities'
import { CITIES } from '@/data/cities'
import { PROJECTS } from '@/data/projects'
import { SITE } from '@/data/site'
import { SectionHead, W } from '@/components/SectionHead'
import { Reveal } from '@/components/Reveal'
import { asset } from '@/lib/asset'

/**
 * Работы на городской странице — статичная сетка, без карусели.
 * Карусель на главной живёт ради первого впечатления; здесь человек пришёл
 * из поиска и ему нужнее увидеть все десять сразу, чем листать.
 * Первыми идут те, что ближе к городу по нише или по географии.
 */
export function CityWorks({ city }: { city: City }) {
  const order = [
    ...city.featured
      .map((id) => PROJECTS.find((p) => p.id === id))
      .filter((p): p is (typeof PROJECTS)[number] => Boolean(p)),
    ...PROJECTS.filter((p) => !city.featured.includes(p.id)),
  ]

  return (
    <section
      id="raboty"
      className="relative overflow-hidden bg-bg-2 py-[var(--section-y)]"
      aria-labelledby="raboty-h"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-[var(--bg)] to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[var(--bg)] to-transparent"
      />

      <div className="container-wide relative">
        <SectionHead eyebrow="работы" id="raboty-h">
          Десять сайтов. Ни один — под <W>шаблон</W>.
        </SectionHead>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:mt-14 lg:grid-cols-3">
          {order.map((p, i) => (
            <Reveal key={p.id} delay={Math.min(i, 5) * 50}>
              <article className="glass-flat flex h-full flex-col overflow-hidden rounded-[var(--r-lg)]">
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-black">
                  <img
                    src={asset(p.poster)}
                    alt={p.alt}
                    width={1600}
                    height={1000}
                    loading={i < 3 ? 'eager' : 'lazy'}
                    className="size-full object-cover object-top"
                  />
                  {p.isDemo ? (
                    <span className="absolute top-3 left-3 rounded-[var(--r-pill)] border border-hairline bg-black/60 px-2.5 py-1 font-mono text-[0.6875rem] text-text-2 backdrop-blur-sm">
                      демо-концепт
                    </span>
                  ) : null}
                </div>

                <div className="flex flex-1 flex-col gap-3 p-5">
                  <p className="t-eyebrow">
                    {p.niche.toLowerCase()} · {p.city.toLowerCase()}
                  </p>
                  <h3 className="t-h3 text-[1.1875rem]">{p.title}</h3>
                  <p className="t-body text-[0.9375rem]">{p.desc}</p>

                  {p.liveUrl ? (
                    <a
                      href={p.liveUrl}
                      target="_blank"
                      rel="noopener"
                      className="mt-auto inline-flex w-fit items-center gap-1.5 pt-2 text-[0.9375rem] text-text-2 transition-colors hover:text-text"
                    >
                      {p.isDemo ? 'Открыть демо' : 'Открыть сайт'}
                      <ArrowUpRight size={15} strokeWidth={1.5} aria-hidden />
                    </a>
                  ) : null}
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/**
 * Перелинковка: районы города для длинного хвоста и ссылки на соседние
 * городские страницы. Районы — текстом, а не ссылками: страниц под районы нет,
 * а битые ссылки хуже их отсутствия.
 */
export function CityLinks({ city }: { city: City }) {
  const others = CITIES.filter((c) => c.slug !== city.slug)

  return (
    <section className="section" aria-labelledby="geo-h">
      <div className="container">
        <SectionHead eyebrow="география" id="geo-h">
          Где ещё <W>работаю</W>
        </SectionHead>

        <p className="t-body measure mt-8">
          Беру заказы {city.inCity} и по всему Татарстану. Внутри города разницы нет —{' '}
          {city.areas.slice(0, 4).join(', ')} и остальные районы работают одинаково: вся
          коммуникация идёт удалённо, а сайт от адреса заказчика не зависит.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <a href={asset('/')} className="btn btn-glass">
            {SITE.city}
          </a>
          {others.map((c) => (
            <a key={c.slug} href={asset(`/${c.slug}/`)} className="btn btn-glass">
              {c.name}
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
