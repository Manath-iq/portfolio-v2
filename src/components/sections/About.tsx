import { existsSync } from 'node:fs'
import path from 'node:path'
import { ArrowRight } from 'lucide-react'
import { CHANNEL_URL, SITE } from '@/data/site'
import { Reveal } from '@/components/Reveal'
import { asset } from '@/lib/asset'

/** Фото автора генерировать нельзя. Нет файла — честный плейсхолдер. */
const PHOTO = '/author.webp'
const HAS_PHOTO = existsSync(path.join(process.cwd(), 'public', 'author.webp'))

/**
 * Единственная светлая секция на сайте. Переход резкий, без градиента.
 * Свечений нет, стекла нет — здесь материал другой.
 */
export function About() {
  return (
    <section className="bg-paper text-ink" aria-labelledby="kto-h">
      <div className="container-wide">
        <div className="grid items-stretch gap-10 py-[var(--section-y)] lg:grid-cols-[42fr_58fr] lg:gap-16">
          <Reveal className="lg:-my-[var(--section-y)]">
            <div className="h-full min-h-[420px] overflow-hidden rounded-[var(--r-xl)] bg-black/[.06] lg:rounded-none lg:rounded-r-[var(--r-xl)]">
              {HAS_PHOTO ? (
                <img
                  src={asset(PHOTO)}
                  alt={`${SITE.name} — разработчик сайтов, ${SITE.city}`}
                  width={1200}
                  height={1600}
                  loading="lazy"
                  className="size-full object-cover"
                />
              ) : (
                <div className="grid h-full min-h-[420px] place-items-center p-8 text-center">
                  <p className="font-mono text-[0.75rem] leading-relaxed text-ink/45">
                    здесь фото автора.
                    <br />
                    единственный ассет, который нельзя сгенерировать —
                    <br />
                    нужен настоящий снимок. положить в public/author.webp
                  </p>
                </div>
              )}
            </div>
          </Reveal>

          <Reveal delay={80} className="flex flex-col justify-center">
            <h2 id="kto-h" className="t-h2 max-w-[16ch]">
              Меня зовут {SITE.name}. Я собираю сайты{' '}
              <span className="accent-word">один</span>, из Нижнекамска.
            </h2>

            <div className="mt-8 flex max-w-[64ch] flex-col gap-5 text-[1.0625rem] leading-[1.65] text-ink/70">
              <p>
                Пришёл из дизайна, поэтому для меня сайт — это не «сверстать макет», а
                решить, что человек прочитает первым, где засомневается и что снимет это
                сомнение.
              </p>
              {/* Про канал с разборами говорим, только когда он есть. */}
              {CHANNEL_URL ? (
                <p>
                  Работаю без менеджеров и без очереди из проектов. Правки обсуждаются в
                  переписке и делаются в тот же день. Каждый свой сайт я потом разбираю в
                  Telegram-канале — можно посмотреть, как это устроено изнутри, до того
                  как решишь работать со мной.
                </p>
              ) : (
                <p>
                  Работаю без менеджеров и без очереди из проектов. Правки обсуждаются в
                  переписке и делаются в тот же день. Написать можно сразу в Telegram —
                  там отвечаю быстрее всего и без «оставьте заявку, вам перезвонят».
                </p>
              )}
            </div>

            <a
              href={CHANNEL_URL ?? SITE.telegram}
              target="_blank"
              rel="noopener"
              className="btn btn-ink mt-9 w-fit"
            >
              {CHANNEL_URL ? 'Telegram-канал с разборами' : 'Написать в Telegram'}
              <ArrowRight size={16} strokeWidth={1.5} aria-hidden />
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
