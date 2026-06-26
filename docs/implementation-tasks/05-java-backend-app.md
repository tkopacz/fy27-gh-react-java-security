# Oddzielny plan implementacji: aplikacja Java backend

Ten plik opisuje osobny, wykonalny strumien prac dla backendu Java. Celem jest napisanie, uruchomienie, przetestowanie i przygotowanie backendu do integracji z React SPA oraz do pokazania Copilot/GHAS.

## Cel backendu

Backend ma byc prosta, wiarygodna aplikacja Spring Boot dla sklepu demo:

- wystawia produkty,
- przyjmuje zamowienia,
- waliduje dane,
- zwraca bledy walidacji w formacie przyjaznym dla React,
- ma testy,
- ma osobny pakiet `securitydemo` z celowo podatnym kodem do CodeQL.

## Zakladany wynik

Po wykonaniu zadan:

```powershell
cd backend
mvn test
mvn spring-boot:run
```

powinno dzialac, a endpoint:

```text
GET http://localhost:8080/api/products
```

powinien zwrocic liste produktow.

---

## JAVA-APP-001: Utworzyc projekt Spring Boot

**Cel:** Stworzyc kompilowalny backend Java.

**Zakres plikow:**

```text
backend/pom.xml
backend/src/main/java/com/example/demo/DemoApplication.java
backend/src/test/java/com/example/demo/DemoApplicationTests.java
```

**Zaleznosci Maven:**

- `spring-boot-starter-web`
- `spring-boot-starter-validation`
- `spring-boot-starter-test`
- opcjonalnie `spring-boot-starter-security`

**Wymagania:**

- Java 17 albo 21, wybrac jedna wersje i wpisac w `pom.xml`.
- Ustawic artifact np. `react-java-security-demo`.
- Dodac podstawowy test context load.

**Acceptance criteria:**

- `mvn test` przechodzi.
- `mvn spring-boot:run` startuje aplikacje.
- Aplikacja nasluchuje na porcie 8080.

**Zaleznosci:** `FND-001`.

---

## JAVA-APP-002: Dodac model produktu

**Cel:** Zdefiniowac dane, ktore frontend bedzie pobieral.

**Pliki:**

```text
backend/src/main/java/com/example/demo/product/Product.java
backend/src/main/java/com/example/demo/product/ProductRepository.java
```

**Model `Product`:**

- `Long id`
- `String name`
- `BigDecimal price`
- `String imageUrl`
- `boolean inStock`
- `String descriptionHtml`

**Repository:**

- Moze byc in-memory.
- Ma zwracac 4-6 produktow.
- Co najmniej jeden produkt ma miec `inStock=false`.
- Co najmniej jeden produkt ma miec `descriptionHtml`, zeby frontend mial realistyczny kontekst XSS demo.

**Acceptance criteria:**

- Repository ma metode `findAll()`.
- Repository ma metode `findById(Long id)`.
- Dane testowe sa deterministyczne.

**Zaleznosci:** `JAVA-APP-001`.

---

## JAVA-APP-003: Dodac `ProductController`

**Cel:** Wystawic endpointy dla React SPA.

**Pliki:**

```text
backend/src/main/java/com/example/demo/product/ProductController.java
backend/src/test/java/com/example/demo/product/ProductControllerTest.java
```

**Endpointy:**

```text
GET /api/products
GET /api/products/{id}
```

**Wymagania:**

- `GET /api/products` zwraca liste produktow.
- `GET /api/products/{id}` zwraca produkt lub 404.
- Zwracac JSON zgodny z typem frontendowym `Product`.

**Testy:**

- lista produktow zwraca 200,
- produkt po id zwraca 200,
- brak produktu zwraca 404.

**Acceptance criteria:**

- `mvn test` przechodzi.
- Frontend moze uzyc endpointu bez adaptera.

**Zaleznosci:** `JAVA-APP-002`.

---

## JAVA-APP-004: Dodac model zamowienia i walidacje

**Cel:** Przygotowac API dla formularza React.

**Pliki:**

```text
backend/src/main/java/com/example/demo/order/OrderRequest.java
backend/src/main/java/com/example/demo/order/OrderResponse.java
backend/src/main/java/com/example/demo/order/OrderService.java
```

**Pola `OrderRequest`:**

- `Long productId`
- `Integer quantity`
- `String firstName`
- `String lastName`
- `String email`
- `String phone`
- `String deliveryAddress`

**Walidacja:**

- `productId` wymagany,
- `quantity` minimum 1,
- `firstName`, `lastName`, `deliveryAddress` wymagane,
- `email` poprawny format,
- `phone` wymagany, walidacja uproszczona.

**Acceptance criteria:**

- DTO uzywa Jakarta Validation.
- `OrderService` zwraca `OrderResponse` z `orderId` i statusem.

**Zaleznosci:** `JAVA-APP-003`.

---

## JAVA-APP-005: Dodac `OrderController`

**Cel:** Wystawic endpoint do skladania zamowien.

**Pliki:**

```text
backend/src/main/java/com/example/demo/order/OrderController.java
backend/src/test/java/com/example/demo/order/OrderControllerTest.java
```

**Endpoint:**

```text
POST /api/orders
```

**Wymagania:**

- Przyjmuje `@Valid @RequestBody OrderRequest`.
- Zwraca 201 dla poprawnego requestu.
- Zwraca JSON z `orderId`, `status`, `message`.
- Nie loguje PII.

**Testy:**

- poprawny request zwraca 201,
- brak email zwraca 400,
- quantity=0 zwraca 400,
- brak productId zwraca 400.

**Acceptance criteria:**

- `mvn test` przechodzi.
- Endpoint jest zgodny z `OrderForm` w React.

**Zaleznosci:** `JAVA-APP-004`.

---

## JAVA-APP-006: Dodac globalna obsluge bledow walidacji

**Cel:** React ma dostawac bledy w formacie latwym do mapowania na pola formularza.

**Pliki:**

```text
backend/src/main/java/com/example/demo/common/ApiErrorResponse.java
backend/src/main/java/com/example/demo/common/ValidationError.java
backend/src/main/java/com/example/demo/common/GlobalExceptionHandler.java
backend/src/test/java/com/example/demo/common/GlobalExceptionHandlerTest.java
```

**Format odpowiedzi 400:**

```json
{
  "message": "Validation failed",
  "fieldErrors": [
    { "field": "email", "message": "must be a well-formed email address" }
  ]
}
```

**Acceptance criteria:**

- React moze mapowac `fieldErrors` do `react-hook-form`.
- Test kontrolera potwierdza format 400.

**Zaleznosci:** `JAVA-APP-005`.

---

## JAVA-APP-007: Skonfigurowac CORS dla lokalnego React

**Cel:** Frontend lokalny moze wolac backend.

**Plik:**

```text
backend/src/main/java/com/example/demo/config/WebConfig.java
```

**Wymagania:**

- Dopuszczac `http://localhost:5173`.
- Dopuszczac metody `GET`, `POST`, `OPTIONS`.
- Nie ustawiac globalnie `*` z credentials.

**Acceptance criteria:**

- React dev server moze pobrac `/api/products`.
- Konfiguracja nie jest antywzorcem CORS.

**Zaleznosci:** `JAVA-APP-003`.

---

## JAVA-APP-008: Dodac pakiet `securitydemo` dla podatnosci Java

**Cel:** Przygotowac kod do CodeQL demo bez mieszania z logika biznesowa.

**Folder:**

```text
backend/src/main/java/com/example/demo/securitydemo/
```

**Minimalne pliki w MVP:**

- `VulnerableSqlExample.java`
- `SafeSqlExample.java`
- `VulnerableFileDownload.java`
- `SafeFileDownload.java`

**Rozszerzenie:**

- `VulnerableDeserialization.java`
- `SafeJsonParsing.java`
- `VulnerableXmlParser.java`
- `SafeXmlParser.java`

**Wymagania:**

- Kazdy podatny plik ma komentarz `DEMO ONLY - intentionally vulnerable`.
- Bezpieczne warianty maja testy tam, gdzie to ma sens.
- Pakiet jest opisany w README albo w `docs/codeql-alerts-guide.md`.

**Acceptance criteria:**

- CodeQL ma material do alertow Java.
- `mvn test` nadal przechodzi.

**Zaleznosci:** `JAVA-APP-001`.

---

## JAVA-APP-009: Dodac backend README i runbook

**Cel:** Backend da sie uruchomic i sprawdzic bez wiedzy autora.

**Pliki:**

```text
backend/README.md
docs/runbook-backend.md
```

**Tresci wymagane:**

- Wymagana wersja Java.
- Komendy:

```powershell
cd backend
mvn test
mvn spring-boot:run
```

- Endpointy do sprawdzenia:

```text
GET http://localhost:8080/api/products
POST http://localhost:8080/api/orders
```

- Przyklad body dla zamowienia.
- Jak interpretowac bledy walidacji.
- Gdzie sa podatnosci Java do CodeQL.

**Acceptance criteria:**

- Nowa osoba moze uruchomic backend z README.
- Dokumentacja wskazuje zwiazek z React demo.

**Zaleznosci:** `JAVA-APP-005`, `JAVA-APP-008`.

---

## JAVA-APP-010: Sprawdzic backend end-to-end

**Cel:** Potwierdzic, ze backend jest gotowy do uzycia przez React.

**Weryfikacja:**

```powershell
cd backend
mvn test
mvn spring-boot:run
```

W drugim terminalu:

```powershell
curl http://localhost:8080/api/products
```

oraz POST `/api/orders` z poprawnym i blednym requestem.

**Acceptance criteria:**

- Testy przechodza.
- Produkty zwracaja sie jako JSON.
- Poprawne zamowienie zwraca 201.
- Bledne zamowienie zwraca 400 z `fieldErrors`.
- CORS pozwala Reactowi lokalnemu wywolac API.

**Zaleznosci:** `JAVA-APP-001` - `JAVA-APP-009`.

