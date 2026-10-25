# Customer Support Management System — MVP Plan

## Problem
Customer emails are unorganized and hard to manage. Need a centralized system to handle, categorize, and respond to them efficiently.

---

## Solution Overview
Incoming customer emails are converted to tickets, auto-categorized and auto-responded by AI where possible, with a single admin agent handling anything the AI can't resolve.

---

## How It Works
- Customer sends an email to the support email address
- A webhook captures the email and creates a ticket in the system
- AI auto-categorizes the ticket (e.g. billing, technical, general)
- AI attempts to auto-respond using a knowledge base
- If AI cannot respond confidently, ticket stays open for the admin
- Admin logs in, reviews the ticket thread, and responds manually
- All replies (AI or human) are shown as a thread on the ticket

---

## Features

### Email Ingestion
- Webhook-based email capture (inbound emails trigger ticket creation)
- Duplicate/loop detection to avoid repeat tickets from auto-replies

### Ticket Management
- Auto-create ticket from each inbound email
- Ticket statuses: **New → Open → AI Responded → Pending Human → Resolved → Closed**
- Full reply thread visible on each ticket (customer emails + agent/AI responses)
- Ticket categorization (AI-assigned, admin can override)

### AI Auto-Response
- AI reads email and searches knowledge base for an answer
- If confident, sends reply and marks ticket as "AI Responded"
- If not confident, escalates to admin (ticket becomes "Pending Human")

### Knowledge Base
- Admin uploads a PDF or Word document as the knowledge base
- AI uses the uploaded document to answer customer emails
- Admin can replace the document at any time

### Admin Dashboard
- Total tickets per day
- Ticket volume over time (chart)
- Tickets by category/bucket
- Ticket status breakdown (chart)
- AI vs Human response ratio
- Average response time
- Resolution rate

### Auth & Security
- Single admin login (email + password)
- Secure session management
- No customer-facing login — customers interact via email only

---

## Out of Scope (MVP)
- Multiple agent accounts or role-based access
- Mobile app
- Live chat or any non-email channels
- Customer portal or ticket tracking for customers
- CRM or third-party integrations (Salesforce, Zendesk, etc.)
- SLA enforcement or automated escalation timers
- Attachment handling in emails
- Bulk ticket actions
- Email templates library
- Localization / multi-language support
- Advanced spam filtering
- Reporting exports (CSV/PDF)
