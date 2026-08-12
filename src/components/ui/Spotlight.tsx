import { cn } from '@/lib/utils'

/**
 * Свечение первого экрана. Один из трёх эффектных компонентов на странице.
 * Прозрачность вдвое ниже дефолтной Aceternity — на тёмном фоне
 * заметно и то, что почти не видно.
 *
 * Живёт не внутри Hero, а на уровне страницы: шапка стоит в потоке и
 * съедает сверху ~80px, поэтому свечение, привязанное к секции, начиналось
 * под шапкой и давало поперечный стык. Отсчёт идёт от самой кромки документа.
 */
export function Spotlight({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        'pointer-events-none absolute inset-x-0 top-0 -z-10 h-[min(1040px,105svh)] overflow-hidden',
        className,
      )}
      style={{
        // Низ гасим маской: иначе блюр луча упирается в край блока
        // и на переходе к следующей секции видна горизонтальная полоса.
        WebkitMaskImage: 'linear-gradient(to bottom, #000 0%, #000 52%, transparent 100%)',
        maskImage: 'linear-gradient(to bottom, #000 0%, #000 52%, transparent 100%)',
      }}
    >
      <div
        className="absolute inset-x-0 top-0 h-[560px]"
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
