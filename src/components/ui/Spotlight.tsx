import { cn } from '@/lib/utils'

/**
 * Свечение первого экрана. Один из трёх эффектных компонентов на странице.
 * Прозрачность вдвое ниже дефолтной Aceternity — на тёмном фоне
 * заметно и то, что почти не видно.
 */
export function Spotlight({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(680px 420px at 50% 0%, rgba(255,77,46,.16), transparent 70%)',
        }}
      />
      {/* вытянутый луч, наклонён — иначе радиальное пятно читается как виньетка */}
      <div
        className="absolute top-[-30%] left-1/2 h-[80vh] w-[120vw] -translate-x-1/2 opacity-60 blur-[60px]"
        style={{
          background:
            'conic-gradient(from 180deg at 50% 0%, transparent 0deg, rgba(255,162,58,.07) 12deg, rgba(255,77,46,.10) 25deg, transparent 45deg)',
        }}
      />
    </div>
  )
}
