import { apiClient } from "./client";
import type {
  Producto,
  ProductoCreate,
  ProductoUpdate,
} from "../types/producto";
import type { Page } from "../types/pagination";

export interface ProductoListParams {
  skip?: number;
  limit?: number;
  nombre?: string;
  disponible?: boolean;
  precio_min?: number;
  precio_max?: number;
  categoria_id?: number;
  ingrediente_id?: number;
  sort_by?: "nombre" | "precio_base" | "created_at";
  order?: "asc" | "desc";
  [key: string]: unknown;
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

export const productoApi = {
  getAll: (params?: ProductoListParams) =>
    apiClient<Page<Producto>>(`/productos${buildQueryString(params)}`),

  getById: (id: number) => apiClient<Producto>(`/productos/${id}`),

  create: (data: ProductoCreate) =>
    apiClient<Producto>("/productos", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (id: number, data: ProductoUpdate) =>
    apiClient<Producto>(`/productos/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  delete: (id: number) =>
    apiClient<void>(`/productos/${id}`, { method: "DELETE" }),

  agregarCategoria: (productoId: number, categoriaId: number) =>
    apiClient<Producto>(`/productos/${productoId}/categorias/${categoriaId}`, {
      method: "POST",
    }),

  eliminarCategoria: (productoId: number, categoriaId: number) =>
    apiClient<Producto>(`/productos/${productoId}/categorias/${categoriaId}`, {
      method: "DELETE",
    }),

  agregarIngrediente: (productoId: number, ingredienteId: number) =>
    apiClient<Producto>(
      `/productos/${productoId}/ingredientes/${ingredienteId}`,
      { method: "POST" },
    ),

  eliminarIngrediente: (productoId: number, ingredienteId: number) =>
    apiClient<Producto>(
      `/productos/${productoId}/ingredientes/${ingredienteId}`,
      { method: "DELETE" },
    ),
};
