# Oddzielny plan implementacji: aplikacja React SPA

Ten plik opisuje osobny, wykonawczy strumien prac dla frontendu React. Celem jest napisanie, uruchomienie, przetestowanie i przygotowanie SPA do pokazania Copilot oraz GHAS.

## Cel frontendu

Frontend ma byc prosta aplikacja sklepu demo:

- wyswietla produkty z Java backend,
- pozwala zlozyc zamowienie,
- ma komponenty i hooki do pokazania Copilot,
- ma strone `Security Demo` z kontrolowanymi scenariuszami podatnosci,
- ma testy,
- ma jasna dokumentacje uruchomienia.

## Zakladany wynik

Po wykonaniu zadan:

```powershell
cd frontend
npm install
npm run dev
npm test
npm run build
```

powinno dzialac, a aplikacja powinna byc dostepna lokalnie pod adresem Vite, zwykle:

```text
http://localhost:5173
```

---

## REACT-APP-001: Utworzyc projekt Vite React TypeScript

**Cel:** Stworzyc kompilowalny frontend React.

**Zakres plikow:**

```text
frontend/package.json
frontend/vite.config.ts
frontend/tsconfig.json
frontend/index.html
frontend/src/main.tsx
frontend/src/App.tsx
```

**Zaleznosci runtime:**

- `react`
- `react-dom`
- `react-router-dom`

**Zaleznosci dev/test:**

- `typescript`
- `vite`
- `vitest`
- `@testing-library/react`
- `@testing-library/jest-dom`
- `@testing-library/user-event`
- `jsdom`

**Acceptance criteria:**

- `npm install` dziala.
- `npm run dev` startuje aplikacje.
- `npm run build` przechodzi.
- `npm test` dziala.

**Zaleznosci:** `FND-001`.

---

## REACT-APP-002: Dodac routing i layout

**Cel:** SPA ma miec realistyczna nawigacje.

**Pliki:**

```text
frontend/src/App.tsx
frontend/src/pages/ProductsPage.tsx
frontend/src/pages/OrderPage.tsx
frontend/src/pages/SecurityDemoPage.tsx
frontend/src/pages/LoginPage.tsx
frontend/src/components/AppLayout.tsx
```

**Sciezki:**

- `/products`
- `/order`
- `/security-demo`
- `/login`
- redirect `/` -> `/products`

**Acceptance criteria:**

- Nawigacja dziala.
- Kazda strona ma naglowek i krotki opis.
- `/security-demo` jest wyraznie oznaczone jako demo-only.

**Zaleznosci:** `REACT-APP-001`.

---

## REACT-APP-003: Dodac typy domenowe

**Cel:** TypeScript ma wspierac Copilot i bezpieczna integracje z backendem.

**Pliki:**

```text
frontend/src/types/Product.ts
frontend/src/types/Order.ts
frontend/src/types/ApiError.ts
```

**Typy:**

- `Product`
- `OrderRequest`
- `OrderResponse`
- `ApiErrorResponse`
- `ValidationError`

**Acceptance criteria:**

- Typy odpowiadaja JSON z backendu Java.
- Serwisy API nie uzywaja `any`.

**Zaleznosci:** `REACT-APP-001`, `JAVA-APP-004`, `JAVA-APP-006`.

---

## REACT-APP-004: Dodac warstwe API client

**Cel:** Oddzielic komunikacje HTTP od komponentow.

**Pliki:**

```text
frontend/src/services/apiClient.ts
frontend/src/services/productsApi.ts
frontend/src/services/ordersApi.ts
```

**Wymagania:**

- `apiClient` zna base URL z `import.meta.env.VITE_API_BASE_URL`.
- Obsluguje JSON.
- Rzuca kontrolowany blad dla non-2xx.
- Nie trzyma sekretow w kodzie ani env.

**Acceptance criteria:**

- `productsApi.getProducts()` dziala z `/api/products`.
- `ordersApi.createOrder()` dziala z `/api/orders`.
- Testy moga mockowac fetch.

**Zaleznosci:** `REACT-APP-003`, `JAVA-APP-003`, `JAVA-APP-005`.

---

## REACT-APP-005: Zaimplementowac ProductCard i liste produktow

**Cel:** Pierwszy ekran aplikacji oraz pierwszy scenariusz Copilot.

**Pliki:**

```text
frontend/src/components/ProductCard.tsx
frontend/src/components/ProductCard.test.tsx
frontend/src/pages/ProductsPage.tsx
frontend/src/hooks/useProducts.ts
frontend/src/hooks/useProducts.test.ts
```

**Wymagania `ProductCard`:**

- Nazwa, cena, obrazek.
- Badge `Niedostepny`.
- `onSelect(id)`.
- Dostepnosc klawiatury.

**Wymagania `useProducts`:**

- `data`, `loading`, `error`, `refetch`.
- `AbortController`.
- 401 -> wyczyszczenie tokena i redirect do `/login`.

**Acceptance criteria:**

- `/products` pokazuje produkty z backendu.
- Testy komponentu i hooka przechodza.

**Zaleznosci:** `REACT-APP-004`.

---

## REACT-APP-006: Zaimplementowac OrderForm

**Cel:** Pokazac formularz, walidacje i integracje z Java backend.

**Pliki:**

```text
frontend/src/components/OrderForm.tsx
frontend/src/components/OrderForm.test.tsx
frontend/src/pages/OrderPage.tsx
```

**Zaleznosci dodatkowe:**

- `react-hook-form`
- `zod`
- opcjonalnie `@hookform/resolvers`

**Pola:**

- productId,
- quantity,
- firstName,
- lastName,
- email,
- phone,
- deliveryAddress.

**Wymagania:**

- Walidacja po polsku.
- Mapowanie backend `fieldErrors` na pola.
- Success message po 201.
- Error message dla network error.

**Acceptance criteria:**

- `/order` pozwala zlozyc poprawne zamowienie.
- Bledy 400 z backendu widac przy polach.
- Testy przechodza.

**Zaleznosci:** `REACT-APP-004`, `JAVA-APP-005`, `JAVA-APP-006`.

---

## REACT-APP-007: Dodac legacy component do refaktoru Copilot

**Cel:** Przygotowac material live demo dla refaktoryzacji.

**Plik:**

```text
frontend/src/legacy/LegacyProductList.jsx
```

**Wymagania:**

- Komponent klasowy.
- `componentDidMount`.
- `componentDidUpdate`.
- `setState`.
- Fetch produktow.
- Brak TypeScript.

**Acceptance criteria:**

- Plik jest zachowany jako material demo.
- Nie musi byc podlaczony do glownej aplikacji.

**Zaleznosci:** `REACT-APP-004`.

---

## REACT-APP-008: Dodac Security Demo page

**Cel:** UI do pokazania podatnosci i kontrastu z backendiem Java.

**Pliki:**

```text
frontend/src/pages/SecurityDemoPage.tsx
frontend/src/security-demo/
```

**Sekcje strony:**

- DOM XSS.
- Open redirect.
- Token storage.
- Prototype pollution.
- Link do Java security demo docs.

**Wymagania:**

- Strona nie uruchamia destrukcyjnych payloadow automatycznie.
- Kazdy scenariusz ma opis:
  - co pokazuje,
  - ktory CodeQL query jest istotny,
  - dlaczego Java backend tego nie widzi.

**Acceptance criteria:**

- `/security-demo` dziala.
- Strona jest zrozumiala dla klienta.

**Zaleznosci:** `SEC-JS-001`, `SEC-JS-002`, `SEC-JS-003`, `SEC-JS-004`, `SEC-JS-005`.

---

## REACT-APP-009: Dodac konfiguracje env bez sekretow

**Cel:** Pokazac poprawna konfiguracje frontendu i przygotowac Secret Scanning narracje.

**Pliki:**

```text
frontend/.env.example
frontend/src/config.ts
```

**`.env.example`:**

```text
VITE_API_BASE_URL=http://localhost:8080
# NIE UMIESZCZAJ SEKRETOW W VITE_*.
# Zmienne VITE_* trafiaja do bundle frontendu.
```

**Acceptance criteria:**

- Base URL jest czytany z env.
- Brak prawdziwych sekretow.
- README wyjasnia, ze `VITE_*` jest publiczne.

**Zaleznosci:** `REACT-APP-004`.

---

## REACT-APP-010: Dodac frontend README i runbook

**Cel:** Frontend da sie uruchomic i sprawdzic bez wiedzy autora.

**Pliki:**

```text
frontend/README.md
docs/runbook-frontend.md
```

**Tresci wymagane:**

- Wymagana wersja Node.
- Komendy:

```powershell
cd frontend
npm install
npm run dev
npm test
npm run build
```

- Opis stron:
  - `/products`,
  - `/order`,
  - `/security-demo`,
  - `/login`.
- Jak podlaczyc do backendu.
- Jak pokazac scenariusze Copilot.
- Jak pokazac scenariusze GHAS.

**Acceptance criteria:**

- Nowa osoba moze uruchomic frontend z README.
- Dokumentacja wskazuje zaleznosc od backendu Java.

**Zaleznosci:** `REACT-APP-001` - `REACT-APP-009`.

---

## REACT-APP-011: Sprawdzic frontend end-to-end

**Cel:** Potwierdzic, ze React SPA jest gotowe do demo.

**Weryfikacja:**

```powershell
cd frontend
npm test
npm run build
npm run dev
```

Z uruchomionym backendem:

- wejsc na `/products`,
- sprawdzic pobranie produktow,
- wejsc na `/order`,
- wyslac poprawne zamowienie,
- wyslac bledne zamowienie i zobaczyc field errors,
- wejsc na `/security-demo`.

**Acceptance criteria:**

- Testy przechodza.
- Build przechodzi.
- React komunikuje sie z backendem.
- Scenariusze demo sa dostepne w UI.

**Zaleznosci:** `REACT-APP-001` - `REACT-APP-010`, `JAVA-APP-010`.

