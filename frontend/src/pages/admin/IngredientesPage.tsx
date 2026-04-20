import { useState } from "react";
import { useIngredientes } from "../../hooks/useIngredientes";
import { IngredienteList } from "../../components/admin/Ingrediente/IngredienteList";
import { IngredienteForm } from "../../components/admin/Ingrediente/IngredienteForm";
import { Modal } from "../../components/ui/Modal";
import { Button } from "../../components/ui/Button";
import type { Ingrediente } from "../../types/ingrediente";

export function IngredientesPage() {
  const {
    ingredientes,
    isLoading,
    error,
    create,
    update,
    remove,
    isCreating,
    isUpdating,
    isDeleting,
  } = useIngredientes();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<Ingrediente | null>(null);

  const openCreate = () => {
    setEditing(null);
    setIsModalOpen(true);
  };

  const openEdit = (ingrediente: Ingrediente) => {
    setEditing(ingrediente);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditing(null);
  };

  const handleSubmit = async (data: {
    nombre: string;
    descripcion: string;
    es_alergeno: boolean;
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
          Error al cargar ingredientes: {error.message}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-foreground)]">
            Ingredientes
          </h1>
          <p className="text-sm text-[var(--color-muted)] mt-1">
            Gestioná los ingredientes de tus productos
          </p>
        </div>
        <Button onClick={openCreate}>+ Nuevo ingrediente</Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-40">
          <div className="w-6 h-6 border-2 border-[var(--color-primary-300)] border-t-[var(--color-primary-600)] rounded-full animate-spin" />
        </div>
      ) : (
        <IngredienteList
          ingredientes={ingredientes}
          onEdit={openEdit}
          onDelete={handleDelete}
          isDeleting={isDeleting}
        />
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editing ? "Editar ingrediente" : "Nuevo ingrediente"}
      >
        <IngredienteForm
          initialData={editing}
          onSubmit={handleSubmit}
          onCancel={closeModal}
        />
      </Modal>
    </div>
  );
}
