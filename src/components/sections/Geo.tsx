import { ArrowRight } from 'lucide-react'
import { CITIES } from '@/data/cities'
import { SITE } from '@/data/site'
import { SectionHead, W } from '@/components/SectionHead'
import { Reveal } from '@/components/Reveal'
import { asset } from '@/lib/asset'

/**
 * География. Единственная точка входа на городские страницы с главной —
 * без неё они висят сиротами, на которые не ведёт ни одной внутренней ссылки.
 *
 * Нижнекамск здесь тоже есть, но карточкой без ссылки: он закреплён за самой
 * главной, и ссылаться со страницы на неё же смысла нет.
 */
export function Geo() {
  return (
    <section id="goroda" className="section" aria-labelledby="goroda-h">
      <div className="container">
        <SectionHead eyebrow="география" id="goroda-h">
          Татарстан целиком. Разницы <W>нет</W>.
        </SectionHead>

        <p className="t-body measure mt-8">
          Живу и работаю в {SITE.city}е, но вся разработка идёт удалённо: бриф в
          переписке, макеты по ссылке, правки в тот же день. Город заказчика на сроки и
          цену не влияет — влияет только то, как быстро он отвечает на вопросы.
        </p>

        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Reveal>
            <div className="glass-flat flex h-full flex-col rounded-[var(--r-md)] border-hairline-2 p-5">
              <p className="t-eyebrow">домашний город</p>
              <h3 className="t-h3 mt-3 text-[1.1875rem]">{SITE.city}</h3>
              <p className="t-body mt-2 text-[0.9375rem]">
                Здесь я и все десять работ выше. Можно встретиться лично.
              </p>
            </div>
          </Reveal>

          {CITIES.map((c, i) => (
            <Reveal key={c.slug} delay={(i + 1) * 60}>
              <a
                href={asset(`/${c.slug}/`)}
                className="glass-flat glass-hover flex h-full flex-col rounded-[var(--r-md)] p-5"
              >
                <p className="t-eyebrow">{c.distanceKm} км · {c.driveTime}</p>
                <h3 className="t-h3 mt-3 text-[1.1875rem]">{c.name}</h3>
                <p className="t-body mt-2 text-[0.9375rem]">{c.cardLine}</p>
                <span className="mt-auto inline-flex items-center gap-1.5 pt-4 text-[0.9375rem] text-text-2">
                  Подробнее
                  <ArrowRight size={15} strokeWidth={1.5} aria-hidden />
                </span>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
