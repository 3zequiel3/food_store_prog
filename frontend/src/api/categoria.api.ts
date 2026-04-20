import { apiClient } from "./client";
import type {
  Categoria,
  CategoriaCreate,
  CategoriaUpdate,
} from "../types/categoria";

export const categoriaApi = {
  getAll: () => apiClient<Categoria[]>("/categorias"),

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
