import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Dashboard from '../pages/Dashboard'

describe('Dashboard', () => {
  afterEach(() => vi.restoreAllMocks())

  it('renders username in nav', () => {
    render(<Dashboard username="admin" onLogout={() => {}} />)
    expect(screen.getByText('admin')).toBeInTheDocument()
  })

  it('renders Home and Tickets nav buttons', () => {
    render(<Dashboard username="admin" onLogout={() => {}} />)
    expect(screen.getByRole('button', { name: /^home$/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /^tickets$/i })).toBeInTheDocument()
  })

  it('Home is active by default', () => {
    render(<Dashboard username="admin" onLogout={() => {}} />)
    expect(screen.getByRole('button', { name: /^home$/i })).toHaveClass('text-blue-700')
  })

  it('clicking Tickets makes it active', async () => {
    const user = userEvent.setup()
    render(<Dashboard username="admin" onLogout={() => {}} />)
    await user.click(screen.getByRole('button', { name: /^tickets$/i }))
    expect(screen.getByRole('button', { name: /^tickets$/i })).toHaveClass('text-blue-700')
    expect(screen.getByRole('button', { name: /^home$/i })).not.toHaveClass('text-blue-700')
  })

  it('calls onLogout when Sign out is clicked', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({ ok: true })
    const onLogout = vi.fn()
    const user = userEvent.setup()
    render(<Dashboard username="admin" onLogout={onLogout} />)
    await user.click(screen.getByRole('button', { name: /sign out/i }))
    await waitFor(() => expect(onLogout).toHaveBeenCalled())
  })
})
