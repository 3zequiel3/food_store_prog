import { useCategorias } from "../../hooks/useCategorias";
import { useAdminCrudState } from "../../hooks/useAdminCrudState";
import { useTableFilters } from "../../hooks/useTableFilters";
import { CategoriaList } from "../../components/admin/Categoria/CategoriaList";
import { CategoriaForm } from "../../components/admin/Categoria/CategoriaForm";
import { Modal } from "../../components/ui/Modal";
import { Button } from "../../components/ui/Button";
import type { Categoria } from "../../types/categoria";
import type { CategoriaListParams } from "../../api/categoria.api";

type CategoriaSortBy = NonNullable<CategoriaListParams["sort_by"]>;

export function CategoriasPage() {
  const {
    pagination,
    setPagination,
    sorting,
    setSorting,
    toQueryParams,
  } = useTableFilters();

  const queryParams = toQueryParams();
  const {
    categorias,
    total,
    isLoading,
    error,
    create,
    update,
    remove,
    isDeleting,
  } = useCategorias({
    skip: queryParams.skip,
    limit: queryParams.limit,
    sort_by: queryParams.sort_by as CategoriaSortBy | undefined,
    order: queryParams.order,
  });

  const {
    isModalOpen,
    editing,
    openCreate,
    openEdit,
    closeModal,
  } = useAdminCrudState<Categoria>();

  const handleSubmit = async (data: {
    nombre: string;
    descripcion: string;
    imagen_url: string | null;
    parent_id: number | null;
  }) => {
    if (editing) {
      await update({ id: editing.id, data });
    } else {
      await create(data);
    }
    closeModal();
  };

  const handleDelete = async (id: number) => {
    await remove(id);
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-500 text-sm">
          Error al cargar categorías: {error.message}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-foreground)]">
            Categorías
          </h1>
          <p className="text-sm text-[var(--color-muted)] mt-1">
            Gestioná las categorías de tus productos
          </p>
        </div>
        <Button onClick={openCreate}>+ Nueva categoría</Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-40">
          <div className="w-6 h-6 border-2 border-[var(--color-primary-300)] border-t-[var(--color-primary-600)] rounded-full animate-spin" />
        </div>
      ) : (
        <CategoriaList
          categorias={categorias}
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
        title={editing ? "Editar categoría" : "Nueva categoría"}
      >
        <CategoriaForm
          initialData={editing}
          categorias={categorias}
          onSubmit={handleSubmit}
          onCancel={closeModal}
        />
      </Modal>
    </div>
  );
}
