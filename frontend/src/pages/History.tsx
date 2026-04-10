import { useEffect, useState } from 'react'
import { historyService } from '../services/historyService'
import type { HistoryEntry } from '../types/history'
import { Skeleton } from '../components/ui/Skeleton'
import { ConfirmModal } from '../components/ui/ConfirmModal'
import { formatHistoryAction, formatHistoryDetails } from '../utils/historyFormat'

export default function History() {
  const [entries, setEntries] = useState<HistoryEntry[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [showClearModal, setShowClearModal] = useState(false)

  useEffect(() => {
    setLoading(true)
    historyService.list({ page, limit: 20 })
      .then((resp) => {
        setEntries(resp.entries)
        setTotal(resp.total)
      })
      .finally(() => setLoading(false))
  }, [page])

  const handleClear = async () => {
    await historyService.clear()
    setEntries([])
    setTotal(0)
    setPage(1)
  }

  const totalPages = Math.ceil(total / 20)

  const formatBadge = (action: string) => {
    const map: Record<string, { color: string }> = {
      PRODUCT_CREATED: { color: 'bg-green-100 text-green-700' },
      PRODUCT_UPDATED: { color: 'bg-blue-100 text-blue-700' },
      PRODUCT_DELETED: { color: 'bg-red-100 text-red-700' },
      PRODUCT_ACTIVATED: { color: 'bg-emerald-100 text-emerald-700' },
      PRODUCT_DEACTIVATED: { color: 'bg-amber-100 text-amber-700' },
      QUANTITY_ADDED: { color: 'bg-emerald-100 text-emerald-700' },
      QUANTITY_REMOVED: { color: 'bg-orange-100 text-orange-700' },
    }
    return map[action] || { color: 'bg-gray-100 text-gray-700' }
  }

  if (loading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-24" />
        <Skeleton className="h-24" />
        <Skeleton className="h-24" />
      </div>
    )
  }

  return (
    <div className="page-shell">
      {showClearModal && (
        <ConfirmModal
          title="Limpar histórico"
          description="Todo o histórico de movimentações será apagado permanentemente. Essa ação não pode ser desfeita."
          confirmLabel="Limpar tudo"
          cancelLabel="Manter"
          variant="danger"
          onConfirm={handleClear}
          onCancel={() => setShowClearModal(false)}
        />
      )}

      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="pill-badge">Rastreabilidade</span>
          <h1 className="page-title mt-3">Histórico</h1>
          <p className="page-subtitle">Visualize cada alteração com contexto e horário.</p>
        </div>
        {entries.length > 0 && (
          <button
            onClick={() => setShowClearModal(true)}
            className="rounded-xl border border-rose-300/70 bg-rose-50 px-4 py-2.5 text-sm font-semibold text-rose-700 transition-colors hover:bg-rose-100"
          >
            Limpar histórico
          </button>
        )}
      </div>

      {entries.length === 0 ? (
        <div className="app-empty text-slate-500">
          <p className="text-lg font-medium text-slate-600">Nenhum registro no histórico</p>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {entries.map((entry) => {
              const { color } = formatBadge(entry.action)
              const details = formatHistoryDetails(entry.action, entry.details)
              return (
                <div key={entry.id} className="app-card flex items-center justify-between gap-4 p-4">
                  <div className="flex flex-col gap-2">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium w-fit ${color}`}>
                      {formatHistoryAction(entry.action)}
                    </span>
                    {details.length > 0 && (
                      <ul className="space-y-1">
                        {details.map((line) => (
                          <li key={line} className="text-sm text-slate-600">{line}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <span className="text-xs font-medium text-slate-500 flex-shrink-0">
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
                Próximo
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
