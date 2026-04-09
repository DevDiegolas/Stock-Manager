import { useEffect, useState } from 'react'
import { historyService } from '../services/historyService'
import type { HistoryEntry } from '../types/history'

export default function History() {
  const [entries, setEntries] = useState<HistoryEntry[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    historyService.list({ page, limit: 20 })
      .then((resp) => {
        setEntries(resp.entries)
        setTotal(resp.total)
      })
      .finally(() => setLoading(false))
  }, [page])

  const totalPages = Math.ceil(total / 20)

  const formatAction = (action: string) => {
    const map: Record<string, { label: string; color: string }> = {
      PRODUCT_CREATED: { label: 'Produto criado', color: 'bg-green-100 text-green-700' },
      PRODUCT_UPDATED: { label: 'Produto atualizado', color: 'bg-blue-100 text-blue-700' },
      PRODUCT_DELETED: { label: 'Produto removido', color: 'bg-red-100 text-red-700' },
      QUANTITY_ADDED: { label: 'Quantidade adicionada', color: 'bg-emerald-100 text-emerald-700' },
      QUANTITY_REMOVED: { label: 'Quantidade removida', color: 'bg-orange-100 text-orange-700' },
    }
    return map[action] || { label: action, color: 'bg-gray-100 text-gray-700' }
  }

  if (loading) return <div className="animate-pulse">Carregando...</div>

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Historico</h1>

      {entries.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg">Nenhum registro no historico</p>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {entries.map((entry) => {
              const { label, color } = formatAction(entry.action)
              return (
                <div key={entry.id} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${color}`}>
                      {label}
                    </span>
                    {entry.details && (
                      <span className="text-sm text-gray-600">
                        {JSON.stringify(entry.details)}
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(entry.created_at).toLocaleString('pt-BR')}
                  </span>
                </div>
              )
            })}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-6">
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
