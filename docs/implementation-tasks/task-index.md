# Indeks zadan implementacyjnych

| ID | Nazwa | Epic | Priorytet | Zaleznosci | Status |
|---|---|---|---|---|---|
| FND-001 | Utworzyc strukture monorepo | Foundation | MVP | brak | todo |
| FND-002 | Utworzyc React SPA TypeScript | Foundation | MVP | FND-001 | todo |
| FND-003 | Utworzyc Spring Boot backend | Foundation | MVP | FND-001 | todo |
| FND-004 | Dodac modele domenowe frontend | Foundation | High | FND-002 | todo |
| JAVA-APP-001 | Utworzyc projekt Spring Boot | Java backend app | MVP | FND-001 | todo |
| JAVA-APP-002 | Dodac model produktu | Java backend app | MVP | JAVA-APP-001 | todo |
| JAVA-APP-003 | Dodac ProductController | Java backend app | MVP | JAVA-APP-002 | todo |
| JAVA-APP-004 | Dodac model zamowienia i walidacje | Java backend app | MVP | JAVA-APP-003 | todo |
| JAVA-APP-005 | Dodac OrderController | Java backend app | MVP | JAVA-APP-004 | todo |
| JAVA-APP-006 | Dodac globalna obsluge bledow walidacji | Java backend app | MVP | JAVA-APP-005 | todo |
| JAVA-APP-007 | Skonfigurowac CORS dla lokalnego React | Java backend app | High | JAVA-APP-003 | todo |
| JAVA-APP-008 | Dodac pakiet securitydemo dla podatnosci Java | Java backend app | MVP | JAVA-APP-001 | todo |
| JAVA-APP-009 | Dodac backend README i runbook | Java backend app | High | JAVA-APP-005, JAVA-APP-008 | todo |
| JAVA-APP-010 | Sprawdzic backend end-to-end | Java backend app | MVP | JAVA-APP-001 - JAVA-APP-009 | todo |
| REACT-APP-001 | Utworzyc projekt Vite React TypeScript | React frontend app | MVP | FND-001 | todo |
| REACT-APP-002 | Dodac routing i layout | React frontend app | MVP | REACT-APP-001 | todo |
| REACT-APP-003 | Dodac typy domenowe | React frontend app | MVP | REACT-APP-001, JAVA-APP-004, JAVA-APP-006 | todo |
| REACT-APP-004 | Dodac warstwe API client | React frontend app | MVP | REACT-APP-003, JAVA-APP-003, JAVA-APP-005 | todo |
| REACT-APP-005 | Zaimplementowac ProductCard i liste produktow | React frontend app | MVP | REACT-APP-004 | todo |
| REACT-APP-006 | Zaimplementowac OrderForm | React frontend app | MVP | REACT-APP-004, JAVA-APP-005, JAVA-APP-006 | todo |
| REACT-APP-007 | Dodac legacy component do refaktoru Copilot | React frontend app | High | REACT-APP-004 | todo |
| REACT-APP-008 | Dodac Security Demo page | React frontend app | High | SEC-JS-001, SEC-JS-002, SEC-JS-003, SEC-JS-004, SEC-JS-005 | todo |
| REACT-APP-009 | Dodac konfiguracje env bez sekretow | React frontend app | MVP | REACT-APP-004 | todo |
| REACT-APP-010 | Dodac frontend README i runbook | React frontend app | High | REACT-APP-001 - REACT-APP-009 | todo |
| REACT-APP-011 | Sprawdzic frontend end-to-end | React frontend app | MVP | REACT-APP-001 - REACT-APP-010, JAVA-APP-010 | todo |
| COP-001 | Zaimplementowac ProductCard | Copilot | MVP | FND-002, FND-004 | todo |
| COP-002 | Zaimplementowac useProducts | Copilot | MVP | FND-002, FND-003, FND-004 | todo |
| COP-003 | Zaimplementowac OrderForm | Copilot | MVP | FND-002, FND-003, FND-004 | todo |
| COP-004 | Dodac legacy React component do refaktoru | Copilot | High | FND-002 | todo |
| COP-005 | Dodac prompt template dla Java controller | Copilot | High | FND-003 | todo |
| SEC-JS-001 | Dodac DOM XSS przez dangerouslySetInnerHTML | Security JS | MVP | FND-002 | todo |
| SEC-JS-002 | Dodac XSS z parametru URL | Security JS | MVP | SEC-JS-001 | todo |
| SEC-JS-003 | Dodac client-side open redirect | Security JS | MVP | FND-002 | todo |
| SEC-JS-004 | Dodac cleartext token storage | Security JS | High | FND-002 | todo |
| SEC-JS-005 | Dodac prototype pollution demo | Security JS | High | FND-002 | todo |
| SEC-JAVA-001 | Dodac SQL injection demo | Security Java | MVP | FND-003 | todo |
| SEC-JAVA-002 | Dodac path traversal demo | Security Java | MVP | FND-003 | todo |
| SEC-JAVA-003 | Dodac unsafe deserialization demo | Security Java | High | FND-003 | todo |
| SEC-JAVA-004 | Dodac XXE demo | Security Java | High | FND-003 | todo |
| GHAS-001 | Dodac CodeQL workflow | GHAS | MVP | FND-002, FND-003 | todo |
| GHAS-002 | Dodac Dependabot configuration | GHAS | MVP | FND-002, FND-003 | todo |
| GHAS-003 | Dodac Dependency Review workflow | GHAS | MVP | GHAS-002 | todo |
| GHAS-004 | Przygotowac npm vulnerable dependency scenario | GHAS | High | GHAS-003 | todo |
| GHAS-005 | Przygotowac Secret Scanning demo bez sekretow | GHAS | MVP | FND-002 | todo |
| GHAS-006 | Przygotowac CodeQL alert guide | GHAS | High | GHAS-001, SEC-JS-001, SEC-JAVA-001 | todo |
| PR-001 | Scenariusz PR demo/react-xss | PR scenarios | High | SEC-JS-002, GHAS-001 | todo |
| PR-002 | Scenariusz PR demo/java-sql-injection | PR scenarios | High | SEC-JAVA-001, GHAS-001 | todo |
| PR-003 | Scenariusz PR demo/npm-vulnerable-dependency | PR scenarios | High | GHAS-003, GHAS-004 | todo |
| DOC-001 | Przygotowac glowny skrypt prezentacji | Docs | MVP | COP-001, COP-002, COP-003, SEC-JS-001, SEC-JAVA-001 | todo |
| DOC-002 | Przygotowac Copilot promptbook | Docs | MVP | COP-001, COP-002, COP-003, COP-004, COP-005 | todo |
| DOC-003 | Przygotowac dokument obiekcji klienta | Docs | High | DOC-001, SEC-JS-001, GHAS-003 | todo |
| DOC-004 | Przygotowac runbook lokalnego uruchomienia | Docs | MVP | FND-002, FND-003 | todo |
| DOC-005 | Przygotowac pre-demo checklist | Docs | High | GHAS-001, GHAS-002, GHAS-003, GHAS-005 | todo |
| DOC-006 | Przygotowac strone Security Demo w aplikacji | Docs/Frontend | High | SEC-JS-001, SEC-JS-002, SEC-JS-003, SEC-JAVA-001 | todo |
| DOC-007 | Przygotowac finalny indeks zadan i statusow | Docs | Done | wszystkie pliki zadan | done |
