const fallback = 'http://localhost:8080/api';

export function normalizeApiBase(url?: string) {
  if (!url) return fallback;
  const trimmed = url.endsWith('/') ? url.slice(0, -1) : url;
  if (trimmed.endsWith('/api')) return trimmed;
  return `${trimmed}/api`;
}

export const BACKEND_URL = normalizeApiBase(process.env.NEXT_PUBLIC_API_URL);

