'use client'

import { forwardRef } from 'react'
import type { Project } from '@/data/projects'
import { cn } from '@/lib/utils'
import { asset } from '@/lib/asset'

type Props = {
  project: Project
  /** Сколько слоёв толщины рисовать. 5 на десктопе, 3 на мобильном. */
  layers: number
  /** Играть ли видео. Спека: центральная и две соседние, остальные — постер. */
  playVideo: boolean
  active: boolean
  onActivate: () => void
  href: string
  videoRef?: (el: HTMLVideoElement | null) => void
}

/**
 * Карточка работы. Пропорция 1.6 — скрин десктопа 16:10 ложится ровно.
 * Скругление 24px как у остальных панелей, плюс граница: на тёмном она
 * единственное, что рисует край карточки.
 */
export const ProjectCard = forwardRef<HTMLDivElement, Props>(function ProjectCard(
  { project, layers, playVideo, active, onActivate, href, videoRef },
  ref,
) {
  return (
    <div
      ref={ref}
      data-card
      className="relative aspect-[1.6/1] w-full [transform-style:preserve-3d]"
    >
      {/* слои толщины — то, что делает эффект объёмным */}
      {Array.from({ length: layers }, (_, i) => (
        <div
          key={i}
          aria-hidden
          className="absolute inset-0 rounded-[24px] border border-white/[.06] bg-[#0d0d10]"
          style={{ transform: `translateZ(${-(i + 1) * 2.4}px)` }}
        />
      ))}

      {/* обратная сторона: тот же экран в блюре */}
      <div
        aria-hidden
        className="absolute inset-0 overflow-hidden rounded-[24px] border border-white/[.12] [backface-visibility:hidden]"
        style={{ transform: 'translateZ(-2px) rotateY(180deg)' }}
      >
        <div
          className="absolute inset-0 scale-110 bg-cover bg-top opacity-40 blur-md"
          style={{ backgroundImage: `url(${asset(project.poster)})` }}
        />
        <div className="absolute inset-0 bg-black/55" />
        <div className="absolute inset-x-0 bottom-0 p-5">
          <p className="t-micro">{project.niche}</p>
          <p className="mt-1 text-[1.0625rem] font-medium">{project.title}</p>
        </div>
      </div>

      {/* лицо */}
      <a
        href={href}
        target={href.startsWith('http') ? '_blank' : undefined}
        rel={href.startsWith('http') ? 'noopener' : undefined}
        onClick={(e) => {
          if (!active) {
            e.preventDefault()
            onActivate()
          }
        }}
        aria-label={`${project.title} — ${project.niche}`}
        className={cn(
          'group absolute inset-0 block overflow-hidden rounded-[24px]',
          'border border-white/[.12] bg-black [backface-visibility:hidden]',
          'shadow-[0_40px_80px_-30px_rgba(0,0,0,.9)]',
        )}
      >
        {/* постер — основа кадра, видео приезжает поверх, когда начинает играть */}
        <img
          src={asset(project.poster)}
          alt={project.alt}
          width={1600}
          height={1000}
          loading="lazy"
          className="size-full object-cover object-top"
        />

        {project.video ? (
          <video
            ref={videoRef}
            muted
            loop
            playsInline
            preload="none"
            width={1152}
            height={720}
            aria-hidden
            className={cn(
              'absolute inset-0 size-full object-cover object-top transition-opacity duration-[var(--dur)]',
              playVideo ? 'opacity-100' : 'opacity-0',
            )}
          >
            <source src={asset(project.video)} type="video/webm" />
            <source src={asset(project.video.replace('.webm', '.mp4'))} type="video/mp4" />
          </video>
        ) : null}

        {/* верх: ниша и пилюля демо */}
        <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-2 bg-gradient-to-b from-black/70 to-transparent p-4">
          <span className="t-micro text-white/70">{project.niche}</span>
          {project.isDemo ? (
            <span className="rounded-[var(--r-pill)] border border-white/20 bg-black/50 px-2.5 py-1 font-mono text-[0.6875rem] text-white/80 backdrop-blur-sm">
              демо-концепт
            </span>
          ) : null}
        </div>

        {/* подсветка края при наведении — без вращающегося луча */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[24px] opacity-0 transition-opacity duration-[var(--dur)] group-hover:opacity-100"
          style={{ boxShadow: 'inset 0 0 0 1px rgba(255,77,46,.55), 0 0 40px -6px rgba(255,77,46,.45)' }}
        />
      </a>
    </div>
  )
})
