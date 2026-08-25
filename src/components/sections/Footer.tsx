import { CITIES } from '@/data/cities'
import { NICHES } from '@/data/niches'
import { SITE } from '@/data/site'
import { Monogram } from '@/components/Monogram'
import { asset } from '@/lib/asset'

export function Footer() {
  return (
    <footer className="hairline-top bg-bg-2">
      <div className="container-wide py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2.5">
              <Monogram className="size-7" />
              <span className="text-[1.0625rem] font-medium">{SITE.brand}</span>
            </div>
            <p className="t-body measure mt-4 text-[0.9375rem]">
              Делаю сайты для бизнеса в Нижнекамске и Татарстане.
            </p>
          </div>

          {/* Города. Единственная сквозная ссылка на посадочные — стоит на
              каждой странице, поэтому городские страницы не остаются сиротами. */}
          <nav aria-label="Города">
            <p className="t-eyebrow">города</p>
            <ul className="mt-4 flex flex-col gap-2 text-[0.9375rem]">
              <li>
                <a href={asset('/')} className="text-text-2 transition-colors hover:text-text">
                  Сайты в {SITE.city}е
                </a>
              </li>
              {CITIES.map((c) => (
                <li key={c.slug}>
                  <a
                    href={asset(`/${c.slug}/`)}
                    className="text-text-2 transition-colors hover:text-text"
                  >
                    Сайты {c.inCity}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Ниши">
            <p className="t-eyebrow">ниши</p>
            <ul className="mt-4 flex flex-col gap-2 text-[0.9375rem]">
              {NICHES.map((n) => (
                <li key={n.label}>
                  {n.href ? (
                    <a
                      href={asset(n.href)}
                      className="text-text-2 transition-colors hover:text-text"
                    >
                      {n.label}
                    </a>
                  ) : (
                    <span className="text-text-2">{n.label}</span>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          {/* Четвёртая колонка — контакты. Правовых страниц у сайта нет,
              поэтому вместо «документов» здесь то, чем реально пользуются.
              Город не дублируем: он стоит строкой ниже, под линией. */}
          <div>
            <p className="t-eyebrow">связаться</p>
            <ul className="mt-4 flex flex-col gap-2 text-[0.9375rem]">
              <li>
                <a href={SITE.phoneHref} className="text-text-2 transition-colors hover:text-text">
                  {SITE.phone}
                </a>
              </li>
              <li>
                <a
                  href={SITE.telegram}
                  target="_blank"
                  rel="noopener"
                  className="text-text-2 transition-colors hover:text-text"
                >
                  Telegram
                </a>
              </li>
              <li>
                <a
                  href={SITE.whatsapp}
                  target="_blank"
                  rel="noopener"
                  className="text-text-2 transition-colors hover:text-text"
                >
                  WhatsApp
                </a>
              </li>
              <li>
                <a href="#zayavka" className="text-text-2 transition-colors hover:text-text">
                  Оставить заявку
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="hairline-top mt-14 flex flex-col gap-4 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="t-micro">
            {SITE.name} ({SITE.brand}) · {SITE.city}, {SITE.region}
          </p>
          <p className="t-micro flex items-center gap-2">
            <Monogram className="size-5" />
            Собран мной, на Next.js
          </p>
        </div>
      </div>
    </footer>
  )
}
