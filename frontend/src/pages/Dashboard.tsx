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
    return <div className="animate-pulse">Carregando...</div>
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <p className="text-sm text-gray-500">Total de Produtos</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <p className="text-sm text-gray-500">Produtos Ativos</p>
          <p className="text-3xl font-bold text-green-600 mt-1">{stats.active}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <p className="text-sm text-gray-500">Produtos Inativos</p>
          <p className="text-3xl font-bold text-red-600 mt-1">{stats.inactive}</p>
        </div>
      </div>

      <div className="flex gap-4">
        <Link
          to="/products/new"
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
        >
          Novo Produto
        </Link>
        <Link
          to="/products"
          className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
        >
          Ver Produtos
        </Link>
      </div>
    </div>
  )
}
