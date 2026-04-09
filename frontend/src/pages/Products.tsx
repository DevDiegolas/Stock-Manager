import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { productService } from '../services/productService'
import type { Product } from '../types/product'
import { Skeleton } from '../components/ui/Skeleton'

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
    <div className="page-shell">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="pill-badge">Catálogo</span>
          <h1 className="page-title mt-3">Produtos</h1>
          <p className="page-subtitle">Busque, acompanhe e entre no detalhe de cada item.</p>
        </div>
        <Link to="/products/new" className="app-button-primary">
          Novo Produto
        </Link>
      </div>

      <div className="mb-5 max-w-lg animate-revealUp delayed-1">
        <input
          type="text"
          placeholder="Buscar produtos..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            setPage(1)
          }}
          className="form-field"
        />
      </div>

      {loading ? (
        <div className="space-y-3">
          <Skeleton className="h-12" />
          <Skeleton className="h-12" />
          <Skeleton className="h-12" />
          <Skeleton className="h-12" />
        </div>
      ) : products.length === 0 ? (
        <div className="app-empty text-slate-500">
          <p className="text-lg font-medium text-slate-600">Nenhum produto encontrado</p>
          <Link to="/products/new" className="mt-2 inline-block font-semibold text-brand-night hover:text-brand-ember">
            Adicionar primeiro produto
          </Link>
        </div>
      ) : (
        <>
          <div className="app-card overflow-hidden p-0">
            <table className="w-full">
              <thead className="border-b border-slate-200 bg-slate-50/80">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Nome</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Categoria</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Cor</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Tamanho</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">Preço</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">Qtd</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.map((p) => (
                  <tr key={p.id} className="transition-colors duration-300 hover:bg-brand-sand/40">
                    <td className="px-6 py-4">
                      <Link to={`/products/${p.id}`} className="font-semibold text-brand-night transition-colors hover:text-brand-ember">
                        {p.name}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{p.category}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{p.color}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{p.size || p.measurement || '-'}</td>
                    <td className="px-6 py-4 text-right text-sm font-semibold text-slate-800">
                      R$ {p.price.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-sm text-right">
                      <span className={`font-semibold ${p.quantity > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {p.quantity}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="mt-6 flex justify-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="app-button-secondary disabled:opacity-50"
              >
                Anterior
              </button>
              <span className="rounded-xl border border-slate-200 bg-white/80 px-4 py-2 text-sm font-semibold text-slate-600">
                {page} de {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="app-button-secondary disabled:opacity-50"
              >
                Próximo
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
