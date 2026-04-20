export interface Categoria {
  id: number;
  nombre: string;
  descripcion: string | null;
}

export interface CategoriaCreate {
  nombre: string;
  descripcion?: string | null;
}

export interface CategoriaUpdate {
  nombre?: string | null;
  descripcion?: string | null;
}
