// DEMO ONLY - intentionally vulnerable
export function redirectAfterLogin() {
  const next = new URLSearchParams(window.location.search).get('next');
  if (next) {
    window.location.href = next;
  }
}
