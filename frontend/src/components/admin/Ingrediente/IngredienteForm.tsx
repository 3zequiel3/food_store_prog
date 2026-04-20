import { useForm } from "@tanstack/react-form";
import { Form, FieldInput, FieldTextarea, FieldCheckbox } from "../../ui/Form";
import type { Ingrediente } from "../../../types/ingrediente";

interface IngredienteFormProps {
  initialData?: Ingrediente | null;
  onSubmit: (data: {
    nombre: string;
    descripcion: string;
    es_alergeno: boolean;
  }) => void;
  onCancel: () => void;
}

export function IngredienteForm({
  initialData,
  onSubmit,
  onCancel,
}: IngredienteFormProps) {
  const isEditing = !!initialData;

  const form = useForm({
    defaultValues: {
      nombre: initialData?.nombre ?? "",
      descripcion: initialData?.descripcion ?? "",
      es_alergeno: initialData?.es_alergeno ?? false,
    },
    onSubmit: async ({ value }) => {
      onSubmit({
        nombre: value.nombre.trim(),
        descripcion: value.descripcion.trim(),
        es_alergeno: value.es_alergeno,
      });
    },
  });

  return (
    <Form
      form={form}
      onCancel={onCancel}
      submitLabel={isEditing ? "Guardar cambios" : "Crear ingrediente"}
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
            placeholder="Ej: Harina de trigo"
            autoFocus
          />
        )}
      </form.Field>
      <form.Field name="descripcion">
        {(field) => (
          <FieldTextarea
            field={field}
            label="Descripción"
            placeholder="Descripción del ingrediente"
          />
        )}
      </form.Field>
      <form.Field name="es_alergeno">
        {(field) => <FieldCheckbox field={field} label="Es alérgeno" />}
      </form.Field>
    </Form>
  );
}
