import { SITE } from '@/data/site'

declare global {
  interface Window {
    ym?: (id: number, action: string, ...args: unknown[]) => void
  }
}

/**
 * Цель Метрики. Пока счётчик не заведён (SITE.metrikaId === null),
 * вызов молча ничего не делает — код секций от этого не зависит.
 */
export function goal(name: string) {
  if (typeof window === 'undefined' || SITE.metrikaId === null) return
  window.ym?.(SITE.metrikaId, 'reachGoal', name)
}
