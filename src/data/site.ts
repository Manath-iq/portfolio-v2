/**
 * Единственное место, где живут контакты и реквизиты.
 * Незаполненные поля равны null — секции это учитывают и не показывают
 * ни пустых блоков, ни выдуманных значений. Список в TODO.md.
 */

const PHONE_DIGITS = '+79872668032'

export const SITE = {
  /** Имя для «Меня зовут …» и разметки. */
  name: 'Максим',
  /** Псевдоним — то, чем подписана шапка, подвал и заголовок вкладки. */
  brand: 'manath',

  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://manath-iq.github.io/portfolio-v2',
  city: 'Нижнекамск',
  region: 'Республика Татарстан',

  phone: '+7 987 266-80-32',
  phoneHref: `tel:${PHONE_DIGITS}`,
  telegram: 'https://t.me/manath',
  whatsapp: `https://wa.me/${PHONE_DIGITS.replace('+', '')}`,

  /**
   * Канал с разборами. Пока не заведён — пилюля-анонс над H1 не рендерится,
   * а кнопка в светлой секции ведёт в личку. Поставить юзернейм без @ —
   * и то и другое включится само.
   */
  channel: null as string | null,

  /** ИНН / ОГРНИП. Пока null — строка реквизитов в подвале идёт без номера. */
  inn: null as string | null,

  /** Номер счётчика Метрики. Пока null — цели молча не срабатывают. */
  metrikaId: null as number | null,
} as const

export const CHANNEL_URL = SITE.channel ? `https://t.me/${SITE.channel}` : null

export const NAV = [
  { label: 'Работы', href: '#raboty' },
  { label: 'Ниши', href: '#nishi' },
  { label: 'Цены', href: '#tseny' },
  { label: 'Вопросы', href: '#voprosy' },
] as const
