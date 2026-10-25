# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Customer support management system where inbound customer emails become tickets, auto-categorized and auto-responded by AI, with a single admin agent handling escalations. See `PROJECT_PLAN.md` for full feature scope and `TECH_STACK.md` for decisions.

## Repository Structure

```
customer-support-system/
├── backend/        Spring Boot 4.x (Java 21, Maven)
└── frontend/       React 18 + Vite 5 (JavaScript, no TypeScript)
```

## Running the Apps

Both must be started manually — there is no root-level script.

**Backend** (runs on port 8081):
```
cd backend
./mvnw.cmd spring-boot:run          # Windows
./mvnw spring-boot:run              # Mac/Linux
```
Logs are written to `backend-log.txt` and `backend-err.txt` in the project root when started via background process.

**Frontend** (runs on port 3000):
```
cd frontend
npm install   # first time only
npm run dev
```

**After any new Java file is added**, the backend must be fully restarted — DevTools does not recompile new source files automatically when running via `mvnw spring-boot:run`.

## Backend Architecture

- **Package**: `com.customersupport.backend`
- **Spring Boot 4.1.2**, Java 21, Maven
- **Database**: PostgreSQL on `localhost:5432`, database `customer_support`, credentials in `application.properties`
- `ddl-auto=update` — Hibernate auto-manages the schema; no manual migrations needed yet
- **Security**: `SecurityConfig.java` currently permits all requests (auth to be implemented)
- New controllers go in `com.customersupport.backend` (flat package for now; introduce sub-packages as features grow)
- Lombok is wired via annotation processor — use `@Data`, `@Builder`, `@NoArgsConstructor` etc. freely on entities

## Frontend Architecture

- **JavaScript** (not TypeScript) — all source files are `.jsx` / `.js`
- Vite proxies `/api/*` → `http://localhost:8081` — all backend calls use relative `/api/...` paths, never hardcoded ports
- Tailwind CSS via PostCSS — configured in `tailwind.config.js` and `postcss.config.js`
- Entry: `src/main.jsx` → `src/App.jsx`

## Key Configuration

| Setting | Value |
|---|---|
| Backend port | 8081 |
| Frontend port | 3000 |
| DB name | customer_support |
| DB user | postgres |
| DB password | admin |

## Running Tests

```
cd backend
./mvnw.cmd test
```
