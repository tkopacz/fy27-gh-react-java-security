# Zadania: kod demonstracyjny podatnosci React/JS i Java

## SEC-JS-001: Dodac DOM XSS przez `dangerouslySetInnerHTML`

**Cel:** Pokazac, ze React ma osobne ryzyko XSS, niezalezne od backendu Java.

**Pliki:**

```text
frontend/src/security-demo/VulnerableUserProfile.tsx
frontend/src/security-demo/SafeUserProfile.tsx
```

**Wymagania dla wersji podatnej:**

- Komentarz: `DEMO ONLY - intentionally vulnerable`.
- Komponent przyjmuje `userHtml: string`.
- Renderuje `dangerouslySetInnerHTML`.

**Wymagania dla wersji bezpiecznej:**

- Jesli HTML nie jest potrzebny: renderuje jako tekst.
- Jesli HTML jest potrzebny: uzywa jawnej sanityzacji i komentarza o ryzyku.

**Acceptance criteria:**

- Oba warianty sa obok siebie.
- Dokumentacja demo wyjasnia roznice.
- Kod podatny jest latwy do pokazania w CodeQL.

**Zaleznosci:** `FND-002`.

---

## SEC-JS-002: Dodac XSS z parametru URL

**Cel:** Wzmocnic demo CodeQL przez widoczny przeplyw source -> sink.

**Plik:**

```text
frontend/src/security-demo/VulnerableSearchPage.tsx
```

**Wymagania:**

- Komentarz: `DEMO ONLY - intentionally vulnerable`.
- Odczyt `q` z `window.location.search`.
- Wstawienie wartosci do `dangerouslySetInnerHTML`.

**Przyklad zachowania:**

```text
/security-demo/search?q=<img src=x onerror=alert(1)>
```

**Acceptance criteria:**

- Strona jest dostepna pod `/security-demo/search`.
- Narracja w dokumentacji mowi: „payload nie musi przejsc przez backend Java”.

**Zaleznosci:** `SEC-JS-001`.

---

## SEC-JS-003: Dodac client-side open redirect

**Cel:** Pokazac `js/client-side-unvalidated-url-redirection`.

**Pliki:**

```text
frontend/src/security-demo/VulnerableRedirect.ts
frontend/src/security-demo/SafeRedirect.ts
frontend/src/security-demo/SafeRedirect.test.ts
```

**Wersja podatna:**

```ts
export function redirectAfterLogin() {
  const next = new URLSearchParams(window.location.search).get('next');
  if (next) {
    window.location.href = next;
  }
}
```

**Wersja bezpieczna:**

- Akceptuje tylko sciezki wzgledne zaczynajace sie od pojedynczego `/`.
- Blokuje:
  - `http://evil.com`,
  - `https://evil.com`,
  - `//evil.com`,
  - `javascript:alert(1)`,
  - puste wartosci.

**Acceptance criteria:**

- Testy potwierdzaja blokade zewnetrznych URL.
- Dokumentacja demo pokazuje phishing scenario.

**Zaleznosci:** `FND-002`.

---

## SEC-JS-004: Dodac cleartext token storage

**Cel:** Pokazac ryzyko tokenow w localStorage.

**Pliki:**

```text
frontend/src/security-demo/VulnerableTokenStorage.ts
frontend/src/security-demo/TokenStorageNotes.md
```

**Wersja podatna:**

```ts
export function saveToken(token: string) {
  localStorage.setItem('authToken', token);
}
```

**Dokumentacja ma wyjasnic:**

- Token w localStorage jest dostepny dla JavaScript.
- XSS moze odczytac token.
- HttpOnly cookie nie jest dostepne dla JavaScript.
- Backend Java nie kontroluje localStorage w przegladarce.

**Acceptance criteria:**

- Przyklad jest prosty i gotowy do pokazania.
- Nie implementujemy prawdziwej auth.

**Zaleznosci:** `FND-002`.

---

## SEC-JS-005: Dodac prototype pollution demo

**Cel:** Pokazac podatnosc specyficzna dla JavaScript.

**Pliki:**

```text
frontend/src/security-demo/VulnerableMerge.ts
frontend/src/security-demo/SafeMerge.ts
frontend/src/security-demo/SafeMerge.test.ts
```

**Wersja podatna:**

- Implementuje recursive merge.
- Nie filtruje kluczy:
  - `__proto__`,
  - `constructor`,
  - `prototype`.

**Wersja bezpieczna:**

- Odrzuca niebezpieczne klucze.
- Dziala tylko na plain objects.

**Testy:**

- Payload z `__proto__` nie zatruwa `Object.prototype` w wersji safe.
- Normalny merge nadal dziala.

**Acceptance criteria:**

- Dokumentacja mowi: „w Javie nie ma analogicznego globalnego `Object.prototype`”.

**Zaleznosci:** `FND-002`.

---

## SEC-JAVA-001: Dodac SQL injection demo

**Cel:** Pokazac klasyczna podatnosc Java i kontrast z React XSS.

**Pliki:**

```text
backend/src/main/java/com/example/demo/securitydemo/VulnerableSqlExample.java
backend/src/main/java/com/example/demo/securitydemo/SafeSqlExample.java
```

**Wersja podatna:**

- Komentarz: `DEMO ONLY - intentionally vulnerable`.
- Buduje SQL przez konkatenacje.
- Uzywa `Statement`.

**Wersja bezpieczna:**

- Uzywa `PreparedStatement`.
- Parametryzuje wejscie.

**Acceptance criteria:**

- CodeQL powinien wykryc `java/sql-injection`.
- Dokumentacja pokazuje source -> sink.

**Zaleznosci:** `FND-003`.

---

## SEC-JAVA-002: Dodac path traversal demo

**Cel:** Pokazac `java/path-injection`.

**Pliki:**

```text
backend/src/main/java/com/example/demo/securitydemo/VulnerableFileDownload.java
backend/src/main/java/com/example/demo/securitydemo/SafeFileDownload.java
backend/src/test/java/com/example/demo/securitydemo/SafeFileDownloadTest.java
```

**Wersja podatna:**

- Bierze `fileName` z parametru.
- Buduje sciezke przez konkatenacje.
- Otwiera plik.

**Wersja bezpieczna:**

- Uzywa `Path.normalize()`.
- Sprawdza, ze wynik zaczyna sie od katalogu bazowego.
- Blokuje `../`.

**Acceptance criteria:**

- Test blokuje `../../etc/passwd`.
- CodeQL powinien wykryc podatny wariant.

**Zaleznosci:** `FND-003`.

---

## SEC-JAVA-003: Dodac unsafe deserialization demo

**Cel:** Pokazac podatnosc Java o wysokim severity.

**Pliki:**

```text
backend/src/main/java/com/example/demo/securitydemo/VulnerableDeserialization.java
backend/src/main/java/com/example/demo/securitydemo/SafeJsonParsing.java
```

**Wersja podatna:**

- Komentarz: `DEMO ONLY - intentionally vulnerable`.
- Uzywa `ObjectInputStream` na niezaufanym input stream.

**Wersja bezpieczna:**

- Uzywa jawnego DTO i parsera JSON.
- Nie deserializuje arbitralnych obiektow.

**Acceptance criteria:**

- Kod kompiluje sie lub jest odseparowany jako przyklad.
- Dokumentacja wskazuje CodeQL `java/unsafe-deserialization`.

**Zaleznosci:** `FND-003`.

---

## SEC-JAVA-004: Dodac XXE demo

**Cel:** Pokazac `java/xxe`.

**Pliki:**

```text
backend/src/main/java/com/example/demo/securitydemo/VulnerableXmlParser.java
backend/src/main/java/com/example/demo/securitydemo/SafeXmlParser.java
backend/src/test/java/com/example/demo/securitydemo/SafeXmlParserTest.java
```

**Wersja podatna:**

- Uzywa `DocumentBuilderFactory`.
- Nie wylacza external entities.

**Wersja bezpieczna:**

- Wylacza external entities.
- Wylacza DTD, jesli niepotrzebne.
- Ustawia secure processing.

**Acceptance criteria:**

- Test pokazuje, ze safe parser nie przetwarza external entity.
- Dokumentacja wskazuje CodeQL `java/xxe`.

**Zaleznosci:** `FND-003`.

