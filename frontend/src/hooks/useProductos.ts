import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { productoApi } from "../api/producto.api";
import type { ProductoCreate, ProductoUpdate } from "../types/producto";

const QUERY_KEY = ["productos"];

export function useProductos() {
  const queryClient = useQueryClient();

  const productosQuery = useQuery({
    queryKey: QUERY_KEY,
    queryFn: productoApi.getAll,
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
    productos: productosQuery.data ?? [],
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
