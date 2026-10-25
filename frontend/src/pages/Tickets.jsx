import { useEffect, useState } from 'react'

const STATUS_LABELS = {
  NEW: 'New',
  OPEN: 'Open',
  AI_RESPONDED: 'AI Responded',
  PENDING_HUMAN: 'Pending Human',
  RESOLVED: 'Resolved',
  CLOSED: 'Closed',
}

const STATUS_COLORS = {
  NEW: 'bg-blue-100 text-blue-700',
  OPEN: 'bg-yellow-100 text-yellow-700',
  AI_RESPONDED: 'bg-purple-100 text-purple-700',
  PENDING_HUMAN: 'bg-orange-100 text-orange-700',
  RESOLVED: 'bg-green-100 text-green-700',
  CLOSED: 'bg-gray-100 text-gray-500',
}

const CATEGORY_LABELS = {
  BILLING: 'Billing',
  TECHNICAL: 'Technical',
  GENERAL: 'General',
  OTHER: 'Other',
}

export default function Tickets({ onSelectTicket }) {
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [categoryFilter, setCategoryFilter] = useState('ALL')

  const [showForm, setShowForm] = useState(false)
  const [newEmail, setNewEmail] = useState('')
  const [newSubject, setNewSubject] = useState('')
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    fetch('/api/tickets')
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(data => setTickets(data))
      .catch(() => setError('Failed to load tickets'))
      .finally(() => setLoading(false))
  }, [])

  const filtered = tickets.filter(t => {
    const matchesStatus = statusFilter === 'ALL' || t.status === statusFilter
    const matchesCategory = categoryFilter === 'ALL' || t.category === categoryFilter
    const q = search.toLowerCase()
    const matchesSearch = !q ||
      t.subject?.toLowerCase().includes(q) ||
      t.customerEmail?.toLowerCase().includes(q)
    return matchesStatus && matchesCategory && matchesSearch
  })

  async function handleCreate(e) {
    e.preventDefault()
    setCreating(true)
    try {
      const res = await fetch('/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerEmail: newEmail, subject: newSubject }),
      })
      if (res.ok) {
        const created = await res.json()
        setTickets(prev => [created, ...prev])
        setNewEmail('')
        setNewSubject('')
        setShowForm(false)
      }
    } finally {
      setCreating(false)
    }
  }

  if (loading) return <p className="text-gray-400 text-sm p-6">Loading tickets...</p>
  if (error) return <p className="text-red-500 text-sm p-6">{error}</p>

  return (
    <div className="p-6 max-w-6xl mx-auto w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Tickets</h2>
        <button
          onClick={() => setShowForm(v => !v)}
          className="px-4 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
        >
          + New Ticket
        </button>
      </div>

      {/* New ticket form */}
      {showForm && (
        <form onSubmit={handleCreate} className="mb-4 p-4 bg-white border border-gray-200 rounded-lg flex gap-3 items-end">
          <div className="flex-1">
            <label className="block text-xs text-gray-500 mb-1">Customer Email</label>
            <input
              type="email"
              value={newEmail}
              onChange={e => setNewEmail(e.target.value)}
              required
              className="w-full border border-gray-200 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
              placeholder="customer@example.com"
            />
          </div>
          <div className="flex-1">
            <label className="block text-xs text-gray-500 mb-1">Subject</label>
            <input
              type="text"
              value={newSubject}
              onChange={e => setNewSubject(e.target.value)}
              required
              className="w-full border border-gray-200 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
              placeholder="Issue description"
            />
          </div>
          <button
            type="submit"
            disabled={creating}
            className="px-4 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {creating ? 'Creating...' : 'Create'}
          </button>
          <button
            type="button"
            onClick={() => setShowForm(false)}
            className="px-4 py-1.5 text-sm text-gray-500 hover:text-gray-700"
          >
            Cancel
          </button>
        </form>
      )}

      {/* Filters */}
      <div className="flex gap-3 mb-4">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by subject or email..."
          className="flex-1 border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
        />
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
        >
          <option value="ALL">All Statuses</option>
          {Object.entries(STATUS_LABELS).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
        <select
          value={categoryFilter}
          onChange={e => setCategoryFilter(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
        >
          <option value="ALL">All Categories</option>
          {Object.entries(CATEGORY_LABELS).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        {filtered.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-10">No tickets found</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Subject</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Customer</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Status</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Category</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(ticket => (
                <tr
                  key={ticket.id}
                  onClick={() => onSelectTicket(ticket.id)}
                  className="hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <td className="px-4 py-3 text-gray-800 font-medium">{ticket.subject}</td>
                  <td className="px-4 py-3 text-gray-500">{ticket.customerEmail}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[ticket.status]}`}>
                      {STATUS_LABELS[ticket.status] ?? ticket.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{CATEGORY_LABELS[ticket.category] ?? ticket.category}</td>
                  <td className="px-4 py-3 text-gray-400">
                    {ticket.createdAt ? new Date(ticket.createdAt).toLocaleDateString() : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
