# PR scenario: `demo/react-xss`

1. Create a branch `demo/react-xss`.
2. Add or modify `frontend/src/security-demo/VulnerableSearchPage.tsx`.
3. Open a PR to `main`.
4. Wait for CodeQL to surface a JavaScript XSS alert.
5. Explain that the issue lives in the browser and is not visible to the Java backend scan.
