import { useMemo, useState } from "react";
import {
  type ColumnDef,
  type PaginationState,
  type SortingState,
  type OnChangeFn,
} from "@tanstack/react-table";
import { DataTable } from "../../ui/Table";
import { Button } from "../../ui/Button";
import { ConfirmDialog } from "../../ui/ConfirmDialog";
import type { Categoria } from "../../../types/categoria";

interface CategoriaListProps {
  categorias: Categoria[];
  onEdit: (categoria: Categoria) => void;
  onDelete: (id: number) => Promise<void>;
  isDeleting?: boolean;
  // Pagination / sorting (server-side)
  total: number;
  pagination: PaginationState;
  onPaginationChange: OnChangeFn<PaginationState>;
  sorting: SortingState;
  onSortingChange: OnChangeFn<SortingState>;
}

export function CategoriaList({
  categorias,
  onEdit,
  onDelete,
  isDeleting,
  total,
  pagination,
  onPaginationChange,
  sorting,
  onSortingChange,
}: CategoriaListProps) {
  const [deleteTarget, setDeleteTarget] = useState<Categoria | null>(null);

  const nombrePorId = useMemo(
    () => new Map(categorias.map((c) => [c.id, c.nombre])),
    [categorias],
  );

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    await onDelete(deleteTarget.id);
    setDeleteTarget(null);
  };

  const columns = useMemo<ColumnDef<Categoria, unknown>[]>(
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
        accessorKey: "parent_id",
        header: "Padre",
        enableSorting: false,
        cell: ({ row }) => {
          const pid = row.original.parent_id;
          const nombre = pid != null ? nombrePorId.get(pid) : null;
          return (
            <span className="text-[var(--color-muted)]">
              {nombre ?? "—"}
            </span>
          );
        },
      },
      {
        accessorKey: "descripcion",
        header: "Descripción",
        enableSorting: false,
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
        enableSorting: false,
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
    [onEdit, nombrePorId],
  );

  return (
    <>
      <DataTable
        columns={columns}
        data={categorias}
        emptyMessage="No hay categorías cargadas"
        manualPagination
        rowCount={total}
        pagination={pagination}
        onPaginationChange={onPaginationChange}
        manualSorting
        sorting={sorting}
        onSortingChange={onSortingChange}
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
