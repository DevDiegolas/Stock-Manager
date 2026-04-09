import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { productService } from '../services/productService'
import type { Product } from '../types/product'

export default function Products() {
  const [products, setProducts] = useState<Product[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  const loadProducts = async (p: number, s: string) => {
    setLoading(true)
    try {
      const resp = await productService.list({ page: p, limit: 20, search: s, active: true })
      setProducts(resp.products)
      setTotal(resp.total)
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProducts(page, search)
  }, [page, search])

  const totalPages = Math.ceil(total / 20)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Produtos</h1>
        <Link
          to="/products/new"
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
        >
          Novo Produto
        </Link>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar produtos..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            setPage(1)
          }}
          className="w-full max-w-md px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
        />
      </div>

      {loading ? (
        <div className="animate-pulse">Carregando...</div>
      ) : products.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg">Nenhum produto encontrado</p>
          <Link to="/products/new" className="text-indigo-600 hover:text-indigo-700 mt-2 inline-block">
            Adicionar primeiro produto
          </Link>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Nome</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Categoria</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Cor</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Tamanho</th>
                  <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase">Preco</th>
                  <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase">Qtd</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <Link to={`/products/${p.id}`} className="text-indigo-600 hover:text-indigo-700 font-medium">
                        {p.name}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{p.category}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{p.color}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{p.size || p.measurement || '-'}</td>
                    <td className="px-6 py-4 text-sm text-gray-900 text-right font-medium">
                      R$ {p.price.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-sm text-right">
                      <span className={`font-medium ${p.quantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {p.quantity}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-4">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1 border border-gray-300 rounded-lg text-sm disabled:opacity-50"
              >
                Anterior
              </button>
              <span className="px-3 py-1 text-sm text-gray-600">
                {page} de {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-1 border border-gray-300 rounded-lg text-sm disabled:opacity-50"
              >
                Proximo
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
