import type { Metadata, Viewport } from 'next'
import { Toaster } from 'sonner'
import { SITE } from '@/data/site'
import '@/styles/globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: `Разработка сайтов и лендингов в Нижнекамске — ${SITE.name}`,
  description:
    'Делаю лендинги и многостраничные сайты для бизнеса в Нижнекамске и Татарстане. Дизайн, тексты, SEO-структура. От 7 дней, от 45 000 ₽. Работаю напрямую, без агентства.',
  keywords: [
    'создание сайтов Нижнекамск',
    'разработка лендинга Нижнекамск',
    'заказать сайт Татарстан',
    'сайт под ключ Нижнекамск',
  ],
  authors: [{ name: SITE.name }],
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    url: SITE.url,
    siteName: `${SITE.name} — сайты для бизнеса`,
    title: `Разработка сайтов и лендингов в Нижнекамске — ${SITE.name}`,
    description:
      'Лендинги и многостраничные сайты для бизнеса в Нижнекамске и Татарстане. От 7 дней, от 45 000 ₽.',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'Сайты для бизнеса в Нижнекамске' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `Разработка сайтов и лендингов в Нижнекамске — ${SITE.name}`,
    description: 'Лендинги и многостраничные сайты для бизнеса. От 7 дней, от 45 000 ₽.',
    images: ['/og.png'],
  },
  robots: { index: true, follow: true },
  icons: {
    icon: [{ url: '/favicon.svg', type: 'image/svg+xml' }],
    apple: '/favicon.svg',
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
          href="/fonts/onest-cyrillic.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/jetbrains-mono-cyrillic.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
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
