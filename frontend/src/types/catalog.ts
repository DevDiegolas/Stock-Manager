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

export interface PublicProductPhoto {
  id: string
  drive_file_id: string
  position: number
}

export interface PublicProduct {
  id: string
  name: string
  category: string
  measurement?: string
  size?: string
  color: string
  price: number
  quantity: number
  photos?: PublicProductPhoto[]
}

export interface PublicCatalog {
  store_name: string
  whatsapp: string
  instagram: string
  products: PublicProduct[]
}
