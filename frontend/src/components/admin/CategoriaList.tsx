import { useState } from "react";
import { Table } from "../ui/Table";
import { Button } from "../ui/Button";
import { ConfirmDialog } from "../ui/ConfirmDialog";
import type { Categoria } from "../../types/categoria";

interface CategoriaListProps {
  categorias: Categoria[];
  onEdit: (categoria: Categoria) => void;
  onDelete: (id: number) => Promise<void>;
  isDeleting?: boolean;
}

export function CategoriaList({
  categorias,
  onEdit,
  onDelete,
  isDeleting,
}: CategoriaListProps) {
  const [deleteTarget, setDeleteTarget] = useState<Categoria | null>(null);

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    await onDelete(deleteTarget.id);
    setDeleteTarget(null);
  };

  const columns = [
    {
      key: "nombre",
      header: "Nombre",
      render: (c: Categoria) => (
        <span className="font-medium text-[var(--color-foreground)]">
          {c.nombre}
        </span>
      ),
    },
    {
      key: "descripcion",
      header: "Descripción",
      render: (c: Categoria) => (
        <span className="text-[var(--color-muted)]">
          {c.descripcion || "—"}
        </span>
      ),
    },
    {
      key: "acciones",
      header: "Acciones",
      className: "w-40",
      render: (c: Categoria) => (
        <div className="flex gap-2">
          <Button size="sm" variant="secondary" onClick={() => onEdit(c)}>
            Editar
          </Button>
          <Button size="sm" variant="danger" onClick={() => setDeleteTarget(c)}>
            Eliminar
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <Table
        columns={columns}
        data={categorias}
        keyExtractor={(c) => c.id}
        emptyMessage="No hay categorías cargadas"
      />
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        title="Eliminar categoría"
        message={`¿Estás seguro de que querés eliminar "${deleteTarget?.nombre}"? Esta acción no se puede deshacer.`}
        isLoading={isDeleting}
      />
    </>
  );
}
