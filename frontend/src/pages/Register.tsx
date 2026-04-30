import { useState, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Toast, type ToastType } from '../components/ui/Toast'
import axios from 'axios'

interface ToastState { message: string; type: ToastType }

const ChevRIcon = () => (
  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6"/>
  </svg>
)
const ChevLIcon = () => (
  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6"/>
  </svg>
)
const CheckIcon = () => (
  <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
)

function Field({ label, type = 'text', value, onChange, placeholder }: {
  label: string; type?: string; value: string; onChange: (v: string) => void; placeholder?: string
}) {
  const [focused, setFocused] = useState(false)
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ display: 'block', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: 6, fontFamily: 'var(--font-body)' }}>
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: '100%', padding: '12px 14px', borderRadius: 12,
          border: `1px solid ${focused ? 'var(--aqua)' : 'var(--border)'}`,
          boxShadow: focused ? '0 0 0 3px rgba(30,203,225,0.15)' : 'none',
          background: 'var(--bg-elev-strong)',
          fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--text)',
          outline: 'none', transition: 'border 0.15s, box-shadow 0.15s',
        }}
      />
    </div>
  )
}

const CATEGORIES = ['Biquíni', 'Calcinha', 'Sunga', 'Maiô', 'Saída']

export default function Register() {
  const [step, setStep] = useState(1)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [category, setCategory] = useState('Biquíni')
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState<ToastState | null>(null)
  const { register } = useAuth()
  const navigate = useNavigate()

  const showToast = useCallback((message: string, type: ToastType = 'error') => {
    setToast({ message, type })
  }, [])

  const strength = Math.min(4, Math.floor(password.length / 3))
  const strengthLabel = ['', 'senha fraca', 'ok, pode melhorar', 'boa senha', 'senha excelente'][strength]
  const strengthColor = strength <= 1 ? 'var(--danger)' : strength <= 2 ? 'var(--warn)' : 'var(--success)'

  const handleStep1 = () => {
    if (!name.trim()) { showToast('Informe seu nome.'); return }
    if (!email.trim()) { showToast('Informe seu email.'); return }
    if (!password) { showToast('Crie uma senha.'); return }
    if (password.length < 6) { showToast('A senha precisa ter pelo menos 6 caracteres.', 'warning'); return }
    setStep(2)
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      await register(name.trim(), email.trim(), password)
      navigate('/')
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const msg = err.response?.data?.error || ''
        if (msg.includes('email already registered') || msg.includes('duplicate')) {
          showToast('Este email já está cadastrado. Tente fazer login.')
        } else if (!err.response) {
          showToast('Servidor fora do ar. Tente novamente em instantes.', 'warning')
        } else {
          showToast('Erro ao criar conta. Tente novamente.')
        }
      } else {
        showToast('Erro ao criar conta. Tente novamente.')
      }
      setStep(1)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ width: '100%', minHeight: '100vh', display: 'flex', background: 'var(--bg)', color: 'var(--text)', position: 'relative', overflow: 'hidden' }}>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Orbs */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
        <div style={{ position: 'absolute', top: '-15%', left: '-10%', width: 520, height: 520, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,107,61,0.3), transparent 70%)', filter: 'blur(40px)' }}/>
        <div style={{ position: 'absolute', bottom: '-20%', right: '-5%', width: 620, height: 620, borderRadius: '50%', background: 'radial-gradient(circle, rgba(30,203,225,0.25), transparent 70%)', filter: 'blur(40px)' }}/>
      </div>

      {/* Left editorial column */}
      <div className="hidden lg:flex" style={{ flex: '1 1 52%', position: 'relative', padding: '40px 56px', flexDirection: 'column', justifyContent: 'space-between', zIndex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <svg width={32} height={32} viewBox="0 0 40 40">
            <defs>
              <linearGradient id="lg-logo-register" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#FF6B3D"/><stop offset="1" stopColor="#1ECBE1"/>
              </linearGradient>
            </defs>
            <rect x="4" y="4" width="32" height="32" rx="10" fill="url(#lg-logo-register)"/>
            <path d="M13 15c0-2 2-3 4-3s4 1 4 3-2 2-4 2-4 1-4 3 2 3 4 3 4-1 4-3M13 25h14" stroke="white" strokeWidth="2.2" strokeLinecap="round" fill="none"/>
          </svg>
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.15 }}>
            <span className="display" style={{ fontSize: 15, fontWeight: 700 }}>Stock Manager</span>
            <span className="mono" style={{ fontSize: 9, color: 'var(--text-subtle)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>swimwear edition</span>
          </div>
        </div>

        <div style={{ maxWidth: 520 }}>
          <div className="mono" style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--ember)', marginBottom: 18 }}>
            ○ crie sua conta grátis
          </div>
          <h1 className="display" style={{ margin: 0, fontSize: 60, fontWeight: 700, lineHeight: 0.95, letterSpacing: '-0.04em' }}>
            Crie, ajuste e<br/>acompanhe tudo<br/>em <em className="grad-text" style={{ fontStyle: 'italic' }}>tempo real.</em>
          </h1>
          <p style={{ fontSize: 15, lineHeight: 1.6, color: 'var(--text-muted)', maxWidth: 400, marginTop: 24 }}>
            O sistema junta cadastro rápido com histórico completo para você saber exatamente o que mudou no estoque.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 32 }}>
            {['Histórico automático de movimentações', 'Dashboard com produtos ativos e inativos', 'Vitrine pública compartilhável por link'].map((f, i) => (
              <div key={i} className="panel-solid" style={{ padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ width: 20, height: 20, borderRadius: '50%', background: 'linear-gradient(135deg, var(--ember), var(--aqua))', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><CheckIcon /></span>
                <span style={{ fontSize: 13, fontWeight: 500 }}>{f}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ fontSize: 11, color: 'var(--text-subtle)' }}>30 segundos · sem cartão de crédito</div>
      </div>

      {/* Right form column */}
      <div style={{ flex: '1 1 48%', padding: '40px 56px', display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative', zIndex: 1, minWidth: 0 }}>
        {/* Switcher */}
        <div style={{ position: 'absolute', top: 32, right: 56, display: 'flex', gap: 4, padding: 3, borderRadius: 10, background: 'var(--bg-elev)', border: '1px solid var(--border)', backdropFilter: 'blur(12px)' }}>
          <Link to="/login" style={{ padding: '6px 14px', borderRadius: 7, border: 'none', cursor: 'pointer', background: 'transparent', color: 'var(--text-muted)', fontSize: 12, fontWeight: 600, fontFamily: 'var(--font-body)', textDecoration: 'none' }}>
            Entrar
          </Link>
          <button style={{ padding: '6px 14px', borderRadius: 7, border: 'none', cursor: 'pointer', background: 'var(--bg-elev-strong)', color: 'var(--text)', fontSize: 12, fontWeight: 600, fontFamily: 'var(--font-body)', boxShadow: 'var(--shadow-panel)' }}>
            Criar conta
          </button>
        </div>

        <div style={{ maxWidth: 420, width: '100%', margin: '0 auto' }} className="reveal">
          {/* Step indicator */}
          <div className="mono" style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span>○ passo {step} de 2</span>
            <span style={{ flex: 1 }}/>
            <div style={{ display: 'flex', gap: 4 }}>
              {[1, 2].map(n => (
                <div key={n} style={{ width: 20, height: 3, borderRadius: 2, background: n <= step ? 'var(--ember)' : 'var(--border-strong)', transition: 'background 0.3s' }}/>
              ))}
            </div>
          </div>

          <h2 className="display" style={{ margin: 0, fontSize: 38, fontWeight: 700, letterSpacing: '-0.03em' }}>
            {step === 1 ? <>Começa aqui.<br/>É grátis.</> : <>Conte sobre<br/>sua loja.</>}
          </h2>
          <p style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: 8, marginBottom: 28 }}>
            {step === 1 ? '30 segundos para criar sua conta. Sem cartão.' : 'Personalizamos sua experiência com base no que você vende.'}
          </p>

          {step === 1 && (
            <>
              <Field label="Nome completo" value={name} onChange={setName} placeholder="Carla Mendes"/>
              <Field label="E-mail" type="email" value={email} onChange={setEmail} placeholder="você@loja.com"/>
              <Field label="Senha" type="password" value={password} onChange={setPassword} placeholder="mínimo 6 caracteres"/>

              {password.length > 0 && (
                <div style={{ marginTop: -4, marginBottom: 16 }}>
                  <div style={{ display: 'flex', gap: 4 }}>
                    {[0,1,2,3].map(i => (
                      <div key={i} style={{ flex: 1, height: 4, borderRadius: 2, background: i < strength ? strengthColor : 'var(--border)', transition: 'background 0.2s' }}/>
                    ))}
                  </div>
                  {strengthLabel && <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 6 }}>{strengthLabel}</div>}
                </div>
              )}

              <button onClick={handleStep1} className="btn-primary" style={{ width: '100%', padding: '14px', fontSize: 14, justifyContent: 'center', gap: 8 }}>
                Continuar <ChevRIcon />
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <div style={{ marginBottom: 18 }}>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: 8 }}>
                  Categoria principal
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
                  {CATEGORIES.map(c => (
                    <button key={c} type="button" onClick={() => setCategory(c)} style={{
                      padding: '10px 8px', borderRadius: 10, cursor: 'pointer',
                      border: `1px solid ${category === c ? 'var(--ember)' : 'var(--border)'}`,
                      background: category === c ? 'var(--ember-soft)' : 'var(--bg-elev-strong)',
                      color: category === c ? 'var(--ember)' : 'var(--text)',
                      fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: category === c ? 600 : 500,
                      transition: 'all 0.15s',
                    }}>{c}</button>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: 8 }}>
                  Quantas peças tem no estoque?
                </label>
                <div style={{ display: 'flex', gap: 6 }}>
                  {['&lt; 20', '20 – 100', '100 – 500', '500+'].map((v, i) => (
                    <button key={v} type="button" style={{
                      flex: 1, padding: '10px 4px', borderRadius: 10, cursor: 'pointer',
                      border: `1px solid ${i === 1 ? 'var(--aqua)' : 'var(--border)'}`,
                      background: i === 1 ? 'var(--aqua-soft)' : 'var(--bg-elev-strong)',
                      color: i === 1 ? 'var(--aqua)' : 'var(--text)',
                      fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: i === 1 ? 600 : 500,
                    }} dangerouslySetInnerHTML={{ __html: v }} />
                  ))}
                </div>
              </div>

              <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 12, color: 'var(--text-muted)', cursor: 'pointer', marginBottom: 20, lineHeight: 1.5 }}>
                <span style={{ width: 18, height: 18, borderRadius: 5, flexShrink: 0, marginTop: 1, background: 'linear-gradient(135deg, var(--ember), var(--aqua))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                  <CheckIcon />
                </span>
                Aceito os <span style={{ color: 'var(--ember)', fontWeight: 600 }}>Termos de uso</span> e a <span style={{ color: 'var(--ember)', fontWeight: 600 }}>Política de privacidade</span>.
              </label>

              <div style={{ display: 'flex', gap: 8 }}>
                <button type="button" className="btn-secondary" onClick={() => setStep(1)} style={{ padding: '14px 18px', display: 'flex', alignItems: 'center' }}>
                  <ChevLIcon />
                </button>
                <button type="button" onClick={handleSubmit} disabled={loading} className="btn-primary" style={{ flex: 1, padding: '14px', fontSize: 14, justifyContent: 'center', gap: 8 }}>
                  {loading ? 'Criando conta...' : <><span>Criar conta</span><CheckIcon /></>}
                </button>
              </div>
            </>
          )}

          <div style={{ textAlign: 'center', marginTop: 24, fontSize: 13, color: 'var(--text-muted)' }}>
            Já tem conta?{' '}
            <Link to="/login" style={{ color: 'var(--ember)', fontWeight: 600, textDecoration: 'none' }}>entrar</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
