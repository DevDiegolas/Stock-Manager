import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { productService } from '../services/productService'
import type { Product } from '../types/product'
import { Skeleton } from '../components/ui/Skeleton'
import { resolvePhotoUrl } from '../utils/photoUrl'

type ActiveFilter = 'all' | 'active' | 'inactive'
type ViewMode = 'table' | 'grid' | 'gallery'

const SearchIcon = () => (
  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
  </svg>
)
const PlusIcon = () => (
  <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 5v14M5 12h14"/>
  </svg>
)
const RowsIcon = () => (
  <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
  </svg>
)
const GridIcon = () => (
  <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
    <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
  </svg>
)
const GalleryIcon = () => (
  <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
    <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
  </svg>
)
const ChevLIcon = () => (
  <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
)
const ChevRIcon = () => (
  <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
)

const TINTS = [
  'rgba(255,107,61,0.3)', 'rgba(30,203,225,0.3)', 'rgba(167,243,208,0.5)',
  'rgba(255,244,232,0.8)', 'rgba(30,203,225,0.2)', 'rgba(255,107,61,0.2)',
]

function ProductImage({ product, index, className }: { product: Product; index: number; className?: string }) {
  const photo = product.photos?.[0]
  if (photo) {
    return <img src={resolvePhotoUrl(photo.drive_file_id, 200)} alt={product.name} className={className} style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
  }
  return (
    <div style={{ width: '100%', height: '100%', background: TINTS[index % TINTS.length], display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.08em', fontFamily: 'var(--font-mono)' }}>
        {product.category?.slice(0, 3).toUpperCase()}
      </span>
    </div>
  )
}

const GALLERY_PATTERNS = [
  { col: 'span 2', row: 'span 2' }, { col: 'span 1', row: 'span 1' }, { col: 'span 1', row: 'span 1' },
  { col: 'span 1', row: 'span 2' }, { col: 'span 2', row: 'span 1' }, { col: 'span 1', row: 'span 1' },
  { col: 'span 1', row: 'span 1' }, { col: 'span 1', row: 'span 1' }, { col: 'span 2', row: 'span 1' },
  { col: 'span 1', row: 'span 1' },
]

const CATEGORIES = ['Biquíni', 'Calcinha', 'Sunga', 'Maiô', 'Saída']

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState<Product[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [viewMode, setViewMode] = useState<ViewMode>('table')
  const [category, setCategory] = useState('Todas')
  const [loading, setLoading] = useState(true)

  const filterParam = searchParams.get('filter')
  const filter: ActiveFilter = filterParam === 'active' || filterParam === 'inactive' ? filterParam : 'all'

  const setFilter = (f: ActiveFilter) => {
    if (f === 'all') searchParams.delete('filter')
    else searchParams.set('filter', f)
    setSearchParams(searchParams, { replace: true })
    setPage(1)
  }

  const loadProducts = async (p: number, s: string, f: ActiveFilter) => {
    setLoading(true)
    try {
      const params: { page: number; limit: number; search: string; active?: boolean } = { page: p, limit: 20, search: s }
      if (f === 'active')   params.active = true
      if (f === 'inactive') params.active = false
      const resp = await productService.list(params)
      setProducts(resp.products)
      setTotal(resp.total)
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadProducts(page, search, filter) }, [page, search, filter])

  const totalPages = Math.ceil(total / 20)
  const filtered = category === 'Todas' ? products : products.filter(p => p.category === category)

  const viewModes = [
    { id: 'table' as ViewMode, icon: <RowsIcon />, label: 'tabela' },
    { id: 'grid' as ViewMode, icon: <GridIcon />, label: 'grade' },
    { id: 'gallery' as ViewMode, icon: <GalleryIcon />, label: 'galeria' },
  ]

  return (
    <div className="reveal" style={{ padding: '22px 28px 40px', display: 'flex', flexDirection: 'column', gap: 18 }}>
      {/* Toolbar */}
      <div className="panel-solid" style={{ padding: 14, display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        {/* Search */}
        <div style={{ position: 'relative', flex: '1 1 240px', minWidth: 200 }}>
          <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-subtle)', display: 'flex' }}>
            <SearchIcon />
          </span>
          <input
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1) }}
            placeholder="buscar peça, cor, categoria…"
            style={{
              width: '100%', padding: '10px 12px 10px 36px', borderRadius: 10,
              border: '1px solid var(--border)', background: 'var(--bg)',
              fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--text)',
              outline: 'none',
            }}
          />
        </div>

        {/* Category chips */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {['Todas', ...CATEGORIES].map(c => (
            <button key={c} onClick={() => setCategory(c)} className={`chip ${category === c ? 'active' : ''}`} style={{ cursor: 'pointer' }}>
              {c}
            </button>
          ))}
        </div>

        {/* Status filter */}
        <div style={{ display: 'flex', gap: 4 }}>
          {(['all', 'active', 'inactive'] as ActiveFilter[]).map(f => {
            const labels = { all: 'Todos', active: 'Ativos', inactive: 'Inativos' }
            const colors = { all: 'var(--night)', active: 'var(--success)', inactive: 'var(--danger)' }
            const isActive = filter === f
            return (
              <button key={f} onClick={() => setFilter(f)} style={{
                padding: '6px 12px', borderRadius: 8, border: `1px solid ${isActive ? colors[f] : 'var(--border)'}`,
                background: isActive ? colors[f] : 'transparent',
                color: isActive ? 'white' : 'var(--text-muted)',
                fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 500, cursor: 'pointer',
                transition: 'all 0.15s',
              }}>{labels[f]}</button>
            )
          })}
        </div>

        <div style={{ flex: 1 }}/>

        {/* View mode toggle */}
        <div style={{ display: 'flex', gap: 2, padding: 3, background: 'var(--bg)', borderRadius: 10, border: '1px solid var(--border)' }}>
          {viewModes.map(v => (
            <button key={v.id} onClick={() => setViewMode(v.id)} title={v.label} style={{
              padding: '6px 10px', borderRadius: 8, border: 'none', cursor: 'pointer',
              background: viewMode === v.id ? 'var(--bg-elev-strong)' : 'transparent',
              color: viewMode === v.id ? 'var(--text)' : 'var(--text-muted)',
              boxShadow: viewMode === v.id ? 'var(--shadow-panel)' : 'none',
              display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 500,
              fontFamily: 'var(--font-body)', transition: 'all 0.15s',
            }}>
              {v.icon} {v.label}
            </button>
          ))}
        </div>

        <Link to="/products/new" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 6, textDecoration: 'none' }}>
          <PlusIcon /> Nova peça
        </Link>
      </div>

      {/* Content */}
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[1,2,3,4].map(i => <Skeleton key={i} className="h-14" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ padding: '60px 20px', textAlign: 'center', borderRadius: 20, border: '1.5px dashed var(--border)', background: 'var(--bg-elev)' }}>
          <p style={{ fontSize: 15, fontWeight: 500, color: 'var(--text-muted)' }}>Nenhuma peça encontrada</p>
          <Link to="/products/new" style={{ color: 'var(--ember)', fontWeight: 600, textDecoration: 'none', fontSize: 13, marginTop: 4, display: 'inline-block' }}>
            Adicionar primeira peça
          </Link>
        </div>
      ) : viewMode === 'table' ? (
        /* TABLE */
        <div className="panel-solid" style={{ overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--bg)' }}>
                {['Peça', 'Categoria', 'Cor · Tam', 'Status', 'Estoque', 'Preço'].map((h, i) => (
                  <th key={h} style={{ padding: '14px 18px', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', textAlign: i >= 4 ? 'right' : 'left', fontFamily: 'var(--font-body)' }}>{h}</th>
                ))}
                <th style={{ width: 40 }}/>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p, i) => (
                <tr key={p.id}
                  style={{ borderTop: '1px solid var(--border)', cursor: 'pointer', transition: 'background 0.12s' }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'var(--row-hover)'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
                  onClick={() => window.location.href = `/products/${p.id}`}
                >
                  <td style={{ padding: '12px 18px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 44, height: 44, borderRadius: 10, overflow: 'hidden', flexShrink: 0 }}>
                        <ProductImage product={p} index={i} />
                      </div>
                      <div>
                        <div style={{ fontWeight: 500, fontSize: 14 }}>{p.name}</div>
                        <div className="mono" style={{ fontSize: 10, color: 'var(--text-subtle)' }}>#{p.id.slice(-6).toUpperCase()}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '12px 18px' }}>
                    <span className="chip" style={{ fontSize: 11 }}>{p.category}</span>
                  </td>
                  <td style={{ padding: '12px 18px', fontSize: 13 }}>
                    <div>{p.color}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{p.size || p.measurement || '—'}</div>
                  </td>
                  <td style={{ padding: '12px 18px' }}>
                    <span className={p.active ? 'chip chip-success' : 'chip chip-danger'}>
                      {p.active ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td style={{ padding: '12px 18px', textAlign: 'right' }}>
                    <span style={{ fontWeight: 600, color: p.quantity === 0 ? 'var(--danger)' : p.quantity <= 3 ? 'var(--warn)' : 'var(--text)' }}>
                      {p.quantity}
                    </span>
                    {p.quantity === 0 && <div style={{ fontSize: 9, color: 'var(--danger)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>zerado</div>}
                    {p.quantity > 0 && p.quantity <= 3 && <div style={{ fontSize: 9, color: 'var(--warn)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>baixo</div>}
                  </td>
                  <td style={{ padding: '12px 18px', textAlign: 'right', fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 14 }}>
                    R$ {p.price.toFixed(2).replace('.', ',')}
                  </td>
                  <td style={{ padding: '12px 18px', textAlign: 'right', color: 'var(--text-subtle)' }}>
                    <ChevRIcon />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : viewMode === 'grid' ? (
        /* GRID */
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
          {filtered.map((p, i) => (
            <Link key={p.id} to={`/products/${p.id}`} className="panel-solid" style={{
              padding: 0, overflow: 'hidden', cursor: 'pointer', textDecoration: 'none', color: 'inherit',
              transition: 'transform 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.transform = 'none'}>
              <div style={{ position: 'relative', aspectRatio: '1/1', overflow: 'hidden' }}>
                <ProductImage product={p} index={i} />
                {p.quantity === 0 && (
                  <div style={{ position: 'absolute', top: 10, left: 10 }}>
                    <span className="chip chip-danger" style={{ fontSize: 10 }}>zerado</span>
                  </div>
                )}
                {p.quantity > 0 && p.quantity <= 3 && (
                  <div style={{ position: 'absolute', top: 10, left: 10 }}>
                    <span className="chip chip-warn" style={{ fontSize: 10 }}>estoque baixo</span>
                  </div>
                )}
                <div style={{ position: 'absolute', top: 10, right: 10, padding: '3px 8px', borderRadius: 999, background: 'rgba(255,255,255,0.92)', fontSize: 10, fontWeight: 600, backdropFilter: 'blur(4px)' }}>
                  {(p.photos?.length || 0)} fotos
                </div>
              </div>
              <div style={{ padding: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, alignItems: 'flex-start' }}>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontWeight: 500, fontSize: 14, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</div>
                    <div className="mono" style={{ fontSize: 10, color: 'var(--text-subtle)' }}>#{p.id.slice(-6).toUpperCase()}</div>
                  </div>
                  <span className={`chip ${p.active ? 'chip-success' : 'chip-danger'}`} style={{ fontSize: 10, flexShrink: 0 }}>
                    {p.active ? '●' : '○'}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 10 }}>
                  <div className="display" style={{ fontSize: 16, fontWeight: 600 }}>R$ {p.price.toFixed(0)}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{p.quantity} un.</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        /* GALLERY */
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gridAutoRows: '180px', gap: 12 }}>
          {filtered.map((p, i) => {
            const pat = GALLERY_PATTERNS[i % GALLERY_PATTERNS.length]
            return (
              <Link key={p.id} to={`/products/${p.id}`} style={{
                gridColumn: pat.col, gridRow: pat.row,
                borderRadius: 16, overflow: 'hidden', cursor: 'pointer',
                position: 'relative', textDecoration: 'none', display: 'block',
              }}>
                <div style={{ position: 'absolute', inset: 0 }}>
                  <ProductImage product={p} index={i} />
                </div>
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 45%, rgba(15,23,42,0.75) 100%)' }}/>
                <div style={{ position: 'absolute', left: 12, bottom: 10, right: 12, color: 'white' }}>
                  <div className="display" style={{ fontSize: 15, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, opacity: 0.8 }}>
                    <span>{p.color}</span>
                    <span>R$ {p.price.toFixed(0)} · {p.quantity} un.</span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 4px' }}>
          <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{total} peças no total</div>
          <div style={{ display: 'flex', gap: 4 }}>
            <button className="chip" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={{ cursor: 'pointer', opacity: page === 1 ? 0.4 : 1 }}>
              <ChevLIcon />
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1).map(n => (
              <button key={n} onClick={() => setPage(n)} className={`chip ${n === page ? 'active' : ''}`} style={{ cursor: 'pointer', minWidth: 32, justifyContent: 'center' }}>
                {n}
              </button>
            ))}
            <button className="chip" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} style={{ cursor: 'pointer', opacity: page === totalPages ? 0.4 : 1 }}>
              <ChevRIcon />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
