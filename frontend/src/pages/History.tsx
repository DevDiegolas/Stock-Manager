import { useEffect, useState } from 'react'
import { historyService } from '../services/historyService'
import type { HistoryEntry } from '../types/history'
import { Skeleton } from '../components/ui/Skeleton'
import { ConfirmModal } from '../components/ui/ConfirmModal'
import { formatHistoryAction, formatHistoryDetails } from '../utils/historyFormat'

const PlusIcon = () => <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>
const EditIcon = () => <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.12 2.12 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
const TrashIcon = () => <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/></svg>
const WarnIcon = () => <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round"><path d="M10.3 3.9L1.8 18a2 2 0 001.7 3h17a2 2 0 001.7-3L13.7 3.9a2 2 0 00-3.4 0z"/><path d="M12 9v4M12 17h.01"/></svg>

interface ActionConfig { bg: string; fg: string; label: string; icon: React.ReactNode }

function actionConfig(action: string): ActionConfig {
  const map: Record<string, ActionConfig> = {
    PRODUCT_CREATED:     { bg: 'var(--success-bg)', fg: 'var(--success)', label: 'Criado',    icon: <PlusIcon /> },
    PRODUCT_UPDATED:     { bg: 'var(--aqua-soft)',  fg: 'var(--aqua)',    label: 'Atualizado', icon: <EditIcon /> },
    PRODUCT_DELETED:     { bg: 'var(--danger-bg)',  fg: 'var(--danger)',  label: 'Removido',  icon: <TrashIcon /> },
    PRODUCT_ACTIVATED:   { bg: 'var(--success-bg)', fg: 'var(--success)', label: 'Ativado',   icon: <PlusIcon /> },
    PRODUCT_DEACTIVATED: { bg: 'var(--warn-bg)',    fg: 'var(--warn)',    label: 'Inativado', icon: <WarnIcon /> },
    QUANTITY_ADDED:      { bg: 'var(--success-bg)', fg: 'var(--success)', label: 'Entrada',   icon: <PlusIcon /> },
    QUANTITY_REMOVED:    { bg: 'var(--ember-soft)', fg: 'var(--ember)',   label: 'Saída',     icon: <EditIcon /> },
  }
  return map[action] || { bg: 'var(--border)', fg: 'var(--text-muted)', label: action, icon: <EditIcon /> }
}

type TypeFilter = 'Todos' | 'PRODUCT_CREATED' | 'PRODUCT_UPDATED' | 'PRODUCT_DELETED' | 'PRODUCT_ACTIVATED' | 'PRODUCT_DEACTIVATED' | 'QUANTITY_ADDED' | 'QUANTITY_REMOVED'

const TYPE_FILTERS: { id: TypeFilter; label: string }[] = [
  { id: 'Todos', label: 'Todos' },
  { id: 'PRODUCT_CREATED', label: 'Criado' },
  { id: 'PRODUCT_UPDATED', label: 'Atualizado' },
  { id: 'PRODUCT_DELETED', label: 'Removido' },
  { id: 'PRODUCT_ACTIVATED', label: 'Ativado' },
  { id: 'PRODUCT_DEACTIVATED', label: 'Inativado' },
  { id: 'QUANTITY_ADDED', label: 'Entrada' },
  { id: 'QUANTITY_REMOVED', label: 'Saída' },
]

type PeriodFilter = 'Tudo' | 'Hoje' | 'Esta semana' | 'Este mês'
const PERIOD_FILTERS: PeriodFilter[] = ['Tudo', 'Hoje', 'Esta semana', 'Este mês']

function entryMatchesPeriod(entry: HistoryEntry, period: PeriodFilter): boolean {
  if (period === 'Tudo') return true
  const date = new Date(entry.created_at)
  const now = new Date()
  if (period === 'Hoje') {
    return date.toDateString() === now.toDateString()
  }
  if (period === 'Esta semana') {
    const weekStart = new Date(now)
    weekStart.setHours(0, 0, 0, 0)
    weekStart.setDate(now.getDate() - now.getDay())
    return date >= weekStart
  }
  if (period === 'Este mês') {
    return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth()
  }
  return true
}

function groupByDay(entries: HistoryEntry[]): Record<string, HistoryEntry[]> {
  return entries.reduce((acc, entry) => {
    const date = new Date(entry.created_at)
    const now = new Date()
    const isToday = date.toDateString() === now.toDateString()
    const yesterday = new Date(now)
    yesterday.setDate(yesterday.getDate() - 1)
    const isYesterday = date.toDateString() === yesterday.toDateString()

    let key: string
    if (isToday) key = 'Hoje'
    else if (isYesterday) key = 'Ontem'
    else key = date.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })

    if (!acc[key]) acc[key] = []
    acc[key].push(entry)
    return acc
  }, {} as Record<string, HistoryEntry[]>)
}

export default function History() {
  const [entries, setEntries] = useState<HistoryEntry[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [showClearModal, setShowClearModal] = useState(false)
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('Todos')
  const [periodFilter, setPeriodFilter] = useState<PeriodFilter>('Tudo')

  useEffect(() => {
    setLoading(true)
    historyService.list({ page, limit: 50 })
      .then(resp => {
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

  const filtered = entries
    .filter(e => typeFilter === 'Todos' || e.action === typeFilter)
    .filter(e => entryMatchesPeriod(e, periodFilter))
  const grouped = groupByDay(filtered)

  const filterBtnStyle = (active: boolean) => ({
    textAlign: 'left' as const,
    padding: '8px 12px',
    borderRadius: 10,
    border: 'none',
    background: active ? 'var(--bg-elev-strong)' : 'transparent',
    color: active ? 'var(--text)' : 'var(--text-muted)',
    fontFamily: 'var(--font-body)',
    fontWeight: active ? 600 : 500,
    fontSize: 13,
    cursor: 'pointer',
    boxShadow: active ? 'var(--shadow-panel)' : 'none',
    width: '100%',
    transition: 'all 0.15s',
  })

  return (
    <div className="reveal" style={{ padding: '22px 28px 40px', display: 'grid', gridTemplateColumns: '220px 1fr', gap: 22 }}>
      {/* Filter rail */}
      <div style={{ position: 'sticky', top: 80, alignSelf: 'flex-start', display: 'flex', flexDirection: 'column', gap: 3 }}>
        <div className="mono" style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', padding: '0 12px 8px' }}>
          Tipo de evento
        </div>
        {TYPE_FILTERS.map(f => (
          <button key={f.id} onClick={() => setTypeFilter(f.id)} style={filterBtnStyle(typeFilter === f.id)}>
            {f.label}
          </button>
        ))}

        <div style={{ height: 16 }}/>
        <div className="mono" style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', padding: '0 12px 8px' }}>
          Período
        </div>
        {PERIOD_FILTERS.map(f => (
          <button key={f} onClick={() => setPeriodFilter(f)} style={filterBtnStyle(periodFilter === f)}>
            {f}
          </button>
        ))}

        <div style={{ height: 16 }}/>
        <button
          onClick={() => setShowClearModal(true)}
          style={{ ...filterBtnStyle(false), color: 'var(--danger)', fontSize: 12 }}
        >
          Limpar histórico
        </button>
      </div>

      {/* Main content */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-48" />
            <Skeleton className="h-32" />
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: '60px 20px', textAlign: 'center', borderRadius: 20, border: '1.5px dashed var(--border)', background: 'var(--bg-elev)', color: 'var(--text-muted)' }}>
            <p style={{ fontSize: 15, fontWeight: 500 }}>Nenhum evento encontrado</p>
          </div>
        ) : (
          Object.entries(grouped).map(([day, dayEntries]) => (
            <div key={day}>
              {/* Day header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12, padding: '0 4px' }}>
                <div className="display" style={{ fontSize: 13, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.14em', whiteSpace: 'nowrap' }}>
                  {day}
                </div>
                <div style={{ flex: 1, height: 1, background: 'var(--border)' }}/>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                  {dayEntries.length} evento{dayEntries.length !== 1 ? 's' : ''}
                </div>
              </div>

              {/* Entries */}
              <div className="panel-solid" style={{ overflow: 'hidden' }}>
                {dayEntries.map((entry, i) => {
                  const c = actionConfig(entry.action)
                  const details = formatHistoryDetails(entry.action, entry.details)
                  const time = new Date(entry.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
                  return (
                    <div key={entry.id} style={{
                      display: 'grid',
                      gridTemplateColumns: '100px 36px 1fr 110px',
                      gap: 16,
                      alignItems: 'center',
                      padding: '14px 20px',
                      borderTop: i > 0 ? '1px solid var(--border)' : 'none',
                    }}>
                      <span style={{ padding: '4px 8px', borderRadius: 6, background: c.bg, color: c.fg, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', textAlign: 'center', width: 'fit-content' }}>
                        {c.label}
                      </span>
                      <div style={{ width: 34, height: 34, borderRadius: 10, background: c.bg, color: c.fg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {c.icon}
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: 14, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {formatHistoryAction(entry.action)}
                        </div>
                        {details.length > 0 && (
                          <div style={{ fontSize: 12, color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {details[0]}
                          </div>
                        )}
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)', textAlign: 'right' }}>
                        <div style={{ fontWeight: 500 }}>{time}</div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))
        )}

        {/* Pagination */}
        {total > 50 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
            <button className="btn-secondary" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={{ padding: '8px 16px', fontSize: 12, opacity: page === 1 ? 0.5 : 1 }}>
              Anterior
            </button>
            <span style={{ padding: '8px 16px', borderRadius: 12, border: '1px solid var(--border)', background: 'var(--bg-elev-strong)', fontSize: 13, fontWeight: 500 }}>
              {page} de {Math.ceil(total / 50)}
            </span>
            <button className="btn-secondary" onClick={() => setPage(p => p + 1)} disabled={page * 50 >= total} style={{ padding: '8px 16px', fontSize: 12, opacity: page * 50 >= total ? 0.5 : 1 }}>
              Próximo
            </button>
          </div>
        )}
      </div>

      {showClearModal && (
        <ConfirmModal
          title="Limpar histórico"
          description="Todo o histórico de movimentações será apagado permanentemente. Essa ação não pode ser desfeita."
          confirmLabel="Limpar tudo"
          cancelLabel="Cancelar"
          variant="danger"
          onConfirm={handleClear}
          onCancel={() => setShowClearModal(false)}
        />
      )}
    </div>
  )
}
