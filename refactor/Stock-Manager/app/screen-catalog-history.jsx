// Catalog (admin config + public storefront) + History

function Catalog({ onNav, layoutVariant = 'editorial' }) {
  const active = PRODUCTS.filter(p => p.status === 'active');
  return (
    <div className="reveal" style={{ padding: '22px 28px 40px', display: 'grid', gridTemplateColumns: '320px 1fr', gap: 22 }}>
      {/* Left: config */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div className="panel-solid" style={{ padding: 20 }}>
          <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: 10 }}>Link da vitrine</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px', borderRadius: 10, background: 'var(--bg)', border: '1px solid var(--border)' }}>
            <span className="mono" style={{ flex: 1, fontSize: 12, color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              stock.app/c/praiadoforte
            </span>
            <button style={{ background: 'transparent', border: 'none', color: 'var(--ember)', cursor: 'pointer' }}>{I.copy}</button>
          </div>
          <button onClick={() => onNav('public')} className="btn-primary" style={{ width: '100%', marginTop: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            {I.eye} Visualizar vitrine
          </button>
        </div>

        <div className="panel-solid" style={{ padding: 20 }}>
          <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: 10 }}>Personalização</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={lbl}>Nome da loja</label>
              <input defaultValue="Praia do Forte Swimwear" style={inp}/>
            </div>
            <div>
              <label style={lbl}>Tagline</label>
              <input defaultValue="Verão 2026 · peças únicas" style={inp}/>
            </div>
            <div>
              <label style={lbl}>Layout</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                {['editorial', 'mobile-shop'].map(v => (
                  <div key={v} style={{
                    padding: 8, borderRadius: 10, border: `2px solid ${layoutVariant === v ? 'var(--ember)' : 'var(--border)'}`,
                    textAlign: 'center', fontSize: 12, fontWeight: 500,
                    background: layoutVariant === v ? 'var(--ember-soft)' : 'transparent',
                  }}>
                    {v === 'editorial' ? 'Boutique' : 'Mobile Shop'}
                  </div>
                ))}
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-subtle)', marginTop: 4 }}>toggle via Tweaks →</div>
            </div>
            <div>
              <label style={lbl}>Cor de destaque</label>
              <div style={{ display: 'flex', gap: 6 }}>
                {['#FF6B3D', '#1ECBE1', '#A7F3D0', '#0F172A', '#E11D48'].map((c, i) => (
                  <div key={c} style={{ width: 28, height: 28, borderRadius: 8, background: c, cursor: 'pointer', border: i === 0 ? '2px solid var(--text)' : '2px solid transparent' }}/>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="panel-solid" style={{ padding: 20 }}>
          <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: 10 }}>Contato</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', borderRadius: 10, background: 'var(--bg)' }}>
              <span style={{ color: '#25D366' }}>{I.wa}</span>
              <span style={{ fontSize: 13, fontWeight: 500 }}>+55 71 9****-1234</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', borderRadius: 10, background: 'var(--bg)' }}>
              <span style={{ color: '#E4405F' }}>{I.ig}</span>
              <span style={{ fontSize: 13, fontWeight: 500 }}>@praiadoforte.co</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right: product selector */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div>
            <h2 className="display" style={{ margin: 0, fontSize: 20, fontWeight: 600 }}>Peças na vitrine</h2>
            <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{active.length} peças ativas · arraste para reordenar</div>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            <button className="btn-secondary">Selecionar destaques</button>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12 }}>
          {active.map((p, i) => (
            <div key={p.id} className="panel-solid" style={{ padding: 0, overflow: 'hidden', position: 'relative' }}>
              <div style={{ position: 'absolute', top: 8, left: 8, zIndex: 2, width: 24, height: 24, borderRadius: 6, background: 'rgba(255,255,255,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'grab' }}>
                {I.drag}
              </div>
              {i < 3 && (
                <div style={{ position: 'absolute', top: 8, right: 8, zIndex: 2, padding: '2px 8px', borderRadius: 6, background: 'linear-gradient(135deg, var(--ember), var(--aqua))', color: 'white', fontSize: 10, fontWeight: 600 }}>
                  destaque
                </div>
              )}
              <ProductPlaceholder ratio="4/5" tint={['coral','ocean','mint','sand','aqua','ember'][i % 6]} label={p.category}/>
              <div style={{ padding: 10 }}>
                <div style={{ fontSize: 13, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
                  <span>R$ {p.price.toFixed(0)}</span>
                  <span>{p.stock} un.</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const lbl = { display: 'block', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: 6, fontWeight: 500 };
const inp = { width: '100%', padding: '10px 12px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg)', fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--text)' };

// ─── Public Catalog (Storefront) ────────────────────────────────
// Two variants: 'editorial' (magazine), 'mobile-shop' (dense, instagram-like)
function PublicCatalog({ variant = 'editorial' }) {
  if (variant === 'mobile-shop') return <PublicCatalogMobile/>;
  return <PublicCatalogEditorial/>;
}

function PublicCatalogEditorial() {
  const products = PRODUCTS.filter(p => p.status === 'active');
  return (
    <div style={{ background: '#FBF8F3', minHeight: '100%', fontFamily: 'var(--font-body)', color: '#0F172A' }}>
      {/* Hero */}
      <div style={{
        padding: '32px 40px 80px',
        background: 'linear-gradient(160deg, #FFF4E8 0%, #FFE4D0 60%, #FBF8F3 100%)',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 48 }}>
          <div className="display" style={{ fontSize: 13, fontWeight: 600, letterSpacing: '0.24em', textTransform: 'uppercase' }}>praia do forte</div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button style={{ width: 40, height: 40, borderRadius: '50%', background: 'white', border: 'none', cursor: 'pointer', color: '#E4405F' }}>{I.ig}</button>
            <button style={{ padding: '10px 18px', borderRadius: 999, background: '#25D366', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>{I.wa} WhatsApp</button>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 40, alignItems: 'end' }}>
          <div>
            <div className="mono" style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#FF6B3D', marginBottom: 16 }}>
              ○ verão 2026 · drop 03
            </div>
            <h1 className="display" style={{ margin: 0, fontSize: 84, fontWeight: 700, letterSpacing: '-0.05em', lineHeight: 0.95 }}>
              Peças que<br/><em style={{ fontStyle: 'italic', background: 'linear-gradient(135deg, #FF6B3D, #1ECBE1)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>respiram</em> praia.
            </h1>
            <p style={{ maxWidth: 480, fontSize: 15, lineHeight: 1.6, color: 'rgba(15,23,42,0.7)', marginTop: 20 }}>
              Coleção limitada. Tecido nacional com proteção UV 50+. Envios para todo o Brasil.
            </p>
          </div>
          <div style={{ position: 'relative', aspectRatio: '4/5', borderRadius: 24, overflow: 'hidden' }}>
            <ProductPlaceholder ratio="4/5" tint="coral" label="HERO IMAGE · MODELO NA PRAIA"/>
            <div style={{ position: 'absolute', bottom: 16, left: 16, padding: '8px 14px', borderRadius: 999, background: 'rgba(255,255,255,0.95)', fontSize: 12, fontWeight: 600 }}>
              biquíni ibiza · r$ 189
            </div>
          </div>
        </div>
      </div>

      {/* Category pills */}
      <div style={{ padding: '24px 40px 8px', display: 'flex', gap: 8, overflowX: 'auto' }}>
        {['Todas', ...CATEGORIES].map((c, i) => (
          <button key={c} style={{
            padding: '10px 20px', borderRadius: 999,
            background: i === 0 ? '#0F172A' : 'transparent',
            color: i === 0 ? 'white' : '#0F172A',
            border: i === 0 ? 'none' : '1px solid rgba(15,23,42,0.15)',
            fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: 13, cursor: 'pointer', whiteSpace: 'nowrap',
          }}>{c}</button>
        ))}
      </div>

      {/* Editorial grid: mix of sizes */}
      <div style={{ padding: '24px 40px 60px', display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gridAutoRows: '200px', gap: 20 }}>
        {products.slice(0, 9).map((p, i) => {
          const layouts = [
            { col: 'span 3', row: 'span 2' },
            { col: 'span 3', row: 'span 1' },
            { col: 'span 3', row: 'span 1' },
            { col: 'span 2', row: 'span 2' },
            { col: 'span 2', row: 'span 1' },
            { col: 'span 2', row: 'span 1' },
            { col: 'span 3', row: 'span 2' },
            { col: 'span 3', row: 'span 1' },
            { col: 'span 3', row: 'span 1' },
          ];
          const tints = ['coral', 'ocean', 'mint', 'sand', 'aqua', 'ember', 'coral', 'ocean', 'mint'];
          return (
            <div key={p.id} style={{ ...layouts[i], position: 'relative', borderRadius: 20, overflow: 'hidden', cursor: 'pointer', background: '#fff' }}>
              <div style={{ position: 'absolute', inset: 0 }}>
                <ProductPlaceholder ratio="auto" tint={tints[i]} label=""/>
              </div>
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 40%, rgba(15,23,42,0.8) 100%)' }}/>
              <div style={{ position: 'absolute', left: 16, bottom: 14, right: 16, color: 'white' }}>
                <div className="display" style={{ fontSize: 20, fontWeight: 600, letterSpacing: '-0.02em' }}>{p.name}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 4 }}>
                  <div style={{ fontSize: 12, opacity: 0.8 }}>{p.color} · {p.sizes.join(' ')}</div>
                  <div className="display" style={{ fontSize: 18, fontWeight: 700 }}>R$ {p.price.toFixed(0)}</div>
                </div>
              </div>
              <div style={{ position: 'absolute', top: 12, right: 12, width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.95)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0F172A' }}>{I.heart}</div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div style={{ padding: '30px 40px', borderTop: '1px solid rgba(15,23,42,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: 12, color: 'rgba(15,23,42,0.6)' }}>praia do forte swimwear · são paulo · salvador</div>
        <div className="mono" style={{ fontSize: 10, color: 'rgba(15,23,42,0.4)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
          powered by stock manager
        </div>
      </div>
    </div>
  );
}

function PublicCatalogMobile() {
  const products = PRODUCTS.filter(p => p.status === 'active');
  return (
    <div style={{ background: '#fff', minHeight: '100%', color: '#0F172A' }}>
      {/* Sticky compact header — top padding clears iOS status bar + dynamic island */}
      <div style={{ padding: '60px 20px 14px', borderBottom: '1px solid rgba(15,23,42,0.08)', position: 'sticky', top: 0, background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(12px)', zIndex: 5 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div>
            <div className="display" style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-0.02em' }}>Praia do Forte</div>
            <div style={{ fontSize: 11, color: 'rgba(15,23,42,0.55)' }}>verão 2026 · frete grátis acima de R$300</div>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            <button style={circBtn('#E4405F')}>{I.ig}</button>
            <button style={circBtn('#25D366')}>{I.wa}</button>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 6, overflowX: 'auto' }}>
          {['Todas', ...CATEGORIES].map((c, i) => (
            <button key={c} style={{
              padding: '6px 14px', borderRadius: 999,
              background: i === 0 ? '#FF6B3D' : 'transparent',
              color: i === 0 ? 'white' : 'rgba(15,23,42,0.7)',
              border: i === 0 ? 'none' : '1px solid rgba(15,23,42,0.1)',
              fontSize: 12, fontWeight: 500, cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0,
            }}>{c}</button>
          ))}
        </div>
      </div>

      {/* Dense 2-col grid */}
      <div style={{ padding: 14, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {products.map((p, i) => (
          <div key={p.id} style={{ position: 'relative' }}>
            <div style={{ position: 'relative', borderRadius: 14, overflow: 'hidden' }}>
              <ProductPlaceholder ratio="4/5" tint={['coral','ocean','mint','sand','aqua','ember'][i % 6]} label=""/>
              <div style={{ position: 'absolute', top: 8, right: 8, width: 30, height: 30, borderRadius: '50%', background: 'rgba(255,255,255,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0F172A' }}>{I.heart}</div>
              {i === 0 && <div style={{ position: 'absolute', top: 8, left: 8, padding: '3px 8px', borderRadius: 6, background: '#FF6B3D', color: 'white', fontSize: 9, fontWeight: 700, letterSpacing: '0.06em' }}>NOVO</div>}
            </div>
            <div style={{ padding: '8px 2px' }}>
              <div style={{ fontSize: 13, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</div>
              <div style={{ fontSize: 11, color: 'rgba(15,23,42,0.55)' }}>{p.color}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
                <div className="display" style={{ fontSize: 14, fontWeight: 700 }}>R$ {p.price.toFixed(0)}</div>
                <button style={{ padding: '4px 10px', borderRadius: 999, background: '#0F172A', color: 'white', border: 'none', fontSize: 10, fontWeight: 600, cursor: 'pointer' }}>comprar</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Sticky bottom cta */}
      <div style={{ position: 'sticky', bottom: 0, padding: 14, background: 'rgba(255,255,255,0.95)', borderTop: '1px solid rgba(15,23,42,0.08)', backdropFilter: 'blur(12px)' }}>
        <button style={{ width: '100%', padding: '12px', borderRadius: 12, background: '#25D366', color: 'white', border: 'none', fontWeight: 600, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          {I.wa} Comprar pelo WhatsApp
        </button>
      </div>
    </div>
  );
}

const circBtn = (color) => ({ width: 36, height: 36, borderRadius: '50%', background: 'transparent', border: `1px solid rgba(15,23,42,0.12)`, color, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' });

// ─── History ─────────────────────────────────────────────────────
function History() {
  const [filter, setFilter] = React.useState('Todos');
  const types = ['Todos', 'Criado', 'Atualizado', 'Removido', 'Compartilhado'];
  const grouped = ACTIVITY.reduce((acc, a) => {
    (acc[a.day] = acc[a.day] || []).push(a); return acc;
  }, {});

  return (
    <div className="reveal" style={{ padding: '22px 28px 40px', display: 'grid', gridTemplateColumns: '220px 1fr', gap: 22 }}>
      {/* Filter rail */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, position: 'sticky', top: 80, alignSelf: 'flex-start' }}>
        <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', padding: '0 12px 8px' }}>Tipo de evento</div>
        {types.map(t => {
          const active = filter === t;
          return (
            <button key={t} onClick={() => setFilter(t)} style={{
              textAlign: 'left', padding: '8px 12px', borderRadius: 10, border: 'none',
              background: active ? 'var(--bg-elev-strong)' : 'transparent',
              color: active ? 'var(--text)' : 'var(--text-muted)',
              fontFamily: 'var(--font-body)', fontWeight: active ? 600 : 500, fontSize: 13, cursor: 'pointer',
              boxShadow: active ? 'var(--shadow-panel)' : 'none',
            }}>{t}</button>
          );
        })}
        <div style={{ height: 16 }}/>
        <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', padding: '0 12px 8px' }}>Período</div>
        {['Hoje', 'Esta semana', 'Este mês', 'Personalizado'].map((t, i) => (
          <button key={t} style={{
            textAlign: 'left', padding: '8px 12px', borderRadius: 10, border: 'none',
            background: i === 1 ? 'var(--bg-elev-strong)' : 'transparent',
            color: i === 1 ? 'var(--text)' : 'var(--text-muted)',
            fontFamily: 'var(--font-body)', fontWeight: i === 1 ? 600 : 500, fontSize: 13, cursor: 'pointer',
            boxShadow: i === 1 ? 'var(--shadow-panel)' : 'none',
          }}>{t}</button>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
        {Object.entries(grouped).map(([day, items]) => (
          <div key={day}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12, position: 'sticky', top: 80, background: 'var(--bg)', padding: '6px 0', zIndex: 2 }}>
              <div className="display" style={{ fontSize: 13, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.14em' }}>{day}</div>
              <div style={{ flex: 1, height: 1, background: 'var(--border)' }}/>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{items.length} evento{items.length !== 1 ? 's' : ''}</div>
            </div>
            <div className="panel-solid" style={{ overflow: 'hidden' }}>
              {items.map((a, i) => {
                const c = ACTIVITY_COLORS[a.type];
                return (
                  <div key={a.id} style={{
                    display: 'grid', gridTemplateColumns: '110px 40px 1fr 120px', gap: 14, alignItems: 'center',
                    padding: '14px 20px',
                    borderTop: i > 0 ? '1px solid var(--border)' : 'none',
                  }}>
                    <span style={{ padding: '4px 10px', borderRadius: 6, background: c.bg, color: c.fg, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', textAlign: 'center', width: 'fit-content' }}>{c.label}</span>
                    <div style={{ width: 34, height: 34, borderRadius: 10, background: c.bg, color: c.fg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {a.type === 'CREATED' && I.plus}
                      {a.type === 'UPDATED' && I.edit}
                      {a.type === 'DELETED' && I.trash}
                      {a.type === 'VIEWED' && I.eye}
                      {a.type === 'TOGGLED' && I.warn}
                      {a.type === 'SHARED' && I.share}
                    </div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 500 }}>{a.product}</div>
                      {a.detail && <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{a.detail}</div>}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', textAlign: 'right' }}>
                      <div>{a.time}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-subtle)' }}>por {a.user}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

Object.assign(window, { Catalog, PublicCatalog, PublicCatalogEditorial, PublicCatalogMobile, History });
