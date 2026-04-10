import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { productService } from '../services/productService'
import { historyService } from '../services/historyService'
import type { Product } from '../types/product'
import type { HistoryEntry } from '../types/history'
import { Skeleton } from '../components/ui/Skeleton'
import { ConfirmModal } from '../components/ui/ConfirmModal'
import { formatHistoryAction, formatHistoryDetails } from '../utils/historyFormat'

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [product, setProduct] = useState<Product | null>(null)
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [activeSlide, setActiveSlide] = useState(0)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  useEffect(() => {
    if (!id) return
    Promise.all([
      productService.getById(id),
      historyService.listByProduct(id, { limit: 10 }),
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
    const h = await historyService.listByProduct(id, { limit: 10 })
    setHistory(h.entries)
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Skeleton className="h-56" />
          <Skeleton className="h-56" />
        </div>
      </div>
    )
  }
  if (!product) return <div className="app-empty text-slate-600">Produto não encontrado</div>

  const photos = product.photos || []

  return (
    <div className="page-shell max-w-5xl">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="pill-badge">Detalhes</span>
          <h1 className="page-title mt-3">{product.name}</h1>
          <p className="page-subtitle">Informações, fotos e histórico deste produto.</p>
        </div>
        <div className="flex gap-2">
          <Link to={`/products/${id}/edit`} className="app-button-primary">
            Editar
          </Link>
          <button
            onClick={handleToggleActive}
            className={`rounded-xl border px-4 py-2.5 text-sm font-semibold transition-colors ${
              product.active
                ? 'border-amber-300/70 bg-amber-50 text-amber-700 hover:bg-amber-100'
                : 'border-emerald-300/70 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
            }`}
          >
            {product.active ? 'Inativar' : 'Ativar'}
          </button>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="rounded-xl border border-rose-300/70 bg-rose-50 px-4 py-2.5 text-sm font-semibold text-rose-700 transition-colors hover:bg-rose-100"
          >
            Remover
          </button>
        </div>
      </div>

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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Detalhes */}
        <div className="app-card !p-4">
          <h2 className="mb-3 font-display text-lg font-bold text-brand-night">Detalhes</h2>
          <dl className="space-y-2">
            <div className="flex justify-between">
              <dt className="text-sm text-slate-500">Categoria</dt>
              <dd className="text-sm font-semibold text-slate-700">{product.category}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-sm text-slate-500">Cor</dt>
              <dd className="text-sm font-semibold text-slate-700">{product.color}</dd>
            </div>
            {product.measurement && (
              <div className="flex justify-between">
                <dt className="text-sm text-slate-500">Medida</dt>
                <dd className="text-sm font-semibold text-slate-700">{product.measurement}</dd>
              </div>
            )}
            {product.size && (
              <div className="flex justify-between">
                <dt className="text-sm text-slate-500">Tamanho</dt>
                <dd className="text-sm font-semibold text-slate-700">{product.size}</dd>
              </div>
            )}
            <div className="flex justify-between">
              <dt className="text-sm text-slate-500">Preço</dt>
              <dd className="text-sm font-semibold text-slate-700">R$ {product.price.toFixed(2)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-sm text-slate-500">Quantidade</dt>
              <dd className={`text-sm font-semibold ${product.quantity > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                {product.quantity}
              </dd>
            </div>
          </dl>
        </div>

        {/* Fotos */}
        <div className="app-card flex flex-col">
          <h2 className="mb-4 font-display text-2xl font-bold text-brand-night">
            Fotos
            {photos.length > 0 && <span className="ml-2 text-sm font-normal text-slate-400">({photos.length})</span>}
          </h2>

          {photos.length === 0 ? (
            <div className="flex flex-1 min-h-[200px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50/50 text-slate-400">
              <svg className="mb-3 h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z" />
              </svg>
              <p className="text-sm font-medium">Nenhuma foto adicionada</p>
            </div>
          ) : (
            <>
              <div className="relative flex-1 min-h-[240px] rounded-2xl border border-slate-200 bg-slate-50/50 overflow-hidden">
                <img
                  src={`https://drive.google.com/thumbnail?id=${photos[activeSlide]?.drive_file_id}&sz=w800`}
                  alt={`Foto ${activeSlide + 1}`}
                  className="h-full w-full object-cover"
                />

                {photos.length > 1 && (
                  <>
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-brand-night/70 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                      {activeSlide + 1} / {photos.length}
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveSlide((s) => (s === 0 ? photos.length - 1 : s - 1))}
                      className="absolute left-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-brand-night shadow-md backdrop-blur-sm transition-all hover:bg-white"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveSlide((s) => (s === photos.length - 1 ? 0 : s + 1))}
                      className="absolute right-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-brand-night shadow-md backdrop-blur-sm transition-all hover:bg-white"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                      </svg>
                    </button>
                  </>
                )}
              </div>

              {photos.length > 1 && (
                <div className="mt-3 flex gap-2">
                  {photos.map((photo, i) => (
                    <button
                      key={photo.id}
                      type="button"
                      onClick={() => setActiveSlide(i)}
                    className={`h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
                      i === activeSlide
                        ? 'border-brand-ember shadow-glow'
                        : 'border-slate-200 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={`https://drive.google.com/thumbnail?id=${photo.drive_file_id}&sz=w100`}
                      alt={`Miniatura ${i + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Histórico Recente */}
        <div className="app-card lg:col-span-2">
          <h2 className="mb-4 font-display text-2xl font-bold text-brand-night">Histórico Recente</h2>
          {history.length === 0 ? (
            <p className="text-sm text-slate-500">Sem histórico</p>
          ) : (
            <div className="space-y-3">
              {history.map((entry) => (
                <div key={entry.id} className="rounded-xl border border-slate-200 bg-white/80 px-3 py-2">
                  <p className="text-sm font-semibold text-slate-800">
                    {formatHistoryAction(entry.action)}
                  </p>
                  {formatHistoryDetails(entry.action, entry.details).map((line) => (
                    <p key={line} className="text-xs text-slate-600">{line}</p>
                  ))}
                  <p className="text-xs text-slate-500">
                    {new Date(entry.created_at).toLocaleString('pt-BR')}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
