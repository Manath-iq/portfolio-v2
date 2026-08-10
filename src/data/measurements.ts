/**
 * Реальные замеры. Каждая цифра на сайте берётся отсюда, чтобы её можно было
 * перепроверить: замер повторяется командой из scripts/README, дата ниже.
 * Придуманных значений здесь быть не должно.
 */
export const PAGESPEED = {
  /** Какую работу меряли. */
  project: 'Центр УЗИ «АЯЗ»',
  url: 'clinic-template',
  /** Lighthouse 12.8, эмуляция мобильного, категория performance. */
  score: 97,
  lcp: '2,2 с',
  cls: '0',
  tool: 'Lighthouse 12, мобильный',
  date: '10.08.2026',
} as const

/** Полный прогон по работам — на случай, если понадобится сводка. */
export const PAGESPEED_ALL = [
  { url: 'clinic-template', score: 97, lcp: '2,2 с', cls: '0' },
  { url: 'sports-nutrition', score: 96, lcp: '1,4 с', cls: '0,117' },
  { url: 'massage-niznek.ru', score: 82, lcp: '3,3 с', cls: '0' },
  { url: 'stomatologya-template', score: 73, lcp: '15,5 с', cls: '0' },
] as const
