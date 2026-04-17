import { type FormEvent, useEffect, useState } from "react";
import Select from "react-select";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Textarea } from "../ui/Textarea";
import type { Producto } from "../../types/producto";
import type { Categoria } from "../../types/categoria";
import type { Ingrediente } from "../../types/ingrediente";

interface CatOption {
  value: number;
  label: string;
}

interface IngOption {
  value: number;
  label: string;
}

interface ProductoFormProps {
  initialData?: Producto | null;
  categorias: Categoria[];
  ingredientes: Ingrediente[];
  onSubmit: (data: {
    nombre: string;
    descripcion: string;
    precio_base: number;
    imagen_url: string[];
    disponible: boolean;
    categoriaIds: number[];
    ingredienteIds: number[];
  }) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function ProductoForm({
  initialData,
  categorias,
  ingredientes,
  onSubmit,
  onCancel,
  isLoading,
}: ProductoFormProps) {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precioBase, setPrecioBase] = useState("");
  const [imagenUrl, setImagenUrl] = useState("");
  const [disponible, setDisponible] = useState(true);
  const [selectedCatIds, setSelectedCatIds] = useState<number[]>([]);
  const [selectedIngIds, setSelectedIngIds] = useState<number[]>([]);

  useEffect(() => {
    if (initialData) {
      setNombre(initialData.nombre);
      setDescripcion(initialData.descripcion ?? "");
      setPrecioBase(String(initialData.precio_base));
      setImagenUrl(initialData.imagen_url.join(", "));
      setDisponible(initialData.disponible);
      setSelectedCatIds(initialData.categorias?.map((c) => c.id) ?? []);
      setSelectedIngIds(initialData.ingredientes?.map((i) => i.id) ?? []);
    } else {
      setNombre("");
      setDescripcion("");
      setPrecioBase("");
      setImagenUrl("");
      setDisponible(true);
      setSelectedCatIds([]);
      setSelectedIngIds([]);
    }
  }, [initialData]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (
      !nombre.trim() ||
      !precioBase ||
      selectedCatIds.length === 0 ||
      selectedIngIds.length === 0
    )
      return;

    const urls = imagenUrl
      .split(",")
      .map((u) => u.trim())
      .filter(Boolean);

    onSubmit({
      nombre: nombre.trim(),
      descripcion: descripcion.trim(),
      precio_base: parseFloat(precioBase),
      imagen_url: urls,
      disponible,
      categoriaIds: selectedCatIds,
      ingredienteIds: selectedIngIds,
    });
  };

  const isEditing = !!initialData;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input
        label="Nombre"
        placeholder="Ej: Hamburguesa clásica"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        required
        autoFocus
      />
      <Textarea
        label="Descripción"
        placeholder="Descripción del producto"
        value={descripcion}
        onChange={(e) => setDescripcion(e.target.value)}
      />
      <Input
        label="Precio base"
        type="number"
        step="0.01"
        min="0"
        placeholder="0.00"
        value={precioBase}
        onChange={(e) => setPrecioBase(e.target.value)}
        required
      />
      <Input
        label="URLs de imágenes"
        placeholder="url1, url2 (separadas por coma)"
        value={imagenUrl}
        onChange={(e) => setImagenUrl(e.target.value)}
      />

      {/* Selector de categorías */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="categorias-select"
          className="text-sm font-medium text-[var(--color-foreground)]"
        >
          Categorías
        </label>
        <Select<CatOption, true>
          inputId="categorias-select"
          isMulti
          options={categorias.map((c) => ({ value: c.id, label: c.nombre }))}
          value={categorias
            .filter((c) => selectedCatIds.includes(c.id))
            .map((c) => ({ value: c.id, label: c.nombre }))}
          onChange={(opts) => setSelectedCatIds(opts.map((o) => o.value))}
          placeholder="Seleccioná categorías…"
          noOptionsMessage={() => "No hay categorías"}
          styles={{
            control: (base, state) => ({
              ...base,
              backgroundColor: "var(--color-background)",
              borderColor: state.isFocused
                ? "var(--color-primary-400)"
                : "var(--color-border)",
              borderRadius: "0.5rem",
              boxShadow: state.isFocused
                ? "0 0 0 2px var(--color-primary-200)"
                : "none",
              fontSize: "0.875rem",
              "&:hover": { borderColor: "var(--color-primary-400)" },
            }),
            menu: (base) => ({
              ...base,
              backgroundColor: "var(--color-card)",
              borderRadius: "0.5rem",
              border: "1px solid var(--color-border)",
              zIndex: 50,
            }),
            option: (base, state) => ({
              ...base,
              backgroundColor: state.isFocused
                ? "var(--color-primary-50)"
                : "transparent",
              color: "var(--color-foreground)",
              fontSize: "0.875rem",
              cursor: "pointer",
              "&:active": { backgroundColor: "var(--color-primary-100)" },
            }),
            multiValue: (base) => ({
              ...base,
              backgroundColor: "var(--color-primary-100)",
              borderRadius: "0.375rem",
            }),
            multiValueLabel: (base) => ({
              ...base,
              color: "var(--color-primary-700)",
              fontSize: "0.75rem",
              fontWeight: 500,
            }),
            multiValueRemove: (base) => ({
              ...base,
              color: "var(--color-primary-500)",
              borderRadius: "0 0.375rem 0.375rem 0",
              "&:hover": {
                backgroundColor: "var(--color-primary-200)",
                color: "var(--color-primary-800)",
              },
            }),
            placeholder: (base) => ({
              ...base,
              color: "var(--color-muted)",
              fontSize: "0.875rem",
            }),
            input: (base) => ({
              ...base,
              color: "var(--color-foreground)",
            }),
          }}
        />
      </div>

      {/* Selector de ingredientes */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="ingredientes-select"
          className="text-sm font-medium text-[var(--color-foreground)]"
        >
          Ingredientes
        </label>
        <Select<IngOption, true>
          inputId="ingredientes-select"
          isMulti
          options={ingredientes.map((i) => ({
            value: i.id,
            label: i.nombre,
          }))}
          value={ingredientes
            .filter((i) => selectedIngIds.includes(i.id))
            .map((i) => ({
              value: i.id,
              label: i.nombre,
            }))}
          onChange={(opts) => setSelectedIngIds(opts.map((o) => o.value))}
          placeholder="Seleccioná ingredientes…"
          noOptionsMessage={() => "No hay ingredientes"}
          styles={{
            control: (base, state) => ({
              ...base,
              backgroundColor: "var(--color-background)",
              borderColor: state.isFocused
                ? "var(--color-primary-400)"
                : "var(--color-border)",
              borderRadius: "0.5rem",
              boxShadow: state.isFocused
                ? "0 0 0 2px var(--color-primary-200)"
                : "none",
              fontSize: "0.875rem",
              "&:hover": { borderColor: "var(--color-primary-400)" },
            }),
            menu: (base) => ({
              ...base,
              backgroundColor: "var(--color-card)",
              borderRadius: "0.5rem",
              border: "1px solid var(--color-border)",
              zIndex: 50,
            }),
            option: (base, state) => ({
              ...base,
              backgroundColor: state.isFocused
                ? "var(--color-primary-50)"
                : "transparent",
              color: "var(--color-foreground)",
              fontSize: "0.875rem",
              cursor: "pointer",
              "&:active": { backgroundColor: "var(--color-primary-100)" },
            }),
            multiValue: (base) => ({
              ...base,
              backgroundColor: "var(--color-primary-100)",
              borderRadius: "0.375rem",
            }),
            multiValueLabel: (base) => ({
              ...base,
              color: "var(--color-primary-700)",
              fontSize: "0.75rem",
              fontWeight: 500,
            }),
            multiValueRemove: (base) => ({
              ...base,
              color: "var(--color-primary-500)",
              borderRadius: "0 0.375rem 0.375rem 0",
              "&:hover": {
                backgroundColor: "var(--color-primary-200)",
                color: "var(--color-primary-800)",
              },
            }),
            placeholder: (base) => ({
              ...base,
              color: "var(--color-muted)",
              fontSize: "0.875rem",
            }),
            input: (base) => ({
              ...base,
              color: "var(--color-foreground)",
            }),
          }}
        />
      </div>

      <label className="flex items-center gap-2 cursor-pointer select-none">
        <input
          type="checkbox"
          checked={disponible}
          onChange={(e) => setDisponible(e.target.checked)}
          className="
            w-4 h-4 rounded
            border-[var(--color-border)]
            text-[var(--color-primary-600)]
            focus:ring-[var(--color-primary-200)]
          "
        />
        <span className="text-sm text-[var(--color-foreground)]">
          Disponible
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
        <Button
          type="submit"
          disabled={
            isLoading ||
            !nombre.trim() ||
            !precioBase ||
            selectedCatIds.length === 0 ||
            selectedIngIds.length === 0
          }
        >
          {isLoading
            ? isEditing
              ? "Guardando…"
              : "Creando…"
            : isEditing
              ? "Guardar cambios"
              : "Crear producto"}
        </Button>
      </div>
    </form>
  );
}
