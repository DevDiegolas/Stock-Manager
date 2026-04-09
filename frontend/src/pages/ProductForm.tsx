import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { productService } from '../services/productService'

const categories = ['Biquini', 'Calcinha', 'Sunga', 'Maio', 'Saida de Praia', 'Outro']

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

  return (
    <div className="page-shell max-w-3xl">
      <div className="mb-6">
        <span className="pill-badge">Produto</span>
        <h1 className="page-title mt-3">{isEditing ? 'Editar Produto' : 'Novo Produto'}</h1>
        <p className="page-subtitle">Preencha os dados para manter seu catalogo completo e organizado.</p>
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="app-card space-y-4">
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
              placeholder="Ex: P, M, G, GG"
              className="form-field"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Tamanho</label>
            <input
              name="size"
              value={form.size}
              onChange={handleChange}
              placeholder="Ex: 36, 38, 40"
              className="form-field"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Preco (R$)</label>
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
          <label className="mb-1 block text-sm font-medium text-slate-700">Descricao</label>
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
      </form>
    </div>
  )
}
