import { NICHES } from '@/data/niches'
import { asset } from '@/lib/asset'

/**
 * Бегущая строка ниш. Одна строка, растворение по краям маской,
 * 40 секунд на круг, пауза при наведении.
 */
export function NicheMarquee() {
  const row = [...NICHES, ...NICHES]

  return (
    <section
      id="nishi"
      aria-label="Ниши, под которые делаю сайты"
      className="marquee mask-fade-x relative overflow-hidden py-6"
      style={{ ['--marquee-dur' as string]: '40s' }}
    >
      <div className="marquee-track">
        {row.map((n, i) => (
          <span
            key={`${n.label}-${i}`}
            className="flex shrink-0 items-center gap-6 pr-6 text-[1.0625rem] whitespace-nowrap"
            aria-hidden={i >= NICHES.length}
          >
            {n.href ? (
              <a
                href={asset(n.href)}
                /* вторая копия строки существует только ради бесшовного цикла —
                   её ссылки надо убрать из обхода и из фокуса, иначе каждая
                   ниша встречается в табуляции дважды */
                tabIndex={i >= NICHES.length ? -1 : undefined}
                className="text-text-2 transition-colors hover:text-text"
              >
                {n.label}
              </a>
            ) : (
              <span className="text-text-2">{n.label}</span>
            )}
            <span className="text-accent" aria-hidden>
              ·
            </span>
          </span>
        ))}
      </div>
    </section>
  )
}
