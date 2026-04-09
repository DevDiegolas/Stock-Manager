import { useState, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Toast, type ToastType } from '../components/ui/Toast'
import axios from 'axios'

interface ToastState {
  message: string
  type: ToastType
}

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState<ToastState | null>(null)
  const { register } = useAuth()
  const navigate = useNavigate()

  const showToast = useCallback((message: string, type: ToastType = 'error') => {
    setToast({ message, type })
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setToast(null)

    const trimmedName = name.trim()
    const trimmedEmail = email.trim()

    if (!trimmedName) {
      showToast('Informe seu nome para continuar.')
      return
    }
    if (!trimmedEmail) {
      showToast('Informe seu email para continuar.')
      return
    }
    if (!password) {
      showToast('Crie uma senha para sua conta.')
      return
    }
    if (password.length < 6) {
      showToast('A senha precisa ter pelo menos 6 caracteres.', 'warning')
      return
    }

    setLoading(true)
    try {
      await register(trimmedName, trimmedEmail, password)
      navigate('/')
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const msg = err.response?.data?.error || ''
        if (msg.includes('email already registered') || msg.includes('duplicate')) {
          showToast('Este email já está cadastrado. Tente fazer login.')
        } else if (msg.includes('password must be')) {
          showToast('A senha precisa ter pelo menos 6 caracteres.', 'warning')
        } else if (msg.includes('required')) {
          showToast('Preencha todos os campos obrigatórios.')
        } else if (!err.response) {
          showToast('Servidor fora do ar. Tente novamente em instantes.', 'warning')
        } else {
          showToast('Erro ao criar conta. Tente novamente.')
        }
      } else {
        showToast('Erro ao criar conta. Tente novamente.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-stage">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="auth-orb -left-24 bottom-8 h-80 w-80 animate-float bg-brand-aqua/70" />
      <div className="auth-orb right-0 top-10 h-72 w-72 animate-drift bg-brand-ember/70" />

      <div className="relative mx-auto grid min-h-screen w-full max-w-6xl grid-cols-1 items-center gap-10 px-4 py-10 lg:grid-cols-2 lg:px-8">
        <section className="order-2 animate-revealUp lg:order-1">
          <div className="auth-card mx-auto max-w-md lg:mx-0">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Cadastro</p>
            <h2 className="font-display text-3xl font-bold text-brand-night">Criar nova conta</h2>
            <p className="mt-2 text-sm text-slate-500">Em segundos, seu painel já fica pronto para controlar o estoque.</p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div className="animate-revealUp delayed-1">
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Nome</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="form-field"
                  placeholder="Seu nome"
                  required
                />
              </div>

              <div className="animate-revealUp delayed-2">
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-field"
                  placeholder="você@email.com"
                  required
                />
              </div>

              <div className="animate-revealUp delayed-3">
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Senha</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-field"
                  placeholder="No mínimo 6 caracteres"
                  minLength={6}
                  required
                />
              </div>

              <button type="submit" disabled={loading} className="auth-action animate-revealUp delayed-3 disabled:opacity-60">
                {loading ? 'Criando conta...' : 'Criar conta'}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-500">
              Já tem conta?{' '}
              <Link to="/login" className="font-semibold text-brand-night underline-offset-4 transition hover:text-brand-aqua hover:underline">
                Entrar
              </Link>
            </p>
          </div>
        </section>

        <section className="order-1 hidden animate-revealUp lg:order-2 lg:block">
          <div className="mx-auto max-w-md rounded-3xl border border-white/60 bg-white/70 p-8 shadow-panel backdrop-blur-xl">
            <p className="inline-flex rounded-full bg-brand-night px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white">
              Fluxo inteligente
            </p>
            <h1 className="mt-5 font-display text-5xl font-bold leading-tight text-brand-night">
              Crie, ajuste e acompanhe tudo em tempo real.
            </h1>
            <p className="mt-4 text-base text-slate-600">
              O sistema junta cadastro rápido com histórico completo para você saber exatamente o que mudou no estoque.
            </p>
            <div className="mt-8 grid gap-3">
              <div className="rounded-2xl border border-slate-200/70 bg-white/90 px-4 py-3 shadow-sm">
                <p className="text-sm font-semibold text-brand-night">Histórico automático de movimentações</p>
              </div>
              <div className="rounded-2xl border border-slate-200/70 bg-white/90 px-4 py-3 shadow-sm">
                <p className="text-sm font-semibold text-brand-night">Dashboard com produtos ativos e inativos</p>
              </div>
              <div className="rounded-2xl border border-slate-200/70 bg-white/90 px-4 py-3 shadow-sm">
                <p className="text-sm font-semibold text-brand-night">Busca e navegação mais fluidas</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
