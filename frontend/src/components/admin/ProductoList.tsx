import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Table } from "../ui/Table";
import { Button } from "../ui/Button";
import { ConfirmDialog } from "../ui/ConfirmDialog";
import type { Producto } from "../../types/producto";

interface ProductoListProps {
  productos: Producto[];
  onEdit: (producto: Producto) => void;
  onDelete: (id: number) => Promise<void>;
  isDeleting?: boolean;
}

export function ProductoList({
  productos,
  onEdit,
  onDelete,
  isDeleting,
}: ProductoListProps) {
  const [deleteTarget, setDeleteTarget] = useState<Producto | null>(null);
  const navigate = useNavigate();

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    await onDelete(deleteTarget.id);
    setDeleteTarget(null);
  };

  const columns = [
    {
      key: "nombre",
      header: "Nombre",
      render: (p: Producto) => (
        <span className="font-medium text-[var(--color-foreground)]">
          {p.nombre}
        </span>
      ),
    },
    {
      key: "precio",
      header: "Precio",
      className: "w-28",
      render: (p: Producto) => (
        <span className="font-semibold text-[var(--color-primary-700)]">
          ${p.precio_base.toFixed(2)}
        </span>
      ),
    },
    {
      key: "categorias",
      header: "Categorías",
      render: (p: Producto) => (
        <div className="flex flex-wrap gap-1">
          {p.categorias && p.categorias.length > 0 ? (
            p.categorias.map((c) => (
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
      key: "disponible",
      header: "Estado",
      className: "w-28",
      render: (p: Producto) => (
        <span
          className={`
            inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
            ${
              p.disponible
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                : "bg-amber-50 text-amber-700 border border-amber-200"
            }
          `}
        >
          {p.disponible ? "Disponible" : "No disponible"}
        </span>
      ),
    },
    {
      key: "acciones",
      header: "Acciones",
      className: "w-52",
      render: (p: Producto) => (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => navigate(`/admin/productos/${p.id}`)}
          >
            Ver
          </Button>
          <Button size="sm" variant="secondary" onClick={() => onEdit(p)}>
            Editar
          </Button>
          <Button size="sm" variant="danger" onClick={() => setDeleteTarget(p)}>
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
        data={productos}
        keyExtractor={(p) => p.id}
        emptyMessage="No hay productos cargados"
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
