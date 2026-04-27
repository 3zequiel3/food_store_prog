import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { categoriaApi, type CategoriaListParams } from "../api/categoria.api";
import type { CategoriaCreate, CategoriaUpdate } from "../types/categoria";

const QUERY_KEY = ["categorias"];

export function useCategorias(params?: CategoriaListParams) {
  const queryClient = useQueryClient();

  const categoriasQuery = useQuery({
    queryKey: [...QUERY_KEY, params],
    queryFn: () => categoriaApi.getAll(params),
  });

  const createMutation = useMutation({
    mutationFn: (data: CategoriaCreate) => categoriaApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: CategoriaUpdate }) =>
      categoriaApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => categoriaApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });

  return {
    categorias: categoriasQuery.data?.items ?? [],
    total: categoriasQuery.data?.total ?? 0,
    skip: categoriasQuery.data?.skip ?? 0,
    limit: categoriasQuery.data?.limit ?? 0,
    hasNext: categoriasQuery.data?.has_next ?? false,
    isLoading: categoriasQuery.isLoading,
    error: categoriasQuery.error,
    create: createMutation.mutateAsync,
    update: updateMutation.mutateAsync,
    remove: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
