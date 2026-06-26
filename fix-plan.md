# Fix plan: gaps found in the React + Java + GHAS demo

This plan lists concrete gaps found while auditing the repository against
`implement-plan.md` and the goal of a *perfect* React + Java + GHAS security demo.
Validation status at audit time: backend `mvn test` passes, frontend `npm test`
(8 tests) passes, `npm run build` passes, all GHAS workflows are syntactically
valid, every `Vulnerable*` file carries the exact `DEMO ONLY - intentionally
vulnerable` comment, and research claims in `react-java-research.md` match the
plan (the `46% więcej testów` claim is correctly marked "do not use").

The items below are ordered by impact on a working live demo.

---

## P1 — Blocking for the GHAS Dependency Review demo

### 1. `package-json-patch.diff` adds a non-vulnerable package (`left-pad`)
- File: `demo-scenarios/dependency-review/package-json-patch.diff`
- Problem: the patch adds `left-pad@^1.3.0`. `left-pad` has **no known security
  advisory**, so `dependency-review-action` (configured with
  `fail-on-severity: high`) will **not** fail the PR. The entire "show the
  Dependency Review failure" scenario silently does nothing.
- Fix: replace with a package that has a known **high/critical** GHSA advisory,
  e.g. `lodash@4.17.4` (CVE-2019-10744 prototype pollution, Critical) or
  `minimist@1.2.0`. Keep the JSON valid (insert before `@hookform/resolvers`,
  matching current `frontend/package.json` context).
- Also update the prose that names the package / behavior:
  - `demo-scenarios/dependency-review/npm-vulnerable-package.md`
  - `demo-scenarios/pr-npm-vulnerable-dependency.md`
- Verify after fix: `git apply --check` against `frontend/package.json`, and that
  the chosen version still appears in the GitHub Advisory DB at `high`+ severity.

---

## P2 — Required for a working server-side demo

### 2. The implemented app is not committed to git
- Observation: only **18 files are tracked**; `backend/`, `frontend/`,
  `.github/workflows/`, `.github/dependabot.yml`, `demo-scenarios/`, and most of
  `docs/` are **untracked**.
- Impact: CodeQL, Dependabot, and Dependency Review all run **server-side on
  GitHub**. None of them will execute until the code, workflows, and manifests
  are committed and pushed to `main`. This is the single largest gap to a live
  GHAS demo.
- Fix: commit the full app + workflows + docs to `main` (storyteller-style
  commit messages per repo convention), push, and confirm the Actions tab shows
  CodeQL running for both `javascript-typescript` and `java-kotlin`, and that the
  Dependency graph detects `frontend/package.json` and `backend/pom.xml`.

### 3. `codeql-alerts-guide.md` covers only 4 of the 9 vulnerable scenarios
- File: `docs/codeql-alerts-guide.md`
- Problem: lists only `js/xss`, `js/client-side-unvalidated-url-redirection`,
  `java/sql-injection`, `java/path-injection`. Missing the query IDs for code
  that exists in the repo and that `SecurityDemoPage.tsx` already advertises:
  - `js/clear-text-storage-of-sensitive-data` → `VulnerableTokenStorage.ts`
  - `js/prototype-pollution-utility` → `VulnerableMerge.ts`
  - Java unsafe deserialization → `VulnerableDeserialization.java`
    (verify exact ID: `java/unsafe-deserialization`)
  - Java XXE → `VulnerableXmlParser.java`
    (verify exact ID: `java/xxe`)
- Fix: add the four missing entries with one line each on what triggers them and
  why backend Java cannot see the JS ones. Verify each query ID against the
  CodeQL query catalog so the guide matches what alerts actually appear.

---

## P3 — Documentation/path drift (correctness)

### 4. Backlog docs reference paths that do not exist in the implementation
- `docs/implementation-tasks/06-react-frontend-app.md:90` references
  `frontend/src/components/AppLayout.tsx`, but `AppLayout` was implemented
  **inline** inside `frontend/src/App.tsx`.
  - Fix (pick one): extract `AppLayout` into its own
    `frontend/src/components/AppLayout.tsx`, or correct the backlog reference.
- `docs/implementation-tasks/04-demo-docs-runbook.md:217` references
  `frontend/src/pages/SecurityDemoPage.test.tsx`, which **does not exist**.
  - Fix (pick one): add a `SecurityDemoPage.test.tsx` (renders the page,
    asserts the demo-only banner and the CodeQL query labels — also satisfies the
    promptbook "Generate React Testing Library tests" prompt), or correct the
    backlog reference.

---

## P4 — Demo quality enhancements (not blocking, but raise demo polish)

### 5. Three vulnerable JS modules are not wired into the UI
- `VulnerableRedirect.ts`, `VulnerableTokenStorage.ts`, and `VulnerableMerge.ts`
  are **not imported anywhere** (`SecurityDemoPage.tsx` only describes them in
  text). CodeQL still analyzes them as source, so alerts should fire, but there
  is no interactive live demo for open redirect / token storage / prototype
  pollution.
- Fix (optional, improves the demo): add small demo-only interactive triggers on
  `/security-demo` (e.g. a "next" param redirect button, a "store token" button,
  a merge form) next to their safe variants — keeping the existing safety rule of
  no auto-running destructive payloads.

### 6. Local build artifacts should not be committed
- On disk but not in `.gitignore`: `frontend/vite.config.js`,
  `frontend/vite.config.d.ts`, `frontend/tsconfig.app.tsbuildinfo`,
  `frontend/tsconfig.node.tsbuildinfo` (generated from `vite.config.ts` / tsc).
- Fix: add `*.tsbuildinfo` and the generated `vite.config.js`/`vite.config.d.ts`
  to `frontend/.gitignore` so only `vite.config.ts` is the source of truth, and
  ensure they are not staged when committing item #2.

---

## Suggested fix order
1. Item 1 (vulnerable dependency patch) — restores the Dependency Review demo.
2. Item 3 (CodeQL guide) + item 4 (path drift) + item 6 (gitignore) — cheap docs/config fixes.
3. Item 5 (interactive vulnerable UI) — optional polish.
4. Item 2 (commit + push everything to `main`) — do this **last**, after the
   above are correct, then verify all GHAS checks run on GitHub.

## Re-validation gates after fixes
- `cd backend && mvn test`
- `cd frontend && npm test && npm run build`
- `git apply --check demo-scenarios/dependency-review/package-json-patch.diff`
- Path audit: every path referenced in `docs/` and `demo-scenarios/` resolves.
- On GitHub: CodeQL runs for both languages; Dependency Review fails the
  vulnerable-dependency PR; Dependabot detects npm + Maven manifests.
