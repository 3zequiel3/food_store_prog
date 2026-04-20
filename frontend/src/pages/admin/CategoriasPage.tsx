import { useState } from "react";
import { useCategorias } from "../../hooks/useCategorias";
import { CategoriaList } from "../../components/admin/Categoria/CategoriaList";
import { CategoriaForm } from "../../components/admin/Categoria/CategoriaForm";
import { Modal } from "../../components/ui/Modal";
import { Button } from "../../components/ui/Button";
import type { Categoria } from "../../types/categoria";

export function CategoriasPage() {
  const {
    categorias,
    isLoading,
    error,
    create,
    update,
    remove,
    isCreating,
    isUpdating,
    isDeleting,
  } = useCategorias();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<Categoria | null>(null);

  const openCreate = () => {
    setEditing(null);
    setIsModalOpen(true);
  };

  const openEdit = (categoria: Categoria) => {
    setEditing(categoria);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditing(null);
  };

  const handleSubmit = async (data: {
    nombre: string;
    descripcion: string;
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
        />
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editing ? "Editar categoría" : "Nueva categoría"}
      >
        <CategoriaForm
          initialData={editing}
          onSubmit={handleSubmit}
          onCancel={closeModal}
        />
      </Modal>
    </div>
  );
}
