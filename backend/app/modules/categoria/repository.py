from typing import Any, cast

from sqlmodel import select

from app.core.base_repository import BaseRepository
from app.modules.categoria.models import Categoria
from app.modules.producto.models import Producto


class CategoriaRepository(BaseRepository[Categoria]):
    model = Categoria

    def get_productos_by_ids(self, ids: list[int]) -> list[Producto]:
        producto_id_col = cast(Any, Producto.id)
        return list(
            self.session.exec(
                select(Producto).where(producto_id_col.in_(ids))
            ).all()
        )
