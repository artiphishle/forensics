'use client';

const headers = { contentType: 'application/json' };

/**
 * Fetch wrapper to perform a json GET request
 */
export async function getJson<T>(url: string) {
  const res = await fetch(url, { headers });
  const json: T = await res.json();

  return json;
}
