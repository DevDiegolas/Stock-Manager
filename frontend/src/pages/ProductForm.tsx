import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { productService } from '../services/productService'
import type { ProductPhoto } from '../types/product'
import { resolvePhotoUrl } from '../utils/photoUrl'

const CATEGORIES = ['Biquíni', 'Calcinha', 'Sunga', 'Maiô', 'Saída de Praia', 'Outro']

const ChevLIcon = () => <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
const ChevRIcon = () => <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
const TrashIcon = () => <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/></svg>
const UploadIcon = () => <svg width={28} height={28} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><path d="M17 8l-5-5-5 5M12 3v12"/></svg>
const PlusIcon = () => <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>

interface PhotoSlot {
  photoRef: string
  previewUrl: string
  file?: File
  position: number
  id?: string
}

const fieldLabel: React.CSSProperties = { display: 'block', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: 6, fontWeight: 600, fontFamily: 'var(--font-body)' }
const fieldInput: React.CSSProperties = { width: '100%', padding: '10px 12px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg-elev-strong)', fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--text)', outline: 'none', transition: 'border 0.15s' }

export default function ProductForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEditing = !!id

  const [form, setForm] = useState({ name: '', category: 'Biquíni', measurement: '', size: '', color: '', price: '', quantity: '0' })
  const [originalQuantity, setOriginalQuantity] = useState(0)
  const [photos, setPhotos] = useState<PhotoSlot[]>([])
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
          quantity: p.quantity.toString(),
        })
        setOriginalQuantity(p.quantity)
        if (p.photos && p.photos.length > 0) {
          setPhotos(p.photos.map((ph: ProductPhoto) => ({
            photoRef: ph.drive_file_id,
            previewUrl: resolvePhotoUrl(ph.drive_file_id, 800),
            position: ph.position,
            id: ph.id,
          })))
        }
      })
    }
  }, [id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      let productId = id
      if (isEditing) {
        await productService.update(id, {
          name: form.name,
          category: form.category,
          measurement: form.measurement || undefined,
          size: form.size || undefined,
          color: form.color,
          price: parseFloat(form.price),
        })
        const newQuantity = parseInt(form.quantity) || 0
        const diff = newQuantity - originalQuantity
        if (diff !== 0) await productService.adjustQuantity(id, diff, 'Ajuste manual via edição')
      } else {
        const created = await productService.create({
          name: form.name,
          category: form.category,
          measurement: form.measurement || undefined,
          size: form.size || undefined,
          color: form.color,
          price: parseFloat(form.price),
          quantity: parseInt(form.quantity) || 0,
          photos: [],
        })
        productId = created.id
      }

      if (productId) {
        for (const photo of photos) {
          if (!photo.id) {
            if (photo.file) await productService.uploadPhoto(productId, photo.file, photo.position)
            else await productService.addPhoto(productId, photo.photoRef, photo.position)
          }
        }
      }
      navigate('/products')
    } catch (err: unknown) {
      const errMessage =
        typeof err === 'object' && err !== null && 'response' in err &&
        typeof (err as { response?: { data?: { error?: string } } }).response?.data?.error === 'string'
          ? (err as { response?: { data?: { error?: string } } }).response?.data?.error
          : null
      setError(errMessage || 'Erro ao salvar produto')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const addPhoto = (file: File) => {
    if (photos.length >= 4) return
    const nextPosition = photos.length + 1
    const previewUrl = URL.createObjectURL(file)
    setPhotos(prev => [...prev, { photoRef: '', previewUrl, file, position: nextPosition }])
    setActiveSlide(photos.length)
  }

  const removePhoto = async (index: number) => {
    const photo = photos[index]
    if (photo.previewUrl.startsWith('blob:')) URL.revokeObjectURL(photo.previewUrl)
    if (isEditing && id && photo.id) await productService.deletePhoto(id, photo.id)
    const updated = photos.filter((_, i) => i !== index).map((p, i) => ({ ...p, position: i + 1 }))
    setPhotos(updated)
    if (activeSlide >= updated.length && updated.length > 0) setActiveSlide(updated.length - 1)
    else if (updated.length === 0) setActiveSlide(0)
  }

  const handleAddPhotoFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    addPhoto(file)
    e.target.value = ''
  }

  const qtyNumber = parseInt(form.quantity) || 0
  const qtyColor = qtyNumber === 0 ? 'var(--danger)' : qtyNumber <= 3 ? 'var(--warn)' : 'var(--success)'

  return (
    <div className="reveal" style={{ padding: '24px 28px 40px' }}>
      {error && (
        <div style={{ marginBottom: 16, padding: '10px 14px', borderRadius: 12, background: 'var(--danger-bg)', color: 'var(--danger)', fontSize: 13, fontWeight: 500 }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
       <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, alignItems: 'stretch' }}>
        {/* Left: info */}
        <div>
          <div className="panel-solid" style={{ padding: 22 }}>
            <h2 className="display" style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 600 }}>Informações da peça</h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
              <div>
                <label style={fieldLabel}>Nome</label>
                <input name="name" value={form.name} onChange={handleChange} style={fieldInput} placeholder="Biquíni Ibiza" required/>
              </div>
              <div>
                <label style={fieldLabel}>Categoria</label>
                <select name="category" value={form.category} onChange={handleChange} style={{ ...fieldInput, cursor: 'pointer' }}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 12 }}>
              <div>
                <label style={fieldLabel}>Cor</label>
                <input name="color" value={form.color} onChange={handleChange} style={fieldInput} placeholder="Coral" required/>
              </div>
              <div>
                <label style={fieldLabel}>Medida</label>
                <input name="measurement" value={form.measurement} onChange={handleChange} placeholder="P, M, G" style={fieldInput}/>
              </div>
              <div>
                <label style={fieldLabel}>Tamanho</label>
                <input name="size" value={form.size} onChange={handleChange} placeholder="36, 38, 40" style={fieldInput}/>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={fieldLabel}>Preço (R$)</label>
                <input name="price" type="number" step="0.01" min="0" value={form.price} onChange={handleChange} style={fieldInput} placeholder="189.00" required/>
              </div>
              <div>
                <label style={fieldLabel}>Quantidade</label>
                <input
                  name="quantity" type="number" min="0" value={form.quantity} onChange={handleChange} required
                  style={{ ...fieldInput, fontWeight: 600, color: qtyColor }}
                />
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
            <button type="submit" disabled={loading} className="btn-primary" style={{ flex: 1, justifyContent: 'center', padding: '12px' }}>
              {loading ? 'Salvando...' : isEditing ? 'Salvar alterações' : 'Cadastrar peça'}
            </button>
            <button type="button" onClick={() => navigate('/products')} className="btn-secondary" style={{ padding: '12px 20px' }}>
              Cancelar
            </button>
          </div>
        </div>

        {/* Right: photos */}
        <div className="panel-solid" style={{ padding: 22, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <h2 className="display" style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>Fotos</h2>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{photos.length}/4</span>
          </div>

          {/* Main carousel */}
          <div style={{
            position: 'relative',
            aspectRatio: '4/3',
            maxHeight: 360,
            borderRadius: 16,
            overflow: 'hidden',
            background: 'var(--bg)',
            border: photos.length === 0 ? '1.5px dashed var(--border)' : '1px solid var(--border)',
          }}>
            {photos.length === 0 ? (
              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 10, color: 'var(--text-subtle)' }}>
                <UploadIcon />
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>Nenhuma foto adicionada</div>
                  <div style={{ fontSize: 11, marginTop: 2 }}>envie até 4 imagens da peça</div>
                </div>
              </div>
            ) : (
              <>
                <img src={photos[activeSlide]?.previewUrl} alt={`Foto ${activeSlide + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>

                <button type="button" onClick={() => removePhoto(activeSlide)}
                  style={{ position: 'absolute', top: 10, right: 10, padding: '6px 10px', borderRadius: 8, background: 'rgba(225,29,72,0.9)', color: 'white', border: 'none', cursor: 'pointer', fontSize: 11, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 5, backdropFilter: 'blur(4px)' }}>
                  <TrashIcon /> Remover
                </button>

                {photos.length > 1 && (
                  <>
                    <button type="button" onClick={() => setActiveSlide(s => s === 0 ? photos.length - 1 : s - 1)}
                      style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,255,255,0.92)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)', boxShadow: 'var(--shadow-panel)' }}>
                      <ChevLIcon />
                    </button>
                    <button type="button" onClick={() => setActiveSlide(s => s === photos.length - 1 ? 0 : s + 1)}
                      style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,255,255,0.92)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)', boxShadow: 'var(--shadow-panel)' }}>
                      <ChevRIcon />
                    </button>
                    <div style={{ position: 'absolute', bottom: 12, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 5 }}>
                      {photos.map((_, i) => (
                        <button key={i} type="button" onClick={() => setActiveSlide(i)}
                          style={{ width: i === activeSlide ? 18 : 6, height: 6, borderRadius: 3, background: i === activeSlide ? 'white' : 'rgba(255,255,255,0.55)', border: 'none', cursor: 'pointer', transition: 'all 0.2s', padding: 0 }}/>
                      ))}
                    </div>
                  </>
                )}
              </>
            )}
          </div>

          {/* Thumbnails + add button */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {photos.map((photo, i) => (
              <button key={i} type="button" onClick={() => setActiveSlide(i)} style={{
                width: 60, height: 60, flexShrink: 0, borderRadius: 10, overflow: 'hidden',
                border: `2px solid ${i === activeSlide ? 'var(--ember)' : 'var(--border)'}`,
                cursor: 'pointer', padding: 0, opacity: i === activeSlide ? 1 : 0.65, transition: 'all 0.15s',
                boxShadow: i === activeSlide ? 'var(--shadow-glow)' : 'none',
              }}>
                <img src={photo.previewUrl} alt={`Miniatura ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
              </button>
            ))}

            {photos.length < 4 && (
              <label style={{
                width: 60, height: 60, flexShrink: 0, borderRadius: 10,
                border: '1.5px dashed var(--border)', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--text-subtle)', background: 'var(--bg)', transition: 'border-color 0.15s',
              }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = 'var(--ember)'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'}>
                <input type="file" accept="image/*" onChange={handleAddPhotoFile} style={{ display: 'none' }}/>
                <PlusIcon />
              </label>
            )}
          </div>
        </div>
       </div>
      </form>
    </div>
  )
}
