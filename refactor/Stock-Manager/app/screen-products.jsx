// Products list screen with table / grid / gallery view modes

function Products({ onNav, viewMode: extMode }) {
  const [mode, setMode] = React.useState(extMode || 'table');
  const [q, setQ] = React.useState('');
  const [cat, setCat] = React.useState('Todas');
  const [sel, setSel] = React.useState(new Set());
  React.useEffect(() => { if (extMode) setMode(extMode); }, [extMode]);

  const filtered = PRODUCTS.filter(p =>
    (!q || p.name.toLowerCase().includes(q.toLowerCase())) &&
    (cat === 'Todas' || p.category === cat)
  );

  return (
    <div className="reveal" style={{ padding: '22px 28px 40px', display: 'flex', flexDirection: 'column', gap: 18 }}>
      {/* Toolbar */}
      <div className="panel-solid" style={{ padding: 14, display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: '1 1 260px', minWidth: 220 }}>
          <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-subtle)' }}>{I.search}</span>
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="buscar peça, SKU, cor…" style={{
            width: '100%', padding: '10px 12px 10px 38px', borderRadius: 10,
            border: '1px solid var(--border)', background: 'var(--bg)',
            fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--text)',
          }}/>
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {['Todas', ...CATEGORIES].map(c => (
            <button key={c} onClick={() => setCat(c)} className={`chip ${cat === c ? 'active' : ''}`} style={{ cursor: 'pointer', border: cat === c ? 'none' : '1px solid var(--border)' }}>{c}</button>
          ))}
        </div>
        <div style={{ flex: 1 }}/>
        <div style={{ display: 'flex', gap: 2, padding: 3, background: 'var(--bg)', borderRadius: 10, border: '1px solid var(--border)' }}>
          {[
            { id: 'table', icon: I.rows, label: 'tabela' },
            { id: 'grid', icon: I.grid, label: 'grade' },
            { id: 'gallery', icon: I.catalog, label: 'galeria' },
          ].map(v => (
            <button key={v.id} onClick={() => setMode(v.id)} title={v.label} style={{
              padding: '6px 10px', borderRadius: 8, border: 'none', cursor: 'pointer',
              background: mode === v.id ? 'var(--bg-elev-strong)' : 'transparent',
              color: mode === v.id ? 'var(--text)' : 'var(--text-muted)',
              boxShadow: mode === v.id ? 'var(--shadow-panel)' : 'none',
              display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 500,
            }}>{v.icon}{v.label}</button>
          ))}
        </div>
        <button className="btn-primary" onClick={() => onNav('product-new')} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {I.plus} Nova peça
        </button>
      </div>

      {/* Selection bar */}
      {sel.size > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 16px', borderRadius: 12, background: 'var(--night)', color: 'white' }}>
          <div style={{ fontSize: 13, fontWeight: 600 }}>{sel.size} selecionadas</div>
          <div style={{ width: 1, height: 20, background: 'rgba(255,255,255,0.2)' }}/>
          <button style={{ background: 'transparent', border: 'none', color: 'white', fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>{I.share} Publicar na vitrine</button>
          <button style={{ background: 'transparent', border: 'none', color: 'white', fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>{I.edit} Editar em lote</button>
          <button style={{ background: 'transparent', border: 'none', color: 'var(--danger)', fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>{I.trash} Remover</button>
          <div style={{ flex: 1 }}/>
          <button onClick={() => setSel(new Set())} style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', opacity: 0.6 }}>{I.x}</button>
        </div>
      )}

      {/* Content */}
      {mode === 'table' && <ProductTable rows={filtered} sel={sel} setSel={setSel} onNav={onNav}/>}
      {mode === 'grid' && <ProductGrid rows={filtered} onNav={onNav}/>}
      {mode === 'gallery' && <ProductGallery rows={filtered} onNav={onNav}/>}

      {/* Pagination */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 4px' }}>
        <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{filtered.length} de 84 peças</div>
        <div style={{ display: 'flex', gap: 4 }}>
          <button className="chip" style={{ cursor: 'pointer' }}>{I.chevL}</button>
          {[1,2,3,4].map(n => <button key={n} className={`chip ${n === 1 ? 'active' : ''}`} style={{ cursor: 'pointer', minWidth: 32, justifyContent: 'center' }}>{n}</button>)}
          <button className="chip" style={{ cursor: 'pointer' }}>{I.chevR}</button>
        </div>
      </div>
    </div>
  );
}

function ProductTable({ rows, sel, setSel, onNav }) {
  const tints = ['coral', 'ocean', 'mint', 'sand', 'aqua', 'ember'];
  const toggle = id => {
    const n = new Set(sel); n.has(id) ? n.delete(id) : n.add(id); setSel(n);
  };
  return (
    <div className="panel-solid" style={{ overflow: 'hidden' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: 'var(--bg)' }}>
            <th style={th(36)}><input type="checkbox"/></th>
            <th style={th()}>Peça</th>
            <th style={th()}>Categoria</th>
            <th style={th()}>Cor · Tam</th>
            <th style={th()}>Status</th>
            <th style={{ ...th(), textAlign: 'right' }}>Estoque</th>
            <th style={{ ...th(), textAlign: 'right' }}>Preço</th>
            <th style={th(40)}/>
          </tr>
        </thead>
        <tbody>
          {rows.map((p, i) => (
            <tr key={p.id} style={{ borderTop: '1px solid var(--border)', cursor: 'pointer' }}
              onClick={() => onNav('product-detail', p.id)}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--sand)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
              <td style={td()} onClick={e => { e.stopPropagation(); toggle(p.id); }}>
                <input type="checkbox" checked={sel.has(p.id)} onChange={()=>{}}/>
              </td>
              <td style={td()}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 10, overflow: 'hidden', flexShrink: 0 }}>
                    <ProductPlaceholder ratio="1/1" tint={tints[i % tints.length]} label=""/>
                  </div>
                  <div>
                    <div style={{ fontWeight: 500, fontSize: 14 }}>{p.name}</div>
                    <div className="mono" style={{ fontSize: 11, color: 'var(--text-subtle)' }}>{p.sku}</div>
                  </div>
                </div>
              </td>
              <td style={td()}><span className="chip" style={{ fontSize: 11 }}>{p.category}</span></td>
              <td style={td()}>
                <div style={{ fontSize: 13 }}>{p.color}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{p.sizes.join(' · ')}</div>
              </td>
              <td style={td()}>
                <span className={`chip ${p.status === 'active' ? 'chip-success' : 'chip-danger'}`}>
                  {p.status === 'active' ? 'Ativo' : 'Inativo'}
                </span>
              </td>
              <td style={{ ...td(), textAlign: 'right' }}>
                <span style={{
                  fontWeight: 600,
                  color: p.stock === 0 ? 'var(--danger)' : p.low ? 'var(--warn)' : 'var(--text)',
                }}>{p.stock}</span>
                {p.low && <div style={{ fontSize: 10, color: 'var(--warn)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>baixo</div>}
                {p.out && <div style={{ fontSize: 10, color: 'var(--danger)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>zerado</div>}
              </td>
              <td style={{ ...td(), textAlign: 'right', fontFamily: 'var(--font-display)', fontWeight: 600 }}>R$ {p.price.toFixed(2).replace('.', ',')}</td>
              <td style={td()} align="right"><span style={{ color: 'var(--text-subtle)' }}>{I.chevR}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
const th = (w) => ({ textAlign: 'left', padding: '14px 18px', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', width: w });
const td = () => ({ padding: '12px 18px', fontSize: 13, color: 'var(--text)' });

function ProductGrid({ rows, onNav }) {
  const tints = ['coral', 'ocean', 'mint', 'sand', 'aqua', 'ember'];
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
      {rows.map((p, i) => (
        <div key={p.id} className="panel-solid" onClick={() => onNav('product-detail', p.id)} style={{
          padding: 0, overflow: 'hidden', cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s',
        }}
        onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'none'}>
          <div style={{ position: 'relative' }}>
            <ProductPlaceholder ratio="1/1" tint={tints[i % tints.length]} label={p.category}/>
            {p.out && <div style={{ position: 'absolute', top: 10, left: 10 }}><span className="chip chip-danger">zerado</span></div>}
            {p.low && <div style={{ position: 'absolute', top: 10, left: 10 }}><span className="chip chip-warn">estoque baixo</span></div>}
            <div style={{ position: 'absolute', top: 10, right: 10, padding: '4px 8px', borderRadius: 999, background: 'rgba(255,255,255,0.9)', fontSize: 11, fontWeight: 600 }}>
              {p.photos} fotos
            </div>
          </div>
          <div style={{ padding: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontWeight: 500, fontSize: 14, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</div>
                <div className="mono" style={{ fontSize: 10, color: 'var(--text-subtle)' }}>{p.sku}</div>
              </div>
              <span className={`chip ${p.status === 'active' ? 'chip-success' : 'chip-danger'}`} style={{ fontSize: 10 }}>{p.status === 'active' ? '●' : '○'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 10 }}>
              <div className="display" style={{ fontSize: 16, fontWeight: 600 }}>R$ {p.price.toFixed(0)}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{p.stock} un.</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function ProductGallery({ rows, onNav }) {
  const tints = ['coral', 'ocean', 'mint', 'sand', 'aqua', 'ember'];
  // mosaic: first is large, then medium, small
  const patterns = [
    { col: 'span 2', row: 'span 2' },
    { col: 'span 1', row: 'span 1' },
    { col: 'span 1', row: 'span 1' },
    { col: 'span 1', row: 'span 2' },
    { col: 'span 2', row: 'span 1' },
    { col: 'span 1', row: 'span 1' },
    { col: 'span 1', row: 'span 1' },
    { col: 'span 1', row: 'span 1' },
    { col: 'span 2', row: 'span 1' },
    { col: 'span 1', row: 'span 1' },
  ];
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gridAutoRows: '180px', gap: 12 }}>
      {rows.map((p, i) => (
        <div key={p.id} onClick={() => onNav('product-detail', p.id)} style={{
          gridColumn: patterns[i % patterns.length].col,
          gridRow: patterns[i % patterns.length].row,
          borderRadius: 16, overflow: 'hidden', cursor: 'pointer', position: 'relative',
        }}>
          <div style={{ position: 'absolute', inset: 0 }}>
            <ProductPlaceholder ratio="auto" tint={tints[i % tints.length]} label={p.category}/>
          </div>
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(180deg, transparent 50%, rgba(15,23,42,0.7) 100%)',
          }}/>
          <div style={{ position: 'absolute', left: 12, bottom: 10, right: 12, color: 'white' }}>
            <div className="display" style={{ fontSize: 15, fontWeight: 600 }}>{p.name}</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, opacity: 0.8 }}>
              <span>{p.color}</span>
              <span>R$ {p.price.toFixed(0)} · {p.stock} un.</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

Object.assign(window, { Products, ProductTable, ProductGrid, ProductGallery });
