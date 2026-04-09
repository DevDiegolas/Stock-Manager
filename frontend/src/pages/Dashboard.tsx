import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { productService } from '../services/productService'

export default function Dashboard() {
  const [stats, setStats] = useState({ total: 0, active: 0, inactive: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [all, active] = await Promise.all([
          productService.list({ limit: 1 }),
          productService.list({ limit: 1, active: true }),
        ])
        setStats({
          total: all.total,
          active: active.total,
          inactive: all.total - active.total,
        })
      } catch {
        // ignore
      } finally {
        setLoading(false)
      }
    }
    loadStats()
  }, [])

  if (loading) {
    return <div className="animate-pulse text-slate-600">Carregando...</div>
  }

  return (
    <div className="page-shell">
      <div className="mb-6">
        <span className="pill-badge">Resumo</span>
        <h1 className="page-title mt-3">Dashboard</h1>
        <p className="page-subtitle">Acompanhe o panorama do estoque com atualizacao rapida.</p>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-5 md:grid-cols-3">
        <div className="app-card animate-revealUp delayed-1">
          <p className="text-xs uppercase tracking-wide text-slate-500">Total de Produtos</p>
          <p className="mt-2 font-display text-4xl font-bold text-brand-night">{stats.total}</p>
          <p className="mt-1 text-xs text-slate-500">Catalogo completo cadastrado</p>
        </div>
        <div className="app-card animate-revealUp delayed-2">
          <p className="text-xs uppercase tracking-wide text-slate-500">Produtos Ativos</p>
          <p className="mt-2 font-display text-4xl font-bold text-emerald-600">{stats.active}</p>
          <p className="mt-1 text-xs text-slate-500">Disponiveis para venda</p>
        </div>
        <div className="app-card animate-revealUp delayed-3">
          <p className="text-xs uppercase tracking-wide text-slate-500">Produtos Inativos</p>
          <p className="mt-2 font-display text-4xl font-bold text-rose-600">{stats.inactive}</p>
          <p className="mt-1 text-xs text-slate-500">Itens fora de circulacao</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link to="/products/new" className="app-button-primary">
          Novo Produto
        </Link>
        <Link to="/products" className="app-button-secondary">
          Ver Produtos
        </Link>
      </div>
    </div>
  )
}
