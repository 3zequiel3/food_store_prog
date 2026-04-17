from typing import TYPE_CHECKING, List, Optional

from sqlalchemy import Column, JSON
from sqlmodel import Field, Relationship

from app.core.base_model import BaseModel
from app.modules.producto.link import ProductoCategoriaLink
from app.modules.ingrediente.link import IngredienteProductoLink

if TYPE_CHECKING:
    from app.modules.categoria.models import Categoria
    from app.modules.ingrediente.models import Ingrediente


class Producto(BaseModel, table=True):
    nombre: str
    descripcion: Optional[str] = None
    precio_base: float
    imagen_url: list[str] = Field(default_factory=list, sa_column=Column(JSON))
    disponible: bool = True

    ingredientes: List["Ingrediente"] = Relationship(
        back_populates="productos",
        link_model=IngredienteProductoLink,
    )

    categorias: List["Categoria"] = Relationship(
        back_populates="productos",
        link_model=ProductoCategoriaLink,
    )