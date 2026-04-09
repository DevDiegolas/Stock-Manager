import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { productService } from '../services/productService'
import type { ProductPhoto } from '../types/product'

const categories = ['Biquíni', 'Calcinha', 'Sunga', 'Maiô', 'Saída de Praia', 'Outro']

interface PhotoSlot {
  driveFileId: string
  position: number
  id?: string // exists only for saved photos (edit mode)
}

export default function ProductForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEditing = !!id

  const [form, setForm] = useState({
    name: '',
    category: 'Biquini',
    measurement: '',
    size: '',
    color: '',
    price: '',
    description: '',
    quantity: '0',
  })
  const [photos, setPhotos] = useState<PhotoSlot[]>([])
  const [newPhotoUrl, setNewPhotoUrl] = useState('')
  const [activeSlide, setActiveSlide] = useState(0)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (id) {
      productService.getById(id).then((p) => {
        setForm({
          name: p.name,
          category: p.category,
          measurement: p.measurement || '',
          size: p.size || '',
          color: p.color,
          price: p.price.toString(),
          description: p.description || '',
          quantity: p.quantity.toString(),
        })
        if (p.photos && p.photos.length > 0) {
          setPhotos(
            p.photos.map((ph: ProductPhoto) => ({
              driveFileId: ph.drive_file_id,
              position: ph.position,
              id: ph.id,
            }))
          )
        }
      })
    }
  }, [id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (isEditing) {
        await productService.update(id, {
          name: form.name,
          category: form.category,
          measurement: form.measurement || undefined,
          size: form.size || undefined,
          color: form.color,
          price: parseFloat(form.price),
          description: form.description || undefined,
        })
        // Sync photos for edit mode - add new ones that don't have an id
        for (const photo of photos) {
          if (!photo.id) {
            await productService.addPhoto(id, photo.driveFileId, photo.position)
          }
        }
      } else {
        await productService.create({
          name: form.name,
          category: form.category,
          measurement: form.measurement || undefined,
          size: form.size || undefined,
          color: form.color,
          price: parseFloat(form.price),
          description: form.description || undefined,
          quantity: parseInt(form.quantity) || 0,
          photos: photos.map((p) => ({
            drive_file_id: p.driveFileId,
            position: p.position,
          })),
        })
      }
      navigate('/products')
    } catch {
      setError('Erro ao salvar produto')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const addPhoto = () => {
    if (!newPhotoUrl.trim()) return
    if (photos.length >= 4) return

    const nextPosition = photos.length + 1
    setPhotos((prev) => [...prev, { driveFileId: newPhotoUrl.trim(), position: nextPosition }])
    setNewPhotoUrl('')
    setActiveSlide(photos.length) // go to the newly added photo
  }

  const removePhoto = async (index: number) => {
    const photo = photos[index]
    // If editing and photo has an id, delete from server
    if (isEditing && id && photo.id) {
      await productService.deletePhoto(id, photo.id)
    }
    const updated = photos.filter((_, i) => i !== index).map((p, i) => ({ ...p, position: i + 1 }))
    setPhotos(updated)
    if (activeSlide >= updated.length && updated.length > 0) {
      setActiveSlide(updated.length - 1)
    } else if (updated.length === 0) {
      setActiveSlide(0)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addPhoto()
    }
  }

  return (
    <div className="page-shell max-w-5xl">
      <div className="mb-6">
        <span className="pill-badge">Produto</span>
        <h1 className="page-title mt-3">{isEditing ? 'Editar Produto' : 'Novo Produto'}</h1>
        <p className="page-subtitle">Preencha os dados e adicione fotos para manter seu catálogo completo.</p>
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Left - Form Fields */}
        <div className="app-card space-y-4">
          <h2 className="font-display text-xl font-bold text-brand-night">Informações</h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Nome</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="form-field"
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Categoria</label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="form-field"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Cor</label>
              <input
                name="color"
                value={form.color}
                onChange={handleChange}
                className="form-field"
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Medida</label>
              <input
                name="measurement"
                value={form.measurement}
                onChange={handleChange}
                placeholder="P, M, G, GG"
                className="form-field"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Tamanho</label>
              <input
                name="size"
                value={form.size}
                onChange={handleChange}
                placeholder="36, 38, 40"
                className="form-field"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Preço (R$)</label>
              <input
                name="price"
                type="number"
                step="0.01"
                min="0"
                value={form.price}
                onChange={handleChange}
                className="form-field"
                required
              />
            </div>
            {!isEditing && (
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Quantidade</label>
                <input
                  name="quantity"
                  type="number"
                  min="0"
                  value={form.quantity}
                  onChange={handleChange}
                  className="form-field"
                  required
                />
              </div>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Descrição</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              className="form-field resize-none"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="app-button-primary disabled:opacity-50"
            >
              {loading ? 'Salvando...' : isEditing ? 'Salvar' : 'Criar Produto'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/products')}
              className="app-button-secondary"
            >
              Cancelar
            </button>
          </div>
        </div>

        {/* Right - Photo Carousel */}
        <div className="app-card flex flex-col">
          <h2 className="mb-4 font-display text-xl font-bold text-brand-night">
            Fotos
            <span className="ml-2 text-sm font-normal text-slate-400">({photos.length}/4)</span>
          </h2>

          {/* Carousel */}
          <div className="relative flex-1 min-h-[280px] rounded-2xl border border-dashed border-slate-300 bg-slate-50/50 overflow-hidden">
            {photos.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-slate-400">
                <svg className="mb-3 h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z" />
                </svg>
                <p className="text-sm font-medium">Nenhuma foto adicionada</p>
                <p className="mt-1 text-xs">Cole o ID do Google Drive abaixo</p>
              </div>
            ) : (
              <>
                {/* Main image */}
                <img
                  src={`https://drive.google.com/thumbnail?id=${photos[activeSlide]?.driveFileId}&sz=w800`}
                  alt={`Foto ${activeSlide + 1}`}
                  className="h-full w-full object-cover"
                />

                {/* Remove button */}
                <button
                  type="button"
                  onClick={() => removePhoto(activeSlide)}
                  className="absolute right-2 top-2 rounded-lg bg-rose-600/90 px-2.5 py-1 text-xs font-medium text-white shadow-lg backdrop-blur-sm transition-all hover:bg-rose-700"
                >
                  Remover
                </button>

                {/* Slide counter */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-brand-night/70 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                  {activeSlide + 1} / {photos.length}
                </div>

                {/* Nav arrows */}
                {photos.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={() => setActiveSlide((s) => (s === 0 ? photos.length - 1 : s - 1))}
                      className="absolute left-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-brand-night shadow-md backdrop-blur-sm transition-all hover:bg-white"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveSlide((s) => (s === photos.length - 1 ? 0 : s + 1))}
                      className="absolute right-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-brand-night shadow-md backdrop-blur-sm transition-all hover:bg-white"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                      </svg>
                    </button>
                  </>
                )}
              </>
            )}
          </div>

          {/* Thumbnail strip */}
          {photos.length > 0 && (
            <div className="mt-3 flex gap-2">
              {photos.map((photo, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActiveSlide(i)}
                  className={`h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
                    i === activeSlide
                      ? 'border-brand-ember shadow-glow'
                      : 'border-slate-200 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img
                    src={`https://drive.google.com/thumbnail?id=${photo.driveFileId}&sz=w100`}
                    alt={`Miniatura ${i + 1}`}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Add photo input */}
          {photos.length < 4 && (
            <div className="mt-3 flex gap-2">
              <input
                type="text"
                placeholder="ID do arquivo no Google Drive"
                value={newPhotoUrl}
                onChange={(e) => setNewPhotoUrl(e.target.value)}
                onKeyDown={handleKeyDown}
                className="form-field flex-1"
              />
              <button
                type="button"
                onClick={addPhoto}
                className="app-button-secondary whitespace-nowrap"
              >
                Adicionar
              </button>
            </div>
          )}
        </div>
      </form>
    </div>
  )
}
