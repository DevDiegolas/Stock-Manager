import api from './api'
import type { ListHistoryResponse } from '../types/history'

interface ListParams {
  page?: number
  limit?: number
}

export const historyService = {
  async list(params: ListParams = {}): Promise<ListHistoryResponse> {
    const response = await api.get<ListHistoryResponse>('/history', { params })
    return response.data
  },

  async listByProduct(productId: string, params: ListParams = {}): Promise<ListHistoryResponse> {
    const response = await api.get<ListHistoryResponse>(`/history/product/${productId}`, { params })
    return response.data
  },
}
