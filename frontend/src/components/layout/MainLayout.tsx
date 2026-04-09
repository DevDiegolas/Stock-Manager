import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Header } from './Header'

export function MainLayout() {
  return (
    <div className="relative flex min-h-screen overflow-hidden bg-transparent">
      <div className="pointer-events-none absolute -left-24 top-0 h-72 w-72 rounded-full bg-brand-ember/20 blur-3xl" />
      <div className="pointer-events-none absolute right-[-4rem] top-1/3 h-80 w-80 rounded-full bg-brand-aqua/20 blur-3xl" />

      <Sidebar />
      <div className="relative z-10 flex flex-1 flex-col">
        <Header />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="rounded-3xl border border-white/60 bg-white/75 p-4 shadow-panel backdrop-blur-md sm:p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
