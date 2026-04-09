import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { productService } from '../services/productService'
import { historyService } from '../services/historyService'
import type { Product } from '../types/product'
import type { HistoryEntry } from '../types/history'

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [product, setProduct] = useState<Product | null>(null)
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [qtyAmount, setQtyAmount] = useState('')
  const [qtyReason, setQtyReason] = useState('')
  const [photoUrl, setPhotoUrl] = useState('')
  const [photoPosition, setPhotoPosition] = useState('1')

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

  const handleAdjustQuantity = async () => {
    if (!id || !qtyAmount) return
    try {
      const updated = await productService.adjustQuantity(id, parseInt(qtyAmount), qtyReason)
      setProduct(updated)
      setQtyAmount('')
      setQtyReason('')
      const h = await historyService.listByProduct(id, { limit: 10 })
      setHistory(h.entries)
    } catch {
      // ignore
    }
  }

  const handleAddPhoto = async () => {
    if (!id || !photoUrl) return
    try {
      await productService.addPhoto(id, photoUrl, parseInt(photoPosition))
      const updated = await productService.getById(id)
      setProduct(updated)
      setPhotoUrl('')
    } catch {
      // ignore
    }
  }

  const handleDeletePhoto = async (photoId: string) => {
    if (!id) return
    await productService.deletePhoto(id, photoId)
    const updated = await productService.getById(id)
    setProduct(updated)
  }

  const handleDelete = async () => {
    if (!id || !confirm('Tem certeza que deseja remover este produto?')) return
    await productService.delete(id)
    navigate('/products')
  }

  if (loading) return <div className="animate-pulse text-slate-600">Carregando...</div>
  if (!product) return <div className="app-empty text-slate-600">Produto nao encontrado</div>

  return (
    <div className="page-shell max-w-5xl">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="pill-badge">Detalhes</span>
          <h1 className="page-title mt-3">{product.name}</h1>
          <p className="page-subtitle">Acompanhe informacoes, estoque, fotos e historico deste produto.</p>
        </div>
        <div className="flex gap-2">
          <Link to={`/products/${id}/edit`} className="app-button-primary">
            Editar
          </Link>
          <button
            onClick={handleDelete}
            className="rounded-xl border border-rose-300/70 bg-rose-50 px-4 py-2.5 text-sm font-semibold text-rose-700 transition-colors hover:bg-rose-100"
          >
            Remover
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="app-card">
          <h2 className="mb-4 font-display text-2xl font-bold text-brand-night">Detalhes</h2>
          <dl className="space-y-3">
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
              <dt className="text-sm text-slate-500">Preco</dt>
              <dd className="text-sm font-semibold text-slate-700">R$ {product.price.toFixed(2)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-sm text-slate-500">Quantidade</dt>
              <dd className={`text-sm font-semibold ${product.quantity > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                {product.quantity}
              </dd>
            </div>
            {product.description && (
              <div className="border-t border-slate-200 pt-2">
                <dt className="mb-1 text-sm text-slate-500">Descricao</dt>
                <dd className="text-sm text-slate-700">{product.description}</dd>
              </div>
            )}
          </dl>
        </div>

        <div className="app-card">
          <h2 className="mb-4 font-display text-2xl font-bold text-brand-night">Ajustar Quantidade</h2>
          <div className="space-y-3">
            <input
              type="number"
              placeholder="Quantidade (ex: 5 ou -3)"
              value={qtyAmount}
              onChange={(e) => setQtyAmount(e.target.value)}
              className="form-field"
            />
            <input
              type="text"
              placeholder="Motivo (ex: venda, reposicao)"
              value={qtyReason}
              onChange={(e) => setQtyReason(e.target.value)}
              className="form-field"
            />
            <button onClick={handleAdjustQuantity} className="app-button-primary w-full">
              Ajustar
            </button>
          </div>
        </div>

        <div className="app-card">
          <h2 className="mb-4 font-display text-2xl font-bold text-brand-night">Fotos</h2>

          {product.photos && product.photos.length > 0 ? (
            <div className="grid grid-cols-2 gap-3 mb-4">
              {product.photos.map((photo) => (
                <div key={photo.id} className="relative group">
                  <img
                    src={`https://drive.google.com/thumbnail?id=${photo.drive_file_id}&sz=w400`}
                    alt={`Foto ${photo.position}`}
                    className="w-full h-32 object-cover rounded-lg border"
                  />
                  <button
                    onClick={() => handleDeletePhoto(photo.id)}
                    className="absolute top-1 right-1 rounded bg-rose-600 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    X
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="mb-4 text-sm text-slate-500">Nenhuma foto adicionada</p>
          )}

          <div className="space-y-2">
            <input
              type="text"
              placeholder="ID do arquivo no Google Drive"
              value={photoUrl}
              onChange={(e) => setPhotoUrl(e.target.value)}
              className="form-field"
            />
            <div className="flex gap-2">
              <select
                value={photoPosition}
                onChange={(e) => setPhotoPosition(e.target.value)}
                className="form-field max-w-[120px]"
              >
                <option value="1">Posicao 1</option>
                <option value="2">Posicao 2</option>
                <option value="3">Posicao 3</option>
                <option value="4">Posicao 4</option>
              </select>
              <button onClick={handleAddPhoto} className="app-button-secondary flex-1">
                Adicionar Foto
              </button>
            </div>
          </div>
        </div>

        <div className="app-card">
          <h2 className="mb-4 font-display text-2xl font-bold text-brand-night">Historico Recente</h2>
          {history.length === 0 ? (
            <p className="text-sm text-slate-500">Sem historico</p>
          ) : (
            <div className="space-y-3">
              {history.map((entry) => (
                <div key={entry.id} className="rounded-xl border border-slate-200 bg-white/80 px-3 py-2">
                  <p className="text-sm font-semibold text-slate-800">
                    {formatAction(entry.action)}
                  </p>
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

function formatAction(action: string): string {
  const map: Record<string, string> = {
    PRODUCT_CREATED: 'Produto criado',
    PRODUCT_UPDATED: 'Produto atualizado',
    PRODUCT_DELETED: 'Produto removido',
    QUANTITY_ADDED: 'Quantidade adicionada',
    QUANTITY_REMOVED: 'Quantidade removida',
  }
  return map[action] || action
}
