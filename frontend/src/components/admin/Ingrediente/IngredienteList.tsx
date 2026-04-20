import { useMemo, useState } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { DataTable } from "../../ui/Table";
import { Button } from "../../ui/Button";
import { ConfirmDialog } from "../../ui/ConfirmDialog";
import type { Ingrediente } from "../../../types/ingrediente";

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

  const columns = useMemo<ColumnDef<Ingrediente, unknown>[]>(
    () => [
      {
        accessorKey: "nombre",
        header: "Nombre",
        cell: ({ row }) => (
          <span className="font-medium text-[var(--color-foreground)]">
            {row.original.nombre}
          </span>
        ),
      },
      {
        accessorKey: "descripcion",
        header: "Descripción",
        cell: ({ row }) => (
          <span className="text-[var(--color-muted)]">
            {row.original.descripcion || "—"}
          </span>
        ),
      },
      {
        id: "acciones",
        header: "Acciones",
        size: 160,
        cell: ({ row }) => (
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => onEdit(row.original)}
            >
              Editar
            </Button>
            <Button
              size="sm"
              variant="danger"
              onClick={() => setDeleteTarget(row.original)}
            >
              Eliminar
            </Button>
          </div>
        ),
      },
    ],
    [onEdit],
  );

  return (
    <>
      <DataTable
        columns={columns}
        data={ingredientes}
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
