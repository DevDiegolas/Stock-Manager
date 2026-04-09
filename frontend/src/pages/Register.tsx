import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await register(name, email, password)
      navigate('/')
    } catch {
      setError('Erro ao criar conta. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-stage">
      <div className="auth-orb -left-24 bottom-8 h-80 w-80 animate-float bg-brand-aqua/70" />
      <div className="auth-orb right-0 top-10 h-72 w-72 animate-drift bg-brand-ember/70" />

      <div className="relative mx-auto grid min-h-screen w-full max-w-6xl grid-cols-1 items-center gap-10 px-4 py-10 lg:grid-cols-2 lg:px-8">
        <section className="order-2 animate-revealUp lg:order-1">
          <div className="auth-card mx-auto max-w-md lg:mx-0">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Cadastro</p>
            <h2 className="font-display text-3xl font-bold text-brand-night">Criar nova conta</h2>
            <p className="mt-2 text-sm text-slate-500">Em segundos, seu painel ja fica pronto para controlar o estoque.</p>

            {error && (
              <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 animate-revealUp delayed-2">
                {error}
              </div>
            )}

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
                  placeholder="No minimo 6 caracteres"
                  minLength={6}
                  required
                />
              </div>

              <button type="submit" disabled={loading} className="auth-action animate-revealUp delayed-3 disabled:opacity-60">
                {loading ? 'Criando conta...' : 'Criar conta'}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-500">
              Ja tem conta?{' '}
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
              O sistema junta cadastro rapido com historico completo para voce saber exatamente o que mudou no estoque.
            </p>
            <div className="mt-8 grid gap-3">
              <div className="rounded-2xl border border-slate-200/70 bg-white/90 px-4 py-3 shadow-sm">
                <p className="text-sm font-semibold text-brand-night">Historico automatico de movimentacoes</p>
              </div>
              <div className="rounded-2xl border border-slate-200/70 bg-white/90 px-4 py-3 shadow-sm">
                <p className="text-sm font-semibold text-brand-night">Dashboard com produtos ativos e inativos</p>
              </div>
              <div className="rounded-2xl border border-slate-200/70 bg-white/90 px-4 py-3 shadow-sm">
                <p className="text-sm font-semibold text-brand-night">Busca e navegacao mais fluidas</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
