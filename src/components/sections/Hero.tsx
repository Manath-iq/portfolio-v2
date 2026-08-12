import { ArrowRight } from 'lucide-react'
import { CHANNEL_URL } from '@/data/site'
import { W } from '@/components/SectionHead'
import { Reveal } from '@/components/Reveal'
import { LiveWindow } from '@/components/LiveWindow'

const FACTS = [
  'от 45 000 ₽',
  '7–10 дней',
  'предоплата 50%',
  'не подошёл прототип — возвращаю полностью',
]

export function Hero() {
  return (
    <section id="top" className="relative min-h-[100svh] overflow-hidden pt-20 pb-16 sm:pt-28">
      {/* Свечение живёт на уровне страницы (см. app/page.tsx): секция начинается
          под шапкой, и привязанный к ней градиент давал стык на верхней кромке. */}
      <div className="container relative flex flex-col items-center text-center">
        <Reveal>
          {/* Пилюля ведёт на самое свежее. Пока канала нет — на витрину:
              «новый разбор», которого не существует, писать нельзя.
              Появится канал — поставить SITE.channel и вернуть сюда пост. */}
          <a
            href={CHANNEL_URL ?? '#raboty'}
            target={CHANNEL_URL ? '_blank' : undefined}
            rel={CHANNEL_URL ? 'noopener' : undefined}
            className="glass-hover inline-flex min-h-9 max-w-full items-center justify-center gap-2 rounded-[var(--r-pill)] border border-hairline bg-[var(--surface)] px-4 py-1.5 text-[0.8125rem] leading-snug sm:px-4.5 sm:text-[0.875rem]"
          >
            {/* На узком экране строка длинная: пилюля тянется по высоте,
                а не режет текст по фиксированным 36px. */}
            <span className="shiny-text text-balance">
              {CHANNEL_URL
                ? 'Новый разбор в Telegram-канале'
                : 'Десять работ ниже — можно открыть любую'}
            </span>
            <ArrowRight
              size={15}
              strokeWidth={1.5}
              className="shrink-0 text-text-3"
              aria-hidden
            />
          </a>
        </Reveal>

        <Reveal delay={60}>
          <h1 className="t-h1 mt-7 max-w-[19ch]">
            Я делаю сайты для бизнеса в Нижнекамске. Вот <W>все</W>, которые я сделал.
          </h1>
        </Reveal>

        <Reveal delay={120}>
          <p className="t-lead measure mx-auto mt-6 text-balance">
            Ни одного шаблона с автозаменой города. Каждый собран под конкретный бизнес:
            своя структура, свои тексты, своя ниша.
          </p>
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

      {/* Живое окно. Снизу подрезано краем экрана — тянется шире контейнера текста. */}
      <div className="container-wide relative mt-10 sm:mt-14">
        <Reveal delay={120}>
          <LiveWindow />
        </Reveal>
      </div>
    </section>
  )
}
