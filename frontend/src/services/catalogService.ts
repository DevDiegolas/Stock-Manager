import api, { publicApi } from './api'
import type { CatalogSettings, PublicCatalog } from '../types/catalog'

export const catalogService = {
  async getSettings(): Promise<CatalogSettings> {
    const response = await api.get<CatalogSettings>('/catalog/settings')
    return response.data
  },

  async saveSettings(data: { store_name?: string; whatsapp?: string; instagram?: string }): Promise<CatalogSettings> {
    const response = await api.put<CatalogSettings>('/catalog/settings', data)
    return response.data
  },

  async getPublicCatalog(slug: string): Promise<PublicCatalog> {
    const response = await publicApi.get<PublicCatalog>(`/public/catalog/${slug}`)
    return response.data
  },
}
