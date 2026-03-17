/**
 * Centralized API base URL.
 * - Browser: NEXT_PUBLIC_API_BASE_URL or same-origin (empty).
 * - Server: API_BASE_URL or NEXT_PUBLIC_API_BASE_URL or http://localhost:3000.
 */
function getBaseUrl(): string {
  if (typeof window !== 'undefined') {
    return process.env.NEXT_PUBLIC_API_BASE_URL ?? '';
  }
  return (
    process.env.API_BASE_URL ??
    process.env.NEXT_PUBLIC_API_BASE_URL ??
    'http://localhost:3000'
  );
}

export const apiConfig = {
  baseUrl: getBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
} as const;
