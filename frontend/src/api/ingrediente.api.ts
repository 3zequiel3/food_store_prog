import { apiClient } from "./client";
import type {
  Ingrediente,
  IngredienteCreate,
  IngredienteUpdate,
} from "../types/ingrediente";
import type { Page } from "../types/pagination";

export interface IngredienteListParams {
  skip?: number;
  limit?: number;
  nombre?: string;
  es_alergeno?: boolean;
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

export const ingredienteApi = {
  getAll: (params?: IngredienteListParams) =>
    apiClient<Page<Ingrediente>>(`/ingredientes${buildQueryString(params)}`),

  getById: (id: number) => apiClient<Ingrediente>(`/ingredientes/${id}`),

  create: (data: IngredienteCreate) =>
    apiClient<Ingrediente>("/ingredientes", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (id: number, data: IngredienteUpdate) =>
    apiClient<Ingrediente>(`/ingredientes/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  delete: (id: number) =>
    apiClient<void>(`/ingredientes/${id}`, { method: "DELETE" }),
};
