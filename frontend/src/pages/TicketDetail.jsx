import { useEffect, useState } from 'react'

const STATUS_OPTIONS = ['NEW', 'OPEN', 'AI_RESPONDED', 'PENDING_HUMAN', 'RESOLVED', 'CLOSED']
const STATUS_LABELS = {
  NEW: 'New', OPEN: 'Open', AI_RESPONDED: 'AI Responded',
  PENDING_HUMAN: 'Pending Human', RESOLVED: 'Resolved', CLOSED: 'Closed',
}
const CATEGORY_OPTIONS = ['BILLING', 'TECHNICAL', 'GENERAL', 'OTHER']
const CATEGORY_LABELS = { BILLING: 'Billing', TECHNICAL: 'Technical', GENERAL: 'General', OTHER: 'Other' }

const SENDER_STYLES = {
  customer: 'self-start bg-gray-100 text-gray-800',
  admin: 'self-end bg-blue-600 text-white',
  ai: 'self-end bg-purple-100 text-purple-800',
}

export default function TicketDetail({ ticketId, onBack }) {
  const [ticket, setTicket] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [replyBody, setReplyBody] = useState('')
  const [sending, setSending] = useState(false)

  useEffect(() => {
    setLoading(true)
    fetch(`/api/tickets/${ticketId}`)
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(data => setTicket(data))
      .catch(() => setError('Failed to load ticket'))
      .finally(() => setLoading(false))
  }, [ticketId])

  async function handleStatusChange(e) {
    const status = e.target.value
    const res = await fetch(`/api/tickets/${ticketId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    if (res.ok) {
      const updated = await res.json()
      setTicket(prev => ({ ...prev, status: updated.status }))
    }
  }

  async function handleCategoryChange(e) {
    const category = e.target.value
    const res = await fetch(`/api/tickets/${ticketId}/category`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ category }),
    })
    if (res.ok) {
      const updated = await res.json()
      setTicket(prev => ({ ...prev, category: updated.category }))
    }
  }

  async function handleReply(e) {
    e.preventDefault()
    if (!replyBody.trim()) return
    setSending(true)
    try {
      const res = await fetch(`/api/tickets/${ticketId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ body: replyBody }),
      })
      if (res.ok) {
        const msg = await res.json()
        setTicket(prev => ({ ...prev, messages: [...(prev.messages ?? []), msg] }))
        setReplyBody('')
      }
    } finally {
      setSending(false)
    }
  }

  if (loading) return <p className="text-gray-400 text-sm p-6">Loading...</p>
  if (error) return <p className="text-red-500 text-sm p-6">{error}</p>

  return (
    <div className="p-6 max-w-3xl mx-auto w-full">
      {/* Back */}
      <button
        onClick={onBack}
        className="text-sm text-blue-600 hover:underline mb-4 inline-block"
      >
        ← Back to tickets
      </button>

      {/* Metadata */}
      <div className="bg-white border border-gray-200 rounded-lg p-5 mb-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-1">{ticket.subject}</h2>
        <p className="text-sm text-gray-500 mb-4">{ticket.customerEmail}</p>
        <div className="flex gap-4">
          <div>
            <label className="block text-xs text-gray-400 mb-1">Status</label>
            <select
              value={ticket.status}
              onChange={handleStatusChange}
              className="border border-gray-200 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
            >
              {STATUS_OPTIONS.map(s => (
                <option key={s} value={s}>{STATUS_LABELS[s]}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Category</label>
            <select
              value={ticket.category}
              onChange={handleCategoryChange}
              className="border border-gray-200 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
            >
              {CATEGORY_OPTIONS.map(c => (
                <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Message thread */}
      <div className="bg-white border border-gray-200 rounded-lg p-5 mb-4 min-h-32">
        {ticket.messages?.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-4">No messages yet</p>
        ) : (
          <div className="flex flex-col gap-3">
            {ticket.messages?.map(msg => (
              <div key={msg.id} className={`max-w-lg px-4 py-2.5 rounded-2xl text-sm ${SENDER_STYLES[msg.sender] ?? 'self-start bg-gray-100'}`}>
                <p className="text-xs opacity-60 mb-1 capitalize">{msg.sender}</p>
                <p className="whitespace-pre-wrap">{msg.body}</p>
                <p className="text-xs opacity-50 mt-1">{msg.sentAt ? new Date(msg.sentAt).toLocaleString() : ''}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Reply box */}
      <form onSubmit={handleReply} className="bg-white border border-gray-200 rounded-lg p-4">
        <textarea
          value={replyBody}
          onChange={e => setReplyBody(e.target.value)}
          rows={3}
          placeholder="Write a reply..."
          className="w-full border border-gray-200 rounded px-3 py-2 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-blue-400 mb-3"
        />
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={sending || !replyBody.trim()}
            className="px-5 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {sending ? 'Sending...' : 'Send Reply'}
          </button>
        </div>
      </form>
    </div>
  )
}
