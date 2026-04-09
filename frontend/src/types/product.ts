export interface Product {
  id: string
  user_id: string
  name: string
  category: string
  measurement?: string
  size?: string
  color: string
  price: number
  description?: string
  quantity: number
  active: boolean
  created_at: string
  updated_at: string
  photos?: ProductPhoto[]
}

export interface ProductPhoto {
  id: string
  product_id: string
  drive_file_id: string
  position: number
  created_at: string
}

export interface CreateProductRequest {
  name: string
  category: string
  measurement?: string
  size?: string
  color: string
  price: number
  description?: string
  quantity: number
}

export interface UpdateProductRequest {
  name?: string
  category?: string
  measurement?: string
  size?: string
  color?: string
  price?: number
  description?: string
}

export interface ListProductsResponse {
  products: Product[]
  total: number
  page: number
  limit: number
}
