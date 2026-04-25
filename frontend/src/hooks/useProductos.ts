import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { productoApi, type ProductoListParams } from "../api/producto.api";
import type { ProductoCreate, ProductoUpdate } from "../types/producto";

const QUERY_KEY = ["productos"];

export function useProducto(id: number) {
  return useQuery({
    queryKey: [...QUERY_KEY, id],
    queryFn: () => productoApi.getById(id),
    enabled: !!id && !Number.isNaN(id),
  });
}

export function useProductos(params?: ProductoListParams) {
  const queryClient = useQueryClient();

  const productosQuery = useQuery({
    queryKey: [...QUERY_KEY, params],
    queryFn: () => productoApi.getAll(params),
  });

  const createMutation = useMutation({
    mutationFn: (data: ProductoCreate) => productoApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: ProductoUpdate }) =>
      productoApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => productoApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });

  const syncCategorias = async (
    productoId: number,
    currentCatIds: number[],
    selectedCatIds: number[],
  ) => {
    const toAdd = selectedCatIds.filter((id) => !currentCatIds.includes(id));
    const toRemove = currentCatIds.filter((id) => !selectedCatIds.includes(id));

    await Promise.all([
      ...toAdd.map((catId) => productoApi.agregarCategoria(productoId, catId)),
      ...toRemove.map((catId) =>
        productoApi.eliminarCategoria(productoId, catId),
      ),
    ]);

    queryClient.invalidateQueries({ queryKey: QUERY_KEY });
  };

  const syncIngredientes = async (
    productoId: number,
    currentIngIds: number[],
    selectedIngIds: number[],
  ) => {
    const toAdd = selectedIngIds.filter((id) => !currentIngIds.includes(id));
    const toRemove = currentIngIds.filter((id) => !selectedIngIds.includes(id));

    await Promise.all([
      ...toAdd.map((ingId) =>
        productoApi.agregarIngrediente(productoId, ingId),
      ),
      ...toRemove.map((ingId) =>
        productoApi.eliminarIngrediente(productoId, ingId),
      ),
    ]);

    queryClient.invalidateQueries({ queryKey: QUERY_KEY });
  };

  return {
    productos: productosQuery.data?.items ?? [],
    total: productosQuery.data?.total ?? 0,
    skip: productosQuery.data?.skip ?? 0,
    limit: productosQuery.data?.limit ?? 0,
    hasNext: productosQuery.data?.has_next ?? false,
    isLoading: productosQuery.isLoading,
    error: productosQuery.error,
    create: createMutation.mutateAsync,
    update: updateMutation.mutateAsync,
    remove: deleteMutation.mutateAsync,
    syncCategorias,
    syncIngredientes,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
