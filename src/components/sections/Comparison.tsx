import { ArrowRight } from 'lucide-react'
import { SectionHead, W } from '@/components/SectionHead'
import { Reveal } from '@/components/Reveal'

const ROWS: [string, string, string][] = [
  ['Структура', 'Универсальная, как у всех', 'Под конкретный бизнес и его возражения'],
  ['Тексты', 'Рыба или автозамена города', 'Пишу сам по брифу'],
  ['Позиции в Яндексе', 'Не индексируется толком', 'Структура и техчасть под поиск с первого дня'],
  ['Мобильная версия', 'Разъезжается на половине экранов', 'Проверяю на реальных устройствах'],
  ['Заявки', 'На почту, которую никто не читает', 'В Telegram, мгновенно'],
  ['Кто делает', 'Менеджер, потом фрилансер, потом верстальщик', 'Я, один, с тобой напрямую'],
  ['Исходники и домен', 'Остаются у студии', 'Оформляются на тебя'],
]

export function Comparison() {
  return (
    <section className="section" aria-labelledby="sravnenie-h">
      <div className="container">
        <SectionHead eyebrow="честный вопрос" id="sravnenie-h">
          А чем это лучше сайта <W>за 15 тысяч</W>?
        </SectionHead>

        <Reveal delay={60}>
          <p className="t-body measure mt-7">
            Открой любой сайт нижнекамской компании — почти наверняка увидишь одно из двух.
            Либо шаблон, у которого город подставлен автозаменой, и такой же стоит у трёх
            конкурентов. Либо одностраничник, который не находится в поиске ни по одному
            запросу и работает ровно до тех пор, пока за него платят рекламу. Цены на них
            обычно нет, и человек уходит к тому, кто цифру написал.
          </p>
        </Reveal>

        <Reveal delay={120}>
          <div className="glass-flat mt-12 overflow-hidden rounded-[var(--r-lg)]">
            {/* десктоп: таблица */}
            <table className="hidden w-full border-collapse text-left md:table">
              <caption className="sr-only">
                Сравнение шаблонного сайта за 15 000 ₽ и сайта, собранного под задачу
              </caption>
              <thead>
                <tr className="border-b border-hairline">
                  <th scope="col" className="w-[26%] p-5 text-[0.8125rem] font-normal text-text-3">
                    <span className="sr-only">Параметр</span>
                  </th>
                  <th scope="col" className="w-[37%] p-5 text-[0.9375rem] font-medium text-text-2">
                    Шаблон за 15 000
                  </th>
                  <th scope="col" className="w-[37%] p-5 text-[0.9375rem] font-medium">
                    Сайт от меня
                  </th>
                </tr>
              </thead>
              <tbody>
                {ROWS.map(([label, a, b], i) => (
                  <tr key={label} className={i < ROWS.length - 1 ? 'border-b border-hairline' : ''}>
                    <th scope="row" className="p-5 text-[0.9375rem] font-normal text-text-3">
                      {label}
                    </th>
                    <td className="p-5 text-[0.9375rem] text-text-2">{a}</td>
                    <td className="p-5 text-[0.9375rem]">{b}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* мобильный: та же таблица разложена карточками */}
            <div className="md:hidden">
              {ROWS.map(([label, a, b], i) => (
                <div
                  key={label}
                  className={i < ROWS.length - 1 ? 'border-b border-hairline p-5' : 'p-5'}
                >
                  <p className="t-micro">{label}</p>
                  <p className="mt-3 text-[0.9375rem] text-text-2">
                    <span className="text-text-3">Шаблон за 15 000 — </span>
                    {a}
                  </p>
                  <p className="mt-2 text-[0.9375rem]">
                    <span className="text-text-3">Сайт от меня — </span>
                    {b}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal delay={180}>
          <a
            href="#raboty"
            className="mt-7 inline-flex items-center gap-1.5 text-[0.9375rem] text-text-2 transition-colors hover:text-text"
          >
            Посмотреть, как это выглядит на деле
            <ArrowRight size={15} strokeWidth={1.5} aria-hidden />
          </a>
        </Reveal>
      </div>
    </section>
  )
}
