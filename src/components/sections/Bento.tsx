import { existsSync } from 'node:fs'
import path from 'node:path'
import { SectionHead, W } from '@/components/SectionHead'
import { Reveal } from '@/components/Reveal'
import { GlowCell } from '@/components/ui/GlowCell'
import {
  BeforeAfter,
  BriefToHeadline,
  FanPreviews,
  PhoneNotification,
  ResponsiveCycle,
  SpeedBar,
} from '@/components/bento/Visuals'

/** Ассет до/после появляется в public — до тех пор в ячейке честный плейсхолдер. */
const BA_READY =
  existsSync(path.join(process.cwd(), 'public/photo/flat.webp')) &&
  existsSync(path.join(process.cwd(), 'public/photo/studio.webp'))

function Cell({
  title,
  note,
  className,
  children,
  visualFirst = false,
}: {
  title: string
  note: string
  className?: string
  children: React.ReactNode
  visualFirst?: boolean
}) {
  const head = (
    <div className="p-6">
      <h3 className="t-h3">{title}</h3>
      <p className="t-body mt-2 text-[0.9375rem]">{note}</p>
    </div>
  )

  return (
    <GlowCell className={className}>
      <div className="flex h-full flex-col">
        {visualFirst ? null : head}
        <div className="flex min-h-0 flex-1 flex-col justify-center px-6 pb-6">{children}</div>
        {visualFirst ? head : null}
      </div>
    </GlowCell>
  )
}

export function Bento() {
  return (
    <section className="section" aria-labelledby="chto-vhodit-h">
      <div className="container-wide">
        <SectionHead eyebrow="что входит" id="chto-vhodit-h">
          Не «сверстать макет», а <W>решить</W>, почему человек не уходит
        </SectionHead>

        <Reveal delay={60}>
          <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-12">
            <Cell
              title="Дизайн под нишу"
              note="Стоматология и автосервис не могут выглядеть одинаково — у них разный страх на входе."
              className="md:col-span-7 md:row-span-2"
              visualFirst
            >
              <FanPreviews />
            </Cell>

            <Cell
              title="Тексты по брифу"
              note="Заголовок вырастает из фразы владельца, а не из подборки «продающих» шаблонов."
              className="md:col-span-5"
            >
              <BriefToHeadline />
            </Cell>

            <Cell
              title="Заявки в Telegram"
              note="Уведомление приходит на телефон сразу, отвечать можно из той же переписки."
              className="md:col-span-5"
            >
              <PhoneNotification />
            </Cell>

            <Cell
              title="Скорость"
              note="Замер живой работы, а не обещание. Проверяется по адресу в любой момент."
              className="md:col-span-4"
            >
              <SpeedBar />
            </Cell>

            <Cell
              title="Адаптив"
              note="Один и тот же экран на десктопе, планшете и телефоне — проверяю на реальных устройствах."
              className="md:col-span-8"
              visualFirst
            >
              <ResponsiveCycle />
            </Cell>

            <Cell
              title="Фото нейросетью"
              note="Студийные снимки под конкретный бизнес — лучше стока и дешевле фотографа."
              className="md:col-span-12"
            >
              <BeforeAfter
                ready={BA_READY}
                before="/photo/flat.webp"
                after="/photo/studio.webp"
                beforeAlt="Кабинет салона красоты при обычном верхнем свете — типовой кадр"
                afterAlt="Тот же кабинет со студийным светом — кадр, сгенерированный нейросетью"
              />
            </Cell>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
