const API_BASE = "http://localhost:8003";

export async function apiClient<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    ...options,
  });

  if (!res.ok) {
    const error = await res
      .json()
      .catch(() => ({ detail: "Error desconocido" }));
    throw new Error(error.detail ?? `Error ${res.status}`);
  }

  if (res.status === 204) return undefined as T;

  return res.json();
}
