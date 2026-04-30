import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { productService } from '../services/productService'
import { historyService } from '../services/historyService'
import type { Product } from '../types/product'
import type { HistoryEntry } from '../types/history'
import { Skeleton } from '../components/ui/Skeleton'
import { ConfirmModal } from '../components/ui/ConfirmModal'
import { formatHistoryAction, formatHistoryDetails } from '../utils/historyFormat'
import { resolvePhotoUrl } from '../utils/photoUrl'

const EditIcon = () => (
  <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
    <path d="M18.5 2.5a2.12 2.12 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
)
const TrashIcon = () => (
  <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
  </svg>
)
const ChevLIcon = () => (
  <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
)
const ChevRIcon = () => (
  <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
)
const UploadIcon = () => (
  <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
    <path d="M17 8l-5-5-5 5M12 3v12"/>
  </svg>
)

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

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [product, setProduct] = useState<Product | null>(null)
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [activeSlide, setActiveSlide] = useState(0)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [uploadRef] = useState(() => ({ current: null as HTMLInputElement | null }))

  useEffect(() => {
    if (!id) return
    Promise.all([
      productService.getById(id),
      historyService.listByProduct(id, { limit: 8 }),
    ]).then(([p, h]) => {
      setProduct(p)
      setHistory(h.entries)
    }).finally(() => setLoading(false))
  }, [id])

  const handleDelete = async () => {
    if (!id) return
    await productService.delete(id)
    navigate('/products')
  }

  const handleToggleActive = async () => {
    if (!id) return
    const updated = await productService.toggleActive(id)
    setProduct(updated)
    const h = await historyService.listByProduct(id, { limit: 8 })
    setHistory(h.entries)
  }

  const handleUploadPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!id || !e.target.files?.[0]) return
    try {
      await productService.uploadPhoto(id, e.target.files[0])
      const updated = await productService.getById(id)
      setProduct(updated)
    } catch { /* ignore */ }
  }

  if (loading) {
    return (
      <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Skeleton className="h-8 w-56" />
        <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 20 }}>
          <Skeleton className="h-80" />
          <Skeleton className="h-80" />
        </div>
      </div>
    )
  }
  if (!product) {
    return (
      <div style={{ padding: '24px 28px', textAlign: 'center', color: 'var(--text-muted)' }}>
        Produto não encontrado
      </div>
    )
  }

  const photos = product.photos || []

  return (
    <div className="reveal" style={{ padding: '24px 28px 40px' }}>
      {showDeleteModal && (
        <ConfirmModal
          title="Remover produto"
          description={`O produto "${product.name}" será removido permanentemente junto com suas fotos e dados. Essa ação não pode ser desfeita.`}
          confirmLabel="Remover"
          cancelLabel="Cancelar"
          variant="danger"
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 24, alignItems: 'start' }}>
        {/* Left: Photo carousel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {/* Main image */}
          <div className="panel-solid" style={{ padding: 0, overflow: 'hidden', borderRadius: 20 }}>
            <div style={{ position: 'relative', aspectRatio: '4/5', background: 'var(--bg)' }}>
              {photos.length > 0 ? (
                <img
                  src={resolvePhotoUrl(photos[activeSlide]?.drive_file_id || '', 800)}
                  alt={`Foto ${activeSlide + 1}`}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12, color: 'var(--text-subtle)' }}>
                  <svg width={48} height={48} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1} strokeLinecap="round" strokeLinejoin="round">
                    <path d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z"/>
                  </svg>
                  <span style={{ fontSize: 13, fontWeight: 500 }}>Nenhuma foto</span>
                </div>
              )}

              {photos.length > 1 && (
                <>
                  <button type="button" onClick={() => setActiveSlide(s => s === 0 ? photos.length - 1 : s - 1)}
                    style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,255,255,0.9)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)', boxShadow: 'var(--shadow-panel)' }}>
                    <ChevLIcon />
                  </button>
                  <button type="button" onClick={() => setActiveSlide(s => s === photos.length - 1 ? 0 : s + 1)}
                    style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,255,255,0.9)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)', boxShadow: 'var(--shadow-panel)' }}>
                    <ChevRIcon />
                  </button>
                  <div style={{ position: 'absolute', bottom: 12, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 5 }}>
                    {photos.map((_, i) => (
                      <button key={i} type="button" onClick={() => setActiveSlide(i)} style={{ width: i === activeSlide ? 18 : 6, height: 6, borderRadius: 3, background: i === activeSlide ? 'white' : 'rgba(255,255,255,0.5)', border: 'none', cursor: 'pointer', transition: 'all 0.2s', padding: 0 }}/>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Thumbnails */}
          {photos.length > 1 && (
            <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 2 }}>
              {photos.map((photo, i) => (
                <button key={photo.id} type="button" onClick={() => setActiveSlide(i)} style={{
                  width: 64, height: 64, flexShrink: 0, borderRadius: 10, overflow: 'hidden',
                  border: `2px solid ${i === activeSlide ? 'var(--ember)' : 'var(--border)'}`,
                  cursor: 'pointer', padding: 0, opacity: i === activeSlide ? 1 : 0.65, transition: 'all 0.15s',
                }}>
                  <img src={resolvePhotoUrl(photo.drive_file_id, 120)} alt={`Miniatura ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
                </button>
              ))}

              {/* Add photo slot */}
              <label style={{
                width: 64, height: 64, flexShrink: 0, borderRadius: 10,
                border: '1.5px dashed var(--border)', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--text-subtle)', background: 'var(--bg)',
              }}>
                <input ref={r => { uploadRef.current = r }} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleUploadPhoto}/>
                <span style={{ fontSize: 20, lineHeight: 1 }}>+</span>
              </label>
            </div>
          )}

          {/* Upload zone */}
          <label className="panel-solid" style={{
            padding: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column',
            gap: 10, cursor: 'pointer', border: '1.5px dashed var(--border)', borderRadius: 16,
            color: 'var(--text-muted)', transition: 'border-color 0.15s',
          }}
          onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = 'var(--ember)'}
          onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'}>
            <input type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={handleUploadPhoto}/>
            <UploadIcon />
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 13, fontWeight: 500 }}>Adicionar fotos</div>
              <div style={{ fontSize: 11, color: 'var(--text-subtle)', marginTop: 2 }}>clique ou arraste aqui</div>
            </div>
          </label>
        </div>

        {/* Right: Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Header */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <span className={`chip ${product.active ? 'chip-success' : 'chip-danger'}`}>{product.active ? 'Ativo' : 'Inativo'}</span>
              <span className="chip">{product.category}</span>
            </div>
            <h1 className="display" style={{ margin: 0, fontSize: 28, fontWeight: 700, letterSpacing: '-0.02em' }}>{product.name}</h1>
            <div className="grad-text display" style={{ fontSize: 24, fontWeight: 700, marginTop: 6 }}>
              R$ {product.price.toFixed(2).replace('.', ',')}
            </div>
          </div>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
            {[
              { label: 'Estoque', value: product.quantity, color: product.quantity === 0 ? 'var(--danger)' : product.quantity <= 3 ? 'var(--warn)' : 'var(--success)' },
              { label: 'Fotos', value: photos.length, color: 'var(--text)' },
              { label: 'Histórico', value: history.length, color: 'var(--text)' },
            ].map(stat => (
              <div key={stat.label} style={{ padding: '12px 14px', borderRadius: 14, background: 'var(--bg-elev)', border: '1px solid var(--border)', textAlign: 'center' }}>
                <div className="display" style={{ fontSize: 22, fontWeight: 700, color: stat.color }}>{stat.value}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Info */}
          <div className="panel-solid" style={{ padding: 18 }}>
            <h3 className="display" style={{ margin: '0 0 12px', fontSize: 14, fontWeight: 600 }}>Informações</h3>
            <dl style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { label: 'Cor', value: product.color },
                product.size ? { label: 'Tamanho', value: product.size } : null,
                product.measurement ? { label: 'Medida', value: product.measurement } : null,
                product.description ? { label: 'Descrição', value: product.description } : null,
              ].filter(Boolean).map(row => (
                <div key={row!.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <dt style={{ fontSize: 13, color: 'var(--text-muted)' }}>{row!.label}</dt>
                  <dd style={{ fontSize: 13, fontWeight: 500, margin: 0, maxWidth: '60%', textAlign: 'right' }}>{row!.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: 8 }}>
            <Link to={`/products/${id}/edit`} className="btn-primary" style={{ flex: 1, justifyContent: 'center', gap: 6, textDecoration: 'none' }}>
              <EditIcon /> Editar
            </Link>
            <button onClick={handleToggleActive} className="btn-secondary" style={{ padding: '10px 14px', fontSize: 13 }}>
              {product.active ? 'Inativar' : 'Ativar'}
            </button>
            <button onClick={() => setShowDeleteModal(true)} style={{
              padding: '10px 12px', borderRadius: 12, border: '1px solid var(--danger-bg)',
              background: 'var(--danger-bg)', color: 'var(--danger)', cursor: 'pointer', display: 'flex', alignItems: 'center',
            }}>
              <TrashIcon />
            </button>
          </div>

          {/* Mini history */}
          {history.length > 0 && (
            <div className="panel-solid" style={{ padding: 18 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <h3 className="display" style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>Histórico recente</h3>
                <Link to="/history" style={{ fontSize: 11, color: 'var(--ember)', textDecoration: 'none', fontWeight: 600 }}>ver tudo</Link>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {history.map(entry => {
                  const c = actionColors(entry.action)
                  const details = formatHistoryDetails(entry.action, entry.details)
                  return (
                    <div key={entry.id} style={{ display: 'flex', gap: 10, padding: '8px 10px', borderRadius: 10, background: 'var(--bg)', borderLeft: `3px solid ${c.fg}` }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span style={{ padding: '2px 6px', borderRadius: 4, background: c.bg, color: c.fg, fontSize: 10, fontWeight: 600, textTransform: 'uppercase' }}>{c.label}</span>
                          <span style={{ fontSize: 11, color: 'var(--text-subtle)' }}>
                            {new Date(entry.created_at).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        {details.length > 0 && <p style={{ margin: '3px 0 0', fontSize: 12, color: 'var(--text-muted)' }}>{details[0]}</p>}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
