// Shared components + icons for Stock Manager

// ─── Icons ───────────────────────────────────────────────────────
const Icon = ({ d, size = 18, stroke = 1.6, fill = 'none', color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
    {d}
  </svg>
);

const I = {
  home: <Icon d={<><path d="M3 11l9-8 9 8v10a2 2 0 01-2 2h-4v-7h-6v7H5a2 2 0 01-2-2V11z"/></>} />,
  box: <Icon d={<><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><path d="M3.3 7L12 12l8.7-5M12 22V12"/></>} />,
  catalog: <Icon d={<><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></>} />,
  clock: <Icon d={<><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></>} />,
  plus: <Icon d={<><path d="M12 5v14M5 12h14"/></>} />,
  search: <Icon d={<><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></>} />,
  menu: <Icon d={<><path d="M3 6h18M3 12h18M3 18h18"/></>} />,
  x: <Icon d={<><path d="M18 6L6 18M6 6l12 12"/></>} />,
  logout: <Icon d={<><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/></>} />,
  user: <Icon d={<><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></>} />,
  bell: <Icon d={<><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 01-3.4 0"/></>} />,
  eye: <Icon d={<><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>} />,
  share: <Icon d={<><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.6 13.5l6.9 4M15.5 6.5L8.6 10.5"/></>} />,
  trend: <Icon d={<><path d="M23 6l-9.5 9.5-5-5L1 18"/><path d="M17 6h6v6"/></>} />,
  warn: <Icon d={<><path d="M10.3 3.9L1.8 18a2 2 0 001.7 3h17a2 2 0 001.7-3L13.7 3.9a2 2 0 00-3.4 0z"/><path d="M12 9v4M12 17h.01"/></>} />,
  trash: <Icon d={<><path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/></>} />,
  edit: <Icon d={<><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.12 2.12 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></>} />,
  upload: <Icon d={<><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><path d="M17 8l-5-5-5 5M12 3v12"/></>} />,
  filter: <Icon d={<><path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z"/></>} />,
  grid: <Icon d={<><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></>} />,
  rows: <Icon d={<><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></>} />,
  wa: <Icon d={<><path d="M20.5 3.5A11 11 0 005.5 19L4 22l3-1.5A11 11 0 1020.5 3.5z"/><path d="M8 10s1 3 3 5 5 3 5 3l2-2-3-2-2 1s-2-1-3-3 1-2 1-2l-2-3-2 2z" fill="currentColor"/></>} />,
  ig: <Icon d={<><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="18" cy="6" r="1" fill="currentColor"/></>} />,
  star: <Icon d={<><polygon points="12 2 15 9 22 10 17 15 18 22 12 19 6 22 7 15 2 10 9 9"/></>} />,
  heart: <Icon d={<><path d="M20.8 4.6a5.5 5.5 0 00-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 10-7.8 7.8l1 1L12 21l7.8-7.8 1-1a5.5 5.5 0 000-7.8z"/></>} />,
  copy: <Icon d={<><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></>} />,
  chevL: <Icon d={<><polyline points="15 18 9 12 15 6"/></>} />,
  chevR: <Icon d={<><polyline points="9 18 15 12 9 6"/></>} />,
  chevD: <Icon d={<><polyline points="6 9 12 15 18 9"/></>} />,
  check: <Icon d={<><polyline points="20 6 9 17 4 12"/></>} />,
  sort: <Icon d={<><path d="M3 6h18M6 12h12M10 18h4"/></>} />,
  drag: <Icon d={<><circle cx="9" cy="6" r="1" fill="currentColor"/><circle cx="9" cy="12" r="1" fill="currentColor"/><circle cx="9" cy="18" r="1" fill="currentColor"/><circle cx="15" cy="6" r="1" fill="currentColor"/><circle cx="15" cy="12" r="1" fill="currentColor"/><circle cx="15" cy="18" r="1" fill="currentColor"/></>} />,
};

// ─── Logo ────────────────────────────────────────────────────────
function Logo({ size = 28, mono = false }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <svg width={size} height={size} viewBox="0 0 40 40">
        <defs>
          <linearGradient id="lg-logo" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="var(--ember)"/>
            <stop offset="1" stopColor="var(--aqua)"/>
          </linearGradient>
        </defs>
        {mono ? (
          <>
            <rect x="4" y="4" width="32" height="32" rx="10" fill="currentColor" opacity="0.15"/>
            <path d="M13 15c0-2 2-3 4-3s4 1 4 3-2 2-4 2-4 1-4 3 2 3 4 3 4-1 4-3M13 25h14" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" fill="none"/>
          </>
        ) : (
          <>
            <rect x="4" y="4" width="32" height="32" rx="10" fill="url(#lg-logo)"/>
            <path d="M13 15c0-2 2-3 4-3s4 1 4 3-2 2-4 2-4 1-4 3 2 3 4 3 4-1 4-3M13 25h14" stroke="white" strokeWidth="2.2" strokeLinecap="round" fill="none"/>
          </>
        )}
      </svg>
      <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
        <span className="display" style={{ fontSize: 16, fontWeight: 700 }}>Stock Manager</span>
        <span style={{ fontSize: 10, color: 'var(--text-subtle)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>swimwear edition</span>
      </div>
    </div>
  );
}

// ─── Avatar ──────────────────────────────────────────────────────
function Avatar({ name = 'Carla', size = 32 }) {
  const initial = name[0];
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: 'linear-gradient(135deg, var(--ember), var(--aqua))',
      color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: size * 0.42,
    }}>{initial}</div>
  );
}

// ─── NavItem ─────────────────────────────────────────────────────
function NavItem({ icon, label, count, active, onClick, variant = 'dark' }) {
  const isDark = variant === 'dark' || variant === 'minimal-dark';
  const isRail = variant === 'rail';

  if (isRail) {
    return (
      <button onClick={onClick} title={label} style={{
        width: 48, height: 48, borderRadius: 14, border: 'none',
        background: active ? 'linear-gradient(135deg, var(--ember), var(--aqua))' : 'transparent',
        color: active ? 'white' : 'rgba(255,255,255,0.55)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', transition: 'all 0.2s',
      }}>{React.cloneElement(icon, { props: { size: 20 } })}
        <span style={{ display: 'none' }}>{label}</span>
      </button>
    );
  }

  return (
    <button onClick={onClick} style={{
      display: 'flex', alignItems: 'center', gap: 12,
      width: '100%', padding: '10px 14px', borderRadius: 12,
      background: active
        ? (isDark ? 'rgba(255,107,61,0.15)' : 'var(--ember-soft)')
        : 'transparent',
      color: active
        ? (isDark ? '#fff' : 'var(--ember)')
        : (isDark ? 'rgba(255,255,255,0.65)' : 'var(--text-muted)'),
      border: 'none', cursor: 'pointer',
      fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: active ? 600 : 500,
      textAlign: 'left', position: 'relative',
      transition: 'background 0.15s, color 0.15s',
    }}>
      {active && (
        <div style={{
          position: 'absolute', left: -14, top: '50%', transform: 'translateY(-50%)',
          width: 3, height: 20, borderRadius: 2,
          background: 'linear-gradient(180deg, var(--ember), var(--aqua))',
        }} />
      )}
      <span style={{ display: 'flex', flexShrink: 0 }}>{icon}</span>
      <span style={{ flex: 1 }}>{label}</span>
      {count !== undefined && (
        <span style={{
          fontSize: 11, padding: '2px 7px', borderRadius: 999,
          background: active ? 'var(--ember)' : (isDark ? 'rgba(255,255,255,0.08)' : 'var(--bg-elev-strong)'),
          color: active ? 'white' : 'inherit', fontWeight: 600,
        }}>{count}</span>
      )}
    </button>
  );
}

// ─── Sidebar ─────────────────────────────────────────────────────
// variants: 'dark' (current), 'rail' (icon-only narrow), 'light' (airy, editorial)
function Sidebar({ current, onNav, variant = 'dark' }) {
  const nav = [
    { id: 'dashboard', icon: I.home, label: 'Dashboard' },
    { id: 'products', icon: I.box, label: 'Produtos', count: 84 },
    { id: 'catalog', icon: I.catalog, label: 'Vitrine' },
    { id: 'history', icon: I.clock, label: 'Histórico' },
  ];

  if (variant === 'rail') {
    return (
      <aside className="nosel" style={{
        width: 72, background: 'var(--night)', color: 'white',
        padding: '20px 0', display: 'flex', flexDirection: 'column',
        alignItems: 'center', gap: 8, flexShrink: 0,
      }}>
        <div style={{
          width: 40, height: 40, borderRadius: 12,
          background: 'linear-gradient(135deg, var(--ember), var(--aqua))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: 16, color: 'white', fontFamily: 'var(--font-display)', fontWeight: 700,
        }}>SM</div>
        {nav.map(n => <NavItem key={n.id} {...n} active={current === n.id} onClick={() => onNav(n.id)} variant="rail" />)}
        <div style={{ flex: 1 }}/>
        <Avatar name="Carla" size={36}/>
      </aside>
    );
  }

  const isDark = variant === 'dark';
  const bg = isDark ? 'var(--night)' : 'var(--bg-elev-strong)';
  const fg = isDark ? 'white' : 'var(--text)';
  const border = isDark ? 'rgba(255,255,255,0.06)' : 'var(--border)';

  return (
    <aside className="nosel" style={{
      width: 272, background: bg, color: fg,
      padding: '24px 18px', display: 'flex', flexDirection: 'column', gap: 6,
      flexShrink: 0, borderRight: `1px solid ${border}`,
    }}>
      <div style={{ padding: '0 6px 18px', color: fg }}>
        <Logo mono={isDark} />
      </div>

      <div style={{
        margin: '0 4px 16px', padding: '12px 14px', borderRadius: 14,
        background: isDark ? 'rgba(255,107,61,0.08)' : 'var(--sand)',
        border: `1px solid ${isDark ? 'rgba(255,107,61,0.15)' : 'rgba(255,107,61,0.18)'}`,
      }}>
        <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em', color: isDark ? 'rgba(255,255,255,0.5)' : 'var(--text-muted)', marginBottom: 6 }}>
          verão 2026 · coleção ativa
        </div>
        <div className="display" style={{ fontSize: 15, fontWeight: 600 }}>
          38 peças publicadas
        </div>
      </div>

      <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.12em', color: isDark ? 'rgba(255,255,255,0.4)' : 'var(--text-subtle)', padding: '0 14px 8px' }}>
        navegação
      </div>
      {nav.map(n => <NavItem key={n.id} {...n} active={current === n.id} onClick={() => onNav(n.id)} variant={variant} />)}

      <div style={{ flex: 1 }}/>

      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '10px 12px', borderRadius: 14,
        background: isDark ? 'rgba(255,255,255,0.04)' : 'var(--bg)',
        border: `1px solid ${border}`,
      }}>
        <Avatar name="Carla" size={32}/>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 600 }}>Carla Mendes</div>
          <div style={{ fontSize: 11, color: isDark ? 'rgba(255,255,255,0.5)' : 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            carla@praiadoforte.co
          </div>
        </div>
        <button style={{
          background: 'transparent', border: 'none', color: 'inherit', opacity: 0.5, cursor: 'pointer', padding: 6,
        }}>{I.logout}</button>
      </div>
    </aside>
  );
}

// ─── Header ──────────────────────────────────────────────────────
function Header({ title, subtitle, actions, breadcrumb }) {
  const now = new Date();
  const h = now.getHours();
  const greet = h < 12 ? 'Bom dia' : h < 18 ? 'Boa tarde' : 'Boa noite';
  return (
    <header style={{
      display: 'flex', alignItems: 'center', gap: 16,
      padding: '22px 28px',
      borderBottom: '1px solid var(--border)',
      background: 'var(--bg)',
      position: 'sticky', top: 0, zIndex: 5,
    }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        {breadcrumb && (
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4, display: 'flex', gap: 6 }}>
            {breadcrumb.map((c, i) => (
              <React.Fragment key={i}>
                {i > 0 && <span>/</span>}
                <span style={{ color: i === breadcrumb.length - 1 ? 'var(--text)' : 'var(--text-muted)' }}>{c}</span>
              </React.Fragment>
            ))}
          </div>
        )}
        <h1 className="display" style={{ margin: 0, fontSize: 24, fontWeight: 600, letterSpacing: '-0.02em' }}>
          {title || `${greet}, Carla`}
        </h1>
        {subtitle && (
          <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>{subtitle}</div>
        )}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {actions}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 12px', borderRadius: 999, background: 'var(--success-bg)', color: 'var(--success)', fontSize: 12, fontWeight: 600 }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'currentColor' }}/>
          Online
        </div>
        <button style={{ width: 36, height: 36, borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg-elev-strong)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text)' }}>
          {I.bell}
        </button>
      </div>
    </header>
  );
}

// ─── Sparkline ───────────────────────────────────────────────────
function Sparkline({ data, color = 'var(--ember)', fill = true, height = 40, width = 140 }) {
  const max = Math.max(...data), min = Math.min(...data);
  const range = max - min || 1;
  const step = width / (data.length - 1);
  const pts = data.map((v, i) => [i * step, height - ((v - min) / range) * height * 0.8 - 4]);
  const path = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0]},${p[1]}`).join(' ');
  const area = `${path} L${width},${height} L0,${height} Z`;
  const last = pts[pts.length - 1];
  return (
    <svg width={width} height={height} style={{ display: 'block' }}>
      {fill && (
        <>
          <defs>
            <linearGradient id={`spk-${color.replace(/[^a-z]/gi, '')}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor={color} stopOpacity="0.25"/>
              <stop offset="1" stopColor={color} stopOpacity="0"/>
            </linearGradient>
          </defs>
          <path d={area} fill={`url(#spk-${color.replace(/[^a-z]/gi, '')})`}/>
        </>
      )}
      <path d={path} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx={last[0]} cy={last[1]} r="3" fill={color}/>
      <circle cx={last[0]} cy={last[1]} r="6" fill={color} opacity="0.2"/>
    </svg>
  );
}

// ─── Placeholder image ───────────────────────────────────────────
function ProductPlaceholder({ label = 'PRODUCT SHOT', ratio = '4/5', tint }) {
  const tints = {
    ember: 'linear-gradient(135deg, rgba(255,107,61,0.3), rgba(255,107,61,0.08))',
    aqua: 'linear-gradient(135deg, rgba(30,203,225,0.28), rgba(30,203,225,0.08))',
    mint: 'linear-gradient(135deg, rgba(167,243,208,0.6), rgba(167,243,208,0.2))',
    coral: 'linear-gradient(135deg, rgba(255,107,61,0.4), rgba(255,200,150,0.3))',
    ocean: 'linear-gradient(160deg, rgba(30,203,225,0.4), rgba(15,23,42,0.2))',
    sand: 'linear-gradient(135deg, rgba(255,244,232,0.9), rgba(255,220,180,0.4))',
  };
  return (
    <div className="img-placeholder" style={{
      width: '100%', aspectRatio: ratio,
      backgroundImage: tint ? tints[tint] : undefined,
      background: tint ? tints[tint] : undefined,
    }}>
      <div className="label">{label}</div>
    </div>
  );
}

Object.assign(window, {
  I, Icon, Logo, Avatar, NavItem, Sidebar, Header, Sparkline, ProductPlaceholder,
});
