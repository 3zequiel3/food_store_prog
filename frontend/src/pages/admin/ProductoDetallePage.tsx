import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useProducto, useProductos } from "../../hooks/useProductos";
import { ProductoDetalle } from "../../components/ProductoDetalle";
import { ConfirmDialog } from "../../components/ui/ConfirmDialog";
import type { Producto } from "../../types/producto";

export function ProductoDetallePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { remove, isDeleting } = useProductos();
  const [deleteTarget, setDeleteTarget] = useState<Producto | null>(null);

  const { data: producto, isLoading, error } = useProducto(Number(id));

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await remove(deleteTarget.id);
    navigate("/admin/productos");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-[var(--color-primary-300)] border-t-[var(--color-primary-600)] rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !producto) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <p className="text-red-500 text-sm">
          {error ? `Error: ${error.message}` : "Producto no encontrado"}
        </p>
        <button
          onClick={() => navigate("/admin/productos")}
          className="text-sm text-[var(--color-primary-600)] hover:underline cursor-pointer"
        >
          ← Volver a productos
        </button>
      </div>
    );
  }

  return (
    <>
      <ProductoDetalle
        producto={producto}
        onBack={() => navigate("/admin/productos")}
        adminActions={{
          onEdit: () =>
            navigate("/admin/productos", { state: { editId: producto.id } }),
          onDelete: (p) => setDeleteTarget(p),
        }}
      />
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Eliminar producto"
        message={`¿Estás seguro de que querés eliminar "${deleteTarget?.nombre}"? Esta acción no se puede deshacer.`}
        isLoading={isDeleting}
      />
    </>
  );
}
