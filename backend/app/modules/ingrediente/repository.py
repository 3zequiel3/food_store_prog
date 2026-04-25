from typing import Any, cast

from sqlalchemy import func
from sqlmodel import select

from app.core.base_repository import BaseRepository
from app.modules.ingrediente.models import Ingrediente


_SORTABLE_FIELDS = {
    "nombre": Ingrediente.nombre,
    "created_at": Ingrediente.created_at,
}


class IngredienteRepository(BaseRepository[Ingrediente]):
    model = Ingrediente

    def listar_filtrado(
        self,
        skip: int = 0,
        limit: int = 20,
        nombre: str | None = None,
        es_alergeno: bool | None = None,
        sort_by: str = "nombre",
        order: str = "asc",
    ) -> tuple[list[Ingrediente], int]:
        filters = [Ingrediente.deleted_at == None]  # noqa: E711

        if nombre is not None:
            nombre_col = cast(Any, Ingrediente.nombre)
            filters.append(nombre_col.ilike(f"%{nombre}%"))

        if es_alergeno is not None:
            filters.append(Ingrediente.es_alergeno == es_alergeno)

        sort_col = _SORTABLE_FIELDS.get(sort_by, Ingrediente.nombre)
        sort_col_any = cast(Any, sort_col)
        order_expr = sort_col_any.asc() if order == "asc" else sort_col_any.desc()

        count_stmt = select(func.count()).select_from(Ingrediente).where(*filters)
        total = self.session.exec(count_stmt).one()
        if isinstance(total, tuple):
            total = total[0]

        stmt = (
            select(Ingrediente)
            .where(*filters)
            .order_by(order_expr)
            .offset(skip)
            .limit(limit)
        )
        items = list(self.session.exec(stmt).all())
        return items, int(total)
