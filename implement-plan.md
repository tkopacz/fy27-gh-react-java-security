# Implementation plan: React SPA + Java + GHAS demo

## Current state

This repository is currently a documentation-first project. It already contains:

- Research narrative in `react-java-research.md` explaining why secure Java does not make a React SPA secure.
- A detailed implementation backlog in `docs/implementation-tasks/`.
- Repository instructions in `.github/copilot-instructions.md`.
- Codespaces/devcontainer configuration with Node.js 22, Java 21/Maven, Docker-in-Docker, and PostgreSQL 16.
- Playwright MCP configuration in `.vscode/mcp.json`.

The runnable app does not exist yet. There is no committed `frontend/package.json`, `backend/pom.xml`, GitHub Actions workflow, Dependabot config, or demo application code.

## Target outcome

Build a demonstrable monorepo that supports a customer conversation around this thesis:

> A secure Java backend does not automatically secure the React SPA. React runs in the browser, has its own attack surface, and needs JavaScript/TypeScript analysis plus npm supply-chain controls.

The completed repository should provide:

- A Spring Boot backend exposing product and order APIs.
- A Vite React TypeScript SPA consuming that backend.
- Safe and intentionally vulnerable demo examples for React/JS and Java.
- GHAS automation for CodeQL, Dependabot, Dependency Review, and Secret Scanning demos.
- Presenter-ready documentation, promptbook, runbook, PR scenarios, and pre-demo checklist.
- A reproducible Codespaces path for development and demo preparation.

## Non-negotiable conventions

- Documentation should be in Polish; code identifiers may be in English.
- Use Windows-friendly commands in docs and examples.
- Vulnerable demo code must be isolated under `security-demo` or `demo-scenarios`.
- Every intentionally vulnerable code file must include the exact comment `DEMO ONLY - intentionally vulnerable`.
- Never commit real secrets. Secret Scanning demos must use placeholders or official test patterns only.
- Do not keep intentionally vulnerable npm dependencies on `main`; demonstrate them through a dedicated branch or `.diff`.
- Keep safe and vulnerable variants side by side for comparison.
- Add professional comments where they clarify demo/security intent, tradeoffs, or non-obvious behavior.
- Commit messages should use storyteller style: intent, context, and outcome.

## Execution strategy

Implement in vertical slices, not as isolated folders. Each phase should leave the repository in a coherent state with passing validation for the completed surfaces. Prefer the MVP path first, then expand to the full demo.

### Phase 1: Repository foundation

Create the monorepo shell and root documentation.

Key changes:

- Create `frontend/`, `backend/`, `demo-scenarios/`, and `.github/workflows/`.
- Expand root `README.md` in Polish with:
  - repository purpose,
  - warning about intentionally vulnerable demo code,
  - frontend/backend run commands,
  - links to demo scenarios and `react-java-research.md`,
  - note that frontend `VITE_*` variables are public bundle data.

Acceptance gate:

- Expected folders exist.
- Root README explains the Copilot + GHAS demo and the intentional vulnerability policy.
- No runnable-code assumptions are documented before the app exists.

Source tasks: `FND-001`.

### Phase 2: Java backend baseline

Build the Spring Boot API first so frontend types and API calls have a stable contract.

Recommended implementation choices:

- Use Java 21 to match `.devcontainer/devcontainer.json`.
- Use Maven and Spring Boot.
- Start with deterministic in-memory repositories; PostgreSQL is available in Codespaces for later persistence, but MVP docs allow in-memory/H2.
- Keep package root `com.example.demo`.

Key changes:

- Create `backend/pom.xml`, `DemoApplication`, and a context-load test.
- Add `product` package:
  - `Product`,
  - `ProductRepository`,
  - `ProductController`.
- Add `order` package:
  - `OrderRequest`,
  - `OrderResponse`,
  - `OrderService`,
  - `OrderController`.
- Add `common` package:
  - `ApiErrorResponse`,
  - `ValidationError`,
  - `GlobalExceptionHandler`.
- Add local CORS config for `http://localhost:5173` with `GET`, `POST`, and `OPTIONS`; avoid wildcard origins with credentials.
- Add backend README and `docs/runbook-backend.md`.

API contract:

- `GET /api/products` returns deterministic product JSON.
- `GET /api/products/{id}` returns product JSON or 404.
- `POST /api/orders` returns 201 with `{ orderId, status, message }`.
- Validation failures return:

```json
{
  "message": "Validation failed",
  "fieldErrors": [
    { "field": "email", "message": "must be a well-formed email address" }
  ]
}
```

Validation gate:

```powershell
cd backend
mvn test
mvn spring-boot:run
```

Manual checks:

```powershell
curl http://localhost:8080/api/products
```

Also verify valid and invalid `POST /api/orders` requests.

Source tasks: `FND-003`, `JAVA-APP-001` through `JAVA-APP-007`, `JAVA-APP-009`, `JAVA-APP-010`.

### Phase 3: React frontend baseline

Build the SPA after the backend contract exists.

Recommended implementation choices:

- Use Vite + React + TypeScript.
- Use Vitest + React Testing Library + `jsdom`.
- Use React Router.
- Use `react-hook-form`, `zod`, and preferably `@hookform/resolvers` for the order form.
- Keep raw HTTP work in `frontend/src/services/`, not in components.

Key changes:

- Create Vite React TypeScript app under `frontend/`.
- Add routes:
  - `/products`,
  - `/order`,
  - `/security-demo`,
  - `/login`,
  - redirect `/` to `/products`.
- Add domain types:
  - `Product`,
  - `OrderRequest`,
  - `OrderResponse`,
  - `ApiErrorResponse`,
  - `ValidationError`.
- Add config:
  - `frontend/.env.example`,
  - `frontend/src/config.ts`,
  - `VITE_API_BASE_URL=http://localhost:8080`.
- Add service layer:
  - `apiClient.ts`,
  - `productsApi.ts`,
  - `ordersApi.ts`.
- Add ProductCard, products page, `useProducts`, OrderForm, and order page.
- Add frontend README and `docs/runbook-frontend.md`.

Behavior details:

- `ProductCard` must support click, Enter, Space, focus, and accessible labels.
- `useProducts` must support `data`, `loading`, `error`, `refetch`, `AbortController`, and 401 handling.
- `OrderForm` must show Polish validation messages and map backend `fieldErrors` to form fields.
- Do not put secrets in env or code.

Validation gate:

```powershell
cd frontend
npm install
npm test
npm run build
npm run dev
```

Single-test examples:

```powershell
cd frontend
npx vitest run src/components/ProductCard.test.tsx
npx vitest run src/hooks/useProducts.test.ts
```

Manual checks with backend running:

- `/products` displays backend products.
- `/order` submits a valid order.
- `/order` maps invalid backend responses to field errors.

Source tasks: `FND-002`, `FND-004`, `REACT-APP-001` through `REACT-APP-007`, `REACT-APP-009`, `REACT-APP-010`, `REACT-APP-011`, `COP-001` through `COP-004`.

### Phase 4: Copilot demo assets

Turn the working app into a repeatable Copilot demo.

Key changes:

- Ensure ProductCard, `useProducts`, and OrderForm are demo-quality examples with tests.
- Add `frontend/src/legacy/LegacyProductList.jsx` as class-component refactor material; it does not need to be wired into the app.
- Add `backend/src/main/java/com/example/demo/order/OrderControllerPrompt.java.txt` as non-compiling prompt material.
- Create `docs/copilot-promptbook.md`.

Promptbook must include:

- Context.
- Main prompt.
- Expected outcome.
- Shorter prompt variant.
- More detailed prompt variant.
- What to say to the customer.

Required prompts:

- ProductCard component.
- `useProducts` hook.
- OrderForm with React Hook Form and Zod.
- Refactor legacy class component to hooks.
- Java OrderController.
- Generate React Testing Library tests.
- Review component for accessibility and performance.
- Explain a CodeQL alert.

Validation gate:

- Promptbook can reproduce the demo without author knowledge.
- Demo code and prompt assets match actual files and paths.

Source tasks: `COP-001` through `COP-005`, `DOC-002`.

### Phase 5: React/JS security demo

Add controlled frontend security examples that demonstrate risks Java cannot see.

Key changes:

- Add `frontend/src/security-demo/` examples:
  - `VulnerableUserProfile.tsx`,
  - `SafeUserProfile.tsx`,
  - `VulnerableSearchPage.tsx`,
  - `VulnerableRedirect.ts`,
  - `SafeRedirect.ts`,
  - `VulnerableTokenStorage.ts`,
  - `TokenStorageNotes.md`,
  - `VulnerableMerge.ts`,
  - `SafeMerge.ts`.
- Add tests for safe redirect and safe merge.
- Add or complete `/security-demo` UI and `/security-demo/search`.

Required scenarios:

- DOM XSS through `dangerouslySetInnerHTML`.
- URL parameter XSS with visible source-to-sink flow.
- Client-side open redirect.
- Cleartext token storage in localStorage.
- Prototype pollution through unsafe recursive merge.

Safety requirements:

- Do not auto-run destructive payloads.
- Make all vulnerable examples demo-only.
- Make the UI explain what CodeQL query is relevant and why backend Java cannot see the issue.

Validation gate:

```powershell
cd frontend
npm test
npm run build
```

Source tasks: `SEC-JS-001` through `SEC-JS-005`, `REACT-APP-008`, `DOC-006`.

### Phase 6: Java security demo

Add backend security examples isolated from business logic.

Key changes:

- Add `backend/src/main/java/com/example/demo/securitydemo/` examples:
  - `VulnerableSqlExample.java`,
  - `SafeSqlExample.java`,
  - `VulnerableFileDownload.java`,
  - `SafeFileDownload.java`,
  - `VulnerableDeserialization.java`,
  - `SafeJsonParsing.java`,
  - `VulnerableXmlParser.java`,
  - `SafeXmlParser.java`.
- Add tests where safe variants need proof:
  - `SafeFileDownloadTest`,
  - `SafeXmlParserTest`.

Required scenarios:

- SQL injection with `Statement` and concatenated SQL.
- Path traversal from untrusted filename.
- Unsafe deserialization using `ObjectInputStream`.
- XXE with an unsafe XML parser.

Safety requirements:

- Vulnerable files must be demo-only.
- Safe variants should be testable and documented.
- Keep these examples separate from production API paths.

Validation gate:

```powershell
cd backend
mvn test
```

Source tasks: `JAVA-APP-008`, `SEC-JAVA-001` through `SEC-JAVA-004`.

### Phase 7: GHAS automation

Wire the repository so GHAS can demonstrate separate JavaScript/TypeScript and Java findings plus supply-chain controls.

Key changes:

- Add `.github/workflows/codeql.yml`:
  - triggers: `push`, `pull_request`, `schedule`,
  - languages: `javascript-typescript`, `java-kotlin`,
  - query suite: prefer `security-extended` for demo coverage.
- Add `.github/dependabot.yml`:
  - npm at `/frontend`,
  - Maven at `/backend`,
  - GitHub Actions at `/`.
- Add `.github/workflows/dependency-review.yml`:
  - trigger on `pull_request`,
  - use Dependency Review action,
  - fail on high/critical vulnerabilities,
  - comment that branch protection must make the check required to block merges.

Validation gate:

- Workflows are syntactically valid.
- CodeQL runs for both language ecosystems.
- Dependency graph sees npm and Maven manifests after frontend/backend exist.
- Dependency Review can fail a PR that adds a vulnerable dependency.

Source tasks: `GHAS-001`, `GHAS-002`, `GHAS-003`.

### Phase 8: Demo scenarios and presenter docs

Create the materials that make the repository usable in a customer presentation.

Key changes:

- Add `docs/demo-script.md`.
- Add `docs/client-objections.md`.
- Add `docs/runbook.md`.
- Add `docs/pre-demo-checklist.md`.
- Add `docs/codeql-alerts-guide.md`.
- Add `demo-scenarios/dependency-review/npm-vulnerable-package.md`.
- Add `demo-scenarios/dependency-review/package-json-patch.diff`.
- Add `demo-scenarios/secret-scanning/README.md`.
- Add `demo-scenarios/secret-scanning/fake-env-example.txt`.
- Add PR scenario docs:
  - `demo-scenarios/pr-react-xss.md`,
  - `demo-scenarios/pr-java-sql-injection.md`,
  - `demo-scenarios/pr-npm-vulnerable-dependency.md`.

Presenter docs must preserve the research narrative:

- Copilot: 55% faster JavaScript task completion in GitHub research; 46% code overall and 61% Java from February 2023 GitHub data.
- Do not claim "46% more tests"; research doc says not to use that.
- Main customer message: Java scans protect Java risks; React needs JS/TS analysis for browser risks.
- Explain Dependency Review as a PR gate only when its check is required by branch protection.
- Explain Secret Scanning without committing real secrets.

Validation gate:

- Every documented demo file path exists.
- Every scenario says what to show, what to say, expected outcome, and cleanup/avoid-merge guidance.
- `docs/pre-demo-checklist.md` can be executed before a meeting without source-code knowledge.

Source tasks: `GHAS-004` through `GHAS-006`, `PR-001` through `PR-003`, `DOC-001`, `DOC-003` through `DOC-005`.

### Phase 9: End-to-end demo hardening

Run the full demo path and fix gaps discovered during integration.

End-to-end validation:

```powershell
cd backend
mvn test
mvn spring-boot:run
```

In another terminal:

```powershell
cd frontend
npm test
npm run build
npm run dev
```

Manual browser checks:

- Open `http://localhost:5173/products`.
- Confirm products load from `http://localhost:8080/api/products`.
- Open `/order`, submit valid and invalid orders.
- Open `/security-demo` and verify all scenarios are reachable and clearly demo-only.
- Use Playwright MCP for browser-flow inspection once the frontend is running.

Repository checks:

- No real secrets.
- No vulnerable dependency is committed to `main`.
- Vulnerable code is isolated and commented.
- Safe variants have tests where planned.
- README and runbooks point to real commands and paths.

Source tasks: `JAVA-APP-010`, `REACT-APP-011`, final cross-check of `DOC-007`.

## Suggested execution order

1. Foundation and root README.
2. Backend API contract and tests.
3. Frontend app, service layer, and core UI.
4. Local frontend-backend integration.
5. Copilot demo assets and promptbook.
6. React/JS security examples and UI.
7. Java security examples.
8. GHAS workflows and Dependabot.
9. Demo scenarios and presenter documentation.
10. End-to-end validation and final README/runbook alignment.

## MVP boundary

For the first usable demo, complete:

- `FND-001`, `FND-002`, `FND-003`, `FND-004`.
- `JAVA-APP-001` through `JAVA-APP-010`.
- `REACT-APP-001` through `REACT-APP-011`.
- `COP-001`, `COP-002`, `COP-003`, `COP-004`, `COP-005`.
- `SEC-JS-001`, `SEC-JS-002`, `SEC-JS-003`.
- `SEC-JAVA-001`, `SEC-JAVA-002`.
- `GHAS-001`, `GHAS-002`, `GHAS-003`, `GHAS-005`.
- `DOC-001`, `DOC-002`, `DOC-004`, `DOC-006`.

After MVP, add prototype pollution, token storage notes, unsafe deserialization, XXE, full CodeQL guide, PR scenarios, objections doc, and pre-demo checklist.

## Key risks and mitigations

| Risk | Mitigation |
|---|---|
| Demo vulnerabilities accidentally look production-ready | Isolate under `security-demo` or `demo-scenarios`, add required demo-only comments, and keep vulnerable examples out of normal business flows. |
| Frontend and backend contracts drift | Implement backend contract first, mirror TypeScript types from API JSON, and validate `/products` and `/order` end to end. |
| Dependency Review demo pollutes `main` | Keep vulnerable npm dependency as branch-only patch and document close-without-merge cleanup. |
| Secret Scanning demo leaks real data | Use placeholders or official test patterns only; never use live-looking credentials. |
| CodeQL expected alerts do not appear | Keep vulnerable source-to-sink flows simple, documented, and aligned to listed CodeQL query IDs. |
| Documentation references stale paths | Finish with a path audit against the generated app and scenario files. |

## Definition of done

The repository is ready when:

- Frontend and backend run locally and in Codespaces.
- React fetches products from Java and submits orders.
- Tests and builds pass for completed surfaces.
- Security demo contains controlled vulnerable and safe examples for React/JS and Java.
- CodeQL, Dependabot, and Dependency Review are configured.
- Demo scenario docs explain how to create PRs without merging unsafe changes.
- Presenter docs let a new person run the demo and answer customer objections.
- No real secrets or permanently vulnerable dependencies are committed to `main`.
