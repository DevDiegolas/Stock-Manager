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
    <div className="page-shell">
      <div className="mb-6">
        <span className="pill-badge">Rastreabilidade</span>
        <h1 className="page-title mt-3">Historico</h1>
        <p className="page-subtitle">Visualize cada alteracao com contexto e horario.</p>
      </div>

      {entries.length === 0 ? (
        <div className="app-empty text-slate-500">
          <p className="text-lg font-medium text-slate-600">Nenhum registro no historico</p>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {entries.map((entry) => {
              const { label, color } = formatAction(entry.action)
              return (
                <div key={entry.id} className="app-card flex items-center justify-between gap-4 p-4">
                  <div className="flex items-center gap-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${color}`}>
                      {label}
                    </span>
                    {entry.details && (
                      <span className="text-sm text-slate-600">
                        {JSON.stringify(entry.details)}
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-medium text-slate-500">
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
                Proximo
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
