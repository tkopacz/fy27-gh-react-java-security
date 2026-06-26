# Plan realizacji

## Definicja gotowosci calego demo

Repo jest gotowe, gdy:

- frontend React uruchamia sie lokalnie,
- backend Java uruchamia sie lokalnie,
- frontend komunikuje sie z backendem,
- sa gotowe scenariusze Copilot do live codingu,
- sa gotowe podatne i bezpieczne warianty kodu dla React/JS oraz Java,
- CodeQL skanuje oba jezyki,
- Dependency Review dziala na pull requestach,
- Dependabot monitoruje npm i Maven,
- dokumentacja prowadzi prezentera krok po kroku.

## Kolejnosc implementacji

### Faza 1: Fundament aplikacji

1. Utworzyc strukture monorepo.
2. Zrealizowac oddzielny plan backendu Java z `05-java-backend-app.md`.
3. Zrealizowac oddzielny plan aplikacji React z `06-react-frontend-app.md`.
4. Dodac wspolny model domenowy: produkty i zamowienia.
5. Doprowadzic do dzialajacego lokalnego end-to-end: React pobiera produkty z Java API.

### Faza 2: Copilot demo

1. Dodac `ProductCard`.
2. Dodac `useProducts`.
3. Dodac `OrderForm`.
4. Dodac legacy komponent do refaktoru.
5. Dodac promptbook do powyzszych scenariuszy.

### Faza 3: Security demo

1. Dodac podatnosci React/JS:
   - DOM XSS,
   - open redirect,
   - cleartext token storage,
   - prototype pollution.
2. Dodac podatnosci Java:
   - SQL injection,
   - path traversal,
   - unsafe deserialization,
   - XXE.
3. Do kazdej podatnosci dodac wariant bezpieczny i komentarz demo.

### Faza 4: GHAS pipeline

1. Dodac CodeQL workflow.
2. Dodac Dependabot.
3. Dodac Dependency Review workflow.
4. Dodac scenariusze PR do pokazania alertow.
5. Dodac dokumentacje Secret Scanning demo bez prawdziwych sekretow.

### Faza 5: Dokumentacja prezentacyjna

1. Dodac `docs/demo-script.md`.
2. Dodac `docs/copilot-promptbook.md`.
3. Dodac `docs/client-objections.md`.
4. Dodac `docs/pre-demo-checklist.md`.
5. Dodac `docs/runbook.md`.

## MVP do pierwszego pokazu

Jesli trzeba szybko uzyskac wartosc demonstracyjna, zrealizowac tylko:

- `FND-001`, `FND-002`, `FND-003`
- `JAVA-APP-001` - `JAVA-APP-009`
- `REACT-APP-001` - `REACT-APP-010`
- `COP-001`, `COP-002`, `COP-003`
- `SEC-JS-001`, `SEC-JS-002`, `SEC-JS-003`
- `SEC-JAVA-001`, `SEC-JAVA-002`
- `GHAS-001`, `GHAS-002`
- `DOC-001`, `DOC-002`

## Sugerowane branche demo

| Branch | Cel |
|---|---|
| `demo/react-xss` | PR z podatnoscia DOM XSS w React |
| `demo/react-open-redirect` | PR z client-side open redirect |
| `demo/java-sql-injection` | PR z podatnoscia SQL injection w Javie |
| `demo/npm-vulnerable-dependency` | PR pokazujacy Dependency Review |
| `demo/secret-scanning` | Instrukcyjny branch do omowienia push protection, bez prawdziwych sekretow |

## Kryteria niefunkcjonalne

- README i dokumentacja maja byc po polsku.
- Nazwy kodu moga byc po angielsku.
- Kazdy podatny plik musi miec komentarz `DEMO ONLY - intentionally vulnerable`.
- Testy bezpiecznych wariantow powinny przechodzic.
- Podatne warianty moga byc wykluczone z produkcyjnych sciezek UI, ale musza byc dostepne do CodeQL demo.
