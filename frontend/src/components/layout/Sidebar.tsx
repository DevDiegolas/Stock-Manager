import { NavLink } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const navItems = [
  { to: '/', label: 'Dashboard' },
  { to: '/products', label: 'Produtos' },
  { to: '/history', label: 'Historico' },
]

export function Sidebar() {
  const { user, logout } = useAuth()

  return (
    <aside className="relative z-20 hidden min-h-screen w-72 border-r border-white/60 bg-brand-night px-4 py-6 text-white shadow-2xl lg:flex lg:flex-col">
      <div className="mb-8 border-b border-white/10 pb-6">
        <p className="mb-2 text-xs uppercase tracking-[0.22em] text-white/60">Stock Platform</p>
        <h1 className="font-display text-2xl font-bold text-white">Stock Manager</h1>
        <p className="mt-2 text-sm text-white/70">Controle com estilo e foco em velocidade.</p>
      </div>

      <nav className="flex-1 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `group flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-300 ${
                isActive
                  ? 'bg-white text-brand-night shadow-glow'
                  : 'text-white/80 hover:bg-white/10 hover:text-white'
              }`
            }
          >
            <span>{item.label}</span>
            <span className="h-2 w-2 rounded-full bg-brand-aqua opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          </NavLink>
        ))}
      </nav>

      <div className="mt-6 border-t border-white/10 pt-4">
        <div className="rounded-xl bg-white/10 px-4 py-3 text-sm text-white/80">
          <p className="text-xs uppercase tracking-wide text-white/60">Conta ativa</p>
          <p className="mt-1 truncate font-medium text-white">{user?.email}</p>
        </div>
        <button
          onClick={logout}
          className="mt-3 w-full rounded-xl border border-red-300/30 px-4 py-2.5 text-left text-sm font-medium text-red-200 transition-colors hover:bg-red-400/20 hover:text-red-100"
        >
          Sair
        </button>
      </div>
    </aside>
  )
}
