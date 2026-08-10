# portfolio-v2

Главная страница сайта-портфолио разработчика. Тёмная стеклянная продуктовая
страница; герой — не абстракция, а сами работы: живое окно браузера с реальными
записями сайтов и 3D-карусель проектов.

Спецификация — [`description.md`](description.md), она единственный источник истины.
Что нужно заполнить перед выкладкой — [`TODO.md`](TODO.md).

---

## Запуск

```bash
npm install
npm run dev
```

Сборка статики в `out/`:

```bash
npm run build
```

`postbuild` докладывает `.htaccess` в `out/` и печатает вес первого экрана
относительно бюджета из части 7 спеки.

---

## Стек

Next.js 15 (App Router, `output: 'export'`), Tailwind v4, framer-motion,
lucide-react, sonner. Эффектные компоненты из Magic UI и Aceternity не
подключены зависимостями, а переписаны под токены проекта в `src/components/ui/`.

Вывод статический, потому что хостинг — обычный Apache. Отсюда
`trailingSlash: true` (без него `/policy/` отдаст 404) и `images.unoptimized`
(в экспорте `next/image` не оптимизирует, картинки готовятся заранее в WebP).

---

## Раскладка

```
src/
  app/            layout, главная, /policy/, /oferta/, sitemap, robots
  components/
    sections/     по секции на файл
    showcase/     карусель работ и карточка
    bento/        визуалки ячеек бенто
    mockups/      BrowserFrame
    ui/           Spotlight, GlowCell
  data/           projects, niches, faq, site, measurements
  lib/            cn, цели Метрики
  styles/         globals.css (токены + слои) и сгенерированный fonts.css
public/
  works/          скриншоты и записи работ
  fonts/          woff2, кириллица и латиница отдельными сабсетами
  photo/          пара для ползунка «до/после»
  api/lead.php    приём заявки и пересылка в Telegram
scripts/          съёмка ассетов, шрифты, OG, постбилд, скриншоты для проверки
```

Все контакты и реквизиты живут в одном файле — [`src/data/site.ts`](src/data/site.ts).

---

## Скрипты

| Команда | Что делает |
|---|---|
| `node scripts/capture.mjs [id]` | снимает скриншоты и записи скролла живых сайтов через CDP |
| `node scripts/fonts.mjs` | качает woff2 из Google Fonts и генерирует `src/styles/fonts.css` |
| `node scripts/og.mjs` | собирает `public/og.png` из настоящих превью работ |
| `node scripts/shots.mjs [url] [w] [h] [префикс]` | скриншотит собственную страницу по экранам; `NOJS=1` — с выключенным JS |

Замер скорости, который показан в ячейке «Скорость»:

```bash
CHROME_PATH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" npx lighthouse@12 https://manath-iq.github.io/clinic-template/ --only-categories=performance --form-factor=mobile --screenEmulation.mobile --chrome-flags="--headless=new" --output=json --output-path=/tmp/lh.json
```

Результат кладётся в [`src/data/measurements.ts`](src/data/measurements.ts) вместе с датой.
Придуманных цифр на странице нет ни одной.

---

## Что стоит знать, если будешь править

**CSS разложен по слоям.** Свои классы (`.btn`, `.glass`, `.t-h2`) лежат в
`@layer components`, база — в `@layer base`. Без этого нелейерные правила
перебивают утилиты Tailwind, и, например, `hidden md:inline-flex` на кнопке
перестаёт работать.

**`cn()` — это `tailwind-merge`.** Класс, похожий на утилиту (`border-beam`,
`text-something`), он выкинет как конфликтующий. Именно поэтому бегущий луч
называется `beam-ring`, а не `border-beam`.

**Reveal считает по кромке, а не по площади.** `threshold: 0.2` на секции выше
экрана не срабатывает никогда — максимальная доля видимости у неё меньше порога.
Поэтому `threshold: 0` плюс отрицательный `rootMargin`.

**Грид-колонка с горизонтальным скроллером требует `min-w-0`.** Иначе
`min-width: auto` распирает колонку по ширине содержимого и вся секция уезжает
за край экрана на мобильном.

**Карусель не перехватывает скролл страницы.** Колесо над блоком крутит карточки
и одновременно скроллит страницу — так и задумано, `preventDefault` там нет.

**Тексты всех проектов лежат в DOM сразу.** Переключается только видимость.
Если подставлять текст в один контейнер из JS-массива, поисковик увидит один
проект из десяти.
