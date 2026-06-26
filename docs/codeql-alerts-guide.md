# CodeQL alerts guide

## JavaScript / TypeScript

Wszystkie poniższe query ID działają po stronie przeglądarki — Java backend nie
widzi kodu JS/TS, więc CodeQL musi być uruchomiony osobno dla `javascript-typescript`.

- `js/xss` — podatny rendering DOM przez `dangerouslySetInnerHTML`
  (`VulnerableUserProfile.tsx`) i wstrzykiwanie parametru URL w query string
  (`VulnerableSearchPage.tsx`).

- `js/client-side-unvalidated-url-redirection` — niezweryfikowany parametr `next`
  steruje `window.location.href` (`VulnerableRedirect.ts`). Java nigdy nie przetwarza
  tego przekierowania — wykonuje je przeglądarka na podstawie danych klienta.

- `js/clear-text-storage-of-sensitive-data` — token zapisany w `localStorage` bez
  żadnego szyfrowania (`VulnerableTokenStorage.ts`). Backend Java operuje na
  `HttpSession` lub nagłówkach HTTP i nie kontroluje localStorage w przeglądarce.

- `js/prototype-pollution-utility` — niebezpieczny recursive merge pozwala zatruć
  `Object.prototype` przez klucz `__proto__` (`VulnerableMerge.ts`). Java nie posiada
  globalnego `Object.prototype`, więc ta klasa podatności nie istnieje po stronie
  backendu.

## Java

Poniższe query ID dotyczą kodu server-side — skan `java-kotlin` nie obejmuje
frontendowego kodu TypeScript/React.

- `java/sql-injection` — konkatenacja stringa w zapytaniu SQL (`VulnerableSqlQuery.java`).

- `java/path-injection` — niezweryfikowana ścieżka pliku od użytkownika
  (`VulnerableFileReader.java`).

- `java/unsafe-deserialization` — deserializacja `ObjectInputStream` z niezaufanych
  danych bez białej listy klas (`VulnerableDeserialization.java`). Brak
  odpowiednika w JS — V8 nie deserializuje natywnych obiektów Java.

- `java/xxe` — parser XML bez wyłączonego `DOCTYPE` / zewnętrznych encji
  (`VulnerableXmlParser.java`). JS/TS parsuje XML przez DOM API przeglądarki,
  który domyślnie nie rozwiązuje zewnętrznych encji systemowych.
