import { NavLink } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'

const navItems = [
  {
    to: '/',
    label: 'Dashboard',
    icon: (
      <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 11l9-8 9 8v10a2 2 0 01-2 2h-4v-7h-6v7H5a2 2 0 01-2-2V11z"/>
      </svg>
    ),
  },
  {
    to: '/products',
    label: 'Produtos',
    icon: (
      <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>
        <path d="M3.3 7L12 12l8.7-5M12 22V12"/>
      </svg>
    ),
  },
  {
    to: '/catalog',
    label: 'Vitrine',
    icon: (
      <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1"/>
        <rect x="14" y="3" width="7" height="7" rx="1"/>
        <rect x="3" y="14" width="7" height="7" rx="1"/>
        <rect x="14" y="14" width="7" height="7" rx="1"/>
      </svg>
    ),
  },
  {
    to: '/history',
    label: 'Histórico',
    icon: (
      <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <path d="M12 6v6l4 2"/>
      </svg>
    ),
  },
]

const LogoutIcon = () => (
  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/>
  </svg>
)

interface SidebarProps {
  mobileOpen: boolean
  onCloseMobile: () => void
}

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const { user, logout } = useAuth()
  const initial = user?.name?.[0]?.toUpperCase() || 'U'

  return (
    <div
      className="nosel flex h-full min-h-screen w-[272px] shrink-0 flex-col py-6"
      style={{ background: 'var(--night)', color: 'white', borderRight: '1px solid rgba(255,255,255,0.06)', padding: '24px 18px' }}
    >
      {/* Logo */}
      <div style={{ padding: '0 6px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <svg width={32} height={32} viewBox="0 0 40 40">
            <defs>
              <linearGradient id="lg-logo-sidebar" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#FF6B3D"/>
                <stop offset="1" stopColor="#1ECBE1"/>
              </linearGradient>
            </defs>
            <rect x="4" y="4" width="32" height="32" rx="10" fill="url(#lg-logo-sidebar)"/>
            <path d="M13 15c0-2 2-3 4-3s4 1 4 3-2 2-4 2-4 1-4 3 2 3 4 3 4-1 4-3M13 25h14" stroke="white" strokeWidth="2.2" strokeLinecap="round" fill="none"/>
          </svg>
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.15 }}>
            <span className="display" style={{ fontSize: 15, fontWeight: 700, color: 'white' }}>Stock Manager</span>
            <span className="mono" style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>swimwear edition</span>
          </div>
        </div>
      </div>

      {/* Nav label */}
      <div className="mono" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.35)', padding: '0 14px 8px' }}>
        navegação
      </div>

      {/* Nav items */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            onClick={onNavigate}
            className="group"
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              width: '100%',
              padding: '10px 14px',
              borderRadius: 12,
              background: isActive ? 'rgba(255,107,61,0.15)' : 'transparent',
              color: isActive ? 'white' : 'rgba(255,255,255,0.6)',
              fontFamily: 'var(--font-body)',
              fontSize: 14,
              fontWeight: isActive ? 600 : 500,
              textDecoration: 'none',
              transition: 'background 0.15s, color 0.15s',
              position: 'relative',
            })}
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <span style={{
                    position: 'absolute',
                    left: 0,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: 3,
                    height: 20,
                    borderRadius: 2,
                    background: 'linear-gradient(180deg, #FF6B3D, #1ECBE1)',
                  }} />
                )}
                <span style={{ display: 'flex', flexShrink: 0 }}>{item.icon}</span>
                <span>{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div style={{ flex: 1 }} />

      {/* User card */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '10px 12px',
        borderRadius: 14,
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div style={{
          width: 32,
          height: 32,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #FF6B3D, #1ECBE1)',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'var(--font-display)',
          fontWeight: 600,
          fontSize: 13,
          flexShrink: 0,
        }}>
          {initial}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'white', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {user?.name || 'Usuário'}
          </div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {user?.email}
          </div>
        </div>
        <button
          onClick={() => { logout(); onNavigate?.() }}
          style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.45)', cursor: 'pointer', padding: 6, display: 'flex', alignItems: 'center' }}
          title="Sair"
        >
          <LogoutIcon />
        </button>
      </div>
    </div>
  )
}

export function Sidebar({ mobileOpen, onCloseMobile }: SidebarProps) {
  return (
    <>
      <aside className="relative z-20 hidden lg:flex">
        <SidebarContent />
      </aside>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.button
              type="button"
              aria-label="Fechar menu"
              className="fixed inset-0 z-30 lg:hidden"
              style={{ background: 'rgba(15,23,42,0.5)', backdropFilter: 'blur(4px)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onCloseMobile}
            />
            <motion.aside
              className="fixed inset-y-0 left-0 z-40 lg:hidden"
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
            >
              <SidebarContent onNavigate={onCloseMobile} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
