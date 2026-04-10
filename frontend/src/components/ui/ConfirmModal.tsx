import { useEffect, useState } from 'react'

interface ConfirmModalProps {
  title: string
  description: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: 'danger' | 'warning'
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmModal({
  title,
  description,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  variant = 'danger',
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true))
  }, [])

  const close = (callback: () => void) => {
    setVisible(false)
    setTimeout(callback, 200)
  }

  const iconVariants = {
    danger: {
      bg: 'bg-rose-100',
      icon: 'text-rose-600',
      btn: 'bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 shadow-lg shadow-rose-500/25',
    },
    warning: {
      bg: 'bg-amber-100',
      icon: 'text-amber-600',
      btn: 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 shadow-lg shadow-amber-500/25',
    },
  }

  const v = iconVariants[variant]

  return (
    <div
      className="fixed inset-0 z-[9999] grid place-items-center overflow-y-auto bg-transparent p-4"
      onClick={() => close(onCancel)}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`w-full max-w-md rounded-2xl border border-brand-slate/70 bg-brand-night p-7 shadow-[0_24px_60px_-20px_rgba(15,23,42,0.72)] transition-all duration-200 ${
          visible ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-2 scale-95 opacity-0'
        }`}
      >
        <div className="flex flex-col items-center text-center">
          <div className={`flex h-14 w-14 items-center justify-center rounded-xl ${v.bg}`}>
            {variant === 'danger' ? (
              <svg className={`h-7 w-7 ${v.icon}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
              </svg>
            ) : (
              <svg className={`h-7 w-7 ${v.icon}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
              </svg>
            )}
          </div>

          <h3 className="mt-4 font-display text-2xl font-bold text-white">{title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-300">{description}</p>
        </div>

        <div className="mt-7 flex gap-3">
          <button
            onClick={() => close(onCancel)}
            className="flex-1 rounded-xl border border-brand-slate bg-brand-slate/45 px-4 py-2.5 text-sm font-semibold text-slate-100 transition-all hover:bg-brand-slate/70"
          >
            {cancelLabel}
          </button>
          <button
            onClick={() => close(onConfirm)}
            className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition-all ${v.btn}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
