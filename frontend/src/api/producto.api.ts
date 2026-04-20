import { apiClient } from "./client";
import type {
  Producto,
  ProductoCreate,
  ProductoUpdate,
} from "../types/producto";

export const productoApi = {
  getAll: () => apiClient<Producto[]>("/productos"),

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
