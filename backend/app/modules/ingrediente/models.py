from typing import TYPE_CHECKING, List
from typing import Optional

from sqlmodel import Relationship

from app.core.base_model import BaseModel
from app.modules.ingrediente.link import IngredienteProductoLink

if TYPE_CHECKING:
    from app.modules.producto.models import Producto


class Ingrediente(BaseModel, table=True):
    nombre: str
    descripcion: Optional[str] = None
    es_alergeno: bool = False
    productos: List["Producto"] = Relationship(
        back_populates="ingredientes",
        link_model=IngredienteProductoLink,
    )