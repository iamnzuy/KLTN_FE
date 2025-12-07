import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { fetcherClient } from './axios';

/**
 * Merges Tailwind class names, resolving any conflicts.
 *
 * @param inputs - An array of class names to merge.
 * @returns A string of merged and optimized class names.
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const configSWR = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  fetcher: fetcherClient,
  errorRetryCount: 3,
};