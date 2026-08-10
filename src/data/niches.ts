export type Niche = {
  label: string
  /** Нишевая страница. Пока её нет — null, и пункт рендерится текстом, а не битой ссылкой. */
  href: string | null
}

/** Бегущая строка и колонка в подвале берут ниши отсюда. */
export const NICHES: Niche[] = [
  { label: 'Стоматологии', href: null },
  { label: 'Строительство домов', href: null },
  { label: 'Спортпит', href: null },
  { label: 'Салоны красоты', href: null },
  { label: 'УЗИ и чек-апы', href: null },
  { label: 'Кафе и рестораны', href: null },
  { label: 'Мебель на заказ', href: null },
  { label: 'Кофейни и кондитерские', href: null },
  { label: 'Турагентства', href: null },
  { label: 'Медцентры', href: null },
]
