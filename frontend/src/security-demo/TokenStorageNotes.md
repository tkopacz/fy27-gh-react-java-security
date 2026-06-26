# Token storage notes

- Storing tokens in localStorage exposes them to any script running in the page.
- A DOM XSS bug can read the token and exfiltrate it without involving the Java backend at all.
- Prefer an HttpOnly cookie or a short-lived session token in a secure context.
