import { ApiError, type ApiErrorResponse } from '../types/ApiError';
import { apiBaseUrl } from '../config';

const baseUrl = apiBaseUrl;

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  if (!headers.has('Content-Type') && init.body) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(`${baseUrl}${path}`, {
    ...init,
    headers,
    credentials: 'omit'
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => ({}))) as ApiErrorResponse;
    throw new ApiError(payload.message || 'Request failed', response.status, payload.fieldErrors);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export { request };
