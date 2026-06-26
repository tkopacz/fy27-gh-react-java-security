// DEMO ONLY - intentionally vulnerable
export function saveToken(token: string) {
  localStorage.setItem('authToken', token);
}
