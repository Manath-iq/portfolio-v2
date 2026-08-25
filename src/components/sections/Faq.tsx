import { ChevronDown } from 'lucide-react'
import { FAQ, type FaqItem } from '@/data/faq'
import { SectionHead, W } from '@/components/SectionHead'
import { Reveal } from '@/components/Reveal'

/**
 * Аккордеон на нативных details. Не Radix: у него закрытый контент выпадает
 * из DOM, а здесь нужна разметка FAQPage и индексация ответов.
 * С отключённым JS всё раскрывается кликом ровно так же.
 *
 * `omit` — id общих вопросов, которые эта посадочная задаёт по-своему. Без
 * него на /kazan/ рядом стояли «вы не из Казани — это не помешает?» и общий
 * «вы из Нижнекамска — а если я из Казани?»: один вопрос дважды.
 *
 * `extra` — вопросы конкретной посадочной, они встают перед общими. Человек,
 * пришедший по запросу с городом, первым делом спрашивает про город, а не про
 * сроки; общие вопросы он дочитает следом. Второй секцией их выносить нельзя:
 * два аккордеона подряд читаются как недоделка, да и FAQPage тогда пришлось бы
 * дробить на два узла.
 */
export function Faq({ extra = [], omit = [] }: { extra?: FaqItem[]; omit?: string[] }) {
  const items = [...extra, ...FAQ.filter((f) => !f.id || !omit.includes(f.id))]

  return (
    <section id="voprosy" className="section" aria-labelledby="voprosy-h">
      <div className="container">
        <SectionHead eyebrow="вопросы" id="voprosy-h">
          То, что спрашивают <W>до</W> первого созвона
        </SectionHead>

        <div className="mt-12 flex flex-col gap-3">
          {items.map((item, i) => (
            <Reveal key={item.q} delay={Math.min(i, 4) * 50}>
              <details
                className="faq-item glass-flat overflow-hidden rounded-[var(--r-md)] transition-colors duration-[var(--dur)]"
                open={i === 0}
              >
                <summary className="flex items-center justify-between gap-6 p-5 sm:p-6">
                  <h3 className="t-h3 text-[1.1875rem] sm:text-[1.3125rem]">{item.q}</h3>
                  <ChevronDown
                    size={20}
                    strokeWidth={1.5}
                    className="faq-chevron shrink-0 text-text-3"
                    aria-hidden
                  />
                </summary>
                <div className="faq-body">
                  <p className="t-body measure px-5 pb-6 sm:px-6">{item.a}</p>
                </div>
              </details>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
