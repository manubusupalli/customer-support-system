import { useEffect, useState } from 'react'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'

export default function App() {
  const [user, setUser] = useState(null)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.ok ? res.json() : null)
      .then(data => setUser(data?.username ?? null))
      .catch(() => setUser(null))
      .finally(() => setChecking(false))
  }, [])

  if (checking) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <span className="text-gray-400 text-sm">Loading...</span>
      </div>
    )
  }

  if (!user) {
    return <Login onLogin={username => setUser(username)} />
  }

  return <Dashboard username={user} onLogout={() => setUser(null)} />
}
