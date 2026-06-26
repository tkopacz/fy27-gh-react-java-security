# fy27-gh-react-java-security

> ⚠️ **CONFERENCE DEMO REPOSITORY** ⚠️
>
> This repository is **intentionally built for live conference and workshop demonstrations**.
> It contains **deliberately vulnerable code** for educational purposes.
> **Do NOT use any of the vulnerable patterns shown here in production systems.**

---

This demo shows why a secure Java backend does **not** automatically protect a React SPA.
The project combines a simple shop application with frontend and backend vulnerability examples,
and full GitHub Advanced Security (GHAS) workflows — CodeQL, Dependency Review, and Secret Scanning.

Licensed under the [MIT License](LICENSE).

## ⚠️ Demo rules

- All vulnerable code is clearly marked with the comment `DEMO ONLY - intentionally vulnerable`.
- Vulnerability examples are isolated in `frontend/src/security-demo/` and `backend/src/main/java/com/example/demo/securitydemo/`.
- `VITE_*` values are public bundle data — never treat them as secrets.
- Never copy vulnerable patterns to production code.

## Running locally

### Backend (Java 21 + Maven required)

```powershell
cd backend
$env:JAVA_HOME = "C:\Program Files\Java\jdk-21"
$env:Path = "$env:JAVA_HOME\bin;$env:Path"
mvn test
mvn spring-boot:run
```

Backend starts at `http://localhost:8080`.

### Frontend (Node.js 22 + npm required)

```powershell
cd frontend
npm install
npm test
npm run build
npm run dev
```

Frontend starts at `http://localhost:5173`.

## Key paths

- `react-java-research.md` — business and research narrative.
- `docs/implementation-tasks/` — detailed implementation backlog.
- `docs/runbook.md` — presenter runbook for demo sessions.
- `docs/codeql-alerts-guide.md` — how to walk through CodeQL alerts live.
- `demo-scenarios/` — PR and dependency demo scenarios.
- `frontend/src/security-demo/` — React XSS, open redirect, prototype pollution examples.
- `backend/src/main/java/com/example/demo/securitydemo/` — Java SQL injection, XXE, path traversal examples.

## GitHub Advanced Security (GHAS) workflows

| Workflow | Purpose |
|---|---|
| CodeQL (javascript-typescript) | Finds XSS, open redirect, prototype pollution in React/TS |
| CodeQL (java-kotlin) | Finds SQL injection, XXE, path traversal in Spring Boot |
| Dependency Review | Blocks PRs introducing high-severity vulnerable dependencies |
| Secret Scanning | Detects accidentally committed credentials |
