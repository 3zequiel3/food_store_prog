import { useState } from "react";
import type { Producto } from "../types/producto";
import { Button } from "./ui/Button";

interface ProductoDetalleProps {
  producto: Producto;
  onBack: () => void;
  /** Solo se renderizan en contexto admin */
  adminActions?: {
    onEdit: (producto: Producto) => void;
    onDelete: (producto: Producto) => void;
  };
}

export function ProductoDetalle({
  producto,
  onBack,
  adminActions,
}: ProductoDetalleProps) {
  const images = producto.imagen_url ?? [];
  const [activeIdx, setActiveIdx] = useState(0);

  const goPrev = () =>
    setActiveIdx((i) => (i === 0 ? images.length - 1 : i - 1));
  const goNext = () =>
    setActiveIdx((i) => (i === images.length - 1 ? 0 : i + 1));

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-sm text-[var(--color-muted)] hover:text-[var(--color-foreground)] transition-colors cursor-pointer"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            className="shrink-0"
          >
            <path
              d="M10 12L6 8L10 4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Volver
        </button>

        {adminActions && (
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => adminActions.onEdit(producto)}
            >
              Editar
            </Button>
            <Button
              size="sm"
              variant="danger"
              onClick={() => adminActions.onDelete(producto)}
            >
              Eliminar
            </Button>
          </div>
        )}
      </div>

      {/* Contenido principal */}
      <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Columna izquierda: Galería */}
          <div className="p-6 lg:p-8 flex flex-col gap-4 border-b lg:border-b-0 lg:border-r border-[var(--color-border)]">
            {images.length > 0 ? (
              <>
                {/* Imagen principal */}
                <div className="relative aspect-square bg-[var(--color-background)] rounded-xl overflow-hidden">
                  <img
                    src={images[activeIdx]}
                    alt={`${producto.nombre} — imagen ${activeIdx + 1}`}
                    className="w-full h-full object-contain p-4"
                  />

                  {/* Controles del carrusel */}
                  {images.length > 1 && (
                    <>
                      <button
                        onClick={goPrev}
                        className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm border border-[var(--color-border)] flex items-center justify-center text-[var(--color-foreground)] hover:bg-white cursor-pointer"
                      >
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 16 16"
                          fill="none"
                        >
                          <path
                            d="M10 12L6 8L10 4"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={goNext}
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm border border-[var(--color-border)] flex items-center justify-center text-[var(--color-foreground)] hover:bg-white cursor-pointer"
                      >
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 16 16"
                          fill="none"
                        >
                          <path
                            d="M6 4L10 8L6 12"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>

                      {/* Indicadores */}
                      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                        {images.map((_, i) => (
                          <button
                            key={i}
                            onClick={() => setActiveIdx(i)}
                            className={`w-1.5 h-1.5 rounded-full transition-all cursor-pointer ${
                              i === activeIdx
                                ? "bg-[var(--color-primary-600)] w-4"
                                : "bg-[var(--color-foreground)]/20 hover:bg-[var(--color-foreground)]/40"
                            }`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {/* Thumbnails */}
                {images.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {images.map((url, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveIdx(i)}
                        className={`shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                          i === activeIdx
                            ? "border-[var(--color-primary-500)] ring-2 ring-[var(--color-primary-200)]"
                            : "border-[var(--color-border)] opacity-60 hover:opacity-100"
                        }`}
                      >
                        <img
                          src={url}
                          alt={`Miniatura ${i + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="aspect-square bg-[var(--color-background)] rounded-xl flex items-center justify-center">
                <div className="text-center text-[var(--color-muted)]">
                  <svg
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="mx-auto mb-2 opacity-40"
                  >
                    <rect
                      x="3"
                      y="3"
                      width="18"
                      height="18"
                      rx="2"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                    <circle
                      cx="8.5"
                      cy="8.5"
                      r="1.5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M21 15L16 10L5 21"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className="text-xs">Sin imágenes</span>
                </div>
              </div>
            )}
          </div>

          {/* Columna derecha: Info */}
          <div className="p-6 lg:p-8 flex flex-col gap-6">
            {/* Categorías arriba del nombre */}
            {producto.categorias && producto.categorias.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {producto.categorias.map((cat) => (
                  <span
                    key={cat.id}
                    className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-primary-600)] bg-[var(--color-primary-50)] border border-[var(--color-primary-200)] px-2 py-0.5 rounded"
                  >
                    {cat.nombre}
                  </span>
                ))}
              </div>
            )}

            {/* Nombre */}
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-[var(--color-foreground)] leading-tight">
                {producto.nombre}
              </h1>
            </div>

            {/* Precio */}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-[var(--color-primary-700)]">
                $
                {producto.precio_base.toLocaleString("es-AR", {
                  minimumFractionDigits: 2,
                })}
              </span>
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                  producto.disponible
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : "bg-amber-50 text-amber-700 border border-amber-200"
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    producto.disponible ? "bg-emerald-500" : "bg-amber-500"
                  }`}
                />
                {producto.disponible ? "Disponible" : "No disponible"}
              </span>
            </div>

            {/* Separador */}
            <div className="h-px bg-[var(--color-border)]" />

            {/* Descripción */}
            {producto.descripcion && (
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)] mb-2">
                  Descripción
                </h3>
                <p className="text-sm leading-relaxed text-[var(--color-foreground)]/80">
                  {producto.descripcion}
                </p>
              </div>
            )}

            {/* Detalles */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)] mb-3">
                Detalles
              </h3>
              <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-sm">
                <div className="text-[var(--color-muted)]">ID</div>
                <div className="font-medium text-[var(--color-foreground)] font-mono text-xs">
                  #{producto.id}
                </div>
                <div className="text-[var(--color-muted)]">Precio base</div>
                <div className="font-medium text-[var(--color-foreground)]">
                  ${producto.precio_base.toFixed(2)}
                </div>
                <div className="text-[var(--color-muted)]">Estado</div>
                <div className="font-medium text-[var(--color-foreground)]">
                  {producto.disponible ? "Disponible" : "No disponible"}
                </div>
                {producto.categorias && producto.categorias.length > 0 && (
                  <>
                    <div className="text-[var(--color-muted)]">Categorías</div>
                    <div className="font-medium text-[var(--color-foreground)]">
                      {producto.categorias.map((c) => c.nombre).join(", ")}
                    </div>
                  </>
                )}
                <div className="text-[var(--color-muted)]">Imágenes</div>
                <div className="font-medium text-[var(--color-foreground)]">
                  {images.length}
                </div>
              </div>
            </div>

            {/* Ingredientes */}
            {producto.ingredientes && producto.ingredientes.length > 0 && (
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)] mb-3">
                  Ingredientes
                </h3>
                <ul className="space-y-1.5">
                  {producto.ingredientes.map((ing) => (
                    <li
                      key={ing.id}
                      className="flex items-center gap-2 text-sm text-[var(--color-foreground)]"
                    >
                      <span className="w-1 h-1 rounded-full bg-[var(--color-muted)] shrink-0" />
                      <span>{ing.nombre}</span>
                      {ing.es_alergeno && (
                        <span className="text-[10px] font-semibold uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200 px-1.5 py-0.5 rounded">
                          Alérgeno
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
