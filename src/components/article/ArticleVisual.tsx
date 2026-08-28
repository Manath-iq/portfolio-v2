/**
 * Визуал статьи: обложка сверху и та же графика врезкой по тексту.
 *
 * Собран вёрсткой, а не картинкой, по тем же причинам, что и схема первого
 * экрана: ноль байт в бюджет первого экрана, резкость на любом экране,
 * тема и акцент берутся из токенов, а не запекаются в пиксели. Растровая
 * обложка на каждую из десяти статей стоила бы сотни килобайт и устаревала
 * бы при первой же правке заголовка.
 *
 * Мотив у каждой статьи свой, но рама общая: тёмная панель, один акцентный
 * подсвет сверху, общий радиус. Отсюда «единый стиль» — меняется содержимое
 * схемы, не её оформление.
 *
 * Важное правило то же, что и у FirstScreenDiagram: мотив показывает мысль
 * статьи, а не украшает её. Воронка показывает, что потери идут ступенями;
 * шкала — что срок делится между двумя сторонами; чеклист — что часть пунктов
 * проверяют, а часть забывают. Если для статьи такой мысли нет, у неё нет и
 * визуала: пустая картинка ради ритма хуже, чем её отсутствие.
 */
import type { VisualKind } from '@/data/articles'
import { cn } from '@/lib/utils'

/** Подпись под схемой. Смысл несёт она, сама графика скрыта от скринридера. */
function Caption({ children }: { children: React.ReactNode }) {
  return <figcaption className="mt-3 text-[0.875rem] text-text-3">{children}</figcaption>
}

/**
 * Воронка потерь. Пять ступеней, каждая уже предыдущей: список в тексте
 * перечисляет места потерь, но не показывает, что они идут подряд и что до
 * формы доходит остаток, а не все.
 */
function Funnel() {
  const steps = [
    { w: '100%', label: 'зашли на сайт', dim: false },
    { w: '78%', label: 'первый экран подтвердил запрос', dim: false },
    { w: '58%', label: 'нашли цену', dim: false },
    { w: '41%', label: 'поверили', dim: false },
    { w: '29%', label: 'дошли до формы', dim: false },
    { w: '17%', label: 'отправили заявку', dim: true },
  ]

  // Сетка, а не флекс в строку: у подписей разная длина, и во флексе длинная
  // сжимала свою полосу сильнее соседних — воронка переставала сужаться по
  // порядку и начинала врать. Колонка подписи фиксированной ширины, полоса
  // всегда меряется от одного и того же трека.
  return (
    <div aria-hidden className="flex flex-col gap-2.5">
      {steps.map((s) => (
        <div
          key={s.label}
          className="grid grid-cols-[1fr_7.5rem] items-center gap-3 sm:grid-cols-[1fr_13rem]"
        >
          <span className="flex">
            <span
              className={cn(
                'h-7 rounded-[6px] sm:h-8',
                s.dim
                  ? 'bg-[var(--accent)] shadow-[0_0_28px_-6px_var(--accent)]'
                  : 'bg-white/[.09]',
              )}
              style={{ width: s.w }}
            />
          </span>
          <span
            className={cn(
              'text-[0.75rem] leading-tight sm:text-[0.8125rem]',
              s.dim ? 'text-text' : 'text-text-3',
            )}
          >
            {s.label}
          </span>
        </div>
      ))}
    </div>
  )
}

/**
 * Шкала срока. Этапы идут слева направо, но красит их не порядок, а то,
 * от кого этап зависит: акцентом отмечено то, что делает заказчик. В таблице
 * это третья колонка, которую при чтении по диагонали пропускают.
 */
function Timeline() {
  const stages = [
    { w: 10, label: 'задача', byClient: false },
    { w: 26, label: 'тексты', byClient: true },
    { w: 18, label: 'дизайн', byClient: false },
    { w: 24, label: 'вёрстка', byClient: false },
    { w: 12, label: 'наполнение', byClient: true },
    { w: 10, label: 'выкладка', byClient: false },
  ]

  return (
    <div aria-hidden className="flex flex-col gap-4">
      <div className="flex gap-1.5">
        {stages.map((s) => (
          <span
            key={s.label}
            className={cn(
              'h-9 rounded-[6px] sm:h-11',
              s.byClient
                ? 'bg-[var(--accent)]/85 shadow-[0_0_28px_-8px_var(--accent)]'
                : 'bg-white/[.10]',
            )}
            style={{ width: `${s.w}%` }}
          />
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
        <span className="flex items-center gap-2 text-[0.8125rem] text-text-3">
          <i className="block size-2.5 rounded-[3px] bg-white/[.14]" />
          зависит от исполнителя
        </span>
        <span className="flex items-center gap-2 text-[0.8125rem] text-text-2">
          <i className="block size-2.5 rounded-[3px] bg-[var(--accent)]" />
          зависит от заказчика
        </span>
      </div>
    </div>
  )
}

/**
 * Чеклист приёмки. Половина строк отмечена, половина пуста: смысл в том,
 * что смотрят обычно на верхние пункты — как выглядит и работает ли, — а
 * забывают нижние, те самые, которые потом нельзя починить.
 */
function Checklist() {
  const rows = [
    { label: 'сайт открывается и выглядит хорошо', done: true },
    { label: 'форма отправляет заявку', done: true },
    { label: 'телефон набирается с телефона', done: true },
    { label: 'домен оформлен на вас', done: false },
    { label: 'доступы к счётчикам у вас', done: false },
    { label: 'сайт не закрыт от индексации', done: false },
  ]

  return (
    <div aria-hidden className="flex flex-col gap-2.5">
      {rows.map((r) => (
        <div key={r.label} className="flex items-center gap-3">
          <span
            className={cn(
              'grid size-5 shrink-0 place-items-center rounded-[6px] border',
              r.done
                ? 'border-transparent bg-white/[.13]'
                : 'border-[var(--accent)]/70 bg-[var(--accent)]/[.08]',
            )}
          >
            {r.done ? (
              <svg viewBox="0 0 12 12" className="size-3 text-text-3" fill="none">
                <path
                  d="M2.5 6.2 4.8 8.5 9.5 3.8"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ) : null}
          </span>
          <span
            className={cn('text-[0.875rem]', r.done ? 'text-text-3' : 'text-text')}
          >
            {r.label}
          </span>
          <span className="h-px flex-1 bg-hairline" />
        </div>
      ))}
    </div>
  )
}

/**
 * Ценовые полосы. В статье три уровня разнесены по заголовкам, и пока
 * читаешь подряд, не видно главного — что это не «дешевле-дороже», а разные
 * вещи: в первой полосе покупают шаблон, в третьей команду. Акцент на
 * средней: это уровень, на котором работаю я, и врать про это незачем.
 */
function Tiers() {
  const tiers = [
    { w: '24%', price: '15 000 ₽', what: 'шаблон с вашим логотипом', mine: false },
    { w: '58%', price: '45 000 – 120 000 ₽', what: 'работа одного человека', mine: true },
    { w: '100%', price: '150 000 – 300 000 ₽', what: 'студия', mine: false },
  ]

  return (
    <div aria-hidden className="flex flex-col gap-4">
      {tiers.map((t) => (
        <div key={t.price} className="flex flex-col gap-1.5">
          <span className="flex">
            <span
              className={cn(
                'h-8 rounded-[6px] sm:h-10',
                t.mine
                  ? 'bg-[var(--accent)]/90 shadow-[0_0_30px_-14px_var(--accent)]'
                  : 'bg-white/[.09]',
              )}
              style={{ width: t.w }}
            />
          </span>
          <span className="flex flex-wrap items-baseline gap-x-2.5 gap-y-0.5">
            <span
              className={cn(
                'font-mono text-[0.8125rem]',
                t.mine ? 'text-text' : 'text-text-2',
              )}
            >
              {t.price}
            </span>
            <span className="text-[0.8125rem] text-text-3">{t.what}</span>
          </span>
        </div>
      ))}
    </div>
  )
}

/**
 * Входы. Лендинг — одна дверь на все запросы, многостраничник — своя дверь
 * на каждый. В тексте это сравнение таблицей, но таблица меряет свойства, а
 * решает не свойство, а число разных вопросов, с которыми к вам приходят.
 */
function Entries() {
  const many = ['брекеты', 'импланты', 'детский приём', 'отбеливание']

  return (
    <div aria-hidden className="grid gap-6 sm:grid-cols-2 sm:gap-8">
      <div className="flex flex-col gap-3">
        <span className="t-eyebrow">лендинг</span>
        <span className="h-1.5 w-10 rounded-full bg-[var(--accent)]" />
        <span className="grid h-20 place-items-center rounded-[10px] border border-hairline-2 bg-white/[.04] text-[0.8125rem] text-text-2">
          одна страница
        </span>
        <span className="text-[0.8125rem] text-text-3">
          один вход на все запросы сразу
        </span>
      </div>

      <div className="flex flex-col gap-3">
        <span className="t-eyebrow">многостраничник</span>
        <span className="flex gap-1.5">
          {many.map((m) => (
            <span key={m} className="h-1.5 w-10 rounded-full bg-[var(--accent)]" />
          ))}
        </span>
        <span className="grid grid-cols-2 gap-1.5">
          {many.map((m) => (
            <span
              key={m}
              className="grid h-[2.125rem] place-items-center rounded-[8px] border border-hairline-2 bg-white/[.04] text-[0.75rem] text-text-2"
            >
              {m}
            </span>
          ))}
        </span>
        <span className="text-[0.8125rem] text-text-3">
          свой вход на каждый запрос
        </span>
      </div>
    </div>
  )
}

/**
 * Два канала и один вход. Список в тексте перечисляет, чего лента не умеет,
 * но не показывает главного: поиск — не «слабое место» соцсетей, а вход,
 * которого у них нет вовсе. Поэтому вторая стрелка не тоньше, а оборвана.
 */
function Channels() {
  const rows = [
    { from: 'ищет «ветклиника рядом» в поиске', to: 'сайт', works: true },
    { from: 'тот же человек, тот же запрос', to: 'группа во ВКонтакте', works: false },
  ]

  return (
    <div aria-hidden className="flex flex-col gap-4">
      {rows.map((r) => (
        <div
          key={r.to}
          className="grid grid-cols-[1fr_auto] items-center gap-3 sm:grid-cols-[auto_1fr_10.5rem]"
        >
          <span className="text-[0.8125rem] text-text-3">{r.from}</span>

          <span className="flex items-center gap-1 sm:w-full">
            <span
              className={cn(
                'h-px w-8 sm:w-full sm:min-w-14',
                r.works
                  ? 'bg-[var(--accent)]'
                  : 'bg-[linear-gradient(90deg,var(--hairline-2)_50%,transparent_50%)] bg-[length:6px_1px]',
              )}
            />
            <span
              className={cn(
                'text-[0.875rem]',
                r.works ? 'text-[var(--accent)]' : 'text-text-3',
              )}
            >
              {r.works ? '\u2192' : '\u00d7'}
            </span>
          </span>

          <span
            className={cn(
              'col-span-2 rounded-[8px] border px-3 py-2 text-[0.8125rem] sm:col-span-1',
              r.works
                ? 'border-[var(--accent)]/50 bg-[var(--accent)]/[.08] text-text'
                : 'border-hairline-2 bg-white/[.02] text-text-3',
            )}
          >
            {r.to}
          </span>
        </div>
      ))}
    </div>
  )
}

const MOTIFS: Record<VisualKind, { node: React.ReactNode; caption: string }> = {
  funnel: {
    node: <Funnel />,
    caption:
      'Заявка теряется не в одном месте, а понемногу на каждой ступени. Чинить имеет смысл верхние: до нижних человек просто не доходит.',
  },
  timeline: {
    node: <Timeline />,
    caption:
      'Пропорции здесь условные — важно не соотношение дней, а то, что красные куски стоят в середине и в конце. Пока они не закрыты, соседние этапы просто ждут.',
  },
  checklist: {
    node: <Checklist />,
    caption:
      'Верхние три пункта проверяют все, нижние три — почти никто. При этом починить потом нельзя как раз нижние.',
  },
  tiers: {
    node: <Tiers />,
    caption:
      'Это не одна услуга за разные деньги. В нижней полосе покупают шаблон, в верхней — команду, и выбирать надо не цену, а то, что вам из этого нужно.',
  },
  entries: {
    node: <Entries />,
    caption:
      'Решает не количество страниц, а количество разных вопросов, с которыми к вам приходят. Один вопрос — одна страница, четыре — четыре.',
  },
  channels: {
    node: <Channels />,
    caption:
      'Поиск — не слабое место соцсетей, а вход, которого у них нет. Всё остальное лента закрывает не хуже сайта, а часто и лучше.',
  },
}

/**
 * `cover` — обложка под лидом статьи, шире колонки текста и с воздухом.
 * `inline` — та же схема врезкой по тексту, уже и тише, с подписью.
 */
export function ArticleVisual({
  kind,
  variant = 'inline',
}: {
  kind: VisualKind
  variant?: 'cover' | 'inline'
}) {
  const m = MOTIFS[kind]
  const cover = variant === 'cover'

  return (
    // Обложка шире колонки текста, но не во всю сетку: на широком экране
    // панель в 1160px растягивала короткие подписи в редкую строчку, и схема
    // читалась как пустая. 56rem — заметно шире текста и всё ещё плотно.
    <figure className={cover ? 'w-full max-w-[56rem]' : 'max-w-[68ch]'}>
      <div
        className={cn(
          'glass-flat relative isolate overflow-hidden rounded-[var(--r-lg)]',
          cover ? 'px-5 py-8 sm:px-10 sm:py-12' : 'px-5 py-7 sm:px-8 sm:py-9',
        )}
      >
        {/* Один акцентный подсвет — та же пара, что держит первый экран сайта.
            Зерна здесь нет намеренно: globals.css кладёт его на всю страницу
            слоем поверх, и второе, локальное, превращает схему в помехи. */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              'radial-gradient(520px 260px at 18% -20%, color-mix(in srgb, var(--accent) 16%, transparent), transparent 70%)',
          }}
        />
        {m.node}
      </div>
      {!cover && <Caption>{m.caption}</Caption>}
    </figure>
  )
}
