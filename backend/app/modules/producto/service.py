from datetime import datetime, timezone
from typing import Optional

from fastapi import HTTPException, status

from app.modules.ingrediente.link import IngredienteProductoLink
from app.modules.producto.exceptions import CategoriaNoEsSubcategoria
from app.modules.producto.link import ProductoCategoriaLink
from app.modules.producto.models import Producto
from app.modules.producto.schemas import ProductoCreate, ProductoUpdate
from app.modules.producto.unit_of_work import ProductoUnitOfWork


class ProductoService:
    def crear(self, datos: ProductoCreate) -> Producto:
        with ProductoUnitOfWork() as uow:
            # Validar categorias (existencia + que sean subcategorias)
            for cat_id in datos.categorias_ids:
                categoria = uow.categoria_repository.get_by_id(cat_id)
                if categoria is None:
                    raise HTTPException(
                        status_code=status.HTTP_404_NOT_FOUND,
                        detail=f"Categoria {cat_id} no encontrada",
                    )
                if categoria.parent_id is None:
                    raise CategoriaNoEsSubcategoria(cat_id)

            # Validar ingredientes (existencia)
            for ing_id in datos.ingredientes_ids:
                ingrediente = uow.ingrediente_repository.get_by_id(ing_id)
                if ingrediente is None:
                    raise HTTPException(
                        status_code=status.HTTP_404_NOT_FOUND,
                        detail=f"Ingrediente {ing_id} no encontrado",
                    )

            # Crear el producto (excluyendo los ids de relaciones)
            producto_data = datos.model_dump(
                exclude={"categorias_ids", "ingredientes_ids"}
            )
            producto = Producto.model_validate(producto_data)
            uow.repository.add(producto)
            uow.session.flush()

            # Crear los links producto-categoria e ingrediente-producto
            for cat_id in datos.categorias_ids:
                link = ProductoCategoriaLink(
                    producto_id=producto.id, categoria_id=cat_id
                )
                uow.repository.add_link(link)
            for ing_id in datos.ingredientes_ids:
                link = IngredienteProductoLink(
                    producto_id=producto.id, ingrediente_id=ing_id
                )
                uow.repository.add_ingrediente_link(link)

            uow.session.flush()
            return uow.repository.get_by_id(producto.id)

    def obtener_por_id(self, producto_id: int) -> Producto | None:
        with ProductoUnitOfWork() as uow:
            return uow.repository.get_by_id(producto_id)

    def listar(
        self,
        skip: int = 0,
        limit: int = 20,
        nombre: str | None = None,
        disponible: bool | None = None,
        precio_min: float | None = None,
        precio_max: float | None = None,
        categoria_id: int | None = None,
        ingrediente_id: int | None = None,
        sort_by: str = "created_at",
        order: str = "desc",
    ) -> tuple[list[Producto], int]:
        with ProductoUnitOfWork() as uow:
            return uow.repository.listar_filtrado(
                skip=skip,
                limit=limit,
                nombre=nombre,
                disponible=disponible,
                precio_min=precio_min,
                precio_max=precio_max,
                categoria_id=categoria_id,
                ingrediente_id=ingrediente_id,
                sort_by=sort_by,
                order=order,
            )

    def actualizar(
        self, producto_id: int, datos: ProductoUpdate
    ) -> Producto | None:
        with ProductoUnitOfWork() as uow:
            producto = uow.repository.get_by_id(producto_id)
            if producto is None:
                return None

            datos_dict = datos.model_dump(exclude_unset=True)
            for campo, valor in datos_dict.items():
                setattr(producto, campo, valor)

            producto.updated_at = datetime.now(timezone.utc)
            uow.session.flush()
            return uow.repository.get_by_id(producto_id)

    def eliminar(self, producto_id: int) -> bool:
        with ProductoUnitOfWork() as uow:
            producto = uow.repository.get_by_id(producto_id)
            if producto is None:
                return False

            producto.deleted_at = datetime.now(timezone.utc)
            producto.updated_at = datetime.now(timezone.utc)
            uow.repository.add(producto)
            uow.session.flush()
            return True

    def agregar_a_categoria(
        self, producto_id: int, categoria_id: int
    ) -> Optional[Producto]:
        with ProductoUnitOfWork() as uow:
            producto = uow.repository.get_by_id(producto_id)
            if not producto:
                return None

            categoria = uow.categoria_repository.get_by_id(categoria_id)
            if not categoria:
                return None

            if categoria.parent_id is None:
                raise CategoriaNoEsSubcategoria(categoria_id)

            existing = uow.repository.get_link(producto_id, categoria_id)
            if not existing:
                link = ProductoCategoriaLink(
                    producto_id=producto_id, categoria_id=categoria_id
                )
                uow.repository.add_link(link)
                uow.session.flush()
            return uow.repository.get_by_id(producto_id)

    def eliminar_de_categoria(
        self, producto_id: int, categoria_id: int
    ) -> Optional[Producto]:
        with ProductoUnitOfWork() as uow:
            link = uow.repository.get_link(producto_id, categoria_id)
            if not link:
                return None

            uow.repository.delete_link(link)
            uow.session.flush()
            return uow.repository.get_by_id(producto_id)

    def agregar_ingrediente(
        self,
        producto_id: int,
        ingrediente_id: int,
        es_removible: bool = False,
    ) -> Optional[Producto]:
        with ProductoUnitOfWork() as uow:
            producto = uow.repository.get_by_id(producto_id)
            if not producto:
                return None

            ingrediente = uow.ingrediente_repository.get_by_id(ingrediente_id)
            if not ingrediente:
                return None

            existing = uow.repository.get_ingrediente_link(producto_id, ingrediente_id)
            if not existing:
                link = IngredienteProductoLink(
                    producto_id=producto_id,
                    ingrediente_id=ingrediente_id,
                    es_removible=es_removible,
                )
                uow.repository.add_ingrediente_link(link)
                uow.session.flush()
            return uow.repository.get_by_id(producto_id)

    def eliminar_ingrediente(
        self, producto_id: int, ingrediente_id: int
    ) -> Optional[Producto]:
        with ProductoUnitOfWork() as uow:
            link = uow.repository.get_ingrediente_link(producto_id, ingrediente_id)
            if not link:
                return None

            uow.repository.delete_ingrediente_link(link)
            uow.session.flush()
            return uow.repository.get_by_id(producto_id)
