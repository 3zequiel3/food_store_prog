from typing import TYPE_CHECKING, List, Optional

from sqlalchemy import CheckConstraint, Column, JSON, String
from sqlmodel import Field, Relationship

from app.core.base_model import BaseModel
from app.modules.producto.link import ProductoCategoriaLink
from app.modules.ingrediente.link import IngredienteProductoLink

if TYPE_CHECKING:
    from app.modules.categoria.models import Categoria
    from app.modules.ingrediente.models import Ingrediente


class Producto(BaseModel, table=True):
    __table_args__ = (
        CheckConstraint("precio_base >= 0", name="ck_producto_precio_base_non_negative"),
        CheckConstraint("stock_cantidad >= 0", name="ck_producto_stock_non_negative"),
    )

    nombre: str = Field(sa_column=Column(String(150), nullable=False))
    descripcion: Optional[str] = None
    precio_base: float = Field(nullable=False)
    imagenes_url: list[str] = Field(default_factory=list, sa_column=Column(JSON))
    disponible: bool = Field(default=True, nullable=False)
    stock_cantidad: int = Field(default=0, nullable=False)

    ingredientes: List["Ingrediente"] = Relationship(
        back_populates="productos",
        link_model=IngredienteProductoLink,
    )

    categorias: List["Categoria"] = Relationship(
        back_populates="productos",
        link_model=ProductoCategoriaLink,
    )
