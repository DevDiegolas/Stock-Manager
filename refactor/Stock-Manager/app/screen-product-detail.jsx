// Product detail screen with drag-drop upload and photo gallery

function ProductDetail({ id, onNav }) {
  const p = PRODUCTS.find(x => x.id === id) || PRODUCTS[0];
  const [activePhoto, setActivePhoto] = React.useState(0);
  const [dragOver, setDragOver] = React.useState(false);
  const [photos, setPhotos] = React.useState(Array.from({ length: p.photos }, (_, i) => ({ id: i, tint: ['coral','ocean','mint','sand','aqua','ember'][i % 6] })));

  return (
    <div className="reveal" style={{ padding: '22px 28px 40px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 24 }}>
        {/* Left: gallery */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ position: 'relative', borderRadius: 20, overflow: 'hidden', background: 'var(--bg-elev-strong)', border: '1px solid var(--border)' }}>
            <ProductPlaceholder ratio="4/5" tint={photos[activePhoto]?.tint} label={`${p.category.toUpperCase()} · FOTO ${activePhoto + 1}`}/>
            <button style={navBtn('left')}>{I.chevL}</button>
            <button style={navBtn('right')}>{I.chevR}</button>
            <div style={{ position: 'absolute', bottom: 14, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 6 }}>
              {photos.map((_, i) => (
                <div key={i} style={{ width: i === activePhoto ? 20 : 6, height: 6, borderRadius: 3, background: i === activePhoto ? 'white' : 'rgba(255,255,255,0.5)', transition: 'width 0.2s' }}/>
              ))}
            </div>
          </div>

          {/* Thumbnail strip + upload zone */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(78px, 1fr))', gap: 8 }}>
            {photos.map((ph, i) => (
              <button key={ph.id} onClick={() => setActivePhoto(i)} style={{
                border: i === activePhoto ? '2px solid var(--ember)' : '2px solid transparent',
                borderRadius: 10, overflow: 'hidden', padding: 0, background: 'transparent',
                cursor: 'pointer', position: 'relative',
              }}>
                <ProductPlaceholder ratio="1/1" tint={ph.tint} label=""/>
                <span style={{ position: 'absolute', top: 4, left: 4, color: 'white', fontSize: 10, fontWeight: 600, textShadow: '0 1px 2px rgba(0,0,0,0.4)' }}>{i + 1}</span>
                <span style={{ position: 'absolute', top: 4, right: 4, color: 'white', cursor: 'grab' }}>{I.drag}</span>
              </button>
            ))}
            <div
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={e => { e.preventDefault(); setDragOver(false); setPhotos([...photos, { id: Date.now(), tint: 'mint' }]); }}
              onClick={() => setPhotos([...photos, { id: Date.now(), tint: 'mint' }])}
              style={{
                aspectRatio: '1/1', borderRadius: 10,
                border: `2px dashed ${dragOver ? 'var(--ember)' : 'var(--border-strong)'}`,
                background: dragOver ? 'var(--ember-soft)' : 'var(--bg)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 4,
                cursor: 'pointer', transition: 'all 0.15s',
                color: dragOver ? 'var(--ember)' : 'var(--text-muted)',
              }}>
              {I.plus}
              <span style={{ fontSize: 10, fontWeight: 500 }}>adicionar</span>
            </div>
          </div>

          {/* Big drag-drop zone */}
          <div
            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={e => { e.preventDefault(); setDragOver(false); }}
            style={{
              padding: 20, borderRadius: 16,
              border: `2px dashed ${dragOver ? 'var(--ember)' : 'var(--border-strong)'}`,
              background: dragOver ? 'var(--ember-soft)' : 'transparent',
              display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer',
              transition: 'all 0.15s',
            }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--sand)', color: 'var(--ember)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              {I.upload}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 14 }}>Arraste novas fotos aqui</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>ou clique para escolher · JPG, PNG · até 10 MB cada</div>
            </div>
            <button className="btn-secondary" style={{ fontSize: 12 }}>escolher arquivos</button>
          </div>
        </div>

        {/* Right: info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <span className="chip">{p.category}</span>
              <span className={`chip ${p.status === 'active' ? 'chip-success' : 'chip-danger'}`}>{p.status === 'active' ? 'Ativo' : 'Inativo'}</span>
              <span className="mono" style={{ fontSize: 11, color: 'var(--text-subtle)' }}>{p.sku}</span>
            </div>
            <h2 className="display" style={{ margin: 0, fontSize: 36, fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1.05 }}>{p.name}</h2>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginTop: 12 }}>
              <div className="display grad-text" style={{ fontSize: 32, fontWeight: 700 }}>R$ {p.price.toFixed(2).replace('.', ',')}</div>
              <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>preço na vitrine</span>
            </div>
          </div>

          <div className="panel-solid" style={{ padding: 18 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
              {[
                { label: 'Estoque', value: p.stock, color: p.stock === 0 ? 'var(--danger)' : p.low ? 'var(--warn)' : 'var(--text)' },
                { label: 'Fotos', value: photos.length, color: 'var(--text)' },
                { label: 'Visitas 7d', value: 312, color: 'var(--aqua)' },
              ].map(s => (
                <div key={s.label}>
                  <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)' }}>{s.label}</div>
                  <div className="display" style={{ fontSize: 24, fontWeight: 700, color: s.color }}>{s.value}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="panel-solid" style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: 6 }}>Cor</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'var(--ember)', border: '1px solid var(--border)' }}/>
                <span style={{ fontSize: 14, fontWeight: 500 }}>{p.color}</span>
              </div>
            </div>
            <div>
              <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: 6 }}>Tamanhos disponíveis</div>
              <div style={{ display: 'flex', gap: 6 }}>
                {p.sizes.map(s => (
                  <div key={s} style={{ padding: '6px 14px', borderRadius: 10, border: '1px solid var(--border-strong)', fontWeight: 600, fontSize: 13 }}>{s}</div>
                ))}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: 6 }}>Descrição</div>
              <p style={{ margin: 0, fontSize: 13, lineHeight: 1.6, color: 'var(--text-muted)' }}>
                Biquíni frente-única com amarração ajustável, tecido importado com proteção UV 50+. Acompanha sacola reutilizável da coleção verão 2026.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn-primary" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
              {I.edit} Editar peça
            </button>
            <button className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              {I.share} Compartilhar
            </button>
            <button className="btn-secondary" style={{ color: 'var(--danger)', border: '1px solid var(--danger-bg)' }}>{I.trash}</button>
          </div>
        </div>
      </div>

      {/* History mini-timeline */}
      <div className="panel-solid" style={{ padding: 20, marginTop: 24 }}>
        <h3 className="display" style={{ margin: '0 0 14px', fontSize: 15, fontWeight: 600 }}>Histórico desta peça</h3>
        <div style={{ display: 'flex', gap: 10, overflowX: 'auto' }}>
          {[
            { label: 'Criado', date: '02 abr', type: 'CREATED' },
            { label: 'Publicado', date: '02 abr', type: 'SHARED' },
            { label: 'Estoque +20', date: '05 abr', type: 'UPDATED' },
            { label: 'Preço R$199 → R$189', date: '12 abr', type: 'UPDATED' },
            { label: 'Estoque 20 → 12', date: 'hoje', type: 'UPDATED' },
          ].map((e, i) => {
            const c = ACTIVITY_COLORS[e.type];
            return (
              <div key={i} style={{ flex: '0 0 auto', padding: '10px 14px', borderRadius: 12, background: 'var(--bg)', minWidth: 140, borderLeft: `3px solid ${c.fg}` }}>
                <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.08em', color: c.fg, fontWeight: 600 }}>{e.date}</div>
                <div style={{ fontSize: 13, fontWeight: 500, marginTop: 2 }}>{e.label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

const navBtn = (side) => ({
  position: 'absolute', top: '50%', transform: 'translateY(-50%)',
  [side]: 14, width: 36, height: 36, borderRadius: '50%',
  background: 'rgba(255,255,255,0.9)', border: 'none', cursor: 'pointer',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
});

Object.assign(window, { ProductDetail });
