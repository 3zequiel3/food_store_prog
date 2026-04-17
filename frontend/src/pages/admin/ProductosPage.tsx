import { useState } from "react";
import { useProductos } from "../../hooks/useProductos";
import { useCategorias } from "../../hooks/useCategorias";
import { useIngredientes } from "../../hooks/useIngredientes";
import { ProductoList } from "../../components/admin/ProductoList";
import { ProductoForm } from "../../components/admin/ProductoForm";
import { Modal } from "../../components/ui/Modal";
import { Button } from "../../components/ui/Button";
import type { Producto } from "../../types/producto";

export function ProductosPage() {
  const {
    productos,
    isLoading,
    error,
    create,
    update,
    remove,
    syncCategorias,
    syncIngredientes,
    isCreating,
    isUpdating,
    isDeleting,
  } = useProductos();

  const { categorias } = useCategorias();
  const { ingredientes } = useIngredientes();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<Producto | null>(null);

  const openCreate = () => {
    setEditing(null);
    setIsModalOpen(true);
  };

  const openEdit = (producto: Producto) => {
    setEditing(producto);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditing(null);
  };

  const handleSubmit = async (data: {
    nombre: string;
    descripcion: string;
    precio_base: number;
    imagen_url: string[];
    disponible: boolean;
    categoriaIds: number[];
    ingredienteIds: number[];
  }) => {
    const { categoriaIds, ingredienteIds, ...productoData } = data;

    if (editing) {
      await update({ id: editing.id, data: productoData });
      const currentCatIds = editing.categorias?.map((c) => c.id) ?? [];
      await syncCategorias(editing.id, currentCatIds, categoriaIds);
      const currentIngIds = editing.ingredientes?.map((i) => i.id) ?? [];
      await syncIngredientes(editing.id, currentIngIds, ingredienteIds);
    } else {
      const nuevo = await create(productoData);
      if (categoriaIds.length > 0) {
        await syncCategorias(nuevo.id, [], categoriaIds);
      }
      if (ingredienteIds.length > 0) {
        await syncIngredientes(nuevo.id, [], ingredienteIds);
      }
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
          isLoading={isCreating || isUpdating}
        />
      </Modal>
    </div>
  );
}
