// Auth screens — Login, Register, Forgot Password
// Same visual vocabulary as the rest: editorial, ember+aqua palette, Space Grotesk display, glass panels, orb backgrounds

function AuthShell({ children, screen, onNav }) {
  return (
    <div style={{
      width: '100%', height: '100%', display: 'flex',
      background: 'var(--bg)', color: 'var(--text)',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Orb background */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
        <div style={{ position: 'absolute', top: '-15%', left: '-10%', width: 520, height: 520, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,107,61,0.35), transparent 70%)', filter: 'blur(40px)' }}/>
        <div style={{ position: 'absolute', bottom: '-20%', right: '-5%', width: 620, height: 620, borderRadius: '50%', background: 'radial-gradient(circle, rgba(30,203,225,0.3), transparent 70%)', filter: 'blur(40px)' }}/>
        <div style={{ position: 'absolute', top: '40%', left: '30%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(167,243,208,0.25), transparent 70%)', filter: 'blur(40px)' }}/>
      </div>

      {/* Left editorial column */}
      <div style={{
        flex: '1 1 52%', position: 'relative', padding: '40px 56px',
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between', zIndex: 1,
      }}>
        <Logo/>

        <div style={{ maxWidth: 520 }}>
          <div className="mono" style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--ember)', marginBottom: 18, display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ width: 24, height: 1, background: 'var(--ember)' }}/>
            estoque inteligente para moda praia
          </div>
          <h1 className="display" style={{ margin: 0, fontSize: 72, fontWeight: 700, lineHeight: 0.95, letterSpacing: '-0.04em' }}>
            Controle<br/>com <em className="grad-text" style={{ fontStyle: 'italic', fontWeight: 700 }}>leveza</em> de<br/>quem vive praia.
          </h1>
          <p style={{ fontSize: 15, lineHeight: 1.6, color: 'var(--text-muted)', maxWidth: 420, marginTop: 24 }}>
            Cadastre peças em segundos, compartilhe sua vitrine por link e acompanhe tudo que acontece — do WhatsApp ao estoque.
          </p>

          {/* Floating peça cards */}
          <div style={{ display: 'flex', gap: 12, marginTop: 36 }}>
            {[
              { tint: 'coral', label: 'biquíni ibiza', price: 'R$ 189' },
              { tint: 'ocean', label: 'maiô acapulco', price: 'R$ 249' },
              { tint: 'mint', label: 'saída noronha', price: 'R$ 159' },
            ].map((c, i) => (
              <div key={i} className="panel-solid" style={{
                width: 132, padding: 0, overflow: 'hidden',
                transform: `rotate(${[-3, 1.5, -1.5][i]}deg) translateY(${[0, -12, 4][i]}px)`,
                transition: 'transform 0.3s',
              }}>
                <ProductPlaceholder ratio="4/5" tint={c.tint} label=""/>
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
            {[0,1,2,3].map(i => (
              <div key={i} style={{
                width: 26, height: 26, borderRadius: '50%',
                background: `linear-gradient(135deg, ${['#FF6B3D','#1ECBE1','#A7F3D0','#FFB088'][i]}, ${['#FF8E68','#4DD8E8','#6EE7B7','#FFC7A8'][i]})`,
                border: '2px solid var(--bg)',
                marginLeft: i === 0 ? 0 : -8,
              }}/>
            ))}
          </div>
          <span><strong style={{ color: 'var(--text)' }}>+2.400</strong> empreendedoras usam a plataforma</span>
        </div>
      </div>

      {/* Right form column */}
      <div style={{
        flex: '1 1 48%', padding: '40px 56px',
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        position: 'relative', zIndex: 1,
      }}>
        <div style={{ maxWidth: 420, width: '100%', margin: '0 auto' }}>
          {children}
        </div>

        {/* screen switcher */}
        <div style={{ position: 'absolute', top: 32, right: 56, display: 'flex', gap: 4, padding: 3, borderRadius: 10, background: 'var(--bg-elev)', border: '1px solid var(--border)', backdropFilter: 'blur(12px)' }}>
          {[
            { id: 'login', label: 'Entrar' },
            { id: 'register', label: 'Criar conta' },
          ].map(s => (
            <button key={s.id} onClick={() => onNav(s.id)} style={{
              padding: '6px 14px', borderRadius: 7, border: 'none', cursor: 'pointer',
              background: screen === s.id ? 'var(--bg-elev-strong)' : 'transparent',
              color: screen === s.id ? 'var(--text)' : 'var(--text-muted)',
              fontSize: 12, fontWeight: 600, fontFamily: 'var(--font-body)',
              boxShadow: screen === s.id ? 'var(--shadow-panel)' : 'none',
            }}>{s.label}</button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Field ──────────────────────────────────────────────────────
function Field({ label, type = 'text', value, onChange, placeholder, right, hint }) {
  const [focus, setFocus] = React.useState(false);
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: 6 }}>
        <span>{label}</span>
        {hint}
      </label>
      <div style={{
        position: 'relative',
        borderRadius: 12,
        background: 'var(--bg-elev-strong)',
        border: `1px solid ${focus ? 'var(--aqua)' : 'var(--border)'}`,
        boxShadow: focus ? '0 0 0 3px rgba(30,203,225,0.15)' : 'none',
        transition: 'border 0.15s, box-shadow 0.15s',
      }}>
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          style={{
            width: '100%', padding: '12px 14px',
            paddingRight: right ? 46 : 14,
            borderRadius: 12, border: 'none', outline: 'none',
            background: 'transparent',
            fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--text)',
          }}
        />
        {right && <span style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>{right}</span>}
      </div>
    </div>
  );
}

// ─── Login ──────────────────────────────────────────────────────
function LoginScreen({ onNav }) {
  const [email, setEmail] = React.useState('carla@praiadoforte.co');
  const [pw, setPw] = React.useState('••••••••••');
  const [show, setShow] = React.useState(false);
  const [remember, setRemember] = React.useState(true);

  return (
    <AuthShell screen="login" onNav={onNav}>
      <div className="reveal">
        <div className="mono" style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 10 }}>○ acesso restrito</div>
        <h2 className="display" style={{ margin: 0, fontSize: 38, fontWeight: 700, letterSpacing: '-0.03em' }}>Bom te ver<br/>de novo.</h2>
        <p style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: 8, marginBottom: 28 }}>
          Entre na sua conta para gerenciar suas peças, vitrine e histórico.
        </p>

        <Field label="E-mail" value={email} onChange={e => setEmail(e.target.value)} placeholder="você@loja.com"/>
        <Field
          label="Senha"
          type={show ? 'text' : 'password'}
          value={pw}
          onChange={e => setPw(e.target.value)}
          placeholder="••••••••"
          hint={<button onClick={() => onNav('forgot')} style={{ background: 'transparent', border: 'none', color: 'var(--ember)', fontWeight: 600, fontSize: 11, cursor: 'pointer', textTransform: 'none', letterSpacing: 0 }}>esqueci a senha</button>}
          right={<button onClick={() => setShow(!show)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'inherit', padding: 4 }}>{I.eye}</button>}
        />

        <label style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: 'var(--text-muted)', cursor: 'pointer', marginBottom: 20 }}>
          <span onClick={() => setRemember(!remember)} style={{
            width: 18, height: 18, borderRadius: 5,
            background: remember ? 'linear-gradient(135deg, var(--ember), var(--aqua))' : 'var(--bg-elev-strong)',
            border: remember ? 'none' : '1px solid var(--border-strong)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white',
          }}>{remember && I.check}</span>
          Manter conectada neste dispositivo
        </label>

        <button className="btn-primary" onClick={() => onNav('dashboard')} style={{ width: '100%', padding: '14px', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          Entrar na plataforma <span style={{ display: 'flex' }}>{I.chevR}</span>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '22px 0', color: 'var(--text-subtle)' }}>
          <div style={{ flex: 1, height: 1, background: 'var(--border)' }}/>
          <span className="mono" style={{ fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase' }}>ou continue com</span>
          <div style={{ flex: 1, height: 1, background: 'var(--border)' }}/>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {[
            { label: 'Google', icon: <svg width="16" height="16" viewBox="0 0 24 24"><path fill="#EA4335" d="M12 5c1.6 0 3 .55 4.1 1.45L19 4c-1.9-1.75-4.35-2.8-7-2.8C7.1 1.2 3 5.3 3 11s4.1 9.8 9 9.8c5.2 0 8.8-3.65 8.8-8.8 0-.7-.05-1.2-.15-1.75H12v3.3h5.05c-.2 1.25-.85 2.3-1.85 3-1 .7-2.3 1.05-3.7 1.05-2.85 0-5.25-1.9-6.1-4.45-.25-.75-.4-1.55-.4-2.35s.15-1.6.4-2.35C6.15 6.9 8.55 5 12 5z"/></svg> },
            { label: 'Apple', icon: <svg width="14" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/></svg> },
          ].map(p => (
            <button key={p.label} className="btn-secondary" style={{ padding: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontSize: 13 }}>
              {p.icon} {p.label}
            </button>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: 24, fontSize: 13, color: 'var(--text-muted)' }}>
          Ainda não tem conta?{' '}
          <button onClick={() => onNav('register')} style={{ background: 'transparent', border: 'none', color: 'var(--ember)', fontWeight: 600, cursor: 'pointer', fontSize: 13 }}>criar conta grátis</button>
        </div>
      </div>
    </AuthShell>
  );
}

// ─── Register ───────────────────────────────────────────────────
function RegisterScreen({ onNav }) {
  const [step, setStep] = React.useState(1);
  const [data, setData] = React.useState({ name: '', email: '', pw: '', shop: '', category: 'Biquíni' });
  const upd = k => e => setData({ ...data, [k]: e.target.value });
  const strength = Math.min(4, Math.floor(data.pw.length / 3));

  return (
    <AuthShell screen="register" onNav={onNav}>
      <div className="reveal">
        <div className="mono" style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
          ○ passo {step} de 2
          <span style={{ flex: 1 }}/>
          <div style={{ display: 'flex', gap: 4 }}>
            {[1,2].map(n => (
              <div key={n} style={{ width: 20, height: 3, borderRadius: 2, background: n <= step ? 'var(--ember)' : 'var(--border-strong)' }}/>
            ))}
          </div>
        </div>
        <h2 className="display" style={{ margin: 0, fontSize: 38, fontWeight: 700, letterSpacing: '-0.03em' }}>
          {step === 1 ? <>Começa aqui.<br/>É grátis.</> : <>Conte sobre<br/>sua loja.</>}
        </h2>
        <p style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: 8, marginBottom: 28 }}>
          {step === 1 ? '30 segundos para criar sua conta. Sem cartão.' : 'Personalizamos sua vitrine com base no que você vende.'}
        </p>

        {step === 1 && (
          <>
            <Field label="Nome completo" value={data.name} onChange={upd('name')} placeholder="Carla Mendes"/>
            <Field label="E-mail" type="email" value={data.email} onChange={upd('email')} placeholder="você@loja.com"/>
            <Field label="Senha" type="password" value={data.pw} onChange={upd('pw')} placeholder="mínimo 8 caracteres"/>

            <div style={{ marginTop: -4, marginBottom: 16 }}>
              <div style={{ display: 'flex', gap: 4 }}>
                {[0,1,2,3].map(i => (
                  <div key={i} style={{
                    flex: 1, height: 4, borderRadius: 2,
                    background: i < strength
                      ? (strength <= 1 ? 'var(--danger)' : strength <= 2 ? 'var(--warn)' : 'var(--success)')
                      : 'var(--border)',
                    transition: 'background 0.2s',
                  }}/>
                ))}
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 6 }}>
                {['', 'senha fraca', 'ok, pode melhorar', 'boa senha', 'senha excelente'][strength]}
              </div>
            </div>

            <button className="btn-primary" onClick={() => setStep(2)} style={{ width: '100%', padding: '14px', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              Continuar <span style={{ display: 'flex' }}>{I.chevR}</span>
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <Field label="Nome da loja" value={data.shop} onChange={upd('shop')} placeholder="Praia do Forte Swimwear"/>

            <div style={{ marginBottom: 18 }}>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: 8 }}>
                Categoria principal
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
                {CATEGORIES.map(c => {
                  const active = data.category === c;
                  return (
                    <button key={c} onClick={() => setData({...data, category: c})} style={{
                      padding: '10px 8px', borderRadius: 10,
                      border: `1px solid ${active ? 'var(--ember)' : 'var(--border)'}`,
                      background: active ? 'var(--ember-soft)' : 'var(--bg-elev-strong)',
                      color: active ? 'var(--ember)' : 'var(--text)',
                      fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: active ? 600 : 500, cursor: 'pointer',
                    }}>{c}</button>
                  );
                })}
              </div>
            </div>

            <div style={{ marginBottom: 18 }}>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: 8 }}>
                Quantas peças tem no estoque?
              </label>
              <div style={{ display: 'flex', gap: 6 }}>
                {['< 20', '20 – 100', '100 – 500', '500+'].map((v, i) => (
                  <button key={v} style={{
                    flex: 1, padding: '10px 8px', borderRadius: 10,
                    border: `1px solid ${i === 1 ? 'var(--aqua)' : 'var(--border)'}`,
                    background: i === 1 ? 'var(--aqua-soft)' : 'var(--bg-elev-strong)',
                    color: i === 1 ? 'var(--aqua)' : 'var(--text)',
                    fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: i === 1 ? 600 : 500, cursor: 'pointer',
                  }}>{v}</button>
                ))}
              </div>
            </div>

            <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 12, color: 'var(--text-muted)', cursor: 'pointer', marginBottom: 20, lineHeight: 1.5 }}>
              <span style={{
                width: 18, height: 18, borderRadius: 5, flexShrink: 0, marginTop: 1,
                background: 'linear-gradient(135deg, var(--ember), var(--aqua))',
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white',
              }}>{I.check}</span>
              Aceito os <span style={{ color: 'var(--ember)', fontWeight: 600 }}>Termos de uso</span> e a <span style={{ color: 'var(--ember)', fontWeight: 600 }}>Política de privacidade</span>. Quero receber dicas sobre gestão de estoque por e-mail.
            </label>

            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn-secondary" onClick={() => setStep(1)} style={{ padding: '14px 18px' }}>
                {I.chevL}
              </button>
              <button className="btn-primary" onClick={() => onNav('dashboard')} style={{ flex: 1, padding: '14px', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                Criar conta <span style={{ display: 'flex' }}>{I.check}</span>
              </button>
            </div>
          </>
        )}

        <div style={{ textAlign: 'center', marginTop: 24, fontSize: 13, color: 'var(--text-muted)' }}>
          Já tem conta?{' '}
          <button onClick={() => onNav('login')} style={{ background: 'transparent', border: 'none', color: 'var(--ember)', fontWeight: 600, cursor: 'pointer', fontSize: 13 }}>entrar</button>
        </div>
      </div>
    </AuthShell>
  );
}

// ─── Forgot Password ────────────────────────────────────────────
function ForgotScreen({ onNav }) {
  const [email, setEmail] = React.useState('');
  const [sent, setSent] = React.useState(false);

  return (
    <AuthShell screen="forgot" onNav={onNav}>
      <div className="reveal">
        <button onClick={() => onNav('login')} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: 12, fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 20, padding: 0 }}>
          {I.chevL} voltar para login
        </button>

        {!sent ? (
          <>
            <div className="mono" style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 10 }}>○ recuperar senha</div>
            <h2 className="display" style={{ margin: 0, fontSize: 38, fontWeight: 700, letterSpacing: '-0.03em' }}>Acontece com<br/>as melhores.</h2>
            <p style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: 8, marginBottom: 28 }}>
              Informe o e-mail cadastrado e te enviamos um link para criar uma nova senha.
            </p>

            <Field label="E-mail cadastrado" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="você@loja.com"/>

            <button className="btn-primary" onClick={() => setSent(true)} style={{ width: '100%', padding: '14px', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 8 }}>
              Enviar link de recuperação <span style={{ display: 'flex' }}>{I.chevR}</span>
            </button>

            <div className="panel-solid" style={{ padding: 16, marginTop: 20, display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <div style={{ width: 32, height: 32, borderRadius: 10, background: 'var(--aqua-soft)', color: 'var(--aqua)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {I.warn}
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
              {React.cloneElement(I.check, { props: { size: 28, stroke: 2.5 } })}
            </div>
            <div className="mono" style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--success)', marginBottom: 10 }}>● link enviado</div>
            <h2 className="display" style={{ margin: 0, fontSize: 38, fontWeight: 700, letterSpacing: '-0.03em' }}>Confira seu<br/>e-mail.</h2>
            <p style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: 8, marginBottom: 28 }}>
              Enviamos as instruções para <strong style={{ color: 'var(--text)' }}>{email || 'você@loja.com'}</strong>. Clique no link em até 24h para redefinir sua senha.
            </p>

            <div className="panel-solid" style={{ padding: 16, marginBottom: 20 }}>
              <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: 8 }}>próximos passos</div>
              {[
                { n: 1, t: 'Abra seu e-mail', d: 'procure por "Stock Manager"' },
                { n: 2, t: 'Clique no link de recuperação', d: 'válido por 24 horas' },
                { n: 3, t: 'Crie uma nova senha', d: 'mínimo 8 caracteres' },
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

            <button className="btn-secondary" onClick={() => setSent(false)} style={{ width: '100%', padding: '12px', fontSize: 13 }}>
              Reenviar para outro e-mail
            </button>
            <div style={{ textAlign: 'center', marginTop: 16, fontSize: 13, color: 'var(--text-muted)' }}>
              Lembrou da senha?{' '}
              <button onClick={() => onNav('login')} style={{ background: 'transparent', border: 'none', color: 'var(--ember)', fontWeight: 600, cursor: 'pointer', fontSize: 13 }}>entrar agora</button>
            </div>
          </>
        )}
      </div>
    </AuthShell>
  );
}

Object.assign(window, { LoginScreen, RegisterScreen, ForgotScreen, AuthShell });
