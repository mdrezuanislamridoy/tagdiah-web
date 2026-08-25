const API_BASE = 'http://localhost:5000/api';
const TOKEN_KEY = 'tagdiah_token';

/** Get the stored JWT token */
export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

/** Store a JWT token */
export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

/** Remove the stored JWT token */
export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

/** Generic fetch wrapper that auto-attaches the JWT Bearer token */
export async function apiFetch<T = unknown>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((options.headers as Record<string, string>) || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  // Handle 401 — token expired or invalid
  if (res.status === 401) {
    clearToken();
    // Don't redirect here — let the caller handle it
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const message = body.message || `Request failed (${res.status})`;
    throw new Error(Array.isArray(message) ? message[0] : message);
  }

  // Handle 204 No Content
  if (res.status === 204) return undefined as T;

  return res.json();
}

/* ── Typed API helpers ── */

export const api = {
  get: <T = unknown>(path: string) => apiFetch<T>(path, { method: 'GET' }),

  post: <T = unknown>(path: string, body?: unknown) =>
    apiFetch<T>(path, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    }),

  put: <T = unknown>(path: string, body?: unknown) =>
    apiFetch<T>(path, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    }),

  patch: <T = unknown>(path: string, body?: unknown) =>
    apiFetch<T>(path, {
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    }),

  delete: <T = unknown>(path: string) => apiFetch<T>(path, { method: 'DELETE' }),
};
