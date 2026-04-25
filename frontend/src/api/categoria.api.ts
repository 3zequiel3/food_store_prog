import { apiClient } from "./client";
import type {
  Categoria,
  CategoriaCreate,
  CategoriaUpdate,
} from "../types/categoria";
import type { Page } from "../types/pagination";

export interface CategoriaListParams {
  skip?: number;
  limit?: number;
  nombre?: string;
  tipo?: "raiz" | "subcategoria";
  parent_id?: number;
  sort_by?: "nombre" | "created_at";
  order?: "asc" | "desc";
}

function buildQueryString(params?: Record<string, unknown>): string {
  if (!params) return "";
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      search.append(key, String(value));
    }
  });
  const qs = search.toString();
  return qs ? `?${qs}` : "";
}

export const categoriaApi = {
  getAll: (params?: CategoriaListParams) =>
    apiClient<Page<Categoria>>(`/categorias${buildQueryString(params)}`),

  getById: (id: number) => apiClient<Categoria>(`/categorias/${id}`),

  create: (data: CategoriaCreate) =>
    apiClient<Categoria>("/categorias", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (id: number, data: CategoriaUpdate) =>
    apiClient<Categoria>(`/categorias/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  delete: (id: number) =>
    apiClient<void>(`/categorias/${id}`, { method: "DELETE" }),
};
