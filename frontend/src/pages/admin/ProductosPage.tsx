import { useProductos } from "../../hooks/useProductos";
import { useCategorias } from "../../hooks/useCategorias";
import { useIngredientes } from "../../hooks/useIngredientes";
import { useAdminCrudState } from "../../hooks/useAdminCrudState";
import { useTableFilters } from "../../hooks/useTableFilters";
import { ProductoList } from "../../components/admin/Producto/ProductoList";
import { ProductoForm } from "../../components/admin/Producto/ProductoForm";
import { Modal } from "../../components/ui/Modal";
import { Button } from "../../components/ui/Button";
import type { Producto } from "../../types/producto";
import type { ProductoListParams } from "../../api/producto.api";

type ProductoSortBy = NonNullable<ProductoListParams["sort_by"]>;

export function ProductosPage() {
  const {
    pagination,
    setPagination,
    sorting,
    setSorting,
    toQueryParams,
  } = useTableFilters();

  const queryParams = toQueryParams();
  const {
    productos,
    total,
    isLoading,
    error,
    create,
    update,
    remove,
    syncCategorias,
    syncIngredientes,
    isDeleting,
  } = useProductos({
    skip: queryParams.skip,
    limit: queryParams.limit,
    sort_by: queryParams.sort_by as ProductoSortBy | undefined,
    order: queryParams.order,
  });

  const { categorias } = useCategorias();
  const { ingredientes } = useIngredientes();

  const {
    isModalOpen,
    editing,
    openCreate,
    openEdit,
    closeModal,
  } = useAdminCrudState<Producto>();

  const handleSubmit = async (data: {
    nombre: string;
    descripcion: string;
    precio_base: number;
    imagenes_url: string[];
    disponible: boolean;
    stock_cantidad: number;
    categorias_ids: number[];
    ingredientes_ids: number[];
  }) => {
    const { categorias_ids, ingredientes_ids, ...productoData } = data;

    try {
      if (editing) {
        await update({ id: editing.id, data: productoData });
        const currentCatIds = editing.categorias?.map((c) => c.id) ?? [];
        await syncCategorias(editing.id, currentCatIds, categorias_ids);
        const currentIngIds = editing.ingredientes?.map((i) => i.id) ?? [];
        await syncIngredientes(editing.id, currentIngIds, ingredientes_ids);
      } else {
        await create({
          ...productoData,
          categorias_ids,
          ingredientes_ids,
        });
      }
      closeModal();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error desconocido";
      alert(`Error al guardar el producto: ${message}`);
    }
  };

  const handleDelete = async (id: number) => {
    await remove(id);
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-500 text-sm">
          Error al cargar productos: {error.message}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-foreground)]">
            Productos
          </h1>
          <p className="text-sm text-[var(--color-muted)] mt-1">
            Gestioná los productos de tu tienda
          </p>
        </div>
        <Button onClick={openCreate}>+ Nuevo producto</Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-40">
          <div className="w-6 h-6 border-2 border-[var(--color-primary-300)] border-t-[var(--color-primary-600)] rounded-full animate-spin" />
        </div>
      ) : (
        <ProductoList
          productos={productos}
          onEdit={openEdit}
          onDelete={handleDelete}
          isDeleting={isDeleting}
          total={total}
          pagination={pagination}
          onPaginationChange={setPagination}
          sorting={sorting}
          onSortingChange={setSorting}
        />
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editing ? "Editar producto" : "Nuevo producto"}
      >
        <ProductoForm
          initialData={editing}
          categorias={categorias}
          ingredientes={ingredientes}
          onSubmit={handleSubmit}
          onCancel={closeModal}
        />
      </Modal>
    </div>
  );
}
