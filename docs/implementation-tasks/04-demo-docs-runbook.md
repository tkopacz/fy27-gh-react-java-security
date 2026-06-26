# Zadania: dokumentacja demo, runbook i checklisty

## DOC-001: Przygotowac glowny skrypt prezentacji

**Cel:** Prowadzacy ma gotowy scenariusz 45-60 minut.

**Plik:**

```text
docs/demo-script.md
```

**Wymagana struktura:**

1. Otwarcie:
   - „Java jest bezpieczna. Czy React tez?”
2. Copilot ROI:
   - 55% szybciej,
   - 46% kodu,
   - 61% Java.
3. Demo Copilot:
   - ProductCard,
   - useProducts,
   - OrderForm,
   - Java OrderController.
4. GHAS React:
   - DOM XSS,
   - open redirect,
   - token storage.
5. GHAS Java:
   - SQL injection,
   - path traversal.
6. Supply chain:
   - Dependabot,
   - Dependency Review.
7. Secret Scanning:
   - `.env`,
   - Vite public env,
   - push protection.
8. Zamkniecie:
   - „GHAS zabezpiecza czesc aplikacji, ktorej Java nie widzi.”

**Acceptance criteria:**

- Kazdy blok ma:
  - co pokazac,
  - co powiedziec,
  - jaki plik otworzyc,
  - jaki efekt jest oczekiwany.

**Zaleznosci:** `COP-001`, `COP-002`, `COP-003`, `SEC-JS-001`, `SEC-JAVA-001`.

---

## DOC-002: Przygotowac Copilot promptbook

**Cel:** Zbior promptow do live coding i Agent mode.

**Plik:**

```text
docs/copilot-promptbook.md
```

**Prompty wymagane:**

- ProductCard component.
- useProducts hook.
- OrderForm with React Hook Form and Zod.
- Refactor legacy class component to hooks.
- Java OrderController.
- Generate React Testing Library tests.
- Review component for accessibility and performance.
- Explain CodeQL alert.

**Dla kazdego promptu podac:**

- kontekst,
- prompt,
- oczekiwany efekt,
- wariant krotszy,
- wariant bardziej szczegolowy,
- co powiedziec klientowi.

**Acceptance criteria:**

- Promptbook pozwala odtworzyc demo bez przygotowania.

**Zaleznosci:** `COP-001`, `COP-002`, `COP-003`, `COP-004`, `COP-005`.

---

## DOC-003: Przygotowac dokument obiekcji klienta

**Cel:** Gotowe odpowiedzi na typowe opory klienta.

**Plik:**

```text
docs/client-objections.md
```

**Obiekcje do pokrycia:**

- „Mamy bezpieczna Jave.”
- „React domyslnie chroni przed XSS.”
- „Robimy code review.”
- „Mamy WAF.”
- „Mamy audyt raz w roku.”
- „npm audit wystarczy.”
- „To bedzie generowac za duzo alertow.”
- „Frontend nie ma sekretow.”

**Dla kazdej obiekcji podac:**

- krotka odpowiedz,
- techniczne uzasadnienie,
- ktory plik/scenariusz pokazac,
- jedno zdanie retoryczne do uzycia na spotkaniu.

**Acceptance criteria:**

- Dokument jest po polsku.
- Kazda obiekcja odwoluje sie do konkretnego demo w repo.

**Zaleznosci:** `DOC-001`, `SEC-JS-001`, `GHAS-003`.

---

## DOC-004: Przygotowac runbook lokalnego uruchomienia

**Cel:** Kazdy moze uruchomic demo lokalnie.

**Plik:**

```text
docs/runbook.md
```

**Tresci wymagane:**

### Frontend

```powershell
cd frontend
npm install
npm run dev
npm test
npm run build
```

### Backend

```powershell
cd backend
mvn test
mvn spring-boot:run
```

### Demo

- URL frontendu.
- URL backendu.
- Jak sprawdzic `/api/products`.
- Jak wejsc na `/security-demo`.

**Acceptance criteria:**

- Komendy sa Windows-friendly.
- Nie zakladaja Linux shell.

**Zaleznosci:** `FND-002`, `FND-003`.

---

## DOC-005: Przygotowac pre-demo checklist

**Cel:** Ograniczyc ryzyko nieudanego demo.

**Plik:**

```text
docs/pre-demo-checklist.md
```

**Checklist:**

- GHAS enabled.
- CodeQL workflow zakonczony sukcesem.
- Dependabot enabled.
- Dependency Review workflow enabled.
- Branch protection ma required checks.
- Secret Scanning enabled.
- Push Protection enabled.
- Copilot extension zalogowany.
- Frontend uruchamia sie lokalnie.
- Backend uruchamia sie lokalnie.
- Testowe PR-y sa przygotowane.
- Nie ma prawdziwych sekretow w repo.

**Acceptance criteria:**

- Checklist da sie przejsc w 5-10 minut przed spotkaniem.

**Zaleznosci:** `GHAS-001`, `GHAS-002`, `GHAS-003`, `GHAS-005`.

---

## DOC-006: Przygotowac strone Security Demo w aplikacji

**Cel:** Prowadzacy moze klikac scenariusze w UI, nie tylko pokazywac pliki.

**Pliki:**

```text
frontend/src/pages/SecurityDemoPage.tsx
frontend/src/pages/SecurityDemoPage.test.tsx
```

**Elementy strony:**

- Sekcja React/JS:
  - DOM XSS,
  - open redirect,
  - token storage,
  - prototype pollution.
- Sekcja Java:
  - SQL injection,
  - path traversal,
  - unsafe deserialization,
  - XXE.
- Przy kazdym scenariuszu:
  - co pokazuje,
  - jaki query CodeQL powinien zadzialac,
  - link do pliku z kodem.

**Acceptance criteria:**

- `/security-demo` dziala.
- Strona nie wykonuje destrukcyjnych payloadow.
- Podatne przyklady sa opisane jako demo-only.

**Zaleznosci:** `SEC-JS-001`, `SEC-JS-002`, `SEC-JS-003`, `SEC-JAVA-001`.

---

## DOC-007: Przygotowac finalny indeks zadan i statusow

**Cel:** Latwo planowac i uruchamiac implementacje.

**Plik:**

```text
docs/implementation-tasks/task-index.md
```

**Tabela:**

| ID | Nazwa | Epic | Priorytet | Zaleznosci | Status |
|---|---|---|---|---|---|

**Statusy:**

- `todo`
- `in-progress`
- `done`
- `blocked`

**Acceptance criteria:**

- Wszystkie zadania z plikow `01-04` sa ujeto w indeksie.
- Priorytet MVP jest oznaczony.

**Zaleznosci:** wszystkie pliki zadan.

