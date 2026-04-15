import api from './api'
import type { Product, CreateProductRequest, UpdateProductRequest, ListProductsResponse, ProductPhoto } from '../types/product'

interface ListParams {
  page?: number
  limit?: number
  category?: string
  search?: string
  active?: boolean
}

export const productService = {
  async list(params: ListParams = {}): Promise<ListProductsResponse> {
    const response = await api.get<ListProductsResponse>('/products', { params })
    return response.data
  },

  async getById(id: string): Promise<Product> {
    const response = await api.get<Product>(`/products/${id}`)
    return response.data
  },

  async create(data: CreateProductRequest): Promise<Product> {
    const response = await api.post<Product>('/products', data)
    return response.data
  },

  async update(id: string, data: UpdateProductRequest): Promise<Product> {
    const response = await api.put<Product>(`/products/${id}`, data)
    return response.data
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/products/${id}`)
  },

  async toggleActive(id: string): Promise<Product> {
    const response = await api.patch<Product>(`/products/${id}/toggle-active`)
    return response.data
  },

  async adjustQuantity(id: string, amount: number, reason: string): Promise<Product> {
    const response = await api.post<Product>(`/products/${id}/quantity`, { amount, reason })
    return response.data
  },

  async addPhoto(productId: string, photoRef: string, position: number): Promise<ProductPhoto> {
    const response = await api.post<ProductPhoto>(`/products/${productId}/photos`, {
      drive_file_id: photoRef,
      position,
    })
    return response.data
  },

  async uploadPhoto(productId: string, file: File, position: number): Promise<ProductPhoto> {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('position', String(position))

    const response = await api.post<ProductPhoto>(`/products/${productId}/photos`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },

  async deletePhoto(productId: string, photoId: string): Promise<void> {
    await api.delete(`/products/${productId}/photos/${photoId}`)
  },
}
