import ReactSelect, {
  type GroupBase,
  type MultiValue,
  type SingleValue,
  type StylesConfig,
} from "react-select";

export interface SelectOption<V = number | string> {
  value: V;
  label: string;
}

/* ── Estilos compartidos (alineados con el tema del proyecto) ── */

function buildStyles<
  V,
  IsMulti extends boolean,
>(hasError: boolean): StylesConfig<SelectOption<V>, IsMulti, GroupBase<SelectOption<V>>> {
  return {
    control: (base, state) => ({
      ...base,
      backgroundColor: "var(--color-card)",
      borderColor: hasError
        ? "#f87171" /* red-400 */
        : state.isFocused
          ? "var(--color-primary-400)"
          : "var(--color-border)",
      borderRadius: "0.5rem",
      boxShadow: state.isFocused
        ? hasError
          ? "0 0 0 2px #fecaca" /* red-200 */
          : "0 0 0 2px var(--color-primary-100)"
        : "none",
      fontSize: "0.875rem",
      minHeight: "2.25rem",
      "&:hover": {
        borderColor: hasError ? "#f87171" : "var(--color-primary-400)",
      },
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
    singleValue: (base) => ({
      ...base,
      color: "var(--color-foreground)",
    }),
    input: (base) => ({
      ...base,
      color: "var(--color-foreground)",
    }),
    indicatorSeparator: (base) => ({
      ...base,
      backgroundColor: "var(--color-border)",
    }),
    dropdownIndicator: (base) => ({
      ...base,
      color: "var(--color-muted)",
      "&:hover": { color: "var(--color-foreground)" },
    }),
    clearIndicator: (base) => ({
      ...base,
      color: "var(--color-muted)",
      "&:hover": { color: "var(--color-foreground)" },
    }),
  };
}

/* ── Props del wrapper ─────────────────────────────────────── */

interface BaseSelectProps<V> {
  id?: string;
  label?: string;
  hint?: string;
  error?: string;
  placeholder?: string;
  options: SelectOption<V>[];
  isClearable?: boolean;
  isDisabled?: boolean;
  isLoading?: boolean;
  noOptionsMessage?: string;
  onBlur?: () => void;
}

interface SingleSelectProps<V> extends BaseSelectProps<V> {
  isMulti?: false;
  value: V | null | undefined;
  onChange: (value: V | null) => void;
}

interface MultiSelectProps<V> extends BaseSelectProps<V> {
  isMulti: true;
  value: V[];
  onChange: (value: V[]) => void;
}

export type SelectProps<V = number | string> =
  | SingleSelectProps<V>
  | MultiSelectProps<V>;

/* ── Componente ────────────────────────────────────────────── */

export function Select<V extends number | string = number | string>(
  props: SelectProps<V>,
) {
  const {
    id,
    label,
    hint,
    error,
    placeholder,
    options,
    isClearable,
    isDisabled,
    isLoading,
    noOptionsMessage,
    onBlur,
  } = props;

  const autoId = id ?? label?.toLowerCase().replace(/\s+/g, "-");
  const hasError = !!error;

  const content = props.isMulti ? (
    <ReactSelect<SelectOption<V>, true>
      inputId={autoId}
      isMulti
      options={options}
      value={options.filter((o) => props.value.includes(o.value))}
      onChange={(opts: MultiValue<SelectOption<V>>) =>
        props.onChange(opts.map((o) => o.value))
      }
      onBlur={onBlur}
      placeholder={placeholder}
      isClearable={isClearable}
      isDisabled={isDisabled}
      isLoading={isLoading}
      noOptionsMessage={() => noOptionsMessage ?? "Sin opciones"}
      styles={buildStyles<V, true>(hasError)}
    />
  ) : (
    <ReactSelect<SelectOption<V>, false>
      inputId={autoId}
      isMulti={false}
      options={options}
      value={options.find((o) => o.value === props.value) ?? null}
      onChange={(opt: SingleValue<SelectOption<V>>) =>
        props.onChange(opt ? opt.value : null)
      }
      onBlur={onBlur}
      placeholder={placeholder}
      isClearable={isClearable}
      isDisabled={isDisabled}
      isLoading={isLoading}
      noOptionsMessage={() => noOptionsMessage ?? "Sin opciones"}
      styles={buildStyles<V, false>(hasError)}
    />
  );

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={autoId}
          className="text-sm font-medium text-[var(--color-foreground)]"
        >
          {label}
        </label>
      )}
      {content}
      {hint && !error && (
        <span className="text-xs text-[var(--color-muted)]">{hint}</span>
      )}
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
}
