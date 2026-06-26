# PR scenario: `demo/npm-vulnerable-dependency`

1. Create the demo branch.
2. Apply the patch in `demo-scenarios/dependency-review/package-json-patch.diff`
   (dodaje `lodash@4.17.4`, CVE-2019-10744, severity: **Critical**).
3. Open a PR.
4. Dependency Review Action zablokuje merge — "Dependency Review" check zakończy
   się błędem z informacją o GHSA-jf85-cpcp-j695.
5. Close the PR without merging.
