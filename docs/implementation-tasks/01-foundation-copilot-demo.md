# Zadania: fundament aplikacji i Copilot demo

## FND-001: Utworzyc strukture monorepo

**Cel:** Przygotowac repo jako demonstracyjne srodowisko React + Java.

**Zakres plikow:**

```text
frontend/
backend/
demo-scenarios/
docs/
.github/workflows/
README.md
```

**Wymagania implementacyjne:**

- Dodac root `README.md`.
- W README opisac:
  - cel repo,
  - ostrzezenie o celowo podatnym kodzie,
  - jak uruchomic frontend,
  - jak uruchomic backend,
  - gdzie sa scenariusze demo,
  - link do `react-java-research.md`.

**Acceptance criteria:**

- Foldery istnieja.
- Root README jest po polsku.
- README jasno mowi, ze repo jest do demonstracji Copilot i GHAS.

**Zaleznosci:** brak.

---

## FND-002: Utworzyc React SPA TypeScript

**Cel:** Zbudowac baze frontendowa do scenariuszy Copilot i GHAS.

**Technologia:**

- Vite
- React
- TypeScript
- Vitest
- React Testing Library
- React Router

**Zakres plikow:**

```text
frontend/package.json
frontend/vite.config.ts
frontend/tsconfig.json
frontend/src/main.tsx
frontend/src/App.tsx
frontend/src/components/
frontend/src/hooks/
frontend/src/pages/
frontend/src/services/
frontend/src/types/
```

**Wymagania implementacyjne:**

- Aplikacja ma miec routing:
  - `/products`,
  - `/order`,
  - `/security-demo`.
- Dodac podstawowy layout z nawigacja.
- Dodac test setup dla Vitest.

**Acceptance criteria:**

- `npm install` dziala w `frontend`.
- `npm run dev` uruchamia aplikacje.
- `npm test` dziala.
- `npm run build` przechodzi.

**Zaleznosci:** `FND-001`.

---

## FND-003: Utworzyc Spring Boot backend

**Cel:** Dostarczyc Java API dla React SPA i material do Copilot/CodeQL demo.

**Technologia:**

- Spring Boot
- Maven
- Spring Web
- Spring Validation
- opcjonalnie Spring Security
- H2 albo in-memory repository

**Zakres plikow:**

```text
backend/pom.xml
backend/src/main/java/com/example/demo/DemoApplication.java
backend/src/main/java/com/example/demo/product/
backend/src/main/java/com/example/demo/order/
backend/src/test/java/com/example/demo/
```

**Endpointy:**

```text
GET /api/products
GET /api/products/{id}
POST /api/orders
```

**Acceptance criteria:**

- `mvn test` dziala w `backend`.
- `mvn spring-boot:run` uruchamia aplikacje.
- `/api/products` zwraca JSON z produktami.
- `/api/orders` przyjmuje poprawny request i zwraca 201.

**Zaleznosci:** `FND-001`.

---

## FND-004: Dodac modele domenowe frontend

**Cel:** Miec typy, na ktorych Copilot moze bazowac podczas generowania komponentow i hookow.

**Pliki:**

```text
frontend/src/types/Product.ts
frontend/src/types/Order.ts
```

**Minimalne typy:**

```ts
export interface Product {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  inStock: boolean;
  descriptionHtml?: string;
}

export interface OrderRequest {
  productId: number;
  quantity: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  deliveryAddress: string;
}
```

**Acceptance criteria:**

- Typy sa uzywane w komponentach i serwisach.
- Brak duplikacji typow w kilku plikach.

**Zaleznosci:** `FND-002`.

---

## COP-001: Zaimplementowac `ProductCard`

**Cel:** Pierwszy scenariusz Copilot: generowanie komponentu React.

**Pliki:**

```text
frontend/src/components/ProductCard.tsx
frontend/src/components/ProductCard.test.tsx
```

**Funkcjonalnosc:**

- Przyjmuje `product: Product`.
- Przyjmuje `onSelect: (id: number) => void`.
- Wyswietla:
  - nazwe,
  - cene,
  - obrazek,
  - badge `Niedostepny`, gdy `inStock === false`.
- Klikniecie wywoluje `onSelect(product.id)`.
- Obsluga klawiatury Enter i Space.
- Dostepnosc:
  - `aria-label`,
  - poprawny focus,
  - brak div-click bez obslugi klawiatury.

**Testy:**

- renderuje nazwe produktu,
- renderuje cene,
- pokazuje badge dla niedostepnego produktu,
- wywoluje `onSelect` po kliknieciu,
- wywoluje `onSelect` po Enter/Space.

**Acceptance criteria:**

- Testy przechodza.
- Komponent jest uzyty na stronie `/products`.

**Zaleznosci:** `FND-002`, `FND-004`.

---

## COP-002: Zaimplementowac `useProducts`

**Cel:** Drugi scenariusz Copilot: hook do API Java.

**Pliki:**

```text
frontend/src/hooks/useProducts.ts
frontend/src/hooks/useProducts.test.ts
frontend/src/services/productsApi.ts
```

**Funkcjonalnosc:**

- Pobiera produkty z `/api/products`.
- Zwraca:
  - `data`,
  - `loading`,
  - `error`,
  - `refetch`.
- Obsluguje `AbortController`.
- Dla HTTP 401:
  - usuwa token z localStorage,
  - przekierowuje na `/login`.

**Testy:**

- success response,
- network error,
- HTTP 401,
- abort on unmount.

**Acceptance criteria:**

- Hook jest uzyty na stronie `/products`.
- Testy przechodza.

**Zaleznosci:** `FND-002`, `FND-003`, `FND-004`.

---

## COP-003: Zaimplementowac `OrderForm`

**Cel:** Trzeci scenariusz Copilot: formularz, walidacja, integracja z Java backend.

**Pliki:**

```text
frontend/src/components/OrderForm.tsx
frontend/src/components/OrderForm.test.tsx
frontend/src/services/ordersApi.ts
```

**Technologia:**

- React Hook Form
- Zod

**Pola formularza:**

- firstName,
- lastName,
- email,
- phone,
- deliveryAddress,
- quantity.

**Wymagania:**

- Walidacja po polsku.
- Telefon w polskim formacie.
- Quantity wieksze od zera.
- Submit do `/api/orders`.
- Obsluga:
  - 201 success,
  - 400 backend validation errors,
  - network error.

**Acceptance criteria:**

- Formularz dziala na stronie `/order`.
- Testy obejmuja walidacje i submit.
- Backend errors mapuja sie na pola.

**Zaleznosci:** `FND-002`, `FND-003`, `FND-004`.

---

## COP-004: Dodac legacy React component do refaktoru

**Cel:** Material demo dla Copilot: class component -> functional component with hooks.

**Plik:**

```text
frontend/src/legacy/LegacyProductList.jsx
```

**Wymagania:**

- Komponent klasowy.
- Uzywa `componentDidMount`.
- Uzywa `componentDidUpdate`.
- Uzywa `setState`.
- Pobiera produkty.
- Nie uzywa TypeScript.

**Acceptance criteria:**

- Plik jest zachowany jako legacy demo.
- Nie musi byc uzywany w glownej aplikacji.
- Prompt do refaktoru jest opisany w `docs/copilot-promptbook.md`.

**Zaleznosci:** `FND-002`.

---

## COP-005: Dodac prompt template dla Java controller

**Cel:** Material demo do pokazania Copilot na backendzie Java.

**Plik:**

```text
backend/src/main/java/com/example/demo/order/OrderControllerPrompt.java.txt
```

**Zawartosc:**

```java
// Spring Boot REST controller for orders
// POST /api/orders
// validate @RequestBody with @Valid
// return 201 on success, 400 field errors on validation failure
// secure with @PreAuthorize("hasRole('USER')")
// do not log PII
```

**Acceptance criteria:**

- Plik nie jest kompilowany.
- Mozna go otworzyc w IDE i uzyc jako prompt do Copilot.

**Zaleznosci:** `FND-003`.

