import { useState, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Toast, type ToastType } from '../components/ui/Toast'
import axios from 'axios'

interface ToastState { message: string; type: ToastType }

const EyeIcon = ({ open }: { open: boolean }) => (
  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
    {open
      ? <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>
      : <><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24M1 1l22 22"/></>
    }
  </svg>
)

const ChevRIcon = () => (
  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6"/>
  </svg>
)

function Field({
  label, type = 'text', value, onChange, placeholder, hint, showToggle, onToggle
}: {
  label: string; type?: string; value: string; onChange: (v: string) => void
  placeholder?: string; hint?: React.ReactNode; showToggle?: boolean; onToggle?: () => void
}) {
  const [focused, setFocused] = useState(false)
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: 6, fontFamily: 'var(--font-body)' }}>
        <span>{label}</span>
        {hint}
      </label>
      <div style={{
        position: 'relative', borderRadius: 12,
        background: 'var(--bg-elev-strong)',
        border: `1px solid ${focused ? 'var(--aqua)' : 'var(--border)'}`,
        boxShadow: focused ? '0 0 0 3px rgba(30,203,225,0.15)' : 'none',
        transition: 'border 0.15s, box-shadow 0.15s',
      }}>
        <input
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            width: '100%', padding: '12px 14px',
            paddingRight: showToggle ? 44 : 14,
            borderRadius: 12, border: 'none', outline: 'none',
            background: 'transparent',
            fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--text)',
          }}
        />
        {showToggle && (
          <button type="button" onClick={onToggle} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 4, display: 'flex' }}>
            <EyeIcon open={type === 'text'} />
          </button>
        )}
      </div>
    </div>
  )
}

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState<ToastState | null>(null)
  const { login } = useAuth()
  const navigate = useNavigate()

  const showToast = useCallback((message: string, type: ToastType = 'error') => {
    setToast({ message, type })
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setToast(null)
    const trimmedEmail = email.trim()
    if (!trimmedEmail) { showToast('Informe seu email para continuar.'); return }
    if (!password)     { showToast('Informe sua senha para continuar.'); return }
    setLoading(true)
    try {
      await login(trimmedEmail, password)
      navigate('/')
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const msg = err.response?.data?.error || ''
        if (err.response?.status === 401 || msg.includes('invalid')) {
          showToast('Email ou senha incorretos. Verifique e tente novamente.')
        } else if (!err.response) {
          showToast('Servidor fora do ar. Tente novamente em instantes.', 'warning')
        } else {
          showToast('Erro inesperado ao fazer login. Tente novamente.')
        }
      } else {
        showToast('Erro inesperado ao fazer login. Tente novamente.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ width: '100%', minHeight: '100vh', display: 'flex', background: 'var(--bg)', color: 'var(--text)', position: 'relative', overflow: 'hidden', justifyContent: 'center' }}>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Orbs */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
        <div style={{ position: 'absolute', top: '-15%', left: '-10%', width: 520, height: 520, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,107,61,0.3), transparent 70%)', filter: 'blur(40px)' }}/>
        <div style={{ position: 'absolute', bottom: '-20%', right: '-5%', width: 620, height: 620, borderRadius: '50%', background: 'radial-gradient(circle, rgba(30,203,225,0.25), transparent 70%)', filter: 'blur(40px)' }}/>
        <div style={{ position: 'absolute', top: '40%', left: '30%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(167,243,208,0.2), transparent 70%)', filter: 'blur(40px)' }}/>
      </div>

      <div style={{ display: 'flex', width: '100%', maxWidth: 1280, position: 'relative', zIndex: 1 }}>

      {/* Left editorial column */}
      <div className="hidden lg:flex" style={{ flex: '1 1 52%', position: 'relative', padding: '40px 56px', flexDirection: 'column', justifyContent: 'space-between', zIndex: 1 }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <svg width={32} height={32} viewBox="0 0 40 40">
            <defs>
              <linearGradient id="lg-logo-login" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#FF6B3D"/><stop offset="1" stopColor="#1ECBE1"/>
              </linearGradient>
            </defs>
            <rect x="4" y="4" width="32" height="32" rx="10" fill="url(#lg-logo-login)"/>
            <path d="M13 15c0-2 2-3 4-3s4 1 4 3-2 2-4 2-4 1-4 3 2 3 4 3 4-1 4-3M13 25h14" stroke="white" strokeWidth="2.2" strokeLinecap="round" fill="none"/>
          </svg>
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.15 }}>
            <span className="display" style={{ fontSize: 15, fontWeight: 700 }}>Stock Manager</span>
            <span className="mono" style={{ fontSize: 9, color: 'var(--text-subtle)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>swimwear edition</span>
          </div>
        </div>

        <div style={{ maxWidth: 520 }}>
          <div className="mono" style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--ember)', marginBottom: 18, display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ width: 24, height: 1, background: 'var(--ember)', display: 'inline-block' }}/>
            estoque inteligente para moda praia
          </div>
          <h1 className="display" style={{ margin: 0, fontSize: 64, fontWeight: 700, lineHeight: 0.95, letterSpacing: '-0.04em' }}>
            Controle<br/>com <em className="grad-text" style={{ fontStyle: 'italic', fontWeight: 700 }}>leveza</em> de<br/>quem vive praia.
          </h1>
          <p style={{ fontSize: 15, lineHeight: 1.6, color: 'var(--text-muted)', maxWidth: 420, marginTop: 24 }}>
            Cadastre peças em segundos, compartilhe sua vitrine por link e acompanhe tudo que acontece — do WhatsApp ao estoque.
          </p>

          {/* Floating product cards */}
          <div style={{ display: 'flex', gap: 12, marginTop: 36 }}>
            {[
              { bg: 'linear-gradient(135deg, rgba(255,107,61,0.4), rgba(255,200,150,0.3))', label: 'biquíni ibiza', price: 'R$ 189', rot: -3, ty: 0 },
              { bg: 'linear-gradient(160deg, rgba(30,203,225,0.4), rgba(15,23,42,0.2))',    label: 'maiô acapulco', price: 'R$ 249', rot: 1.5, ty: -12 },
              { bg: 'linear-gradient(135deg, rgba(167,243,208,0.6), rgba(167,243,208,0.2))', label: 'saída noronha', price: 'R$ 159', rot: -1.5, ty: 4 },
            ].map((c, i) => (
              <div key={i} className="panel-solid" style={{ width: 128, padding: 0, overflow: 'hidden', transform: `rotate(${c.rot}deg) translateY(${c.ty}px)`, flexShrink: 0 }}>
                <div style={{ aspectRatio: '4/5', background: c.bg }}/>
                <div style={{ padding: '8px 10px' }}>
                  <div style={{ fontSize: 11, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.label}</div>
                  <div className="display" style={{ fontSize: 13, fontWeight: 700 }}>{c.price}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 11, color: 'var(--text-muted)' }}>
          <div style={{ display: 'flex' }}>
            {['#FF6B3D','#1ECBE1','#A7F3D0','#FFB088'].map((c, i) => (
              <div key={i} style={{ width: 26, height: 26, borderRadius: '50%', background: c, border: '2px solid var(--bg)', marginLeft: i === 0 ? 0 : -8 }}/>
            ))}
          </div>
          <span><strong style={{ color: 'var(--text)' }}>+2.400</strong> empreendedoras usam a plataforma</span>
        </div>
      </div>

      {/* Right form column */}
      <div style={{ flex: '1 1 48%', padding: '40px 56px', display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative', zIndex: 1, minWidth: 0 }}>
        {/* Switcher (Login / Criar conta) */}
        <div style={{ position: 'absolute', top: 32, right: 56, display: 'flex', gap: 4, padding: 3, borderRadius: 10, background: 'var(--bg-elev)', border: '1px solid var(--border)', backdropFilter: 'blur(12px)' }}>
          <button style={{ padding: '6px 14px', borderRadius: 7, border: 'none', cursor: 'pointer', background: 'var(--bg-elev-strong)', color: 'var(--text)', fontSize: 12, fontWeight: 600, fontFamily: 'var(--font-body)', boxShadow: 'var(--shadow-panel)' }}>
            Entrar
          </button>
          <Link to="/register" style={{ padding: '6px 14px', borderRadius: 7, border: 'none', cursor: 'pointer', background: 'transparent', color: 'var(--text-muted)', fontSize: 12, fontWeight: 600, fontFamily: 'var(--font-body)', textDecoration: 'none' }}>
            Criar conta
          </Link>
        </div>

        <div style={{ maxWidth: 420, width: '100%', margin: '0 auto' }} className="reveal">
          <div className="mono" style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 10 }}>○ acesso restrito</div>
          <h2 className="display" style={{ margin: 0, fontSize: 38, fontWeight: 700, letterSpacing: '-0.03em' }}>Bom te ver<br/>de novo.</h2>
          <p style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: 8, marginBottom: 28 }}>
            Entre na sua conta para gerenciar suas peças, vitrine e histórico.
          </p>

          <form onSubmit={handleSubmit}>
            <Field label="E-mail" type="email" value={email} onChange={setEmail} placeholder="você@loja.com"/>
            <Field
              label="Senha"
              type={showPw ? 'text' : 'password'}
              value={password}
              onChange={setPassword}
              placeholder="••••••••"
              showToggle
              onToggle={() => setShowPw(!showPw)}
              hint={
                <Link to="/forgot-password" style={{ background: 'transparent', border: 'none', color: 'var(--ember)', fontWeight: 600, fontSize: 11, cursor: 'pointer', textDecoration: 'none', textTransform: 'none', letterSpacing: 0 }}>
                  esqueci a senha
                </Link>
              }
            />

            <button type="submit" disabled={loading} className="auth-action" style={{ width: '100%', padding: '14px', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 4 }}>
              {loading ? 'Entrando...' : <><span>Entrar na plataforma</span><ChevRIcon /></>}
            </button>
          </form>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '22px 0', color: 'var(--text-subtle)' }}>
            <div style={{ flex: 1, height: 1, background: 'var(--border)' }}/>
            <span className="mono" style={{ fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase' }}>ou continue com</span>
            <div style={{ flex: 1, height: 1, background: 'var(--border)' }}/>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {[
              { label: 'Google', color: '#EA4335' },
              { label: 'Apple',  color: 'var(--text)' },
            ].map(p => (
              <button key={p.label} className="btn-secondary" style={{ padding: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontSize: 13 }}>
                {p.label}
              </button>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: 24, fontSize: 13, color: 'var(--text-muted)' }}>
            Ainda não tem conta?{' '}
            <Link to="/register" style={{ color: 'var(--ember)', fontWeight: 600, textDecoration: 'none' }}>criar conta grátis</Link>
          </div>
        </div>
      </div>

      </div>
    </div>
  )
}
