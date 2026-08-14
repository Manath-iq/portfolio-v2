import { NICHE_PAGES } from '@/data/niche-pages'

export type Niche = {
  label: string
  /** Нишевая страница. Пока её нет — null, и пункт рендерится текстом, а не битой ссылкой. */
  href: string | null
}

/**
 * Бегущая строка и колонка в подвале берут ниши отсюда.
 *
 * Ссылка появляется у ниши ровно тогда, когда под неё заведена страница
 * в niche-pages.ts. «Медцентры» ссылки не имеют намеренно: готовой работы
 * в этой нише нет, а страница без единого примера — тонкий контент, который
 * тянет вниз весь раздел, а не только себя.
 */
const EXTRA: Niche[] = [{ label: 'Медцентры', href: null }]

export const NICHES: Niche[] = [
  ...NICHE_PAGES.map((n) => ({ label: n.label, href: `/${n.slug}/` })),
  ...EXTRA,
]
