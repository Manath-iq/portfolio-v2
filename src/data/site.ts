/**
 * Единственное место, где живут контакты и реквизиты.
 * Плейсхолдеры в фигурных скобках заполняются перед выкладкой — список в TODO.md.
 */

export const SITE = {
  name: '{ИМЯ}',
  /** Монограмма в шапке и подвале. Заполняется вместе с именем. */
  monogram: '{ИМЯ}',
  url: 'https://example.ru',
  city: 'Нижнекамск',
  region: 'Республика Татарстан',

  phone: '{ТЕЛЕФОН}',
  /** tel: собирается из phone — оставить цифры без пробелов, +7… */
  phoneHref: 'tel:{ТЕЛЕФОН}',
  telegram: '{TG}',
  whatsapp: '{WA}',
  /** Юзернейм канала без @ — из него собираются ссылки на разборы. */
  channel: '{КАНАЛ}',
  channelUrl: 'https://t.me/{КАНАЛ}',

  inn: '{ИНН}',

  /** Цели Метрики. Пока счётчика нет — вызовы просто не сработают. */
  metrikaId: null as number | null,
} as const

export const NAV = [
  { label: 'Работы', href: '#raboty' },
  { label: 'Ниши', href: '#nishi' },
  { label: 'Цены', href: '#tseny' },
  { label: 'Вопросы', href: '#voprosy' },
] as const
