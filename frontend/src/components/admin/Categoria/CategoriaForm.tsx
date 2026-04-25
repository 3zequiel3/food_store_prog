import { useForm } from "@tanstack/react-form";
import { Form, FieldInput, FieldTextarea } from "../../ui/Form";
import { Select } from "../../ui/Select";
import type { Categoria } from "../../../types/categoria";

interface CategoriaFormSubmit {
  nombre: string;
  descripcion: string;
  imagen_url: string | null;
  parent_id: number | null;
}

interface CategoriaFormProps {
  initialData?: Categoria | null;
  categorias: Categoria[];
  onSubmit: (data: CategoriaFormSubmit) => void;
  onCancel: () => void;
}

export function CategoriaForm({
  initialData,
  categorias,
  onSubmit,
  onCancel,
}: CategoriaFormProps) {
  const isEditing = !!initialData;

  const candidatosPadre = categorias.filter((c) => c.id !== initialData?.id);

  const form = useForm({
    defaultValues: {
      nombre: initialData?.nombre ?? "",
      descripcion: initialData?.descripcion ?? "",
      imagen_url: initialData?.imagen_url ?? "",
      parent_id: initialData?.parent_id ?? (null as number | null),
    },
    onSubmit: async ({ value }) => {
      const imagen = value.imagen_url.trim();
      onSubmit({
        nombre: value.nombre.trim(),
        descripcion: value.descripcion.trim(),
        imagen_url: imagen === "" ? null : imagen,
        parent_id: value.parent_id,
      });
    },
  });

  return (
    <Form
      form={form}
      onCancel={onCancel}
      submitLabel={isEditing ? "Guardar cambios" : "Crear categoría"}
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
            placeholder="Ej: Bebidas, Postres…"
            autoFocus
          />
        )}
      </form.Field>

      <form.Field name="descripcion">
        {(field) => (
          <FieldTextarea
            field={field}
            label="Descripción"
            placeholder="Descripción opcional de la categoría"
          />
        )}
      </form.Field>

      <form.Field name="imagen_url">
        {(field) => (
          <FieldInput
            field={field}
            label="URL de imagen"
            placeholder="https://…"
          />
        )}
      </form.Field>

      <form.Field name="parent_id">
        {(field) => (
          <Select<number>
            id={field.name}
            label="Categoría padre"
            placeholder="— Sin categoría padre (raíz) —"
            isClearable
            options={candidatosPadre.map((c) => ({
              value: c.id,
              label: c.nombre,
            }))}
            value={field.state.value}
            onChange={(v) => field.handleChange(v)}
            onBlur={field.handleBlur}
            noOptionsMessage="No hay categorías disponibles"
          />
        )}
      </form.Field>
    </Form>
  );
}
