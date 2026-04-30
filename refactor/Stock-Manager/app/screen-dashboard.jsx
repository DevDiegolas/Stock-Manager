// Screens for Stock Manager prototype

// ─── Dashboard ──────────────────────────────────────────────────
function Dashboard({ onNav }) {
  return (
    <div className="reveal" style={{ padding: '24px 28px 40px', display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Hero band: big stat with sparkline + alerts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr', gap: 16 }}>
        <div className="panel-solid" style={{ padding: 24, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, right: 0, width: 200, height: 200, background: 'radial-gradient(circle, rgba(255,107,61,0.18), transparent 70%)', pointerEvents: 'none' }}/>
          <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--text-muted)', marginBottom: 8 }}>
            Movimento da vitrine · últimos 14 dias
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
            <div className="display" style={{ fontSize: 48, fontWeight: 700, letterSpacing: '-0.04em', lineHeight: 1 }}>
              1.247
            </div>
            <div className="chip chip-success" style={{ gap: 4 }}>
              <span style={{ display: 'flex' }}>{I.trend}</span>
              +18% vs. 2 sem
            </div>
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>
            visitas únicas na vitrine pública · 89 cliques em WhatsApp
          </div>
          <div style={{ marginTop: 16, marginLeft: -8 }}>
            <Sparkline data={SPARK_VIEWS} color="#FF6B3D" width={320} height={64}/>
          </div>
        </div>

        <div className="panel-solid" style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 30, height: 30, borderRadius: 8, background: 'var(--warn-bg)', color: 'var(--warn)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {I.warn}
            </div>
            <div style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)' }}>Atenção</div>
          </div>
          <div>
            <div className="display" style={{ fontSize: 32, fontWeight: 700, letterSpacing: '-0.03em' }}>6</div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>peças com estoque baixo</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12 }}>
            {PRODUCTS.filter(p => p.low).slice(0, 2).map(p => (
              <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 10px', borderRadius: 8, background: 'var(--bg)' }}>
                <span style={{ fontWeight: 500 }}>{p.name}</span>
                <span style={{ color: 'var(--warn)', fontWeight: 600 }}>{p.stock} un.</span>
              </div>
            ))}
          </div>
          <button className="btn-secondary" onClick={() => onNav('products')} style={{ fontSize: 12, padding: '8px' }}>Ver todos</button>
        </div>

        <div className="panel-solid" style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 12, background: 'linear-gradient(160deg, var(--night), var(--slate))', color: 'white', border: 'none' }}>
          <div style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.6)' }}>Sem estoque</div>
          <div>
            <div className="display" style={{ fontSize: 32, fontWeight: 700, letterSpacing: '-0.03em' }}>3</div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)' }}>peças ativas zeradas</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12 }}>
            {PRODUCTS.filter(p => p.out).slice(0, 2).map(p => (
              <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 10px', borderRadius: 8, background: 'rgba(255,255,255,0.06)' }}>
                <span>{p.name}</span>
                <span style={{ color: 'var(--danger)', fontWeight: 600 }}>0</span>
              </div>
            ))}
          </div>
          <button style={{ background: 'linear-gradient(135deg, var(--ember), var(--aqua))', color: 'white', border: 'none', borderRadius: 10, padding: '8px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Repor estoque</button>
        </div>
      </div>

      {/* Middle: top products + activity */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 16 }}>
        <div className="panel-solid" style={{ padding: 22 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div>
              <h3 className="display" style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>Top produtos · esta semana</h3>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>ordenados por cliques em "Comprar"</div>
            </div>
            <div style={{ display: 'flex', gap: 4 }}>
              {['7d', '30d', 'tudo'].map((t, i) => (
                <button key={t} className={`chip ${i === 0 ? 'active' : ''}`} style={{ cursor: 'pointer', border: 'none' }}>{t}</button>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {PRODUCTS.slice(0, 5).map((p, i) => {
              const clicks = [42, 38, 29, 24, 18][i];
              const pct = (clicks / 42) * 100;
              const tints = ['coral', 'ocean', 'mint', 'sand', 'aqua'];
              return (
                <div key={p.id} style={{ display: 'grid', gridTemplateColumns: '24px 52px 1fr 100px 70px', alignItems: 'center', gap: 14 }}>
                  <div className="mono" style={{ fontSize: 11, color: 'var(--text-subtle)', fontWeight: 500 }}>0{i+1}</div>
                  <div style={{ width: 52, height: 52, borderRadius: 12, overflow: 'hidden' }}>
                    <ProductPlaceholder ratio="1/1" tint={tints[i]} label={p.category.slice(0,3)}/>
                  </div>
                  <div>
                    <div style={{ fontWeight: 500, fontSize: 14 }}>{p.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{p.category} · {p.color}</div>
                  </div>
                  <div style={{ position: 'relative', height: 8, borderRadius: 4, background: 'var(--bg)', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', inset: 0, width: `${pct}%`, background: 'linear-gradient(90deg, var(--ember), var(--aqua))' }}/>
                  </div>
                  <div style={{ fontSize: 13, textAlign: 'right', fontWeight: 600 }}>{clicks} <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>cliques</span></div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="panel-solid" style={{ padding: 22 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 className="display" style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>Atividade recente</h3>
            <button onClick={() => onNav('history')} style={{ background: 'transparent', border: 'none', fontSize: 12, color: 'var(--ember)', fontWeight: 600, cursor: 'pointer' }}>
              ver tudo →
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {ACTIVITY.slice(0, 6).map((a, i) => {
              const c = ACTIVITY_COLORS[a.type];
              return (
                <div key={a.id} style={{ display: 'flex', gap: 12, padding: '8px 0', position: 'relative' }}>
                  <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: c.fg, border: '2px solid var(--bg-elev-strong)', zIndex: 1 }}/>
                    {i < 5 && <div style={{ position: 'absolute', top: 10, bottom: -8, width: 1, background: 'var(--border)' }}/>}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                      <span style={{ padding: '2px 7px', borderRadius: 4, background: c.bg, color: c.fg, fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{c.label}</span>
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 500 }}>{a.product}</div>
                    {a.detail && <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{a.detail}</div>}
                    <div style={{ fontSize: 11, color: 'var(--text-subtle)', marginTop: 2 }}>{a.time}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {[
          { icon: I.plus, title: 'Cadastrar peça', sub: 'adicionar ao estoque', action: () => onNav('product-new') },
          { icon: I.share, title: 'Compartilhar vitrine', sub: 'link + QR code', action: () => onNav('catalog') },
          { icon: I.eye, title: 'Ver como visitante', sub: 'previa pública', action: () => onNav('public') },
        ].map((q, i) => (
          <button key={i} onClick={q.action} className="panel-solid" style={{ padding: 18, display: 'flex', alignItems: 'center', gap: 14, border: '1px solid var(--border)', cursor: 'pointer', textAlign: 'left' }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: 'var(--sand)', color: 'var(--ember)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {q.icon}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{q.title}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{q.sub}</div>
            </div>
            <span style={{ color: 'var(--text-subtle)' }}>{I.chevR}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

Object.assign(window, { Dashboard });
