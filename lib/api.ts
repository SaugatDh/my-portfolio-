const API_BASE = import.meta.env.VITE_API_URL || '';

export async function apiFetch(path: string, options?: RequestInit) {
  const url = API_BASE ? `${API_BASE}${path}` : path;
  return fetch(url, options);
}
