import type { City } from '@/data/cities'
import { Reveal } from '@/components/Reveal'
import { W } from '@/components/SectionHead'
import { asset } from '@/lib/asset'

const FACTS = ['от 45 000 ₽', '7–10 дней', 'предоплата 50%', 'работаю один']

/**
 * Первый экран городской страницы. Осознанно тише главной: здесь нет живого
 * окна и второго свечения — человек пришёл из поиска по городу и должен
 * за два экрана понять, что и почём, а не смотреть демонстрацию возможностей.
 */
export function CityHero({ city }: { city: City }) {
  return (
    <section id="top" className="relative overflow-hidden pt-28 pb-14 sm:pt-32 sm:pb-20">
      <div className="container relative flex flex-col items-center text-center">
        <Reveal>
          <nav aria-label="Хлебные крошки" className="t-micro">
            <a href={asset('/')} className="transition-colors hover:text-text-2">
              Главная
            </a>
            <span className="mx-2" aria-hidden>
              /
            </span>
            <span className="text-text-2">{city.name}</span>
          </nav>
        </Reveal>

        <Reveal delay={60}>
          <h1 className="t-h1 mt-6 max-w-[17ch]">{city.h1}</h1>
        </Reveal>

        <Reveal delay={120}>
          <p className="t-lead measure mx-auto mt-6 text-balance">{city.lead}</p>
        </Reveal>

        <Reveal delay={180}>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <a href="#zayavka" className="btn btn-accent">
              Обсудить проект
            </a>
            <a href="#raboty" className="btn btn-glass">
              Смотреть работы
            </a>
          </div>
        </Reveal>

        <Reveal delay={240}>
          <p className="t-micro mt-5 flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
            {FACTS.map((f, i) => (
              <span key={f} className="inline-flex items-center gap-2">
                {i > 0 && <span aria-hidden>·</span>}
                {f}
              </span>
            ))}
          </p>
        </Reveal>
      </div>
    </section>
  )
}

/** Три абзаца про рынок города + аргумент про расстояние. */
export function CityIntro({ city }: { city: City }) {
  return (
    <section className="section pt-0" aria-labelledby="rynok-h">
      <div className="container">
        <Reveal className="flex flex-col gap-4">
          <span className="t-eyebrow">рынок {city.ofCity.toLowerCase()}</span>
          <h2 id="rynok-h" className="t-h2 max-w-[18ch]">
            Что здесь <W>иначе</W>
          </h2>
        </Reveal>

        <div className="mt-10 flex max-w-[68ch] flex-col gap-5">
          {city.intro.map((p, i) => (
            <Reveal key={i} delay={Math.min(i, 3) * 60}>
              <p className="t-body">{p}</p>
            </Reveal>
          ))}
        </div>

        <Reveal delay={120}>
          <div className="glass-flat mt-10 max-w-[68ch] rounded-[var(--r-lg)] p-6 sm:p-8">
            <h3 className="t-h3">{city.proximity.head}</h3>
            <p className="t-body mt-4">{city.proximity.body}</p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
