import Select from "react-select";
import { useForm } from "@tanstack/react-form";
import { Form, FieldInput, FieldTextarea, FieldCheckbox } from "../../ui/Form";
import type { Producto } from "../../../types/producto";
import type { Categoria } from "../../../types/categoria";
import type { Ingrediente } from "../../../types/ingrediente";

interface SelectOption {
  value: number;
  label: string;
}

const selectStyles = {
  control: (base: Record<string, unknown>, state: { isFocused: boolean }) => ({
    ...base,
    backgroundColor: "var(--color-background)",
    borderColor: state.isFocused
      ? "var(--color-primary-400)"
      : "var(--color-border)",
    borderRadius: "0.5rem",
    boxShadow: state.isFocused ? "0 0 0 2px var(--color-primary-200)" : "none",
    fontSize: "0.875rem",
    "&:hover": { borderColor: "var(--color-primary-400)" },
  }),
  menu: (base: Record<string, unknown>) => ({
    ...base,
    backgroundColor: "var(--color-card)",
    borderRadius: "0.5rem",
    border: "1px solid var(--color-border)",
    zIndex: 50,
  }),
  option: (base: Record<string, unknown>, state: { isFocused: boolean }) => ({
    ...base,
    backgroundColor: state.isFocused
      ? "var(--color-primary-50)"
      : "transparent",
    color: "var(--color-foreground)",
    fontSize: "0.875rem",
    cursor: "pointer",
    "&:active": { backgroundColor: "var(--color-primary-100)" },
  }),
  multiValue: (base: Record<string, unknown>) => ({
    ...base,
    backgroundColor: "var(--color-primary-100)",
    borderRadius: "0.375rem",
  }),
  multiValueLabel: (base: Record<string, unknown>) => ({
    ...base,
    color: "var(--color-primary-700)",
    fontSize: "0.75rem",
    fontWeight: 500,
  }),
  multiValueRemove: (base: Record<string, unknown>) => ({
    ...base,
    color: "var(--color-primary-500)",
    borderRadius: "0 0.375rem 0.375rem 0",
    "&:hover": {
      backgroundColor: "var(--color-primary-200)",
      color: "var(--color-primary-800)",
    },
  }),
  placeholder: (base: Record<string, unknown>) => ({
    ...base,
    color: "var(--color-muted)",
    fontSize: "0.875rem",
  }),
  input: (base: Record<string, unknown>) => ({
    ...base,
    color: "var(--color-foreground)",
  }),
};

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
    stock_cantidad: number;
    categoriaIds: number[];
    ingredienteIds: number[];
  }) => void;
  onCancel: () => void;
}

export function ProductoForm({
  initialData,
  categorias,
  ingredientes,
  onSubmit,
  onCancel,
}: ProductoFormProps) {
  const isEditing = !!initialData;

  const form = useForm({
    defaultValues: {
      nombre: initialData?.nombre ?? "",
      descripcion: initialData?.descripcion ?? "",
      precio_base: initialData ? String(initialData.precio_base) : "",
      imagen_url: initialData?.imagen_url.join(", ") ?? "",
      disponible: initialData?.disponible ?? true,
      stock_cantidad: initialData ? String(initialData.stock_cantidad) : "",
      categoriaIds:
        initialData?.categorias?.map((c) => c.id) ?? ([] as number[]),
      ingredienteIds:
        initialData?.ingredientes?.map((i) => i.id) ?? ([] as number[]),
    },
    onSubmit: async ({ value }) => {
      const urls = value.imagen_url
        .split(",")
        .map((u) => u.trim())
        .filter(Boolean);

      onSubmit({
        nombre: value.nombre.trim(),
        descripcion: value.descripcion.trim(),
        precio_base: parseFloat(value.precio_base),
        imagen_url: urls,
        disponible: value.disponible,
        stock_cantidad: parseInt(value.stock_cantidad, 10),
        categoriaIds: value.categoriaIds,
        ingredienteIds: value.ingredienteIds,
      });
    },
  });

  return (
    <Form
      form={form}
      onCancel={onCancel}
      submitLabel={isEditing ? "Guardar cambios" : "Crear producto"}
      loadingLabel={isEditing ? "Guardando…" : "Creando…"}
    >
      <form.Field
        name="nombre"
        validators={{
          onChange: ({ value }) =>
            !value.trim() ? "El nombre es obligatorio" : undefined,
        }}
      >
        {(field) => (
          <FieldInput
            field={field}
            label="Nombre"
            placeholder="Ej: Hamburguesa clásica"
            autoFocus
          />
        )}
      </form.Field>

      <form.Field name="descripcion">
        {(field) => (
          <FieldTextarea
            field={field}
            label="Descripción"
            placeholder="Descripción del producto"
          />
        )}
      </form.Field>

      <form.Field
        name="precio_base"
        validators={{
          onChange: ({ value }) => {
            if (!value.trim()) return "El precio es obligatorio";
            const n = parseFloat(value);
            if (isNaN(n) || n <= 0) return "El precio debe ser mayor a 0";
            return undefined;
          },
        }}
      >
        {(field) => (
          <FieldInput
            field={field}
            label="Precio base"
            placeholder="0.00"
            inputMode="decimal"
          />
        )}
      </form.Field>

      <form.Field name="imagen_url">
        {(field) => (
          <FieldInput
            field={field}
            label="URLs de imágenes"
            placeholder="url1, url2 (separadas por coma)"
          />
        )}
      </form.Field>

      <form.Field
        name="stock_cantidad"
        validators={{
          onChange: ({ value }) => {
            if (!value.trim()) return "El stock es obligatorio";
            const n = parseInt(value, 10);
            if (isNaN(n) || n < 0)
              return "El stock debe ser un número mayor o igual a 0";
            return undefined;
          },
        }}
      >
        {(field) => (
          <FieldInput
            field={field}
            label="Stock"
            placeholder="Ej: 50"
            inputMode="numeric"
          />
        )}
      </form.Field>

      {/* Selector de categorías */}
      <form.Field
        name="categoriaIds"
        validators={{
          onChange: ({ value }) =>
            value.length === 0
              ? "Seleccioná al menos una categoría"
              : undefined,
        }}
      >
        {(field) => {
          const errors = field.state.meta.isTouched
            ? field.state.meta.errors.map(String)
            : [];
          return (
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="categorias-select"
                className="text-sm font-medium text-[var(--color-foreground)]"
              >
                Categorías
              </label>
              <Select<SelectOption, true>
                inputId="categorias-select"
                isMulti
                options={categorias.map((c) => ({
                  value: c.id,
                  label: c.nombre,
                }))}
                value={categorias
                  .filter((c) => field.state.value.includes(c.id))
                  .map((c) => ({ value: c.id, label: c.nombre }))}
                onChange={(opts) =>
                  field.handleChange(opts.map((o) => o.value))
                }
                onBlur={field.handleBlur}
                placeholder="Seleccioná categorías…"
                noOptionsMessage={() => "No hay categorías"}
                styles={selectStyles}
              />
              {errors.length > 0 && (
                <span className="text-xs text-red-500">
                  {errors.join(", ")}
                </span>
              )}
            </div>
          );
        }}
      </form.Field>

      {/* Selector de ingredientes */}
      <form.Field
        name="ingredienteIds"
        validators={{
          onChange: ({ value }) =>
            value.length === 0
              ? "Seleccioná al menos un ingrediente"
              : undefined,
        }}
      >
        {(field) => {
          const errors = field.state.meta.isTouched
            ? field.state.meta.errors.map(String)
            : [];
          return (
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="ingredientes-select"
                className="text-sm font-medium text-[var(--color-foreground)]"
              >
                Ingredientes
              </label>
              <Select<SelectOption, true>
                inputId="ingredientes-select"
                isMulti
                options={ingredientes.map((i) => ({
                  value: i.id,
                  label: i.nombre,
                }))}
                value={ingredientes
                  .filter((i) => field.state.value.includes(i.id))
                  .map((i) => ({ value: i.id, label: i.nombre }))}
                onChange={(opts) =>
                  field.handleChange(opts.map((o) => o.value))
                }
                onBlur={field.handleBlur}
                placeholder="Seleccioná ingredientes…"
                noOptionsMessage={() => "No hay ingredientes"}
                styles={selectStyles}
              />
              {errors.length > 0 && (
                <span className="text-xs text-red-500">
                  {errors.join(", ")}
                </span>
              )}
            </div>
          );
        }}
      </form.Field>

      <form.Field name="disponible">
        {(field) => <FieldCheckbox field={field} label="Disponible" />}
      </form.Field>
    </Form>
  );
}
