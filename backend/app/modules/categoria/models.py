from typing import TYPE_CHECKING, List, Optional

from sqlalchemy import BigInteger, Column, ForeignKey, String, Text
from sqlmodel import Field, Relationship

from app.core.base_model import BaseModel
from app.modules.producto.link import ProductoCategoriaLink

if TYPE_CHECKING:
    from app.modules.producto.models import Producto


class Categoria(BaseModel, table=True):
    nombre: str = Field(sa_column=Column(String(100), unique=True, nullable=False))
    descripcion: Optional[str] = Field(default=None, sa_column=Column(Text))
    imagen_url: Optional[str] = Field(default=None, sa_column=Column(Text))

    parent_id: Optional[int] = Field(
        default=None,
        sa_column=Column(
            BigInteger,
            ForeignKey("categoria.id", ondelete="SET NULL"),
            nullable=True,
        ),
    )

    parent: Optional["Categoria"] = Relationship(
        back_populates="subcategorias",
        sa_relationship_kwargs={
            "foreign_keys": "[Categoria.parent_id]",
            "remote_side": "[Categoria.id]",
        },
    )

    subcategorias: List["Categoria"] = Relationship(
        back_populates="parent",
        sa_relationship_kwargs={
            "foreign_keys": "[Categoria.parent_id]",
        },
    )

    productos: List["Producto"] = Relationship(
        back_populates="categorias",
        link_model=ProductoCategoriaLink,
    )
