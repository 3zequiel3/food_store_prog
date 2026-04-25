from typing import Any, cast

from sqlalchemy import func
from sqlmodel import select

from app.core.base_repository import BaseRepository
from app.modules.categoria.models import Categoria
from app.modules.producto.models import Producto


_SORTABLE_FIELDS = {
    "nombre": Categoria.nombre,
    "created_at": Categoria.created_at,
}


class CategoriaRepository(BaseRepository[Categoria]):
    model = Categoria

    def get_productos_by_ids(self, ids: list[int]) -> list[Producto]:
        producto_id_col = cast(Any, Producto.id)
        return list(
            self.session.exec(
                select(Producto).where(producto_id_col.in_(ids))
            ).all()
        )

    def listar_filtrado(
        self,
        skip: int = 0,
        limit: int = 20,
        nombre: str | None = None,
        tipo: str | None = None,
        parent_id: int | None = None,
        sort_by: str = "nombre",
        order: str = "asc",
    ) -> tuple[list[Categoria], int]:
        filters = [Categoria.deleted_at == None]  # noqa: E711

        if nombre is not None:
            nombre_col = cast(Any, Categoria.nombre)
            filters.append(nombre_col.ilike(f"%{nombre}%"))

        if tipo == "raiz":
            filters.append(Categoria.parent_id == None)  # noqa: E711
        elif tipo == "subcategoria":
            filters.append(Categoria.parent_id != None)  # noqa: E711

        if parent_id is not None:
            filters.append(Categoria.parent_id == parent_id)

        sort_col = _SORTABLE_FIELDS.get(sort_by, Categoria.nombre)
        sort_col_any = cast(Any, sort_col)
        order_expr = sort_col_any.asc() if order == "asc" else sort_col_any.desc()

        count_stmt = select(func.count()).select_from(Categoria).where(*filters)
        total = self.session.exec(count_stmt).one()
        if isinstance(total, tuple):
            total = total[0]

        stmt = (
            select(Categoria)
            .where(*filters)
            .order_by(order_expr)
            .offset(skip)
            .limit(limit)
        )
        items = list(self.session.exec(stmt).all())
        return items, int(total)
