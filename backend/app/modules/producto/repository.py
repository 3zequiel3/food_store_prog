from typing import Any, List, Optional, cast

from sqlalchemy import func, or_, select as sa_select
from sqlalchemy.orm import selectinload
from sqlmodel import select

from app.core.base_repository import BaseRepository
from app.modules.categoria.models import Categoria
from app.modules.ingrediente.link import IngredienteProductoLink
from app.modules.producto.link import ProductoCategoriaLink
from app.modules.producto.models import Producto


_SORTABLE_FIELDS = {
    "nombre": Producto.nombre,
    "precio_base": Producto.precio_base,
    "created_at": Producto.created_at,
}


class ProductoRepository(BaseRepository[Producto]):
    model = Producto

    def _with_relations(self):
        return (
            selectinload(Producto.categorias),
            selectinload(Producto.ingredientes),
        )

    def get_by_id(self, entity_id: int) -> Optional[Producto]:
        return self.session.exec(
            select(Producto)
            .where(
                Producto.id == entity_id,
                Producto.deleted_at == None,  # noqa: E711
            )
            .options(*self._with_relations())
        ).first()

    def list_active(self) -> List[Producto]:
        return list(
            self.session.exec(
                select(Producto)
                .where(Producto.deleted_at == None)  # noqa: E711
                .options(*self._with_relations())
            ).all()
        )

    def listar_filtrado(
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
        filters = [Producto.deleted_at == None]  # noqa: E711

        if nombre is not None:
            nombre_col = cast(Any, Producto.nombre)
            filters.append(nombre_col.ilike(f"%{nombre}%"))

        if disponible is not None:
            filters.append(Producto.disponible == disponible)

        if precio_min is not None:
            filters.append(Producto.precio_base >= precio_min)

        if precio_max is not None:
            filters.append(Producto.precio_base <= precio_max)

        if categoria_id is not None:
            producto_id_col = cast(Any, Producto.id)
            subcat_id_col = cast(Any, Categoria.id)
            exists_categoria = (
                sa_select(ProductoCategoriaLink.producto_id)
                .join(
                    Categoria,
                    subcat_id_col == ProductoCategoriaLink.categoria_id,
                )
                .where(
                    ProductoCategoriaLink.producto_id == producto_id_col,
                    or_(
                        Categoria.id == categoria_id,
                        Categoria.parent_id == categoria_id,
                    ),
                )
                .exists()
            )
            filters.append(exists_categoria)

        if ingrediente_id is not None:
            producto_id_col = cast(Any, Producto.id)
            exists_ingrediente = (
                sa_select(IngredienteProductoLink.producto_id)
                .where(
                    IngredienteProductoLink.producto_id == producto_id_col,
                    IngredienteProductoLink.ingrediente_id == ingrediente_id,
                )
                .exists()
            )
            filters.append(exists_ingrediente)

        sort_col = _SORTABLE_FIELDS.get(sort_by, Producto.created_at)
        sort_col_any = cast(Any, sort_col)
        order_expr = sort_col_any.asc() if order == "asc" else sort_col_any.desc()

        count_stmt = select(func.count()).select_from(Producto).where(*filters)
        total = self.session.exec(count_stmt).one()
        if isinstance(total, tuple):
            total = total[0]

        stmt = (
            select(Producto)
            .where(*filters)
            .order_by(order_expr)
            .offset(skip)
            .limit(limit)
            .options(*self._with_relations())
        )
        items = list(self.session.exec(stmt).all())
        return items, int(total)

    def get_link(self, producto_id: int, categoria_id: int) -> ProductoCategoriaLink | None:
        return self.session.exec(
            select(ProductoCategoriaLink).where(
                ProductoCategoriaLink.producto_id == producto_id,
                ProductoCategoriaLink.categoria_id == categoria_id,
            )
        ).first()

    def add_link(self, link: ProductoCategoriaLink):
        self.session.add(link)

    def delete_link(self, link: ProductoCategoriaLink):
        self.session.delete(link)

    def get_ingrediente_link(
        self, producto_id: int, ingrediente_id: int
    ) -> IngredienteProductoLink | None:
        return self.session.exec(
            select(IngredienteProductoLink).where(
                IngredienteProductoLink.producto_id == producto_id,
                IngredienteProductoLink.ingrediente_id == ingrediente_id,
            )
        ).first()

    def add_ingrediente_link(self, link: IngredienteProductoLink):
        self.session.add(link)

    def delete_ingrediente_link(self, link: IngredienteProductoLink):
        self.session.delete(link)
