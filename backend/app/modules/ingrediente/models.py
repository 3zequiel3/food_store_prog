from typing import TYPE_CHECKING, List, Optional

from sqlalchemy import Column, String, Text
from sqlmodel import Field, Relationship

from app.core.base_model import BaseModel
from app.modules.ingrediente.link import IngredienteProductoLink

if TYPE_CHECKING:
    from app.modules.producto.models import Producto


class Ingrediente(BaseModel, table=True):
    nombre: str = Field(sa_column=Column(String(100), unique=True, nullable=False))
    descripcion: Optional[str] = Field(default=None, sa_column=Column(Text))
    es_alergeno: bool = Field(default=False, nullable=False)

    productos: List["Producto"] = Relationship(
        back_populates="ingredientes",
        link_model=IngredienteProductoLink,
    )
