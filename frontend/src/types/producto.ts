import type { Categoria } from "./categoria";
import type { Ingrediente } from "./ingrediente";

export interface Producto {
  id: number;
  nombre: string;
  descripcion: string | null;
  precio_base: number;
  imagenes_url: string[];
  disponible: boolean;
  stock_cantidad: number;
  categorias: Categoria[];
  ingredientes: Ingrediente[];
}

export interface ProductoCreate {
  nombre: string;
  descripcion?: string | null;
  precio_base: number;
  imagenes_url?: string[];
  disponible?: boolean;
  stock_cantidad?: number;
  categorias_ids: number[];
  ingredientes_ids: number[];
}

export interface ProductoUpdate {
  nombre?: string | null;
  descripcion?: string | null;
  precio_base?: number | null;
  imagenes_url?: string[] | null;
  disponible?: boolean | null;
  stock_cantidad?: number | null;
}
