import type { Metadata, Viewport } from 'next'
import { Toaster } from 'sonner'
import { SITE } from '@/data/site'
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
  icons: {
    icon: [{ url: asset('/favicon.svg'), type: 'image/svg+xml' }],
    apple: asset('/favicon.svg'),
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
        {/* @font-face вынесен из бандла: так пути внутри него остаются
            относительными и переезд на подпуть ничего не ломает */}
        <link rel="stylesheet" href={asset('/fonts.css')} />
        <style
          dangerouslySetInnerHTML={{
            __html: `:root{--noise:url(${asset('/noise.png')})}`,
          }}
        />
      </head>
      <body>
        {children}
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
