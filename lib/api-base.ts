/**
 * Normalize API base URLs so they always end with a single "/api" segment.
 */
export function ensureApiBaseUrl(
  rawUrl?: string,
  fallback = 'http://localhost:8080/api',
): string {
  const base = (rawUrl?.trim() || fallback).replace(/\/+$/, '');
  return base.endsWith('/api') ? base : `${base}/api`;
}

