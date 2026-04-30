// Main app — routing, side-by-side layout, Tweaks panel

const SCREENS = {
  dashboard: { label: 'Dashboard', title: 'Boa tarde, Carla', subtitle: 'O estoque está enxuto. 6 peças precisam de atenção.' },
  products: { label: 'Produtos', title: 'Produtos', subtitle: 'Cadastro, estoque e preços' },
  'product-detail': { label: 'Detalhe', title: 'Peça', breadcrumb: ['Produtos', 'Biquíni Ibiza'] },
  'product-new': { label: 'Nova peça', title: 'Cadastrar peça', breadcrumb: ['Produtos', 'Nova'] },
  catalog: { label: 'Vitrine', title: 'Vitrine pública', subtitle: 'Personalize o link compartilhado com suas clientes' },
  history: { label: 'Histórico', title: 'Histórico', subtitle: 'Tudo que aconteceu no estoque' },
};

function App() {
  const [tweaks, setTweaks] = React.useState(() => {
    try { return JSON.parse(localStorage.getItem('sm_tweaks')) || window.__TWEAK_DEFAULTS; }
    catch { return window.__TWEAK_DEFAULTS; }
  });
  const [showTweaks, setShowTweaks] = React.useState(false);
  const [screen, setScreen] = React.useState(() => localStorage.getItem('sm_screen') || 'login');
  const [productId, setProductId] = React.useState('p1');

  React.useEffect(() => {
    localStorage.setItem('sm_tweaks', JSON.stringify(tweaks));
    document.documentElement.classList.toggle('dark', tweaks.darkMode);
  }, [tweaks]);
  React.useEffect(() => { localStorage.setItem('sm_screen', screen); }, [screen]);

  // tweak mode contract
  React.useEffect(() => {
    const handler = (e) => {
      if (e.data?.type === '__activate_edit_mode') setShowTweaks(true);
      if (e.data?.type === '__deactivate_edit_mode') setShowTweaks(false);
    };
    window.addEventListener('message', handler);
    window.parent?.postMessage({ type: '__edit_mode_available' }, '*');
    return () => window.removeEventListener('message', handler);
  }, []);

  const updateTweak = (k, v) => {
    const next = { ...tweaks, [k]: v };
    setTweaks(next);
    window.parent?.postMessage({ type: '__edit_mode_set_keys', edits: { [k]: v } }, '*');
  };

  const nav = (id, pid) => {
    if (pid) setProductId(pid);
    setScreen(id);
  };

  return (
    <div style={{
      minHeight: '100vh', padding: '32px 24px 80px',
      display: 'flex', gap: 32, justifyContent: 'center',
      background: tweaks.darkMode
        ? 'radial-gradient(ellipse at top, #1a2340 0%, #050812 60%)'
        : 'radial-gradient(ellipse at top, #F5EFE4 0%, #E7E3DC 60%)',
      position: 'relative',
    }}>
      {/* decorative orbs */}
      <div className="orb-bg">
        <div className="orb" style={{ top: '-10%', left: '20%', width: 400, height: 400, background: 'radial-gradient(circle, rgba(255,107,61,0.25), transparent 70%)' }}/>
        <div className="orb" style={{ top: '40%', right: '15%', width: 500, height: 500, background: 'radial-gradient(circle, rgba(30,203,225,0.2), transparent 70%)', animationDelay: '4s' }}/>
      </div>

      <div style={{ display: 'flex', gap: 32, alignItems: 'flex-start', position: 'relative', zIndex: 1 }}>
        {/* Desktop frame */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.16em', color: tweaks.darkMode ? 'rgba(255,255,255,0.5)' : 'var(--text-muted)', padding: '0 6px' }}>
            Desktop · admin · 1280 × 800
          </div>
          <ChromeWindow
            tabs={[{ title: screen === 'public' ? 'Praia do Forte' : 'Stock Manager' }]}
            url={screen === 'public' ? 'stock.app/c/praiadoforte' : 'stock.app/' + screen.replace('-', '/')}
            width={1280} height={800}
          >
            <div className={tweaks.darkMode ? 'dark' : ''} style={{ width: '100%', height: '100%', display: 'flex', background: 'var(--bg)', color: 'var(--text)' }}>
              {screen !== 'public' && !['login','register','forgot'].includes(screen) && <Sidebar current={screen.split('-')[0]} onNav={nav} variant={tweaks.sidebarStyle}/>}
              <main style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
                {screen !== 'public' && !['login','register','forgot'].includes(screen) && <Header {...SCREENS[screen]} actions={screen === 'catalog' ? <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>{I.share} Compartilhar vitrine</button> : null}/>}
                {screen === 'dashboard' && <Dashboard onNav={nav}/>}
                {screen === 'products' && <Products onNav={nav}/>}
                {screen === 'product-detail' && <ProductDetail id={productId} onNav={nav}/>}
                {screen === 'product-new' && <ProductDetail id="p1" onNav={nav}/>}
                {screen === 'catalog' && <Catalog onNav={nav} layoutVariant={tweaks.catalogLayout}/>}
                {screen === 'history' && <History/>}
                {screen === 'public' && <PublicCatalog variant={tweaks.catalogLayout}/>}
                {screen === 'login' && <LoginScreen onNav={nav}/>}
                {screen === 'register' && <RegisterScreen onNav={nav}/>}
                {screen === 'forgot' && <ForgotScreen onNav={nav}/>}
              </main>
            </div>
          </ChromeWindow>
          <div style={{ display: 'flex', gap: 6, padding: '4px 6px' }}>
            {['login','register','forgot','dashboard','products','product-detail','catalog','history','public'].map(s => (
              <button key={s} onClick={() => setScreen(s)} className={`chip ${screen === s ? 'active' : ''}`} style={{ cursor: 'pointer', border: screen === s ? 'none' : '1px solid var(--border)', fontSize: 11 }}>
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Mobile frame */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.16em', color: tweaks.darkMode ? 'rgba(255,255,255,0.5)' : 'var(--text-muted)', padding: '0 6px' }}>
            Mobile · cliente · vitrine pública
          </div>
          <IOSDevice width={380} height={820} dark={false}>
            <div style={{ height: '100%', overflow: 'auto' }}>
              <PublicCatalog variant="mobile-shop"/>
            </div>
          </IOSDevice>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: tweaks.darkMode ? 'rgba(255,255,255,0.4)' : 'var(--text-subtle)', maxWidth: 380, textAlign: 'center', letterSpacing: '0.05em' }}>
            ↑ o que suas clientes veem quando abrem o link
          </div>
        </div>
      </div>

      {/* Floating tweaks toggle (visible when not in edit mode, too) */}
      {!showTweaks && (
        <button onClick={() => setShowTweaks(true)} style={{
          position: 'fixed', bottom: 20, right: 20,
          padding: '10px 16px', borderRadius: 999,
          background: 'var(--night)', color: 'white', border: 'none',
          cursor: 'pointer', fontSize: 12, fontWeight: 600,
          boxShadow: '0 8px 24px rgba(0,0,0,0.25)', zIndex: 100,
          display: 'flex', alignItems: 'center', gap: 6,
        }}>
          ◈ Tweaks
        </button>
      )}

      {showTweaks && (
        <TweaksPanel tweaks={tweaks} update={updateTweak} onClose={() => setShowTweaks(false)}/>
      )}
    </div>
  );
}

function TweaksPanel({ tweaks, update, onClose }) {
  return (
    <div style={{
      position: 'fixed', bottom: 20, right: 20, width: 300,
      background: 'var(--night)', color: 'white', borderRadius: 18,
      padding: 18, zIndex: 100, fontFamily: 'var(--font-body)',
      boxShadow: '0 24px 60px rgba(0,0,0,0.35)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div className="display" style={{ fontSize: 15, fontWeight: 700 }}>Tweaks</div>
        <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.6)', cursor: 'pointer' }}>{I.x}</button>
      </div>

      <TweakRow label="Modo escuro">
        <Toggle value={tweaks.darkMode} onChange={v => update('darkMode', v)}/>
      </TweakRow>

      <TweakRow label="Sidebar">
        <SegControl value={tweaks.sidebarStyle} onChange={v => update('sidebarStyle', v)} options={[
          { id: 'dark', label: 'Escura' },
          { id: 'light', label: 'Clara' },
          { id: 'rail', label: 'Mini' },
        ]}/>
      </TweakRow>

      <TweakRow label="Vitrine pública">
        <SegControl value={tweaks.catalogLayout} onChange={v => update('catalogLayout', v)} options={[
          { id: 'editorial', label: 'Boutique' },
          { id: 'mobile-shop', label: 'Shop' },
        ]}/>
      </TweakRow>

      <div style={{ padding: '10px 0 0', borderTop: '1px solid rgba(255,255,255,0.1)', marginTop: 6, fontSize: 10, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.06em' }}>
        preview · stock manager redesign
      </div>
    </div>
  );
}

function TweakRow({ label, children }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
      <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)' }}>{label}</div>
      {children}
    </div>
  );
}

function Toggle({ value, onChange }) {
  return (
    <button onClick={() => onChange(!value)} style={{
      width: 38, height: 22, borderRadius: 999,
      background: value ? 'var(--ember)' : 'rgba(255,255,255,0.15)',
      border: 'none', cursor: 'pointer', position: 'relative', transition: 'all 0.2s',
    }}>
      <div style={{
        position: 'absolute', top: 2, left: value ? 18 : 2,
        width: 18, height: 18, borderRadius: '50%', background: 'white',
        transition: 'left 0.18s',
      }}/>
    </button>
  );
}

function SegControl({ value, onChange, options }) {
  return (
    <div style={{ display: 'flex', gap: 2, padding: 2, borderRadius: 8, background: 'rgba(255,255,255,0.06)' }}>
      {options.map(o => (
        <button key={o.id} onClick={() => onChange(o.id)} style={{
          padding: '5px 10px', borderRadius: 6, border: 'none',
          background: value === o.id ? 'white' : 'transparent',
          color: value === o.id ? 'var(--night)' : 'rgba(255,255,255,0.6)',
          fontSize: 11, fontWeight: 600, cursor: 'pointer',
        }}>{o.label}</button>
      ))}
    </div>
  );
}

Object.assign(window, { App });
