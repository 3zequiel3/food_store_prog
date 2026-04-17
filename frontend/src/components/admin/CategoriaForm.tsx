import { type FormEvent, useEffect, useState } from "react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Textarea } from "../ui/Textarea";
import type { Categoria } from "../../types/categoria";

interface CategoriaFormProps {
  initialData?: Categoria | null;
  onSubmit: (data: { nombre: string; descripcion: string }) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function CategoriaForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading,
}: CategoriaFormProps) {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");

  useEffect(() => {
    if (initialData) {
      setNombre(initialData.nombre);
      setDescripcion(initialData.descripcion ?? "");
    } else {
      setNombre("");
      setDescripcion("");
    }
  }, [initialData]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!nombre.trim()) return;
    onSubmit({ nombre: nombre.trim(), descripcion: descripcion.trim() });
  };

  const isEditing = !!initialData;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input
        label="Nombre"
        placeholder="Ej: Bebidas, Postres…"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        required
        autoFocus
      />
      <Textarea
        label="Descripción"
        placeholder="Descripción opcional de la categoría"
        value={descripcion}
        onChange={(e) => setDescripcion(e.target.value)}
      />
      <div className="flex justify-end gap-3 pt-2">
        <Button
          type="button"
          variant="ghost"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={isLoading || !nombre.trim()}>
          {isLoading
            ? isEditing
              ? "Guardando…"
              : "Creando…"
            : isEditing
              ? "Guardar cambios"
              : "Crear categoría"}
        </Button>
      </div>
    </form>
  );
}
