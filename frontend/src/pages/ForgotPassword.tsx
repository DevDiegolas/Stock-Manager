import { useState } from 'react'
import { Link } from 'react-router-dom'

const ChevLIcon = () => (
  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6"/>
  </svg>
)
const ChevRIcon = () => (
  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6"/>
  </svg>
)
const CheckIcon = () => (
  <svg width={28} height={28} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
)
const WarnIcon = () => (
  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.3 3.9L1.8 18a2 2 0 001.7 3h17a2 2 0 001.7-3L13.7 3.9a2 2 0 00-3.4 0z"/>
    <path d="M12 9v4M12 17h.01"/>
  </svg>
)

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [focused, setFocused] = useState(false)
  const [sent, setSent] = useState(false)

  return (
    <div style={{ width: '100%', minHeight: '100vh', display: 'flex', background: 'var(--bg)', color: 'var(--text)', position: 'relative', overflow: 'hidden', justifyContent: 'center' }}>
      {/* Orbs */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
        <div style={{ position: 'absolute', top: '-15%', left: '-10%', width: 520, height: 520, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,107,61,0.3), transparent 70%)', filter: 'blur(40px)' }}/>
        <div style={{ position: 'absolute', bottom: '-20%', right: '-5%', width: 620, height: 620, borderRadius: '50%', background: 'radial-gradient(circle, rgba(30,203,225,0.25), transparent 70%)', filter: 'blur(40px)' }}/>
      </div>

      <div style={{ display: 'flex', width: '100%', maxWidth: 1280, position: 'relative', zIndex: 1 }}>

      {/* Left editorial column */}
      <div className="hidden lg:flex" style={{ flex: '1 1 52%', position: 'relative', padding: '40px 56px', flexDirection: 'column', justifyContent: 'space-between', zIndex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <svg width={32} height={32} viewBox="0 0 40 40">
            <defs>
              <linearGradient id="lg-logo-forgot" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#FF6B3D"/><stop offset="1" stopColor="#1ECBE1"/>
              </linearGradient>
            </defs>
            <rect x="4" y="4" width="32" height="32" rx="10" fill="url(#lg-logo-forgot)"/>
            <path d="M13 15c0-2 2-3 4-3s4 1 4 3-2 2-4 2-4 1-4 3 2 3 4 3 4-1 4-3M13 25h14" stroke="white" strokeWidth="2.2" strokeLinecap="round" fill="none"/>
          </svg>
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.15 }}>
            <span className="display" style={{ fontSize: 15, fontWeight: 700 }}>Stock Manager</span>
            <span className="mono" style={{ fontSize: 9, color: 'var(--text-subtle)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>swimwear edition</span>
          </div>
        </div>

        <div style={{ maxWidth: 440 }}>
          <div className="mono" style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--ember)', marginBottom: 18 }}>
            ○ recuperação de conta
          </div>
          <h1 className="display" style={{ margin: 0, fontSize: 60, fontWeight: 700, lineHeight: 0.95, letterSpacing: '-0.04em' }}>
            Segurança<br/>em primeiro<br/><em className="grad-text" style={{ fontStyle: 'italic' }}>lugar.</em>
          </h1>
          <p style={{ fontSize: 15, lineHeight: 1.6, color: 'var(--text-muted)', marginTop: 24 }}>
            Um link de recuperação chegará no seu email em segundos. O acesso à sua conta e aos seus produtos estão protegidos.
          </p>
        </div>

        <div style={{ fontSize: 11, color: 'var(--text-subtle)' }}>Link válido por 24 horas · seguro e criptografado</div>
      </div>

      {/* Right form column */}
      <div style={{ flex: '1 1 48%', padding: '40px 56px', display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative', zIndex: 1, minWidth: 0 }}>
        <div style={{ maxWidth: 420, width: '100%', margin: '0 auto' }} className="reveal">
          <Link to="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)', fontSize: 12, fontWeight: 500, textDecoration: 'none', marginBottom: 28, fontFamily: 'var(--font-body)' }}>
            <ChevLIcon /> voltar para login
          </Link>

          {!sent ? (
            <>
              <div className="mono" style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 10 }}>○ recuperar senha</div>
              <h2 className="display" style={{ margin: 0, fontSize: 38, fontWeight: 700, letterSpacing: '-0.03em' }}>Acontece com<br/>as melhores.</h2>
              <p style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: 8, marginBottom: 28 }}>
                Informe o e-mail cadastrado e te enviamos um link para criar uma nova senha.
              </p>

              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: 6, fontFamily: 'var(--font-body)' }}>
                  E-mail cadastrado
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="você@loja.com"
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

              <button
                onClick={() => setSent(true)}
                className="btn-primary"
                style={{ width: '100%', padding: '14px', fontSize: 14, justifyContent: 'center', gap: 8, marginTop: 4 }}
              >
                Enviar link de recuperação <ChevRIcon />
              </button>

              <div className="panel-solid" style={{ padding: 16, marginTop: 20, display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <div style={{ width: 32, height: 32, borderRadius: 10, background: 'var(--aqua-soft)', color: 'var(--aqua)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <WarnIcon />
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>Não recebeu o e-mail antes?</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                    Confira a caixa de spam ou promoções. O link vale por 24 horas.
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <div style={{ width: 56, height: 56, borderRadius: 16, background: 'linear-gradient(135deg, var(--ember), var(--aqua))', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                <CheckIcon />
              </div>
              <div className="mono" style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--success)', marginBottom: 10 }}>● link enviado</div>
              <h2 className="display" style={{ margin: 0, fontSize: 38, fontWeight: 700, letterSpacing: '-0.03em' }}>Confira seu<br/>e-mail.</h2>
              <p style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: 8, marginBottom: 28 }}>
                Enviamos as instruções para <strong style={{ color: 'var(--text)' }}>{email || 'você@loja.com'}</strong>. Clique no link em até 24h para redefinir sua senha.
              </p>

              <div className="panel-solid" style={{ padding: 16, marginBottom: 20 }}>
                <div className="mono" style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: 8 }}>próximos passos</div>
                {[
                  { n: 1, t: 'Abra seu e-mail', d: 'procure por "Stock Manager"' },
                  { n: 2, t: 'Clique no link de recuperação', d: 'válido por 24 horas' },
                  { n: 3, t: 'Crie uma nova senha', d: 'mínimo 6 caracteres' },
                ].map(s => (
                  <div key={s.n} style={{ display: 'flex', gap: 12, padding: '8px 0' }}>
                    <div style={{ width: 24, height: 24, borderRadius: 8, background: 'var(--ember-soft)', color: 'var(--ember)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, flexShrink: 0 }}>{s.n}</div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 500 }}>{s.t}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{s.d}</div>
                    </div>
                  </div>
                ))}
              </div>

              <button onClick={() => setSent(false)} className="btn-secondary" style={{ width: '100%', padding: '12px', fontSize: 13 }}>
                Reenviar para outro e-mail
              </button>
              <div style={{ textAlign: 'center', marginTop: 16, fontSize: 13, color: 'var(--text-muted)' }}>
                Lembrou da senha?{' '}
                <Link to="/login" style={{ color: 'var(--ember)', fontWeight: 600, textDecoration: 'none' }}>entrar agora</Link>
              </div>
            </>
          )}
        </div>
      </div>

      </div>
    </div>
  )
}
