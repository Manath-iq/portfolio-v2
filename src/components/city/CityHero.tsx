import type { City } from '@/data/cities'
import { Reveal } from '@/components/Reveal'
import { SectionHead, W } from '@/components/SectionHead'
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

/**
 * Кому в этом городе чаще нужен сайт.
 *
 * Секция появилась не ради объёма, а ради него же по-честному: до неё три
 * городские страницы совпадали друг с другом на три четверти текста, и это
 * ровно то, что Яндекс называет шаблонными страницами. Разбор ниш —
 * единственное, что у городов действительно разное по существу: в Челнах
 * заказчик приходит от КАМАЗа, в Альметьевске — из нефтесервиса, в Казани
 * конкуренция в выдаче переписывает саму задачу.
 *
 * Ниши здесь текстом, а не ссылками на нишевые страницы: набор ниш у города
 * свой, и половины из них в /sayt-dlya-… просто нет. Битая или подменённая
 * ссылка хуже её отсутствия.
 */
export function CityNiches({ city }: { city: City }) {
  return (
    <section id="nishi" className="section pt-0" aria-labelledby="nishi-h">
      <div className="container">
        <SectionHead eyebrow={`кому нужен сайт ${city.inCity}`} id="nishi-h">
          Пять ниш и что <W>решает</W> в каждой
        </SectionHead>

        <p className="t-body measure mt-8">
          Список не про то, «с кем я работаю» — работаю я с любым бизнесом. Он про то,
          что у этих ниш {city.inCity} разный человек на входе и разный страх, а значит,
          и порядок блоков на странице разный. Одинаково их собирать нельзя.
        </p>

        <ol className="mt-10 flex flex-col gap-3">
          {city.niches.map((item, i) => (
            <Reveal key={item.n} delay={Math.min(i, 5) * 50}>
              <li className="glass-flat flex gap-4 rounded-[var(--r-md)] p-5 sm:gap-6 sm:p-6">
                <span className="t-micro shrink-0 pt-1 tabular-nums">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="min-w-0">
                  <h3 className="t-h3 text-[1.0625rem] sm:text-[1.1875rem]">{item.n}</h3>
                  <p className="t-body mt-2 text-[0.9375rem]">{item.why}</p>
                </div>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}
