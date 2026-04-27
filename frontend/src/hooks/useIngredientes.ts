import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ingredienteApi,
  type IngredienteListParams,
} from "../api/ingrediente.api";
import type {
  IngredienteCreate,
  IngredienteUpdate,
} from "../types/ingrediente";

const QUERY_KEY = ["ingredientes"];

export function useIngredientes(params?: IngredienteListParams) {
  const queryClient = useQueryClient();

  const ingredientesQuery = useQuery({
    queryKey: [...QUERY_KEY, params],
    queryFn: () => ingredienteApi.getAll(params),
  });

  const createMutation = useMutation({
    mutationFn: (data: IngredienteCreate) => ingredienteApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: IngredienteUpdate }) =>
      ingredienteApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => ingredienteApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });

  return {
    ingredientes: ingredientesQuery.data?.items ?? [],
    total: ingredientesQuery.data?.total ?? 0,
    skip: ingredientesQuery.data?.skip ?? 0,
    limit: ingredientesQuery.data?.limit ?? 0,
    hasNext: ingredientesQuery.data?.has_next ?? false,
    isLoading: ingredientesQuery.isLoading,
    error: ingredientesQuery.error,
    create: createMutation.mutateAsync,
    update: updateMutation.mutateAsync,
    remove: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
