import { type FormEvent, useEffect, useState } from "react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Textarea } from "../ui/Textarea";
import type { Ingrediente } from "../../types/ingrediente";

interface IngredienteFormProps {
  initialData?: Ingrediente | null;
  onSubmit: (data: {
    nombre: string;
    descripcion: string;
    es_alergeno: boolean;
  }) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function IngredienteForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading,
}: IngredienteFormProps) {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [esAlergeno, setEsAlergeno] = useState(false);

  useEffect(() => {
    if (initialData) {
      setNombre(initialData.nombre);
      setDescripcion(initialData.descripcion ?? "");
      setEsAlergeno(initialData.es_alergeno);
    } else {
      setNombre("");
      setDescripcion("");
      setEsAlergeno(false);
    }
  }, [initialData]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!nombre.trim()) return;

    onSubmit({
      nombre: nombre.trim(),
      descripcion: descripcion.trim(),
      es_alergeno: esAlergeno,
    });
  };

  const isEditing = !!initialData;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input
        label="Nombre"
        placeholder="Ej: Harina de trigo"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        required
        autoFocus
      />
      <Textarea
        label="Descripción"
        placeholder="Descripción del ingrediente"
        value={descripcion}
        onChange={(e) => setDescripcion(e.target.value)}
      />

      <label className="flex items-center gap-2 cursor-pointer select-none">
        <input
          type="checkbox"
          checked={esAlergeno}
          onChange={(e) => setEsAlergeno(e.target.checked)}
          className="
            w-4 h-4 rounded
            border-[var(--color-border)]
            text-[var(--color-primary-600)]
            focus:ring-[var(--color-primary-200)]
          "
        />
        <span className="text-sm text-[var(--color-foreground)]">
          Es alérgeno
        </span>
      </label>

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
              : "Crear ingrediente"}
        </Button>
      </div>
    </form>
  );
}
