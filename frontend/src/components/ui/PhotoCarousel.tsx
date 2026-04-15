import { useState } from 'react'
import type { ProductPhoto } from '../../types/product'
import { resolvePhotoUrl } from '../../utils/photoUrl'

interface PhotoCarouselProps {
  photos: ProductPhoto[]
  alt: string
}

export function PhotoCarousel({ photos, alt }: PhotoCarouselProps) {
  const [current, setCurrent] = useState(0)

  if (photos.length === 0) {
    return (
      <div className="flex aspect-square items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50/50 text-slate-400">
        <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z" />
        </svg>
      </div>
    )
  }

  return (
    <div className="relative aspect-square overflow-hidden rounded-2xl bg-slate-100">
      <img
        src={resolvePhotoUrl(photos[current]?.drive_file_id || '', 800)}
        alt={`${alt} - Foto ${current + 1}`}
        className="h-full w-full object-cover"
      />

      {photos.length > 1 && (
        <>
          <button
            type="button"
            onClick={() => setCurrent((c) => (c === 0 ? photos.length - 1 : c - 1))}
            className="absolute left-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-brand-night shadow-md backdrop-blur-sm transition-all hover:bg-white"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => setCurrent((c) => (c === photos.length - 1 ? 0 : c + 1))}
            className="absolute right-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-brand-night shadow-md backdrop-blur-sm transition-all hover:bg-white"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
          </button>

          <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1.5">
            {photos.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setCurrent(i)}
                className={`h-2 w-2 rounded-full transition-all ${
                  i === current ? 'bg-white shadow-md scale-110' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
