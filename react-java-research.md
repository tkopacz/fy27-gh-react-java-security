# GitHub Copilot i GitHub Advanced Security dla React SPA + Java

> **Cel:** dać materiał do rozmowy z klientem, który uważa, że „backend w Javie jest bezpieczny, więc React nie wymaga osobnej analizy bezpieczeństwa”. Raport pokazuje dwie rzeczy: jak GitHub Copilot przyspiesza tworzenie React SPA oraz dlaczego GitHub Advanced Security ma realną wartość również dla frontendu.

## 1. Executive Summary

GitHub Copilot ma bezpośrednie zastosowanie w React SPA: pomaga generować komponenty, hooki, testy, obsługę błędów, integrację z API Java oraz opisy PR. W kontrolowanym badaniu GitHub z 95 profesjonalnymi deweloperami zadanie w JavaScript zostało ukończone **55% szybciej** z Copilotem; grupa z Copilotem kończyła zadanie częściej (78% vs 70%), a wynik był statystycznie istotny (P=.0017, 95% CI [21%, 89%]).[^1]

Wartość dla stosu React + Java jest podwójna: Copilot wspiera frontend JavaScript/TypeScript oraz backend Java. Według danych GitHub z lutego 2023 r. średnio 46% kodu było budowane z użyciem Copilota we wszystkich językach, a dla Javy wskaźnik wynosił 61%.[^2]

Najważniejszy komunikat bezpieczeństwa: **bezpieczna Java nie oznacza bezpiecznego React SPA**. React działa w przeglądarce użytkownika, korzysta z DOM, localStorage, routerów, parametrów URL i ekosystemu npm. CodeQL dla Javy nie znajdzie `dangerouslySetInnerHTML`, DOM XSS, prototype pollution ani client-side open redirect. Do tego potrzebna jest analiza JavaScript/TypeScript oraz kontrola zależności npm.

## 2. Jak pokazać, że React jest wspierany przez GitHub Copilot

### 2.1 Twarde dane o przyspieszeniu

| Metryka | Wynik | Jak użyć w rozmowie |
|---|---:|---|
| Szybkość realizacji zadania | 55% szybciej | „To badanie było na JavaScript — tym samym ekosystemie, w którym działa React SPA.” |
| Ukończenie zadania | 78% z Copilotem vs 70% bez | „Copilot nie tylko przyspiesza, ale pomaga dowieźć zadanie do końca.” |
| Dane GitHub dla Javy | 61% kodu z Copilotem (luty 2023) | „Backend Java też korzysta, więc to nie jest narzędzie tylko dla frontendu.” |

Nie używać twierdzenia „46% więcej testów” — nie zostało potwierdzone w oficjalnych źródłach.

### 2.2 Funkcje Copilot, które warto pokazać na React SPA

GitHub dokumentuje m.in. inline suggestions, Copilot Chat, pull request summaries, Copilot code review, agent mode oraz next edit suggestions.[^3] W praktyce dla React oznacza to:

1. **Komponenty i hooki:** generowanie komponentów funkcyjnych, `useEffect`, `useState`, `useMemo`, custom hooks, props i typów TypeScript.
2. **Integracja z Java API:** hooki `useProducts`, `useCreateOrder`, fetch/axios/React Query pod endpointy Spring Boot.
3. **Testy:** szkielety testów w React Testing Library/Vitest/Jest, w tym loading/error/success states.
4. **Refaktoryzacja:** komponent klasowy do hooks, JavaScript do TypeScript, wyciąganie reusable components.
5. **PR i review:** automatyczne podsumowanie zmian oraz sugestie podczas review.

React jest także wymieniany przez GitHub jako jedna z dokumentacji startowych dla Copilot for Docs, obok Azure Docs i MDN.[^4]

## 3. Scenariusze demo Copilot dla React SPA + Java backend

### Demo 1 — Komponent React z TypeScript

**Prompt:**

```tsx
// ProductCard component:
// - props: id, name, price, imageUrl, inStock
// - show "Niedostępny" badge when inStock is false
// - clicking card calls onSelect(id)
// - accessible keyboard support
```

**Efekt:** Copilot generuje komponent, typy propsów, warunkowe renderowanie i obsługę kliknięcia. Następny prompt: „Napisz test React Testing Library dla tego komponentu”.

**Moment aha:** Copilot nie generuje tylko pojedynczej linii — tworzy gotowy, spójny komponent z testem.

### Demo 2 — Hook do API Spring Boot

**Prompt:**

```ts
// Custom React hook for fetching /api/products from Java backend
// - handles loading, error, data
// - on 401 clear token and redirect to /login
// - abort request on unmount
```

**Efekt:** hook z `fetch`, `AbortController`, stanami UI i obsługą 401. Potem poproś: „Przepisz to na React Query”.

**Moment aha:** integracja frontend-backend, którą zwykle pisze się ręcznie, powstaje z gotowym handlingiem edge-case’ów.

### Demo 3 — Formularz zamówienia z walidacją

**Prompt:**

```text
Create an order form with React Hook Form and Zod validation.
Fields: firstName, lastName, email, phone (Polish format), deliveryAddress.
On submit POST to /api/orders. Map Spring validation errors to fields.
```

**Efekt:** schemat walidacji, komponent formularza, obsługa błędów backendu i komunikaty po polsku.

### Demo 4 — Refaktor legacy React

**Prompt:**

```text
Refactor this class component to a functional component with hooks.
Add TypeScript types and preserve all behavior.
```

**Efekt:** migracja `componentDidMount`/`componentDidUpdate` do `useEffect`, dopisane typy i czytelniejszy komponent.

### Demo 5 — Java backend endpoint

**Prompt:**

```java
// Spring Boot REST controller for orders
// POST /api/orders
// validate @RequestBody with @Valid
// return 201 on success, 400 field errors on validation failure
// secure with @PreAuthorize("hasRole('USER')")
// do not log PII
```

**Efekt:** Copilot pokazuje, że przyspiesza też backend Java — istotne, bo klient już ufa Javie.

## 4. Dlaczego bezpieczna Java nie oznacza bezpiecznego React SPA

### 4.1 Dwie osobne powierzchnie ataku

| Obszar | Java backend | React SPA |
|---|---|---|
| Runtime | JVM na serwerze | JavaScript w przeglądarce |
| Typowe źródła danych | HTTP request, DB, pliki, XML | DOM, URL, localStorage, cookies, postMessage, API response |
| Typowe sinki | SQL, filesystem, deserializacja, XML parser | `innerHTML`, `dangerouslySetInnerHTML`, `window.location`, storage |
| Typowe podatności | SQLi, XXE, path traversal, unsafe deserialization | DOM XSS, prototype pollution, open redirect, cleartext storage |
| Narzędzie CodeQL | Java/Kotlin pack | JavaScript/TypeScript pack |

**Teza:** zabezpieczenie backendu Java nie usuwa ryzyk w przeglądarce. Java nie widzi tego, co dzieje się w DOM użytkownika.

### 4.2 DOM-based XSS działa po stronie klienta

OWASP opisuje DOM-based XSS jako atak, którego payload wykonuje się w wyniku modyfikacji DOM w przeglądarce; odpowiedź HTTP z serwera może w ogóle nie zawierać payloadu.[^5] To kluczowe: backend Java, WAF i logi serwerowe mogą nie zobaczyć ataku.

**Komunikat dla klienta:** „Wasza Java może być perfekcyjna. Jeżeli React bierze parametr z URL i wkłada go do DOM bez sanityzacji, atak dzieje się w przeglądarce użytkownika — poza Javą.”

### 4.3 React ma bezpieczne domyślne mechanizmy, ale też escape hatche

OWASP XSS Prevention Cheat Sheet wprost wymienia ryzyka takie jak `dangerouslySetInnerHTML` bez sanityzacji oraz `javascript:`/`data:` URLs w React.[^6] To nie jest abstrakcyjny problem „starego JavaScriptu”; to realny wzorzec spotykany w aplikacjach React, szczególnie przy CMS, markdown, rich text, legacy jQuery i integracjach z zewnętrznym HTML.

## 5. GHAS / CodeQL: React/JS/TS vs Java

CodeQL obsługuje zarówno JavaScript/TypeScript (`javascript-typescript`), jak i Java/Kotlin (`java-kotlin`).[^7] Query suites obejmują `default`, `security-extended` i `security-and-quality`.[^8]

### 5.1 CodeQL dla React / JavaScript / TypeScript

| Query | Co wykrywa | Severity | Security severity | Precision | Dlaczego ważne dla React |
|---|---|---:|---:|---|---|
| `js/xss` | Client-side XSS | error | 7.8 | high | Niezaufane dane trafiają do DOM, np. `dangerouslySetInnerHTML`.[^9] |
| `js/xss-through-dom` | DOM text reinterpreted as HTML | warning | 7.8 | high | Kod czyta text z DOM i interpretuje jako HTML.[^10] |
| `js/client-side-unvalidated-url-redirection` | Client-side open redirect | error | 6.1 | high | `window.location` ustawiany z parametru URL; phishing.[^11] |
| `js/prototype-pollution` | Prototype-polluting merge call | error | 6.1 | high | Specyficzne dla JS; może prowadzić do XSS/RCE/logical bypass.[^12] |
| `js/clear-text-storage-of-sensitive-data` | Dane wrażliwe w cleartext storage | error | 7.5 | high | Tokeny/JWT/PII w localStorage/cookies.[^13] |

### 5.2 CodeQL dla Java backend

| Query | Co wykrywa | Severity | Security severity | Precision | Dlaczego ważne dla Java |
|---|---|---:|---:|---|---|
| `java/sql-injection` | SQL/JPQL z danych użytkownika | error | 8.8 | high | Klasyczny backend injection.[^14] |
| `java/path-injection` | Niezaufane dane w ścieżce pliku | error | 7.5 | high | Path traversal / odczyt plików.[^15] |
| `java/unsafe-deserialization` | Deserializacja danych użytkownika | error | 9.8 | high | RCE przez biblioteki deserializacji.[^16] |
| `java/xxe` | XML External Entity | error | 9.1 | high | Odczyt plików / SSRF przez parser XML.[^17] |

### 5.3 Kluczowy wniosek

CodeQL dla Java i CodeQL dla JavaScript/TypeScript wykrywają **inne klasy błędów**, bo analizują inne runtime’y i inne modele zagrożeń.

> „Skanowanie Javy chroni kuchnię. React płonie w salonie. Potrzebujesz gaśnicy w obu miejscach.”

## 6. Supply chain: npm, Dependency Review, Dependabot, Secret Scanning

### 6.1 Dependabot Alerts

Dependabot skanuje default branch i generuje alerty, gdy nowa podatność pojawia się w GitHub Advisory Database albo zmienia się dependency graph.[^18] Obsługuje zarówno npm, jak i Maven, ale to są osobne ekosystemy i osobne grafy zależności.

### 6.2 Dependabot Security Updates

Dla npm Dependabot może utworzyć PR aktualizujący jawnie zdefiniowaną zależność do bezpiecznej wersji nawet wtedy, gdy naprawa wymaga aktualizacji parent dependency albo usunięcia sub-dependency, której parent już nie potrzebuje.[^19]

**Komunikat:** „W React/npm podatność może wejść przez zależność przechodnią, której developer nawet nie widzi w `package.json`. Dependabot widzi cały graf.”

### 6.3 Dependency Review jako bramka PR

Dependency Review pokazuje zmiany w zależnościach w każdym PR. `dependency-review-action` domyślnie failuje check, jeśli odkryje podatne paczki; failed check blokuje merge, gdy właściciel repo wymaga tego checka jako required status check.[^20]

**Demo:** Dodaj podatną wersję paczki npm w PR i pokaż, że merge jest zablokowany. To zmienia bezpieczeństwo z „raportu do przeczytania” w „bramkę do przejścia”.

### 6.4 GitHub Advisory Database i malware npm

GitHub Advisory Database agreguje dane m.in. z GitHub Security Advisories, NVD, npm Security Advisories i innych baz.[^21] Malware advisories są ekskluzywne dla ekosystemu npm — to istotny sygnał, że frontendowy łańcuch dostaw ma własny profil ryzyka.

### 6.5 Secret Scanning + Push Protection

Secret scanning skanuje całą historię Git na wszystkich branchach oraz m.in. issues, PR, discussions, wiki i secret gists.[^22] Push protection blokuje sekrety zanim trafią do repozytorium.[^23]

**Scenariusz React:** developer przez przypadek commit’uje klucz API w `.env` albo `config.ts`. W aplikacji SPA taki klucz może trafić do bundle i stać się widoczny w DevTools. Push protection blokuje problem przed zapisaniem go w historii repo.

## 7. Plan prezentacji dla klienta

| Czas | Blok | Cel |
|---:|---|---|
| 5 min | Mit: „Java jest bezpieczna” | Ustawić ramę: backend ≠ cała aplikacja |
| 10 min | Copilot ROI | 55% szybciej, 46% kodu, 61% Java |
| 15 min | Live demo React | komponent + hook + test + PR summary |
| 10 min | CodeQL React vs Java | pokazać różne klasy query |
| 10 min | Dependency Review + Secret Scanning | PR gate i blokada sekretów |
| 5 min | Podsumowanie | „GHAS zabezpiecza tę część, której Java nie widzi” |

### Minimalny kod demo dla XSS

```jsx
function UserProfile({ userHtml }) {
  return <div dangerouslySetInnerHTML={{ __html: userHtml }} />;
}
```

Narracja: „React normalnie escapuje JSX. Ale tutaj developer świadomie obchodzi ochronę. CodeQL `js/xss` wykrywa przepływ niezaufanych danych do sinka DOM.”

### Minimalny kod demo dla open redirect

```js
const next = new URLSearchParams(window.location.search).get('next');
window.location = next;
```

Narracja: „To nie jest backend. To routing w SPA. Atakujący może użyć waszej domeny jako trampoliny phishingowej.”

## 8. Gotowe komunikaty retoryczne

### „Mamy bezpieczną Javę”

Macie bezpieczną Javę — świetnie. Ale React SPA to osobna aplikacja, uruchamiana na komputerze użytkownika. Java nie kontroluje DOM, localStorage, `window.location`, `postMessage` ani paczek npm. Skanowanie tylko Javy zostawia ślepą plamę dokładnie tam, gdzie użytkownik widzi aplikację.

### „React domyślnie chroni przed XSS”

React domyślnie escapuje wartości w JSX, ale aplikacje produkcyjne używają escape hatchy: rich text, markdown, CMS, `dangerouslySetInnerHTML`, stare jQuery, integracje reklamowe, analityka, parametry URL. OWASP wymienia te ryzyka wprost. CodeQL sprawdza, czy nie zostały użyte źle.

### „Robimy code review”

Code review robi człowiek, który ma 20 plików w PR i ograniczony czas. CodeQL śledzi przepływ danych od źródła do sinka w sposób powtarzalny przy każdym pushu. To nie zastępuje review — to usuwa z review klasy błędów, które maszyna wykrywa lepiej.

### „Mamy audyt raz w roku”

CVE nie czeka na audyt. Dependabot reaguje, gdy advisory pojawia się w bazie, a Dependency Review blokuje podatną paczkę już w PR. To jest shift-left w praktyce.

### „To za dużo alertów”

Dobrze skonfigurowane GHAS ma być bramką jakości, nie tablicą alarmową. Zacznij od CodeQL default, Dependency Review dla high/critical i Secret Scanning Push Protection. Potem rozszerzaj.

## 9. Confidence Assessment

| Twierdzenie | Pewność | Uzasadnienie |
|---|---|---|
| Copilot przyspieszył zadanie o 55% | Wysoka | Kontrolowane badanie GitHub, n=95, P=.0017.[^1] |
| 46% kodu / 61% Java | Wysoka z datą | Dane GitHub z lutego 2023; używać z datą.[^2] |
| Funkcje Copilot: Chat, inline, PR summaries, code review, agent mode | Wysoka | Oficjalna dokumentacja GitHub.[^3] |
| React `dangerouslySetInnerHTML` jako ryzyko XSS | Wysoka | OWASP XSS Prevention Cheat Sheet.[^6] |
| DOM XSS może być niewidoczny dla serwera | Wysoka | OWASP DOM Based XSS.[^5] |
| Query CodeQL JS/TS i Java | Wysoka | Oficjalne CodeQL Query Help.[^9]-[^17] |
| Dependency Review blokuje merge | Wysoka | Oficjalne GitHub Docs; wymaga required status check.[^20] |
| npm „setki zależności przechodnich” | Średnia | Ostrożne sformułowanie bez konkretnej liczby; nie podawać 700–1500 bez źródła. |
| „46% więcej testów” | Nie używać | Brak potwierdzonego źródła. |

## Footnotes

[^1]: GitHub Research, „Research: quantifying GitHub Copilot's impact on developer productivity and happiness”, 7 września 2022. https://github.blog/news-insights/research/research-quantifying-github-copilots-impact-on-developer-productivity-and-happiness/

[^2]: GitHub Blog, „GitHub Copilot for Business is now available”, 14 lutego 2023. https://github.blog/news-insights/product-news/github-copilot-for-business-is-now-available/

[^3]: GitHub Docs, „GitHub Copilot features”. https://docs.github.com/en/copilot/get-started/features

[^4]: GitHub Blog, „GitHub Copilot X: The AI-powered developer experience”. https://github.blog/news-insights/product-news/github-copilot-x-the-ai-powered-developer-experience/

[^5]: OWASP, „DOM Based XSS”. https://owasp.org/www-community/attacks/DOM_Based_XSS

[^6]: OWASP Cheat Sheet Series, „Cross Site Scripting Prevention Cheat Sheet”. https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html

[^7]: GitHub Docs, „Code scanning with CodeQL”. https://docs.github.com/en/code-security/concepts/code-scanning/codeql/codeql-code-scanning

[^8]: CodeQL Query Help, JavaScript index / query suites. https://codeql.github.com/codeql-query-help/javascript/

[^9]: CodeQL Query Help, „Client-side cross-site scripting” (`js/xss`). https://codeql.github.com/codeql-query-help/javascript/js-xss/

[^10]: CodeQL Query Help, „DOM text reinterpreted as HTML” (`js/xss-through-dom`). https://codeql.github.com/codeql-query-help/javascript/js-xss-through-dom/

[^11]: CodeQL Query Help, „Client-side URL redirect” (`js/client-side-unvalidated-url-redirection`). https://codeql.github.com/codeql-query-help/javascript/js-client-side-unvalidated-url-redirection/

[^12]: CodeQL Query Help, „Prototype-polluting merge call” (`js/prototype-pollution`). https://codeql.github.com/codeql-query-help/javascript/js-prototype-pollution/

[^13]: CodeQL Query Help, „Clear text storage of sensitive information” (`js/clear-text-storage-of-sensitive-data`). https://codeql.github.com/codeql-query-help/javascript/js-clear-text-storage-of-sensitive-data/

[^14]: CodeQL Query Help, „Query built from user-controlled sources” (`java/sql-injection`). https://codeql.github.com/codeql-query-help/java/java-sql-injection/

[^15]: CodeQL Query Help, „Uncontrolled data used in path expression” (`java/path-injection`). https://codeql.github.com/codeql-query-help/java/java-path-injection/

[^16]: CodeQL Query Help, „Deserialization of user-controlled data” (`java/unsafe-deserialization`). https://codeql.github.com/codeql-query-help/java/java-unsafe-deserialization/

[^17]: CodeQL Query Help, „Resolving XML external entity in user-controlled data” (`java/xxe`). https://codeql.github.com/codeql-query-help/java/java-xxe/

[^18]: GitHub Docs, „Dependabot alerts”. https://docs.github.com/en/code-security/concepts/supply-chain-security/dependabot-alerts

[^19]: GitHub Docs, „Dependabot security updates”. https://docs.github.com/en/code-security/concepts/supply-chain-security/dependabot-security-updates

[^20]: GitHub Docs, „Dependency review”. https://docs.github.com/en/code-security/concepts/supply-chain-security/dependency-review

[^21]: GitHub Docs, „About the GitHub Advisory Database”. https://docs.github.com/en/code-security/concepts/vulnerability-reporting-and-management/github-advisory-database

[^22]: GitHub Docs, „Secret scanning”. https://docs.github.com/en/code-security/concepts/secret-security/secret-scanning

[^23]: GitHub Docs, „Push protection”. https://docs.github.com/en/code-security/concepts/secret-security/push-protection
