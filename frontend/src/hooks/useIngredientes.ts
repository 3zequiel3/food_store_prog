import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ingredienteApi } from "../api/ingrediente.api";
import type {
  IngredienteCreate,
  IngredienteUpdate,
} from "../types/ingrediente";

const QUERY_KEY = ["ingredientes"];

export function useIngredientes() {
  const queryClient = useQueryClient();

  const ingredientesQuery = useQuery({
    queryKey: QUERY_KEY,
    queryFn: ingredienteApi.getAll,
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
    ingredientes: ingredientesQuery.data ?? [],
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
