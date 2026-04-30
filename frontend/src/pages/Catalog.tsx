import { useEffect, useState, useCallback } from 'react'
import { catalogService } from '../services/catalogService'
import { productService } from '../services/productService'
import type { CatalogSettings } from '../types/catalog'
import type { Product } from '../types/product'
import { Toast, type ToastType } from '../components/ui/Toast'
import { Skeleton } from '../components/ui/Skeleton'
import { resolvePhotoUrl } from '../utils/photoUrl'

interface ToastState { message: string; type: ToastType }

const CopyIcon = () => (
  <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
  </svg>
)
const EyeIcon = () => (
  <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
  </svg>
)
const WaIcon = () => (
  <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.5 3.5A11 11 0 005.5 19L4 22l3-1.5A11 11 0 1020.5 3.5z"/>
  </svg>
)
const IgIcon = () => (
  <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="18" cy="6" r="1" fill="currentColor"/>
  </svg>
)

const fieldLabel = { display: 'block', fontSize: 11, textTransform: 'uppercase' as const, letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: 6, fontWeight: 500, fontFamily: 'var(--font-body)' }
const fieldInput = { width: '100%', padding: '10px 12px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg)', fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--text)', outline: 'none' }

const TINTS = ['rgba(255,107,61,0.3)', 'rgba(30,203,225,0.3)', 'rgba(167,243,208,0.5)', 'rgba(255,244,232,0.8)', 'rgba(30,203,225,0.2)', 'rgba(255,107,61,0.2)']

export default function Catalog() {
  const [settings, setSettings] = useState<CatalogSettings | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<ToastState | null>(null)
  const [storeName, setStoreName] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [instagram, setInstagram] = useState('')

  const showToast = useCallback((message: string, type: ToastType = 'success') => setToast({ message, type }), [])

  useEffect(() => {
    const load = async () => {
      try {
        const [s, p] = await Promise.all([
          catalogService.getSettings(),
          productService.list({ active: true, limit: 100 }),
        ])
        setSettings(s)
        setStoreName(s.store_name || '')
        setWhatsapp(s.whatsapp || '')
        setInstagram(s.instagram || '')
        setProducts(p.products)
      } catch {
        try {
          const p = await productService.list({ active: true, limit: 100 })
          setProducts(p.products)
        } catch { /* ignore */ }
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      const updated = await catalogService.saveSettings({ store_name: storeName, whatsapp, instagram })
      setSettings(updated)
      showToast('Configurações salvas!')
    } catch {
      showToast('Erro ao salvar configurações.', 'error')
    } finally {
      setSaving(false)
    }
  }

  const shareUrl = settings?.slug ? `${window.location.origin}/c/${settings.slug}` : null

  const copyLink = async () => {
    if (!shareUrl) return
    try {
      await navigator.clipboard.writeText(shareUrl)
      showToast('Link copiado!')
    } catch {
      showToast('Erro ao copiar link.', 'error')
    }
  }

  if (loading) {
    return (
      <div style={{ padding: '22px 28px 40px', display: 'grid', gridTemplateColumns: '320px 1fr', gap: 22 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Skeleton className="h-32" />
          <Skeleton className="h-48" />
          <Skeleton className="h-24" />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12 }}>
          {[1,2,3,4,5,6].map(i => <Skeleton key={i} className="h-56" />)}
        </div>
      </div>
    )
  }

  return (
    <div className="reveal" style={{ padding: '22px 28px 40px', display: 'grid', gridTemplateColumns: '320px 1fr', gap: 22 }}>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Left: config sidebar */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Link panel */}
        <div className="panel-solid" style={{ padding: 20 }}>
          <div className="mono" style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: 10 }}>
            Link da vitrine
          </div>
          {shareUrl ? (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px', borderRadius: 10, background: 'var(--bg)', border: '1px solid var(--border)' }}>
                <span className="mono" style={{ flex: 1, fontSize: 11, color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {shareUrl.replace(/^https?:\/\//, '')}
                </span>
                <button onClick={copyLink} style={{ background: 'transparent', border: 'none', color: 'var(--ember)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                  <CopyIcon />
                </button>
              </div>
              <a href={shareUrl} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ width: '100%', marginTop: 12, justifyContent: 'center', gap: 6, textDecoration: 'none', display: 'flex' }}>
                <EyeIcon /> Visualizar vitrine
              </a>
            </>
          ) : (
            <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Salve as configurações para gerar o link.</p>
          )}
        </div>

        {/* Customization */}
        <div className="panel-solid" style={{ padding: 20 }}>
          <div className="mono" style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: 14 }}>
            Personalização
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={fieldLabel}>Nome da loja</label>
              <input value={storeName} onChange={e => setStoreName(e.target.value)} placeholder="Minha Loja" style={fieldInput}/>
            </div>
            <div>
              <label style={fieldLabel}>Cor de destaque</label>
              <div style={{ display: 'flex', gap: 8 }}>
                {['#FF6B3D', '#1ECBE1', '#A7F3D0', '#0F172A', '#E11D48'].map((c, i) => (
                  <div key={c} style={{ width: 28, height: 28, borderRadius: 8, background: c, cursor: 'pointer', border: i === 0 ? '2px solid var(--text)' : '2px solid transparent', transition: 'border 0.15s' }}/>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="panel-solid" style={{ padding: 20 }}>
          <div className="mono" style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: 14 }}>
            Contato
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div>
              <label style={fieldLabel}>WhatsApp</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#25D366', display: 'flex' }}><WaIcon /></span>
                <input value={whatsapp} onChange={e => setWhatsapp(e.target.value)} placeholder="+55 11 99999-9999" style={{ ...fieldInput, paddingLeft: 32 }}/>
              </div>
            </div>
            <div>
              <label style={fieldLabel}>Instagram</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#E4405F', display: 'flex' }}><IgIcon /></span>
                <input value={instagram} onChange={e => setInstagram(e.target.value)} placeholder="@minha_loja" style={{ ...fieldInput, paddingLeft: 32 }}/>
              </div>
            </div>
          </div>
        </div>

        <button onClick={handleSave} disabled={saving} className="btn-primary" style={{ justifyContent: 'center', width: '100%', padding: '12px' }}>
          {saving ? 'Salvando...' : 'Salvar configurações'}
        </button>
      </div>

      {/* Right: products grid */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div>
            <h2 className="display" style={{ margin: 0, fontSize: 20, fontWeight: 600 }}>Peças na vitrine</h2>
            <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>
              {products.length} peças ativas
            </div>
          </div>
        </div>

        {products.length === 0 ? (
          <div style={{ padding: '60px 20px', textAlign: 'center', borderRadius: 20, border: '1.5px dashed var(--border)', background: 'var(--bg-elev)', color: 'var(--text-muted)' }}>
            <p style={{ fontSize: 15, fontWeight: 500 }}>Nenhum produto ativo</p>
            <p style={{ fontSize: 13, marginTop: 4 }}>Ative produtos para exibi-los na vitrine.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12 }}>
            {products.map((p, i) => {
              const photo = p.photos?.[0]
              const isTop3 = i < 3
              return (
                <div key={p.id} className="panel-solid" style={{ padding: 0, overflow: 'hidden', position: 'relative' }}>
                  {isTop3 && (
                    <div style={{ position: 'absolute', top: 8, right: 8, zIndex: 2, padding: '2px 8px', borderRadius: 6, background: 'linear-gradient(135deg, var(--ember), var(--aqua))', color: 'white', fontSize: 9, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                      destaque
                    </div>
                  )}
                  <div style={{ aspectRatio: '4/5', overflow: 'hidden' }}>
                    {photo ? (
                      <img src={resolvePhotoUrl(photo.drive_file_id, 300)} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
                    ) : (
                      <div style={{ width: '100%', height: '100%', background: TINTS[i % TINTS.length], display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.08em', fontFamily: 'var(--font-mono)' }}>
                          {p.category?.slice(0, 3).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                  <div style={{ padding: 10 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between', marginTop: 3 }}>
                      <span>R$ {p.price.toFixed(0)}</span>
                      <span>{p.quantity} un.</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
