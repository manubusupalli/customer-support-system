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

## Testing

### Backend Tests (9 tests total)

Requires PostgreSQL running on `localhost:5432` for integration tests.

```
cd backend
./mvnw.cmd test          # Windows
./mvnw test              # Mac/Linux
```

**Unit tests** (web layer only, no DB):
- [HealthControllerTest.java](backend/src/test/java/com/customersupport/backend/HealthControllerTest.java) — `GET /api/health` returns 200. Uses `@Import(SecurityConfig.class)` — required so `permitAll()` applies instead of default Basic Auth.
- [AuthControllerTest.java](backend/src/test/java/com/customersupport/backend/AuthControllerTest.java) — `/api/auth/me` unauthenticated → 401; with `@WithMockUser` → 200.

**Integration tests** (full Spring context + real PostgreSQL):
- [AuthIntegrationTest.java](backend/src/test/java/com/customersupport/backend/AuthIntegrationTest.java) — login/logout/session flow. `@Transactional` rolls back any DB state after each test.

**Spring Boot 4 import note**: `@WebMvcTest` and `@AutoConfigureMockMvc` moved to `org.springframework.boot.webmvc.test.autoconfigure.*` (was `org.springframework.boot.test.autoconfigure.web.servlet.*` in Boot 3).

### Frontend Component Tests (9 tests total)

No backend required — `fetch` is mocked with `vi.spyOn(globalThis, 'fetch')`.

```
cd frontend
npm test
```

Test files in [frontend/src/test/](frontend/src/test/):
- [Login.test.jsx](frontend/src/test/Login.test.jsx) — renders form, 401 error, network error, success calls `onLogin`
- [Dashboard.test.jsx](frontend/src/test/Dashboard.test.jsx) — renders username, nav buttons, active state, sign out calls `onLogout`

Vitest picks up only `src/test/**/*.test.{js,jsx}` (configured in `vite.config.js`) — the `e2e/` folder is excluded.

### E2E Tests (4 tests total)

Both backend (port 8081) and frontend (port 3000) must be running.

```
cd frontend
npx playwright install chromium   # first time only
npm run test:e2e
```

Test file: [frontend/e2e/auth.spec.js](frontend/e2e/auth.spec.js) — login page shown unauthenticated, valid login → dashboard, sign out → login, invalid credentials → error.
