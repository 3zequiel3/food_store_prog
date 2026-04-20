import type {
  InputHTMLAttributes,
  ReactNode,
  TextareaHTMLAttributes,
} from "react";
import type { AnyFieldApi } from "@tanstack/react-form";
import { Input } from "./Input";
import { Textarea } from "./Textarea";
import { Button } from "./Button";

/* ── Contenedor de formulario ────────────────────────────── */

interface FormProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: any;
  onCancel: () => void;
  submitLabel?: string;
  loadingLabel?: string;
  children: ReactNode;
}

export function Form({
  form,
  onCancel,
  submitLabel = "Guardar",
  loadingLabel = "Guardando…",
  children,
}: FormProps) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="flex flex-col gap-4"
    >
      {children}
      <div className="flex justify-end gap-3 pt-2">
        <form.Subscribe
          selector={(state: { canSubmit: boolean; isSubmitting: boolean }) => [
            state.canSubmit,
            state.isSubmitting,
          ]}
        >
          {([canSubmit, isSubmitting]: [boolean, boolean]) => (
            <>
              <Button
                type="button"
                variant="ghost"
                onClick={onCancel}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={!canSubmit || isSubmitting}>
                {isSubmitting ? loadingLabel : submitLabel}
              </Button>
            </>
          )}
        </form.Subscribe>
      </div>
    </form>
  );
}

/* ── Adaptador: Input ────────────────────────────────────── */

interface FieldInputProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "value" | "onChange" | "onBlur"
> {
  field: AnyFieldApi;
  label?: string;
}

export function FieldInput({ field, label, type, ...props }: FieldInputProps) {
  const errors = field.state.meta.isTouched
    ? field.state.meta.errors.map(String)
    : [];

  return (
    <Input
      id={field.name}
      name={field.name}
      label={label}
      type={type}
      value={field.state.value ?? ""}
      onChange={(e) => {
        if (type === "number") {
          field.handleChange(
            e.target.value === "" ? 0 : Number(e.target.value),
          );
        } else {
          field.handleChange(e.target.value);
        }
      }}
      onBlur={field.handleBlur}
      error={errors.length > 0 ? errors.join(", ") : undefined}
      {...props}
    />
  );
}

/* ── Adaptador: Textarea ─────────────────────────────────── */

interface FieldTextareaProps extends Omit<
  TextareaHTMLAttributes<HTMLTextAreaElement>,
  "value" | "onChange" | "onBlur"
> {
  field: AnyFieldApi;
  label?: string;
}

export function FieldTextarea({ field, label, ...props }: FieldTextareaProps) {
  const errors = field.state.meta.isTouched
    ? field.state.meta.errors.map(String)
    : [];

  return (
    <Textarea
      id={field.name}
      name={field.name}
      label={label}
      value={field.state.value ?? ""}
      onChange={(e) => field.handleChange(e.target.value)}
      onBlur={field.handleBlur}
      error={errors.length > 0 ? errors.join(", ") : undefined}
      {...props}
    />
  );
}

/* ── Adaptador: Checkbox ─────────────────────────────────── */

interface FieldCheckboxProps {
  field: AnyFieldApi;
  label: string;
}

export function FieldCheckbox({ field, label }: FieldCheckboxProps) {
  return (
    <label className="flex items-center gap-2 cursor-pointer select-none">
      <input
        type="checkbox"
        id={field.name}
        name={field.name}
        checked={field.state.value ?? false}
        onChange={(e) => field.handleChange(e.target.checked)}
        onBlur={field.handleBlur}
        className="
          w-4 h-4 rounded
          border-[var(--color-border)]
          text-[var(--color-primary-600)]
          focus:ring-[var(--color-primary-200)]
        "
      />
      <span className="text-sm text-[var(--color-foreground)]">{label}</span>
    </label>
  );
}
