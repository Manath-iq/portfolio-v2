/**
 * Схема первого экрана: четыре ответа, размеченные прямо на макете.
 *
 * Это единственная картинка в статьях, и она здесь не для разнообразия.
 * Текст статьи перечисляет четыре ответа списком, но список не показывает
 * главного — что все четыре должны уместиться в один экран без прокрутки.
 * Схема показывает именно это, то есть сообщает то, чего в тексте нет.
 *
 * Собрана вёрсткой, а не картинкой: масштабируется без потери резкости,
 * читается скринридером как обычный список, весит ноль байт и не разъезжается
 * при смене шрифта. Декоративные части скрыты от скринридера, значение несёт
 * подпись под схемой.
 */
const ZONES = [
  { n: 1, label: 'что это', hint: 'услуга теми же словами, которыми её искали' },
  { n: 2, label: 'для кого и где', hint: 'город, тип клиента' },
  { n: 3, label: 'сколько', hint: 'цена, вилка или одна конкретная цифра' },
  { n: 4, label: 'что дальше', hint: 'одна кнопка с понятным действием' },
]

/** Номерная метка на макете. */
function Pin({ n }: { n: number }) {
  return (
    <span className="grid size-6 shrink-0 place-items-center rounded-full border border-hairline-2 bg-[var(--bg)] font-mono text-[0.6875rem] text-text-2">
      {n}
    </span>
  )
}

export function FirstScreenDiagram() {
  return (
    <figure className="max-w-[68ch]">
      <div className="glass-flat overflow-hidden rounded-[var(--r-lg)] p-2">
        {/* Хром окна: три точки и адресная строка — чтобы схема сразу читалась
            как первый экран сайта, а не как абстрактный прямоугольник. */}
        <div aria-hidden className="flex items-center gap-2 px-3 py-2.5">
          <span className="flex gap-1.5">
            <i className="block size-2 rounded-full bg-white/15" />
            <i className="block size-2 rounded-full bg-white/15" />
            <i className="block size-2 rounded-full bg-white/15" />
          </span>
          <span className="ml-2 h-4 flex-1 rounded-[var(--r-pill)] bg-white/[.04]" />
        </div>

        <div className="rounded-[var(--r-md)] bg-black/30 px-5 py-8 sm:px-8 sm:py-10">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <Pin n={1} />
              <span className="h-6 flex-1 rounded bg-white/[.13] sm:h-7" aria-hidden />
            </div>

            <div className="flex items-center gap-3">
              <Pin n={2} />
              <span className="h-3.5 w-[62%] rounded bg-white/[.07]" aria-hidden />
            </div>

            <div className="mt-2 flex items-center gap-3">
              <Pin n={3} />
              <span
                aria-hidden
                className="h-7 w-28 rounded-[var(--r-pill)] border border-hairline bg-white/[.05]"
              />
            </div>

            <div className="mt-3 flex items-center gap-3">
              <Pin n={4} />
              <span
                aria-hidden
                className="h-9 w-40 rounded-[var(--r-pill)] bg-[var(--accent)]/80"
              />
            </div>
          </div>

          {/* Кромка «фолда»: всё, что ниже, человек уже не видит без прокрутки.
              Ради этой линии схема и рисуется. */}
          <div className="mt-8 flex items-center gap-3">
            <span aria-hidden className="h-px flex-1 bg-[repeating-linear-gradient(90deg,rgba(255,255,255,.25)_0_6px,transparent_6px_12px)]" />
            <span className="font-mono text-[0.625rem] tracking-[0.12em] text-text-3 uppercase">
              ниже фолда
            </span>
            <span aria-hidden className="h-px flex-1 bg-[repeating-linear-gradient(90deg,rgba(255,255,255,.25)_0_6px,transparent_6px_12px)]" />
          </div>
        </div>
      </div>

      <ol className="mt-5 grid gap-x-8 gap-y-2.5 sm:grid-cols-2">
        {ZONES.map((z) => (
          <li key={z.n} className="flex gap-3">
            <Pin n={z.n} />
            <span className="text-[0.9375rem] leading-[1.5]">
              <span className="font-medium">{z.label}</span>
              <span className="text-text-2"> — {z.hint}</span>
            </span>
          </li>
        ))}
      </ol>

      <figcaption className="t-micro mt-5">
        Все четыре ответа — выше кромки. То, что уехало за неё, для решения
        остаться уже не работает.
      </figcaption>
    </figure>
  )
}
