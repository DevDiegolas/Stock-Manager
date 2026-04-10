import type { Product } from './product'

export interface CatalogSettings {
  id: string
  user_id: string
  slug: string
  store_name: string
  whatsapp: string
  instagram: string
  active: boolean
  created_at: string
  updated_at: string
}

export interface PublicCatalog {
  store_name: string
  whatsapp: string
  instagram: string
  products: Product[]
}
