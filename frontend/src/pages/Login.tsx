import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await login(email, password)
      navigate('/')
    } catch {
      setError('Email ou senha invalidos')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-stage">
      <div className="auth-orb -left-20 top-10 h-72 w-72 animate-drift bg-brand-ember/70" />
      <div className="auth-orb right-[-6rem] top-1/2 h-80 w-80 animate-float bg-brand-aqua/70" />

      <div className="relative mx-auto grid min-h-screen w-full max-w-6xl grid-cols-1 items-center gap-10 px-4 py-10 lg:grid-cols-2 lg:px-8">
        <section className="hidden lg:block animate-revealUp">
          <div className="max-w-md">
            <p className="mb-4 inline-flex rounded-full bg-brand-night px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white">
              Inventory Experience
            </p>
            <h1 className="font-display text-5xl font-bold leading-tight text-brand-night">
              Estoque vivo, rapido e bonito.
            </h1>
            <p className="mt-5 text-base text-slate-600">
              Organize entradas e saidas em uma interface com feedback instantaneo e um fluxo muito mais fluido.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="rounded-2xl border border-white/70 bg-white/75 p-4 shadow-panel">
                <p className="text-xs uppercase tracking-wide text-slate-500">Produtos ativos</p>
                <p className="mt-2 font-display text-3xl font-bold text-brand-night">+150</p>
              </div>
              <div className="rounded-2xl border border-white/70 bg-white/75 p-4 shadow-panel">
                <p className="text-xs uppercase tracking-wide text-slate-500">Atualizacao</p>
                <p className="mt-2 font-display text-3xl font-bold text-brand-night">Live</p>
              </div>
            </div>
          </div>
        </section>

        <section className="animate-revealUp delayed-1">
          <div className="auth-card mx-auto max-w-md">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Acesso</p>
            <h2 className="font-display text-3xl font-bold text-brand-night">Entrar no Stock Manager</h2>
            <p className="mt-2 text-sm text-slate-500">Use sua conta para abrir o painel de controle.</p>

            {error && (
              <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 animate-revealUp delayed-2">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div className="animate-revealUp delayed-2">
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-field"
                  placeholder="voce@email.com"
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
                  placeholder="Digite sua senha"
                  required
                />
              </div>

              <button type="submit" disabled={loading} className="auth-action animate-revealUp delayed-3 disabled:opacity-60">
                {loading ? 'Entrando...' : 'Entrar'}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-500">
              Nao tem conta?{' '}
              <Link to="/register" className="font-semibold text-brand-night underline-offset-4 transition hover:text-brand-ember hover:underline">
                Criar conta
              </Link>
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}
