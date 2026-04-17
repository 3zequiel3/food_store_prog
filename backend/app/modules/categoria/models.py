from typing import TYPE_CHECKING, List, Optional

from sqlmodel import Relationship

from app.core.base_model import BaseModel
from app.modules.producto.link import ProductoCategoriaLink

if TYPE_CHECKING:
    from app.modules.producto.models import Producto


class Categoria(BaseModel, table=True):
    nombre: str
    descripcion: Optional[str] = None

    productos: List["Producto"] = Relationship(
        back_populates="categorias",
        link_model=ProductoCategoriaLink,
    )