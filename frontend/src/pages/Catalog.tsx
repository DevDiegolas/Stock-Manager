import { useEffect, useState, useCallback } from 'react'
import { catalogService } from '../services/catalogService'
import { productService } from '../services/productService'
import type { CatalogSettings } from '../types/catalog'
import type { Product } from '../types/product'
import { CatalogProductCard } from '../components/catalog/CatalogProductCard'
import { Toast, type ToastType } from '../components/ui/Toast'
import { Skeleton } from '../components/ui/Skeleton'

interface ToastState {
  message: string
  type: ToastType
}

export default function Catalog() {
  const [settings, setSettings] = useState<CatalogSettings | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<ToastState | null>(null)

  const [storeName, setStoreName] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [instagram, setInstagram] = useState('')

  const showToast = useCallback((message: string, type: ToastType = 'success') => {
    setToast({ message, type })
  }, [])

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
        // Settings may not exist yet
        try {
          const p = await productService.list({ active: true, limit: 100 })
          setProducts(p.products)
        } catch {
          // ignore
        }
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      const updated = await catalogService.saveSettings({
        store_name: storeName,
        whatsapp: whatsapp,
        instagram: instagram,
      })
      setSettings(updated)
      showToast('Configurações salvas com sucesso!')
    } catch {
      showToast('Erro ao salvar configurações.', 'error')
    } finally {
      setSaving(false)
    }
  }

  const shareUrl = settings?.slug
    ? `${window.location.origin}/c/${settings.slug}`
    : null

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
      <div className="page-shell space-y-5">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-48" />
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-80" />
          <Skeleton className="h-80" />
          <Skeleton className="h-80" />
        </div>
      </div>
    )
  }

  return (
    <div className="page-shell">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="mb-6">
        <span className="pill-badge">Vitrine</span>
        <h1 className="page-title mt-3">Catálogo</h1>
        <p className="page-subtitle">Configure sua loja e compartilhe o catálogo com seus clientes.</p>
      </div>

      {/* Settings */}
      <div className="app-card mb-8 animate-revealUp">
        <h2 className="mb-4 font-display text-xl font-bold text-brand-night">Configurações da Loja</h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Nome da loja</label>
            <input
              type="text"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              placeholder="Minha Loja"
              className="form-field"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">WhatsApp</label>
            <input
              type="text"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              placeholder="+55 11 99999-9999"
              className="form-field"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Instagram</label>
            <input
              type="text"
              value={instagram}
              onChange={(e) => setInstagram(e.target.value)}
              placeholder="@minha_loja"
              className="form-field"
            />
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button
            onClick={handleSave}
            disabled={saving}
            className="app-button-primary disabled:opacity-50"
          >
            {saving ? 'Salvando...' : 'Salvar'}
          </button>

          {shareUrl && (
            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white/80 px-3 py-2">
              <span className="max-w-[240px] truncate text-sm text-slate-600">{shareUrl}</span>
              <button
                onClick={copyLink}
                className="shrink-0 rounded-lg bg-brand-night px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-brand-night/80"
              >
                Copiar link
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Products Grid */}
      <div className="mb-4">
        <h2 className="font-display text-xl font-bold text-brand-night">
          Produtos Ativos
          <span className="ml-2 text-sm font-normal text-slate-400">({products.length})</span>
        </h2>
      </div>

      {products.length === 0 ? (
        <div className="app-empty text-slate-500">
          <p className="text-lg font-medium text-slate-600">Nenhum produto ativo</p>
          <p className="mt-1 text-sm">Ative produtos para exibi-los no catálogo.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <CatalogProductCard
              key={product.id}
              product={product}
              whatsapp={whatsapp}
              instagram={instagram}
            />
          ))}
        </div>
      )}
    </div>
  )
}
