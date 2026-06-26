# Zadania: GHAS pipeline i scenariusze PR

## GHAS-001: Dodac CodeQL workflow

**Cel:** Automatyczne skanowanie JavaScript/TypeScript i Java.

**Plik:**

```text
.github/workflows/codeql.yml
```

**Wymagania:**

- Trigger:
  - `push`,
  - `pull_request`,
  - `schedule`.
- Jezyki:
  - `javascript-typescript`,
  - `java-kotlin`.
- Query suite:
  - na potrzeby demo preferowane `security-extended`.

**Acceptance criteria:**

- Workflow uruchamia sie na PR.
- GitHub pokazuje alerty dla JS/TS i Java.
- Dokumentacja opisuje, gdzie znalezc Security -> Code scanning.

**Zaleznosci:** `FND-002`, `FND-003`.

---

## GHAS-002: Dodac Dependabot configuration

**Cel:** Monitorowac zaleznosci npm, Maven i GitHub Actions.

**Plik:**

```text
.github/dependabot.yml
```

**Konfiguracja:**

```yaml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/frontend"
    schedule:
      interval: "weekly"
  - package-ecosystem: "maven"
    directory: "/backend"
    schedule:
      interval: "weekly"
  - package-ecosystem: "github-actions"
    directory: "/"
    schedule:
      interval: "weekly"
```

**Acceptance criteria:**

- GitHub rozpoznaje konfiguracje.
- Dependency graph obejmuje npm i Maven.

**Zaleznosci:** `FND-002`, `FND-003`.

---

## GHAS-003: Dodac Dependency Review workflow

**Cel:** Blokowac PR z podatnymi zaleznosciami.

**Plik:**

```text
.github/workflows/dependency-review.yml
```

**Wymagania:**

- Trigger: `pull_request`.
- Uzywa `actions/dependency-review-action`.
- Fail dla `high` i `critical`.
- W komentarzu workflow opisac, ze check trzeba ustawic jako required status check, aby blokowal merge.

**Acceptance criteria:**

- Workflow dziala na PR.
- Przy dodaniu podatnej zaleznosci check moze failowac.
- `docs/codeql-alerts-guide.md` albo `docs/demo-script.md` opisuje, jak pokazac blokade.

**Zaleznosci:** `GHAS-002`.

---

## GHAS-004: Przygotowac npm vulnerable dependency scenario

**Cel:** Pokazac Dependency Review bez stalego psucia `main`.

**Pliki:**

```text
demo-scenarios/dependency-review/npm-vulnerable-package.md
demo-scenarios/dependency-review/package-json-patch.diff
```

**Wymagania:**

- Opisac branch `demo/npm-vulnerable-dependency`.
- Patch ma dodawac historycznie podatna wersje paczki npm, np. znany vulnerable package z GitHub Advisory Database.
- Instrukcja:
  1. utworz branch,
  2. zastosuj patch,
  3. otworz PR,
  4. pokaz Dependency Review failure,
  5. zamknij PR bez merge.

**Acceptance criteria:**

- Podatna zaleznosc nie musi zostawac na `main`.
- Instrukcja jest bezpieczna i powtarzalna.

**Zaleznosci:** `GHAS-003`.

---

## GHAS-005: Przygotowac Secret Scanning demo bez prawdziwych sekretow

**Cel:** Pokazac ryzyko sekretow w React bez commitowania sekretow.

**Pliki:**

```text
demo-scenarios/secret-scanning/README.md
demo-scenarios/secret-scanning/fake-env-example.txt
frontend/.env.example
```

**Wymagania:**

- `frontend/.env.example` ma zawierac:

```text
VITE_API_BASE_URL=http://localhost:8080
# NIE UMIESZCZAJ SEKRETOW W VITE_*.
# Zmienne VITE_* sa osadzane w bundle frontendu.
```

- README ma wyjasniac:
  - dlaczego sekret w React bundle nie jest sekretem,
  - jak dziala push protection,
  - jak pokazac demo bez prawdziwego klucza,
  - czego nie robic.

**Acceptance criteria:**

- W repo nie ma prawdziwych sekretow.
- Scenariusz jest gotowy do omowienia z klientem.

**Zaleznosci:** `FND-002`.

---

## GHAS-006: Przygotowac CodeQL alert guide

**Cel:** Prowadzacy demo wie, jak pokazac alerty CodeQL.

**Plik:**

```text
docs/codeql-alerts-guide.md
```

**Tresci wymagane:**

- Gdzie wejsc w GitHub UI:
  - Security,
  - Code scanning.
- Jak pokazac alert na PR.
- Jak opowiedziec source -> flow -> sink.
- Jak odroznic alert JS od Java.
- Jak omowic Copilot Autofix.

**Acceptance criteria:**

- Dokument zawiera osobne sekcje dla:
  - `js/xss`,
  - `js/client-side-unvalidated-url-redirection`,
  - `java/sql-injection`,
  - `java/path-injection`.

**Zaleznosci:** `GHAS-001`, `SEC-JS-001`, `SEC-JAVA-001`.

---

## PR-001: Scenariusz PR `demo/react-xss`

**Cel:** Pokazac alert `js/xss` w pull requescie.

**Plik instrukcji:**

```text
demo-scenarios/pr-react-xss.md
```

**Kroki:**

1. Utworz branch `demo/react-xss`.
2. Dodaj albo zmodyfikuj `VulnerableSearchPage.tsx`.
3. Otworz PR do `main`.
4. Poczekaj na CodeQL.
5. Pokaz alert.
6. Pokaz narracje: „Java tego nie widzi”.

**Acceptance criteria:**

- Instrukcja zawiera spodziewany alert.
- Instrukcja zawiera gotowy tekst dla prezentera.

**Zaleznosci:** `SEC-JS-002`, `GHAS-001`.

---

## PR-002: Scenariusz PR `demo/java-sql-injection`

**Cel:** Pokazac kontrast: GHAS wykrywa tez Jave, ale inne klasy ryzyka.

**Plik instrukcji:**

```text
demo-scenarios/pr-java-sql-injection.md
```

**Kroki:**

1. Utworz branch `demo/java-sql-injection`.
2. Dodaj `VulnerableSqlExample.java`.
3. Otworz PR.
4. Pokaz alert `java/sql-injection`.
5. Pokaz, ze to inna klasa ryzyka niz React XSS.

**Acceptance criteria:**

- Instrukcja zawiera spodziewany alert.
- Instrukcja zawiera porownanie z `js/xss`.

**Zaleznosci:** `SEC-JAVA-001`, `GHAS-001`.

---

## PR-003: Scenariusz PR `demo/npm-vulnerable-dependency`

**Cel:** Pokazac Dependency Review jako bramke PR.

**Plik instrukcji:**

```text
demo-scenarios/pr-npm-vulnerable-dependency.md
```

**Kroki:**

1. Utworz branch.
2. Dodaj podatna paczke przez przygotowany patch.
3. Otworz PR.
4. Pokaz `dependency-review` failure.
5. Pokaz, ze merge jest zablokowany, jesli check jest required.

**Acceptance criteria:**

- Instrukcja jest zgodna z `GHAS-004`.
- Nie wymaga merge do `main`.

**Zaleznosci:** `GHAS-003`, `GHAS-004`.

