import type { Metadata, Viewport } from 'next'
import { Toaster } from 'sonner'
import { SITE } from '@/data/site'
import { FONT_FACES } from '@/data/fonts'
import { Metrika } from '@/components/Metrika'
import { ClickGoals } from '@/components/ClickGoals'
import { asset } from '@/lib/asset'
import '@/styles/globals.css'

const TITLE = `Разработка сайтов и лендингов в Нижнекамске — ${SITE.brand}`
const DESCRIPTION =
  'Делаю лендинги и многостраничные сайты для бизнеса в Нижнекамске и Татарстане. Дизайн, тексты, SEO-структура. От 7 дней, от 45 000 ₽. Работаю напрямую, без агентства.'

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    'создание сайтов Нижнекамск',
    'разработка лендинга Нижнекамск',
    'заказать сайт Татарстан',
    'сайт под ключ Нижнекамск',
  ],
  authors: [{ name: SITE.name }],
  alternates: { canonical: `${SITE.url}/` },
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    url: `${SITE.url}/`,
    siteName: `${SITE.brand} — сайты для бизнеса`,
    title: TITLE,
    description:
      'Лендинги и многостраничные сайты для бизнеса в Нижнекамске и Татарстане. От 7 дней, от 45 000 ₽.',
    images: [
      {
        url: `${SITE.url}/og.png`,
        width: 1200,
        height: 630,
        alt: 'Сайты для бизнеса в Нижнекамске',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: 'Лендинги и многостраничные сайты для бизнеса. От 7 дней, от 45 000 ₽.',
    images: [`${SITE.url}/og.png`],
  },
  robots: { index: true, follow: true },
  // <meta name="yandex-verification">. Появляется, только когда код проставлен
  // в site.ts. Google подтверждён файлом в public/ — см. комментарий там же.
  ...(SITE.yandexVerification
    ? { verification: { yandex: SITE.yandexVerification } }
    : {}),
  icons: {
    icon: [{ url: asset('/favicon.svg'), type: 'image/svg+xml' }],
    // Safari на iOS понимает здесь только растр: с SVG он молча берёт вместо
    // иконки уменьшенный скриншот страницы. Собирается scripts/icons.mjs
    // из того же favicon.svg, чтобы источник оставался один.
    apple: [{ url: asset('/apple-touch-icon.png'), sizes: '180x180', type: 'image/png' }],
  },
}

export const viewport: Viewport = {
  themeColor: '#0A0A0C',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <head>
        {/* Шрифты лежат рядом, но первый экран ждать их не должен — только два сабсета. */}
        <link
          rel="preload"
          href={asset('/fonts/onest-cyrillic.woff2')}
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href={asset('/fonts/jetbrains-mono-cyrillic.woff2')}
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        {/* Playfair стоит внутри h1 — в акцентном слове, то есть внутри
            LCP-элемента. Без предзагрузки он обнаруживается только после
            разбора fonts.css, и заголовок перерисовывается на глазах. */}
        <link
          rel="preload"
          href={asset('/fonts/playfair-italic-cyrillic.woff2')}
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        {/* @font-face инлайном, а не отдельным fonts.css: файл был второй
            блокирующей рендер таблицей стилей, и браузер узнавал о нём только
            разобрав HTML — лишний круг перед тем, как станет известно, какие
            шрифты вообще нужны. Пути собираются через asset(), поэтому подпуть
            GitHub Pages по-прежнему работает. Там же переменные курсора: сам
            курсор собирается в globals.css. */}
        <style
          dangerouslySetInnerHTML={{
            __html:
              FONT_FACES.map(
                (f) =>
                  `@font-face{font-family:'${f.family}';font-style:${f.style};font-weight:${f.weight};font-display:swap;src:url(${asset(`/fonts/${f.file}`)}) format('woff2');unicode-range:${f.range}}`,
              ).join('') +
              `:root{--noise:url(${asset('/noise.png')});--cur:url(${asset('/cursor.png')});--cur-2x:url(${asset('/cursor@2x.png')});--cur-link:url(${asset('/cursor-link.png')});--cur-link-2x:url(${asset('/cursor-link@2x.png')})}`,
          }}
        />
      </head>
      <body>
        {children}
        <ClickGoals />
        <Metrika />
        <Toaster
          theme="dark"
          position="bottom-right"
          toastOptions={{
            style: {
              background: 'rgba(16,16,20,.92)',
              border: '1px solid rgba(255,255,255,.09)',
              color: '#F6F5F3',
              borderRadius: '16px',
              backdropFilter: 'blur(20px)',
            },
          }}
        />
      </body>
    </html>
  )
}
