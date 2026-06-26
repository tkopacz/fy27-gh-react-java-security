# Zadania implementacyjne: React SPA + Java + GHAS demo

Ten folder zawiera wykonalny backlog zadan do zbudowania kodu demonstracyjnego na podstawie `react-java-research.md`.

## Cel implementacji

Powstac ma repo demonstracyjne, ktore pozwala pokazac klientowi:

1. GitHub Copilot przyspiesza tworzenie React SPA i backendu Java.
2. React SPA ma osobna powierzchnie ataku, niezalezna od bezpieczenstwa backendu Java.
3. GitHub Advanced Security wykrywa inne klasy podatnosci w JavaScript/TypeScript i inne w Javie.
4. Dependency Review, Dependabot i Secret Scanning maja realna wartosc dla frontendu npm.
5. Calosc da sie uruchomic lokalnie i pokazac w PR-ach na GitHub.

## Pliki z zadaniami

| Plik | Zakres |
|---|---|
| `00-plan-realizacji.md` | Kolejnosc prac, MVP, definicja gotowosci |
| `01-foundation-copilot-demo.md` | Monorepo, React SPA, Spring Boot, scenariusze Copilot |
| `02-security-demo-code.md` | Podatnosci React/JS i Java oraz bezpieczne warianty |
| `03-ghas-pipeline-pr-scenarios.md` | CodeQL, Dependabot, Dependency Review, Secret Scanning, PR scenarios |
| `04-demo-docs-runbook.md` | Dokumentacja prezentacji, promptbook, runbook, checklisty |
| `05-java-backend-app.md` | Oddzielny, wykonawczy plan napisania aplikacji Java backend end-to-end |
| `06-react-frontend-app.md` | Oddzielny, wykonawczy plan napisania aplikacji React SPA end-to-end |

## Zasady dla implementacji

- Kod podatny musi byc wyraznie oznaczony jako `DEMO ONLY` i trzymany w folderach `security-demo` albo `demo-scenarios`.
- Nie wolno commitowac prawdziwych sekretow. Secret Scanning demo ma uzywac tylko placeholderow albo oficjalnych testowych wzorcow.
- Podatne zaleznosci npm najlepiej pokazywac na osobnym branchu demo lub przez patch `.diff`, nie jako stale zaleznosci `main`.
- Kazde zadanie ma miec jasne acceptance criteria.
- Kazdy scenariusz demo ma miec kod podatny, kod bezpieczny i narracje: co pokazac klientowi.

## Minimalny zakres MVP

MVP wystarczy do pierwszej prezentacji:

1. React SPA z `ProductCard`, `useProducts`, `OrderForm`.
2. Spring Boot backend z `/api/products` i `/api/orders`.
3. React security demo: XSS, open redirect, token storage.
4. Java security demo: SQL injection i path traversal.
5. CodeQL workflow dla `javascript-typescript` i `java-kotlin`.
6. Dependency Review workflow.
7. `docs/demo-script.md` z pelnym przebiegiem prezentacji.
