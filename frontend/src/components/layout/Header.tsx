import { useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

interface HeaderProps {
  onMenuToggle: () => void
}

function BellIcon() {
  return (
    <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/>
      <path d="M13.7 21a2 2 0 01-3.4 0"/>
    </svg>
  )
}

function MenuIcon() {
  return (
    <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round">
      <path d="M3 6h18M3 12h18M3 18h18"/>
    </svg>
  )
}

function getHeaderInfo(pathname: string) {
  if (pathname === '/') return { title: 'Dashboard', subtitle: 'Visão geral do estoque' }
  if (pathname === '/products') return { title: 'Produtos', subtitle: 'Cadastro, estoque e preços' }
  if (pathname === '/products/new') return { title: 'Nova peça', breadcrumb: ['Produtos', 'Nova'] }
  if (pathname.match(/\/products\/[^/]+\/edit/)) return { title: 'Editar peça', breadcrumb: ['Produtos', 'Editar'] }
  if (pathname.match(/\/products\/[^/]+/)) return { title: 'Detalhe', breadcrumb: ['Produtos', 'Peça'] }
  if (pathname === '/catalog') return { title: 'Vitrine pública', subtitle: 'Personalize o link compartilhado com suas clientes' }
  if (pathname === '/history') return { title: 'Histórico', subtitle: 'Tudo que aconteceu no estoque' }
  return { title: 'Stock Manager' }
}

export function Header({ onMenuToggle }: HeaderProps) {
  const { user } = useAuth()
  const location = useLocation()
  const firstName = user?.name?.split(' ')[0] || 'usuário'

  const h = new Date().getHours()
  const greet = h < 12 ? 'Bom dia' : h < 18 ? 'Boa tarde' : 'Boa noite'

  const { title, subtitle, breadcrumb } = getHeaderInfo(location.pathname) as {
    title: string
    subtitle?: string
    breadcrumb?: string[]
  }

  return (
    <header
      className="sticky top-0 z-10 flex items-center gap-4 px-7 py-5"
      style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg)' }}
    >
      {/* Mobile menu */}
      <button
        type="button"
        onClick={onMenuToggle}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border lg:hidden"
        style={{ border: '1px solid var(--border)', background: 'var(--bg-elev-strong)', color: 'var(--text)' }}
        aria-label="Abrir menu"
      >
        <MenuIcon />
      </button>

      <div className="flex-1 min-w-0">
        {breadcrumb ? (
          <div className="mb-1 flex items-center gap-1.5" style={{ fontSize: 12, color: 'var(--text-muted)' }}>
            {breadcrumb.map((crumb, i) => (
              <span key={i} className="flex items-center gap-1.5">
                {i > 0 && <span style={{ opacity: 0.4 }}>/</span>}
                <span style={{ color: i === breadcrumb.length - 1 ? 'var(--text)' : 'var(--text-muted)' }}>{crumb}</span>
              </span>
            ))}
          </div>
        ) : (
          <div className="mono mb-0.5" style={{ fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
            {greet}, {firstName}
          </div>
        )}
        <h1 className="display truncate" style={{ margin: 0, fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em' }}>
          {title}
        </h1>
        {subtitle && (
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>{subtitle}</p>
        )}
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <div className="hidden items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold sm:flex" style={{ background: 'var(--success-bg)', color: 'var(--success)', fontSize: 12 }}>
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: 'var(--success)' }} />
          Online
        </div>
        <button
          className="flex h-9 w-9 items-center justify-center rounded-xl"
          style={{ border: '1px solid var(--border)', background: 'var(--bg-elev-strong)', color: 'var(--text)', cursor: 'pointer' }}
          aria-label="Notificações"
        >
          <BellIcon />
        </button>
      </div>
    </header>
  )
}
