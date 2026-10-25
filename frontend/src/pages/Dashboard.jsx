import { useState } from 'react'
import Tickets from './Tickets'
import TicketDetail from './TicketDetail'

export default function Dashboard({ username, onLogout }) {
  const [activePage, setActivePage] = useState('home')
  const [selectedTicketId, setSelectedTicketId] = useState(null)

  function openTicket(id) {
    setSelectedTicketId(id)
    setActivePage('ticket-detail')
  }

  function backToTickets() {
    setSelectedTicketId(null)
    setActivePage('tickets')
  }

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    onLogout()
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top nav */}
      <nav className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <span className="font-semibold text-gray-800">Customer Support</span>
          <div className="flex gap-1">
            <button
              onClick={() => setActivePage('home')}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                activePage === 'home'
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => setActivePage('tickets')}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                activePage === 'tickets'
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Tickets
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">{username}</span>
          <button
            onClick={handleLogout}
            className="text-sm text-gray-500 hover:text-red-600 transition-colors"
          >
            Sign out
          </button>
        </div>
      </nav>

      {/* Page content */}
      <main className="flex-1 flex flex-col">
        {activePage === 'home' && (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-gray-400 text-sm">Home page coming soon</p>
          </div>
        )}
        {activePage === 'tickets' && (
          <Tickets onSelectTicket={openTicket} />
        )}
        {activePage === 'ticket-detail' && selectedTicketId && (
          <TicketDetail ticketId={selectedTicketId} onBack={backToTickets} />
        )}
      </main>
    </div>
  )
}
