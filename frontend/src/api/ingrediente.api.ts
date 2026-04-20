import { apiClient } from "./client";
import type {
  Ingrediente,
  IngredienteCreate,
  IngredienteUpdate,
} from "../types/ingrediente";

export const ingredienteApi = {
  getAll: () => apiClient<Ingrediente[]>("/ingredientes"),

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
