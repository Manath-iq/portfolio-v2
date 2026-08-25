import type { Block } from '@/data/articles'
import { Reveal } from '@/components/Reveal'
import { FirstScreenDiagram } from './FirstScreenDiagram'

/**
 * Тело статьи.
 *
 * Разметка собирается из типизированных блоков, а не из строки с HTML или
 * markdown: у блоков есть тип, поэтому таблица не может приехать без шапки,
 * а заголовок не может оказаться внутри абзаца. Плюс контент остаётся данными,
 * и по нему честно считается время чтения.
 *
 * Ширина колонки — 68ch. Длинная строка в статье на 1500 слов утомляет
 * сильнее, чем на посадочной: там текст читают кусками, здесь подряд.
 */
export function ArticleBody({ blocks }: { blocks: Block[] }) {
  return (
    <div className="flex flex-col gap-6">
      {blocks.map((b, i) => {
        // Задержка только у первых блоков: на длинной статье лесенка из
        // сорока элементов превращается в ожидание, а не в оживление.
        const delay = Math.min(i, 3) * 50

        if (b.t === 'h') {
          return (
            <Reveal key={i} delay={delay}>
              <h2 className="t-h2 mt-6 max-w-[24ch] text-[1.5rem] sm:text-[1.875rem]">
                {b.text}
              </h2>
            </Reveal>
          )
        }

        if (b.t === 'p') {
          return (
            <Reveal key={i} delay={delay}>
              <p className="t-body max-w-[68ch] text-[1.0625rem]">{b.text}</p>
            </Reveal>
          )
        }

        if (b.t === 'list') {
          return (
            <Reveal key={i} delay={delay}>
              <ul className="flex max-w-[68ch] flex-col gap-3">
                {b.items.map((item) => (
                  <li key={item} className="flex gap-3">
                    {/* Маркер — точка на своей строке, а не list-style: так он
                        не съезжает относительно первой строки длинного пункта. */}
                    <span aria-hidden className="mt-[0.7em] size-1 shrink-0 rounded-full bg-text-3" />
                    <span className="t-body text-[1.0625rem]">{item}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          )
        }

        if (b.t === 'note') {
          return (
            <Reveal key={i} delay={delay}>
              <aside className="glass-flat max-w-[68ch] rounded-[var(--r-md)] border-hairline-2 p-5 sm:p-6">
                <p className="text-[1.0625rem] leading-[1.6] font-medium">{b.text}</p>
              </aside>
            </Reveal>
          )
        }

        if (b.t === 'figure') {
          return (
            <Reveal key={i} delay={delay}>
              <div className="my-2">
                <FirstScreenDiagram />
              </div>
            </Reveal>
          )
        }

        return (
          <Reveal key={i} delay={delay}>
            {/* Таблица уезжает в свою прокрутку, а не растягивает страницу:
                на телефоне четыре колонки в экран не помещаются никак. */}
            <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
              <table className="w-full min-w-[520px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-hairline-2">
                    {b.head.map((h) => (
                      <th
                        key={h}
                        scope="col"
                        className="t-eyebrow py-3 pr-4 align-bottom font-normal"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {b.rows.map((row) => (
                    <tr key={row.join()} className="border-b border-hairline">
                      {row.map((cell, k) => (
                        <td
                          key={k}
                          className={
                            k === 0
                              ? 'py-3.5 pr-4 align-top text-[0.9375rem] font-medium'
                              : 'py-3.5 pr-4 align-top text-[0.9375rem] text-text-2'
                          }
                        >
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>
        )
      })}
    </div>
  )
}
