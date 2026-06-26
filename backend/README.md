# Backend demo

Ten moduł dostarcza prostą aplikację Spring Boot dla sklepu demo.

## Wymagania

- Java 21
- Maven 3.9+

## Komendy

```powershell
cd backend
$env:JAVA_HOME = "C:\Program Files\Java\jdk-21"
$env:Path = "$env:JAVA_HOME\bin;$env:Path"
mvn test
mvn spring-boot:run
```

## Endpointy

- `GET /api/products`
- `GET /api/products/{id}`
- `POST /api/orders`

Przykładowe zamówienie:

```json
{
  "productId": 1,
  "quantity": 2,
  "firstName": "Ada",
  "lastName": "Lovelace",
  "email": "ada@example.com",
  "phone": "123456789",
  "deliveryAddress": "10 Downing Street"
}
```

Błędy walidacji są zwracane w formacie przyjaznym dla React:

```json
{
  "message": "Validation failed",
  "fieldErrors": [
    { "field": "email", "message": "must be a well-formed email address" }
  ]
}
```
