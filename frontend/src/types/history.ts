export interface HistoryEntry {
  id: string
  user_id: string
  product_id?: string
  action: string
  details?: Record<string, unknown>
  created_at: string
}

export interface ListHistoryResponse {
  entries: HistoryEntry[]
  total: number
  page: number
  limit: number
}
