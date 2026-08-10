import { ArrowLeft } from 'lucide-react'
import { Monogram } from '@/components/Monogram'
import { SITE } from '@/data/site'
import { Footer } from '@/components/sections/Footer'
import { asset } from '@/lib/asset'

/** Общая обёртка юридических страниц: узкая колонка, без эффектов. */
export function LegalPage({
  title,
  updated,
  children,
}: {
  title: string
  updated: string
  children: React.ReactNode
}) {
  return (
    <>
      <div className="pointer-events-none sticky top-0 z-50 flex justify-center px-[var(--gutter)] pt-4">
        <a
          href={asset("/")}
          className="glass-hover pointer-events-auto flex items-center gap-2.5 rounded-[var(--r-pill)] border border-hairline bg-[var(--surface)] py-2.5 pr-5 pl-4 backdrop-blur-2xl"
        >
          <ArrowLeft size={16} strokeWidth={1.5} aria-hidden />
          <Monogram className="size-5" />
          <span className="text-[0.9375rem] font-medium">{SITE.brand}</span>
        </a>
      </div>

      <main className="container pt-20 pb-24">
        <h1 className="t-h2 max-w-[20ch]">{title}</h1>
        <p className="t-micro mt-4">Редакция от {updated}</p>

        <div className="legal mt-12 flex max-w-[68ch] flex-col gap-5 text-[1.0625rem] leading-[1.7] text-text-2">
          {children}
        </div>
      </main>

      <Footer />
    </>
  )
}

/** Заголовок раздела внутри документа. */
export function H({ children }: { children: React.ReactNode }) {
  return <h2 className="t-h3 mt-6 text-text">{children}</h2>
}
