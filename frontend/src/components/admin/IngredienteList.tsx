import { useState } from "react";
import { Table } from "../ui/Table";
import { Button } from "../ui/Button";
import { ConfirmDialog } from "../ui/ConfirmDialog";
import type { Ingrediente } from "../../types/ingrediente";

interface IngredienteListProps {
  ingredientes: Ingrediente[];
  onEdit: (ingrediente: Ingrediente) => void;
  onDelete: (id: number) => Promise<void>;
  isDeleting?: boolean;
}

export function IngredienteList({
  ingredientes,
  onEdit,
  onDelete,
  isDeleting,
}: IngredienteListProps) {
  const [deleteTarget, setDeleteTarget] = useState<Ingrediente | null>(null);

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    await onDelete(deleteTarget.id);
    setDeleteTarget(null);
  };

  const columns = [
    {
      key: "nombre",
      header: "Nombre",
      render: (i: Ingrediente) => (
        <span className="font-medium text-[var(--color-foreground)]">
          {i.nombre}
        </span>
      ),
    },
    {
      key: "descripcion",
      header: "Descripción",
      render: (i: Ingrediente) => (
        <span className="text-[var(--color-muted)]">
          {i.descripcion || "—"}
        </span>
      ),
    },
    {
      key: "acciones",
      header: "Acciones",
      className: "w-40",
      render: (i: Ingrediente) => (
        <div className="flex gap-2">
          <Button size="sm" variant="secondary" onClick={() => onEdit(i)}>
            Editar
          </Button>
          <Button size="sm" variant="danger" onClick={() => setDeleteTarget(i)}>
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
        data={ingredientes}
        keyExtractor={(i) => i.id}
        emptyMessage="No hay ingredientes cargados"
      />
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        title="Eliminar ingrediente"
        message={`¿Estás seguro de que querés eliminar "${deleteTarget?.nombre}"? Esta acción no se puede deshacer.`}
        isLoading={isDeleting}
      />
    </>
  );
}
