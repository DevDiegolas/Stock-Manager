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

  if (loading) return <div className="animate-pulse">Carregando...</div>
  if (!product) return <div>Produto nao encontrado</div>

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
        <div className="flex gap-2">
          <Link
            to={`/products/${id}/edit`}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
          >
            Editar
          </Link>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
          >
            Remover
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Product Info */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Detalhes</h2>
          <dl className="space-y-3">
            <div className="flex justify-between">
              <dt className="text-sm text-gray-500">Categoria</dt>
              <dd className="text-sm font-medium">{product.category}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-sm text-gray-500">Cor</dt>
              <dd className="text-sm font-medium">{product.color}</dd>
            </div>
            {product.measurement && (
              <div className="flex justify-between">
                <dt className="text-sm text-gray-500">Medida</dt>
                <dd className="text-sm font-medium">{product.measurement}</dd>
              </div>
            )}
            {product.size && (
              <div className="flex justify-between">
                <dt className="text-sm text-gray-500">Tamanho</dt>
                <dd className="text-sm font-medium">{product.size}</dd>
              </div>
            )}
            <div className="flex justify-between">
              <dt className="text-sm text-gray-500">Preco</dt>
              <dd className="text-sm font-medium">R$ {product.price.toFixed(2)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-sm text-gray-500">Quantidade</dt>
              <dd className={`text-sm font-medium ${product.quantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {product.quantity}
              </dd>
            </div>
            {product.description && (
              <div className="pt-2 border-t">
                <dt className="text-sm text-gray-500 mb-1">Descricao</dt>
                <dd className="text-sm">{product.description}</dd>
              </div>
            )}
          </dl>
        </div>

        {/* Adjust Quantity */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Ajustar Quantidade</h2>
          <div className="space-y-3">
            <input
              type="number"
              placeholder="Quantidade (ex: 5 ou -3)"
              value={qtyAmount}
              onChange={(e) => setQtyAmount(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            />
            <input
              type="text"
              placeholder="Motivo (ex: venda, reposicao)"
              value={qtyReason}
              onChange={(e) => setQtyReason(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            />
            <button
              onClick={handleAdjustQuantity}
              className="w-full py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
            >
              Ajustar
            </button>
          </div>
        </div>

        {/* Photos */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Fotos</h2>

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
                    className="absolute top-1 right-1 bg-red-600 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    X
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 mb-4">Nenhuma foto adicionada</p>
          )}

          <div className="space-y-2">
            <input
              type="text"
              placeholder="ID do arquivo no Google Drive"
              value={photoUrl}
              onChange={(e) => setPhotoUrl(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            />
            <div className="flex gap-2">
              <select
                value={photoPosition}
                onChange={(e) => setPhotoPosition(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="1">Posicao 1</option>
                <option value="2">Posicao 2</option>
                <option value="3">Posicao 3</option>
                <option value="4">Posicao 4</option>
              </select>
              <button
                onClick={handleAddPhoto}
                className="flex-1 py-2 bg-gray-800 text-white rounded-lg text-sm font-medium hover:bg-gray-900 transition-colors"
              >
                Adicionar Foto
              </button>
            </div>
          </div>
        </div>

        {/* History */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Historico Recente</h2>
          {history.length === 0 ? (
            <p className="text-sm text-gray-500">Sem historico</p>
          ) : (
            <div className="space-y-3">
              {history.map((entry) => (
                <div key={entry.id} className="border-l-2 border-indigo-200 pl-3 py-1">
                  <p className="text-sm font-medium text-gray-900">
                    {formatAction(entry.action)}
                  </p>
                  <p className="text-xs text-gray-500">
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
