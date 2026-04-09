import { useAuth } from '../../context/AuthContext'

interface HeaderProps {
  onMenuToggle: () => void
}

export function Header({ onMenuToggle }: HeaderProps) {
  const { user } = useAuth()
  const firstName = user?.name?.split(' ')[0] || 'usuario'

  return (
    <header className="sticky top-0 z-10 border-b border-white/60 bg-white/70 px-4 py-4 backdrop-blur-xl sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onMenuToggle}
          className="mr-3 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white/80 text-slate-700 transition-colors hover:bg-slate-100 lg:hidden"
          aria-label="Abrir menu"
        >
          <span className="text-lg leading-none">≡</span>
        </button>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Painel</p>
          <h2 className="font-display text-2xl font-bold text-brand-night">Bem-vindo, {firstName}</h2>
        </div>

        <div className="hidden items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 sm:flex">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          Sistema online
        </div>
      </div>
    </header>
  )
}
