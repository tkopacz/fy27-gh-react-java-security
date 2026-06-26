# Copilot instructions for this repository

This repository is currently a documentation-first demo plan for a React SPA + Java Spring Boot application that will demonstrate GitHub Copilot and GitHub Advanced Security (GHAS). There are no committed `frontend/package.json` or `backend/pom.xml` files yet; follow `docs/implementation-tasks/` when creating the runnable app.

## Build, test, and run commands

Use Windows-friendly commands in docs and examples.

### Frontend, once `frontend/` exists

```powershell
cd frontend
npm install
npm run dev
npm test
npm run build
```

Expected stack: Vite + React + TypeScript, Vitest, React Testing Library, `jsdom`, and `react-router-dom`. The local dev URL is expected to be Vite's default `http://localhost:5173`.

Run a single frontend test with Vitest, for example:

```powershell
cd frontend
npx vitest run src/components/ProductCard.test.tsx
```

### Backend, once `backend/` exists

```powershell
cd backend
mvn test
mvn spring-boot:run
```

Expected stack: Spring Boot with Maven, Java 17 or 21, `spring-boot-starter-web`, `spring-boot-starter-validation`, and `spring-boot-starter-test`. The backend should listen on `http://localhost:8080`.

Run a single backend test with Maven Surefire, for example:

```powershell
cd backend
mvn -Dtest=ProductControllerTest test
```

No lint command is documented or configured yet. Do not invent lint tooling unless the task is to add it.

## Codespaces and dev containers

- `.devcontainer/devcontainer.json` defines the preferred Codespaces environment with Node.js 22, Java 21, Maven, Docker-in-Docker, and a PostgreSQL service from `.devcontainer/docker-compose.yml`.
- The dev container requests a larger Codespaces host: 4 CPUs, 16 GB RAM, and 32 GB storage.
- Forwarded ports are `5173` for Vite, `8080` for Spring Boot, and `5432` for PostgreSQL.
- PostgreSQL defaults are for local demo development only: database `demo`, user `demo`, password `demo`.

## MCP servers

- `.vscode/mcp.json` configures the Playwright MCP server for browser-based inspection and automation of the planned React frontend.
- Use Playwright MCP for end-to-end browser checks and demo flow validation after starting the frontend dev server.

## High-level architecture

- The intended app is a monorepo with `frontend/` for the React SPA and `backend/` for the Spring Boot API. Current executable implementation guidance lives in `docs/implementation-tasks/05-java-backend-app.md` and `docs/implementation-tasks/06-react-frontend-app.md`.
- The domain is a simple shop demo. Backend exposes `GET /api/products`, `GET /api/products/{id}`, and `POST /api/orders`; frontend routes include `/products`, `/order`, `/security-demo`, and `/login`, with `/` redirecting to `/products`.
- Frontend HTTP code belongs in a service layer (`frontend/src/services/apiClient.ts`, `productsApi.ts`, `ordersApi.ts`). Components and hooks should not own raw fetch details. `apiClient` reads the base URL from `import.meta.env.VITE_API_BASE_URL`.
- Backend validation errors should use a React-friendly JSON shape:

```json
{
  "message": "Validation failed",
  "fieldErrors": [
    { "field": "email", "message": "must be a well-formed email address" }
  ]
}
```

- GHAS is part of the product, not an afterthought: planned workflows include CodeQL for `javascript-typescript` and `java-kotlin`, Dependabot for npm/Maven/GitHub Actions, and Dependency Review on PRs.
- The demo intentionally contrasts frontend and backend security. React/JS examples cover DOM XSS, URL-param XSS, open redirect, token storage, and prototype pollution. Java examples cover SQL injection, path traversal, deserialization, and XXE.

## Repository-specific conventions

- Documentation is in Polish; code identifiers may be in English.
- Commit messages should use a storyteller style: explain the change as a concise narrative of intent, context, and outcome rather than only listing touched files.
- Code changes should include professional comments where they clarify intent, security/demo context, tradeoffs, or non-obvious behavior; avoid comments that merely restate the code.
- Vulnerable demo code must be clearly isolated under `security-demo` or `demo-scenarios` and include the exact comment `DEMO ONLY - intentionally vulnerable`.
- Do not commit real secrets. Secret Scanning demos should use placeholders or official test patterns only.
- Do not keep intentionally vulnerable npm dependencies on `main`; show them on a dedicated demo branch or as a `.diff`.
- Keep vulnerable and safe variants side by side so GHAS/CodeQL demos can compare them directly.
- `/security-demo` must be clearly marked as demo-only and must not auto-run destructive payloads.
- Frontend `VITE_*` values are public bundle data. Never treat them as secrets.
- Backend CORS for local development should allow `http://localhost:5173` and methods `GET`, `POST`, and `OPTIONS`; do not configure wildcard origins with credentials.
- `POST /api/orders` must not log PII.
- Planned demo branches include `demo/react-xss`, `demo/react-open-redirect`, `demo/java-sql-injection`, `demo/npm-vulnerable-dependency`, and `demo/secret-scanning`.

## Key source docs

- `react-java-research.md` contains the research narrative for why React needs separate security analysis from Java.
- `docs/implementation-tasks/README.md` defines the demo goals and implementation rules.
- `docs/implementation-tasks/00-plan-realizacji.md` defines implementation phases, MVP scope, and nonfunctional criteria.
- `docs/implementation-tasks/03-ghas-pipeline-pr-scenarios.md` defines GHAS workflow and PR demo scenarios.
- `docs/implementation-tasks/04-demo-docs-runbook.md` defines the presenter runbook expectations.
