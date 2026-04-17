import type { Categoria } from "./categoria";
import type { Ingrediente } from "./ingrediente";

export interface Producto {
  id: number;
  nombre: string;
  descripcion: string | null;
  precio_base: number;
  imagen_url: string[];
  disponible: boolean;
  categorias: Categoria[];
  ingredientes: Ingrediente[];
}

export interface ProductoCreate {
  nombre: string;
  descripcion?: string | null;
  precio_base: number;
  imagen_url?: string[];
  disponible?: boolean;
}

export interface ProductoUpdate {
  nombre?: string | null;
  descripcion?: string | null;
  precio_base?: number | null;
  imagen_url?: string[] | null;
  disponible?: boolean | null;
}
