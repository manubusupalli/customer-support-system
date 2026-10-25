# Tech Stack

## Backend
- **Spring Boot** — REST API, business logic, email webhook handling, AI integration

## Frontend
- **React + Vite** — Admin UI (ticket list, ticket detail/thread, dashboard, knowledge base upload)
- **Tailwind CSS** — Styling

## Database
- **PostgreSQL** — Tickets, messages/threads, categories, knowledge base metadata, admin user

## AI
- **Claude API (Anthropic)** — Email categorization and auto-response generation

## Email
- **Webhook (inbound email service)** — Captures incoming emails and pushes to backend (e.g. SendGrid, Mailgun, or Postmark inbound)

## Auth
- **Spring Security + JWT** — Admin login and session management

## File Handling
- Knowledge base PDF/Word file stored on the server; parsed at upload time for AI use
