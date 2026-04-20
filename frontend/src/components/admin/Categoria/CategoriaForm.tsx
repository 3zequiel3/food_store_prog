import { useForm } from "@tanstack/react-form";
import { Form, FieldInput, FieldTextarea } from "../../ui/Form";
import type { Categoria } from "../../../types/categoria";

interface CategoriaFormProps {
  initialData?: Categoria | null;
  onSubmit: (data: { nombre: string; descripcion: string }) => void;
  onCancel: () => void;
}

export function CategoriaForm({
  initialData,
  onSubmit,
  onCancel,
}: CategoriaFormProps) {
  const isEditing = !!initialData;

  const form = useForm({
    defaultValues: {
      nombre: initialData?.nombre ?? "",
      descripcion: initialData?.descripcion ?? "",
    },
    onSubmit: async ({ value }) => {
      onSubmit({
        nombre: value.nombre.trim(),
        descripcion: value.descripcion.trim(),
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
    </Form>
  );
}
