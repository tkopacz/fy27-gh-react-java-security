# fy27-gh-react-java-security

Ten repo jest dokumentacyjno-implementacyjnym demo dla pokazania, dlaczego bezpieczny backend Java nie zabezpiecza automatycznie React SPA. Projekt łączy prosty sklep demo, przykłady podatności po stronie frontendu i backendu oraz workflowy GHAS.

## Zasady demo

- Kod podatny jest wyraźnie oznaczony jako `DEMO ONLY - intentionally vulnerable`.
- Przykłady podatności są izolowane w katalogach `frontend/src/security-demo` i `backend/src/main/java/com/example/demo/securitydemo`.
- Wartości `VITE_*` są publiczne w bundlu frontendu — nie traktuj ich jak sekretów.

## Uruchamianie lokalne

### Backend

```powershell
cd backend
$env:JAVA_HOME = "C:\Program Files\Java\jdk-21"
$env:Path = "$env:JAVA_HOME\bin;$env:Path"
mvn test
mvn spring-boot:run
```

### Frontend

```powershell
cd frontend
npm install
npm test
npm run build
npm run dev
```

## Najważniejsze ścieżki

- `react-java-research.md` — narracja biznesowa i badawcza.
- `docs/implementation-tasks/` — szczegółowy backlog implementacyjny.
- `docs/runbook.md` — przewodnik prowadzącego demo.
- `docs/codeql-alerts-guide.md` — jak pokazać alerty CodeQL.
- `demo-scenarios/` — scenariusze PR i zależności.
