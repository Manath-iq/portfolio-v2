import { cn } from '@/lib/utils'

/**
 * Монограмма. Один цвет, без заливок — читается и в 16px фавиконе,
 * и в 40px подвале. Скобки и слэш: код и адрес, ничего абстрактного.
 */
export function Monogram({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className={cn('shrink-0', className)}
    >
      <rect x="0.75" y="0.75" width="22.5" height="22.5" rx="7" stroke="currentColor" strokeWidth="1.5" opacity="0.35" />
      <path d="M8.4 7.6 5.2 12l3.2 4.4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M15.6 7.6 18.8 12l-3.2 4.4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M13.3 6.6 10.7 17.4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}
