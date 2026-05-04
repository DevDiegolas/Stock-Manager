import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { productService } from '../services/productService'
import { historyService } from '../services/historyService'
import type { Product } from '../types/product'
import type { HistoryEntry } from '../types/history'
import { Skeleton } from '../components/ui/Skeleton'
import { formatHistoryAction } from '../utils/historyFormat'

const TrendIcon = () => (
  <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M23 6l-9.5 9.5-5-5L1 18"/><path d="M17 6h6v6"/>
  </svg>
)
const PlusIcon = () => (
  <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 5v14M5 12h14"/>
  </svg>
)
const ShareIcon = () => (
  <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
    <path d="M8.6 13.5l6.9 4M15.5 6.5L8.6 10.5"/>
  </svg>
)
const EyeIcon = () => (
  <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
  </svg>
)
const WarnIcon = () => (
  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.3 3.9L1.8 18a2 2 0 001.7 3h17a2 2 0 001.7-3L13.7 3.9a2 2 0 00-3.4 0z"/>
    <path d="M12 9v4M12 17h.01"/>
  </svg>
)
const ChevRIcon = () => (
  <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6"/>
  </svg>
)

function Sparkline({ data, color = '#FF6B3D', height = 56, width = 300 }: { data: number[], color?: string, height?: number, width?: number }) {
  if (data.length < 2) return null
  const max = Math.max(...data), min = Math.min(...data)
  const range = max - min || 1
  const step = width / (data.length - 1)
  const pts = data.map((v, i) => [i * step, height - ((v - min) / range) * height * 0.78 - 4] as [number, number])
  const path = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ')
  const area = `${path} L${width},${height} L0,${height} Z`
  const last = pts[pts.length - 1]
  const gradId = `spk-${color.replace(/[^a-z0-9]/gi, '')}`
  return (
    <svg width={width} height={height} style={{ display: 'block', overflow: 'visible' }}>
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={color} stopOpacity="0.22"/>
          <stop offset="1" stopColor={color} stopOpacity="0"/>
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${gradId})`}/>
      <path d={path} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx={last[0]} cy={last[1]} r="3" fill={color}/>
      <circle cx={last[0]} cy={last[1]} r="6" fill={color} opacity="0.18"/>
    </svg>
  )
}

function actionColors(action: string) {
  const map: Record<string, { bg: string; fg: string; label: string }> = {
    PRODUCT_CREATED:     { bg: 'var(--success-bg)', fg: 'var(--success)', label: 'Criado' },
    PRODUCT_UPDATED:     { bg: 'var(--aqua-soft)',  fg: 'var(--aqua)',    label: 'Atualizado' },
    PRODUCT_DELETED:     { bg: 'var(--danger-bg)',  fg: 'var(--danger)',  label: 'Removido' },
    PRODUCT_ACTIVATED:   { bg: 'var(--success-bg)', fg: 'var(--success)', label: 'Ativado' },
    PRODUCT_DEACTIVATED: { bg: 'var(--warn-bg)',    fg: 'var(--warn)',    label: 'Inativado' },
    QUANTITY_ADDED:      { bg: 'var(--success-bg)', fg: 'var(--success)', label: 'Entrada' },
    QUANTITY_REMOVED:    { bg: 'var(--ember-soft)', fg: 'var(--ember)',   label: 'Saída' },
  }
  return map[action] || { bg: 'var(--border)', fg: 'var(--text-muted)', label: action }
}

const SPARK_DATA = [18, 22, 19, 28, 34, 30, 38, 42, 35, 48, 52, 44, 58, 61]

export default function Dashboard() {
  const [stats, setStats] = useState({ total: 0, active: 0, inactive: 0 })
  const [lowStock, setLowStock] = useState<Product[]>([])
  const [outOfStock, setOutOfStock] = useState<Product[]>([])
  const [topProducts, setTopProducts] = useState<Product[]>([])
  const [activity, setActivity] = useState<HistoryEntry[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const load = async () => {
      try {
        const [all, active, products, hist] = await Promise.all([
          productService.list({ limit: 1 }),
          productService.list({ limit: 1, active: true }),
          productService.list({ limit: 100, active: true }),
          historyService.list({ page: 1, limit: 6 }),
        ])
        const allProds = products.products
        setStats({ total: all.total, active: active.total, inactive: all.total - active.total })
        setLowStock(allProds.filter(p => p.quantity > 0 && p.quantity <= 3))
        setOutOfStock(allProds.filter(p => p.quantity === 0))
        setTopProducts(allProds.slice(0, 5))
        setActivity(hist.entries)
      } catch {
        // ignore
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) {
    return (
      <div style={{ padding: '24px 28px 40px', display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr', gap: 16 }}>
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 16 }}>
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      </div>
    )
  }

  return (
    <div className="reveal" style={{ padding: '24px 28px 40px', display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Hero band */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr', gap: 16 }}>
        {/* Main stat */}
        <div className="panel-solid" style={{ padding: 24, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, right: 0, width: 200, height: 200, background: 'radial-gradient(circle, rgba(255,107,61,0.15), transparent 70%)', pointerEvents: 'none' }}/>
          <div className="mono" style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--text-muted)', marginBottom: 8 }}>
            Produtos · visão geral
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
            <div className="display" style={{ fontSize: 48, fontWeight: 700, letterSpacing: '-0.04em', lineHeight: 1 }}>
              {stats.total}
            </div>
            {stats.active > 0 && (
              <div className="chip chip-success" style={{ gap: 4, display: 'inline-flex', alignItems: 'center' }}>
                <TrendIcon /> {stats.active} ativos
              </div>
            )}
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>
            produtos cadastrados · {stats.inactive} inativos
          </div>
          <div style={{ marginTop: 16, marginLeft: -4 }}>
            <Sparkline data={SPARK_DATA} color="#FF6B3D" width={300} height={56}/>
          </div>
        </div>

        {/* Low stock */}
        <div className="panel-solid" style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 30, height: 30, borderRadius: 8, background: 'var(--warn-bg)', color: 'var(--warn)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <WarnIcon />
            </div>
            <div className="mono" style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)' }}>Atenção</div>
          </div>
          <div>
            <div className="display" style={{ fontSize: 32, fontWeight: 700, letterSpacing: '-0.03em' }}>{lowStock.length}</div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>peças com estoque baixo</div>
          </div>
          {lowStock.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12 }}>
              {lowStock.slice(0, 2).map(p => (
                <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 10px', borderRadius: 8, background: 'var(--bg)' }}>
                  <span style={{ fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 120 }}>{p.name}</span>
                  <span style={{ color: 'var(--warn)', fontWeight: 600, flexShrink: 0 }}>{p.quantity} un.</span>
                </div>
              ))}
            </div>
          )}
          <button className="btn-secondary" onClick={() => navigate('/products')} style={{ fontSize: 12, padding: '8px' }}>
            Ver todos
          </button>
        </div>

        {/* Out of stock */}
        <div className="panel-solid" style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 12, background: 'linear-gradient(160deg, var(--night), var(--slate))', color: 'white', border: 'none' }}>
          <div className="mono" style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.5)' }}>Sem estoque</div>
          <div>
            <div className="display" style={{ fontSize: 32, fontWeight: 700, letterSpacing: '-0.03em' }}>{outOfStock.length}</div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>peças ativas zeradas</div>
          </div>
          {outOfStock.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12 }}>
              {outOfStock.slice(0, 2).map(p => (
                <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 10px', borderRadius: 8, background: 'rgba(255,255,255,0.06)' }}>
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 120 }}>{p.name}</span>
                  <span style={{ color: '#FB7185', fontWeight: 600, flexShrink: 0 }}>0</span>
                </div>
              ))}
            </div>
          )}
          <Link to="/products/new" style={{ display: 'block', padding: '8px', borderRadius: 10, background: 'linear-gradient(135deg, var(--ember), var(--aqua))', color: 'white', border: 'none', fontSize: 12, fontWeight: 600, cursor: 'pointer', textAlign: 'center', textDecoration: 'none' }}>
            Repor estoque
          </Link>
        </div>
      </div>

      {/* Middle: top products + activity */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 16 }}>
        {/* Top products */}
        <div className="panel-solid" style={{ padding: 22 }}>
          <div style={{ marginBottom: 16 }}>
            <h3 className="display" style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>Top produtos</h3>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>por quantidade em estoque</div>
          </div>
          {topProducts.length === 0 ? (
            <div style={{ fontSize: 13, color: 'var(--text-muted)', padding: '16px 0' }}>Nenhum produto ativo ainda.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {topProducts.map((p, i) => {
                const max = topProducts[0]?.quantity || 1
                const pct = Math.max(8, (p.quantity / max) * 100)
                const tints = ['rgba(255,107,61,0.3)', 'rgba(30,203,225,0.3)', 'rgba(167,243,208,0.5)', 'rgba(255,244,232,0.8)', 'rgba(30,203,225,0.2)']
                return (
                  <Link key={p.id} to={`/products/${p.id}`} style={{ display: 'grid', gridTemplateColumns: '24px 44px 1fr 90px 60px', alignItems: 'center', gap: 12, textDecoration: 'none', color: 'inherit' }}>
                    <div className="mono" style={{ fontSize: 11, color: 'var(--text-subtle)', fontWeight: 500 }}>0{i + 1}</div>
                    <div style={{ width: 44, height: 44, borderRadius: 10, overflow: 'hidden', background: tints[i], display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 600, color: 'var(--text-muted)' }}>
                      {p.category?.slice(0, 3).toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontWeight: 500, fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{p.category} · {p.color}</div>
                    </div>
                    <div style={{ position: 'relative', height: 6, borderRadius: 4, background: 'var(--bg)', overflow: 'hidden' }}>
                      <div style={{ position: 'absolute', inset: 0, width: `${pct}%`, background: 'linear-gradient(90deg, var(--ember), var(--aqua))', borderRadius: 4 }}/>
                    </div>
                    <div style={{ fontSize: 12, textAlign: 'right', fontWeight: 600 }}>
                      {p.quantity} <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>un.</span>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>

        {/* Activity feed */}
        <div className="panel-solid" style={{ padding: 22 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 className="display" style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>Atividade recente</h3>
            <Link to="/history" style={{ fontSize: 12, color: 'var(--ember)', fontWeight: 600, textDecoration: 'none' }}>
              ver tudo →
            </Link>
          </div>
          {activity.length === 0 ? (
            <div style={{ fontSize: 13, color: 'var(--text-muted)', padding: '16px 0' }}>Nenhuma atividade registrada ainda.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {activity.map((a, i) => {
                const c = actionColors(a.action)
                return (
                  <div key={a.id} style={{ display: 'flex', gap: 12, padding: '8px 0', position: 'relative' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                      <div style={{ width: 10, height: 10, borderRadius: '50%', background: c.fg, border: '2px solid var(--bg-elev-strong)', zIndex: 1, marginTop: 3 }}/>
                      {i < activity.length - 1 && <div style={{ width: 1, flex: 1, background: 'var(--border)', marginTop: 2 }}/>}
                    </div>
                    <div style={{ flex: 1, minWidth: 0, paddingBottom: 6 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                        <span style={{ padding: '2px 7px', borderRadius: 4, background: c.bg, color: c.fg, fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                          {c.label}
                        </span>
                      </div>
                      <div style={{ fontSize: 13, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {formatHistoryAction(a.action)}
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--text-subtle)', marginTop: 1 }}>
                        {new Date(a.created_at).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Quick actions */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {[
          { icon: <PlusIcon />, title: 'Cadastrar peça', sub: 'adicionar ao estoque', to: '/products/new' },
          { icon: <ShareIcon />, title: 'Compartilhar vitrine', sub: 'link do catálogo público', to: '/catalog' },
          { icon: <EyeIcon />, title: 'Ver catálogo', sub: 'visualize como cliente', to: '/catalog' },
        ].map((q, i) => (
          <Link key={i} to={q.to} className="panel-solid" style={{ padding: 18, display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer', textDecoration: 'none', color: 'inherit', transition: 'transform 0.15s', borderRadius: 20 }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.transform = 'none'}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: 'var(--sand)', color: 'var(--ember)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              {q.icon}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{q.title}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{q.sub}</div>
            </div>
            <ChevRIcon />
          </Link>
        ))}
      </div>
    </div>
  )
}
