import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  type ColumnDef,
  type PaginationState,
  type SortingState,
  type OnChangeFn,
} from "@tanstack/react-table";
import { DataTable } from "../../ui/Table";
import { Button } from "../../ui/Button";
import { ConfirmDialog } from "../../ui/ConfirmDialog";
import type { Producto } from "../../../types/producto";

interface ProductoListProps {
  productos: Producto[];
  onEdit: (producto: Producto) => void;
  onDelete: (id: number) => Promise<void>;
  isDeleting?: boolean;
  // Pagination / sorting (server-side)
  total: number;
  pagination: PaginationState;
  onPaginationChange: OnChangeFn<PaginationState>;
  sorting: SortingState;
  onSortingChange: OnChangeFn<SortingState>;
}

export function ProductoList({
  productos,
  onEdit,
  onDelete,
  isDeleting,
  total,
  pagination,
  onPaginationChange,
  sorting,
  onSortingChange,
}: ProductoListProps) {
  const [deleteTarget, setDeleteTarget] = useState<Producto | null>(null);
  const navigate = useNavigate();

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    await onDelete(deleteTarget.id);
    setDeleteTarget(null);
  };

  const columns = useMemo<ColumnDef<Producto, unknown>[]>(
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
        accessorKey: "precio_base",
        header: "Precio",
        size: 112,
        cell: ({ row }) => (
          <span className="font-semibold text-[var(--color-primary-700)]">
            ${row.original.precio_base.toFixed(2)}
          </span>
        ),
      },
      {
        id: "categorias",
        header: "Categorías",
        enableSorting: false,
        cell: ({ row }) => (
          <div className="flex flex-wrap gap-1">
            {row.original.categorias && row.original.categorias.length > 0 ? (
              row.original.categorias.map((c) => (
                <span
                  key={c.id}
                  className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-[var(--color-primary-50)] text-[var(--color-primary-700)] border border-[var(--color-primary-200)]"
                >
                  {c.nombre}
                </span>
              ))
            ) : (
              <span className="text-xs text-[var(--color-muted)]">—</span>
            )}
          </div>
        ),
      },
      {
        accessorKey: "stock_cantidad",
        header: "Stock",
        size: 90,
        enableSorting: false,
        cell: ({ row }) => (
          <span
            className={`font-medium ${
              row.original.stock_cantidad === 0
                ? "text-red-600"
                : "text-[var(--color-foreground)]"
            }`}
          >
            {row.original.stock_cantidad}
          </span>
        ),
      },
      {
        accessorKey: "disponible",
        header: "Estado",
        size: 112,
        enableSorting: false,
        cell: ({ row }) => (
          <span
            className={`
              inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
              ${
                row.original.disponible
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  : "bg-amber-50 text-amber-700 border border-amber-200"
              }
            `}
          >
            {row.original.disponible ? "Disponible" : "No disponible"}
          </span>
        ),
      },
      {
        id: "acciones",
        header: "Acciones",
        size: 208,
        enableSorting: false,
        cell: ({ row }) => (
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => navigate(`/admin/productos/${row.original.id}`)}
            >
              Ver
            </Button>
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
    [navigate, onEdit],
  );

  return (
    <>
      <DataTable
        columns={columns}
        data={productos}
        emptyMessage="No hay productos cargados"
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
        title="Eliminar producto"
        message={`¿Estás seguro de que querés eliminar "${deleteTarget?.nombre}"? Esta acción no se puede deshacer.`}
        isLoading={isDeleting}
      />
    </>
  );
}
