# Dependency Review demo

## Pakiet testowy

Plik `package-json-patch.diff` dodaje `lodash@4.17.4` — wersję z krytyczną
luką **CVE-2019-10744** (prototype pollution, GHSA-jf85-cpcp-j695, ocena **Critical**).
Dependency Review Action skonfigurowana z `fail-on-severity: high` odrzuci ten PR.

## Kroki demonstracji

1. Create a branch named `demo/npm-vulnerable-dependency`.
2. Apply the patch in `demo-scenarios/dependency-review/package-json-patch.diff`.
3. Open a PR.
4. Dependency Review Action wykryje `lodash@4.17.4` i zablokuje merge.
5. Close the PR without merging.

> **Nota:** Nie używaj `left-pad` ani innych pakietów bez aktywnych GHSA Advisory —
> Dependency Review nie zasygnalizuje błędu dla pakietów bez znanych podatności.
