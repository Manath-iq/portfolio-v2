import { NICHES } from '@/data/niches'
import { SITE } from '@/data/site'
import { Monogram } from '@/components/Monogram'
import { asset } from '@/lib/asset'

export function Footer() {
  return (
    <footer className="hairline-top bg-bg-2">
      <div className="container-wide py-16">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-2.5">
              <Monogram className="size-7" />
              <span className="text-[1.0625rem] font-medium">{SITE.brand}</span>
            </div>
            <p className="t-body measure mt-4 text-[0.9375rem]">
              Делаю сайты для бизнеса в Нижнекамске и Татарстане.
            </p>
            <div className="mt-5 flex flex-col gap-2 text-[0.9375rem]">
              <a
                href={SITE.telegram}
                target="_blank"
                rel="noopener"
                className="w-fit text-text-2 transition-colors hover:text-text"
              >
                Telegram
              </a>
              <a
                href={SITE.whatsapp}
                target="_blank"
                rel="noopener"
                className="w-fit text-text-2 transition-colors hover:text-text"
              >
                WhatsApp
              </a>
            </div>
          </div>

          <nav aria-label="Ниши">
            <p className="t-eyebrow">ниши</p>
            <ul className="mt-4 flex flex-col gap-2 text-[0.9375rem]">
              {NICHES.map((n) => (
                <li key={n.label}>
                  {n.href ? (
                    <a href={n.href} className="text-text-2 transition-colors hover:text-text">
                      {n.label}
                    </a>
                  ) : (
                    <span className="text-text-2">{n.label}</span>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="t-eyebrow">документы</p>
            <ul className="mt-4 flex flex-col gap-2 text-[0.9375rem]">
              <li>
                <a
                  href={asset('/policy/')}
                  className="text-text-2 transition-colors hover:text-text"
                >
                  Политика конфиденциальности
                </a>
              </li>
              <li>
                <a
                  href={asset('/oferta/')}
                  className="text-text-2 transition-colors hover:text-text"
                >
                  Договор-оферта
                </a>
              </li>
              <li>
                <a href={SITE.phoneHref} className="text-text-2 transition-colors hover:text-text">
                  {SITE.phone}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="hairline-top mt-14 flex flex-col gap-4 pt-6 sm:flex-row sm:items-center sm:justify-between">
          {/* ИНН показывается, только когда он есть: строка «ИНН» без номера
              выглядит как недоделка, а выдуманный номер — это подлог. */}
          <p className="t-micro">
            {SITE.name} ({SITE.brand}), ИП
            {SITE.inn ? ` · ИНН ${SITE.inn}` : ''} · {SITE.city}, {SITE.region}
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
