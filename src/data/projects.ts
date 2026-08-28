export type Project = {
  id: string
  title: string
  niche: string
  nicheSlug: string
  city: string
  desc: string
  /** Только проверяемый факт. Придуманных цифр здесь быть не должно. */
  metric: string | null
  tgPost: string | null
  liveUrl: string | null
  poster: string
  video: string | null
  /** Работа попадает табом в живое окно на первом экране. Максимум четыре. */
  inHero: boolean
  /** Демо-концепт, а не клиентский заказ. Выдаётся пилюлей в углу карточки. */
  isDemo: boolean
  /**
   * Чем работа подписана в шапке разбора, если «демо-концепт» — неточность.
   * Нужно там, где сайт собран под конкретный названный бизнес, но ещё не
   * запущен: для такого «демо-концепт» врёт в меньшую сторону, а «сайт
   * клиента» — в большую. Не задано — подпись считается из isDemo.
   */
  statusLabel?: string
  /** Домен, который набирается в адресной строке живого окна. */
  domain: string
  /** alt по формуле: что это — для кого — в каком городе. */
  alt: string
}

/**
 * Адрес разбора у работы не хранится: он живёт в cases.ts вместе с самим
 * разбором, и берётся оттуда через caseHrefFor(id). Обратный импорт устроить
 * нельзя — cases.ts берёт отсюда постер, нишу и город, и вышел бы цикл.
 */
export const PROJECTS: Project[] = [
  {
    id: 'massage-nk',
    title: 'Massage Niznek — аппаратный массаж',
    niche: 'Салоны красоты',
    nicheSlug: 'sayt-dlya-salona-krasoty',
    city: 'Нижнекамск',
    desc: 'Действующий сайт студии на проспекте Вахитова. Семь аппаратных методик разведены по отдельным блокам, у каждой — своя цена и своё показание, чтобы человек выбирал процедуру, а не читал прайс сплошняком.',
    metric: null,
    tgPost: null,
    liveUrl: 'https://massage-niznek.ru/',
    poster: '/works/massage-nk.webp',
    video: '/works/massage-nk.webm',
    inHero: true,
    isDemo: false,
    domain: 'massage-niznek.ru',
    alt: 'Сайт студии аппаратного массажа в Нижнекамске — главная страница',
  },
  {
    id: 'dobrovet',
    title: 'ДоброВет — ветеринарная клиника',
    niche: 'Ветклиники',
    nicheSlug: 'sayt-dlya-vetkliniki',
    city: 'Нижнекамск',
    desc: 'Клиника с УЗИ, рентгеном, операционной и стационаром, у которой не было сайта вообще. Первый экран отвечает «примут ли сейчас» живым статусом работы, оценка срочности разбирает симптом за один тап, цены стоят пакетом с колонкой «что входит».',
    metric: null,
    tgPost: null,
    liveUrl: 'https://manath-iq.github.io/dobrovet/',
    poster: '/works/dobrovet.webp',
    video: '/works/dobrovet.webm',
    inHero: false,
    isDemo: true,
    statusLabel: 'собран под клинику · ещё не запущен',
    domain: 'dobrovet',
    alt: 'Сайт ветеринарной клиники в Нижнекамске — главная страница',
  },
  {
    id: 'uzi-ayaz',
    title: 'Центр УЗИ «АЯЗ»',
    niche: 'УЗИ и чек-апы',
    nicheSlug: 'sayt-dlya-uzi',
    city: 'Нижнекамск',
    desc: 'Диагностика продаётся спокойствием, а не скидкой. Первый экран отвечает на «когда примут» и «что я унесу с собой», прайс открыт целиком, запись на сегодня вынесена отдельной кнопкой.',
    metric: null,
    tgPost: null,
    liveUrl: 'https://manath-iq.github.io/clinic-template/',
    poster: '/works/uzi-ayaz.webp',
    video: '/works/uzi-ayaz.webm',
    inHero: true,
    isDemo: true,
    domain: 'clinic-template',
    alt: 'Лендинг центра ультразвуковой диагностики в Нижнекамске — главная страница',
  },
  {
    id: 'stomatologiya-ulybka',
    title: 'Клиника «Улыбка» — имплантация',
    niche: 'Стоматологии',
    nicheSlug: 'sayt-dlya-stomatologii',
    city: 'Нижнекамск',
    desc: 'Имплантация — покупка на годы, поэтому вся страница про снятие страха: этапы по шагам, гарантия десять лет в цифре, а не в тексте, врачи с фамилиями и стажем.',
    metric: null,
    tgPost: null,
    liveUrl: 'https://manath-iq.github.io/stomatologya_template/',
    poster: '/works/stomatologiya-ulybka.webp',
    video: '/works/stomatologiya-ulybka.webm',
    inHero: true,
    isDemo: true,
    domain: 'stomatologya-template',
    alt: 'Лендинг стоматологической клиники в Нижнекамске — имплантация зубов',
  },
  {
    id: 'sportpit-sostav',
    title: 'СОСТАВ — спортивное питание',
    niche: 'Спортпит',
    nicheSlug: 'sayt-dlya-sportpita',
    city: 'Нижнекамск',
    desc: 'Магазин, где человек не знает, что ему нужно. Поэтому вход не через каталог, а через цель: подбор набора за минуту, самовывоз за тридцать минут, проверка оригинальности по коду производителя.',
    metric: null,
    tgPost: null,
    liveUrl: 'https://manath-iq.github.io/sports-nutrition-/',
    poster: '/works/sportpit-sostav.webp',
    video: '/works/sportpit-sostav.webm',
    inHero: true,
    isDemo: true,
    domain: 'sports-nutrition',
    alt: 'Лендинг магазина спортивного питания в Нижнекамске — главная страница',
  },
  {
    id: 'dom-proekt',
    title: 'ДОМ-ПРОЕКТ — дома под ключ',
    niche: 'Строительство домов',
    nicheSlug: 'sayt-dlya-stroitelstva-domov',
    city: 'Татарстан',
    desc: 'В ИЖС главное возражение — «сколько на самом деле». Фиксированная цена в договоре и эскроу-счёт вынесены на первый экран, дальше сметы по типам домов и этапы стройки помесячно.',
    metric: null,
    tgPost: null,
    liveUrl: 'https://manath-iq.github.io/stroika-template/',
    poster: '/works/dom-proekt.webp',
    video: '/works/dom-proekt.webm',
    inHero: false,
    isDemo: true,
    domain: 'stroika-template',
    alt: 'Лендинг строительной компании в Татарстане — каркасные дома под ключ',
  },
  {
    id: 'kuhni-mera',
    title: 'МЕРА — кухни на заказ',
    niche: 'Мебель на заказ',
    nicheSlug: 'sayt-dlya-mebeli',
    city: 'Казань',
    desc: 'Кухню не покупают по каталогу, поэтому вместо каталога — подбор из пяти вопросов, который выдаёт цену, срок и состав до замера. Звонок менеджера перестаёт быть условием расчёта.',
    metric: null,
    tgPost: null,
    liveUrl: 'https://manath-iq.github.io/kitchen-template/',
    poster: '/works/kuhni-mera.webp',
    video: '/works/kuhni-mera.webm',
    inHero: false,
    isDemo: true,
    domain: 'kitchen-template',
    alt: 'Лендинг производителя кухонь на заказ в Казани — главная страница',
  },
  {
    id: 'brekety',
    title: 'Брекеты — ортодонтия',
    niche: 'Стоматологии',
    nicheSlug: 'sayt-dlya-stomatologii',
    city: 'Нижнекамск',
    desc: 'Отдельная страница под один запрос вместо раздела внутри общего сайта клиники. Системы сравниваются таблицей, срок лечения и рассрочка названы до формы, а не после.',
    metric: null,
    tgPost: null,
    liveUrl: 'https://manath-iq.github.io/braces_stomat/',
    poster: '/works/brekety.webp',
    video: '/works/brekety.webm',
    inHero: false,
    isDemo: true,
    domain: 'braces-stomat',
    alt: 'Лендинг по установке брекетов — ортодонтия, главная страница',
  },
  {
    id: 'baobab',
    title: 'Баобаб — мастерская шоколада',
    niche: 'Кофейни и кондитерские',
    nicheSlug: 'sayt-dlya-kofeyni',
    city: 'Нижнекамск',
    desc: 'Семейная мастерская с кофейней на проспекте Строителей. Три разных повода — подарок, завтрак и мастер-класс — разведены по отдельным входам, чтобы страница не превращалась в общее меню.',
    metric: null,
    tgPost: null,
    liveUrl: 'https://manath-iq.github.io/baobab-template/',
    poster: '/works/baobab.webp',
    video: '/works/baobab.webm',
    inHero: false,
    isDemo: true,
    domain: 'baobab-template',
    alt: 'Лендинг мастерской шоколада и кофейни в Нижнекамске — главная страница',
  },
  {
    id: 'stary-ambar',
    title: 'Старый Амбар — народный трактир',
    niche: 'Кафе и рестораны',
    nicheSlug: 'sayt-dlya-restorana',
    city: 'Нижнекамск',
    desc: 'У ресторана три разные аудитории: обед в будни, банкет и семья с детьми. Каждой отдан свой блок со своей кнопкой, бронь стола работает без звонка.',
    metric: null,
    tgPost: null,
    liveUrl: 'https://manath-iq.github.io/old-ambar-site/',
    poster: '/works/stary-ambar.webp',
    video: '/works/stary-ambar.webm',
    inHero: false,
    isDemo: true,
    domain: 'old-ambar-site',
    alt: 'Лендинг ресторана в Нижнекамске — меню, банкеты, бронь стола',
  },
  {
    id: 'alice-tour',
    title: 'Элис Тур — подбор путешествий',
    niche: 'Турагентства',
    nicheSlug: 'sayt-dlya-turagentstva',
    city: 'Нижнекамск',
    desc: 'Турагентство конкурирует с агрегатором, поэтому продаёт не цену, а подбор. Вход — через вопрос «куда и с кем», выход — заявка менеджеру, а не выдача из тысячи туров.',
    metric: null,
    tgPost: null,
    liveUrl: 'https://manath-iq.github.io/alice_tour_template/',
    poster: '/works/alice-tour.webp',
    video: '/works/alice-tour.webm',
    inHero: false,
    isDemo: true,
    domain: 'alice-tour-template',
    alt: 'Лендинг турагентства — подбор путешествий, главная страница',
  },
]

export const HERO_PROJECTS = PROJECTS.filter((p) => p.inHero)
