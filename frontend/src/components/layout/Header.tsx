import { useAuth } from '../../context/AuthContext'

export function Header() {
  const { user } = useAuth()

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-800">
          Bem-vindo, {user?.name}
        </h2>
      </div>
    </header>
  )
}
