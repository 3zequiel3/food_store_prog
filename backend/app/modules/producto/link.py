from sqlalchemy import Column, ForeignKey, Integer
from sqlmodel import SQLModel, Field


class ProductoCategoriaLink(SQLModel, table=True):
    __tablename__ = "producto_categoria_link"  # type: ignore

    producto_id: int = Field(
        sa_column=Column(Integer, ForeignKey("producto.id"), primary_key=True, nullable=False)
    )
    categoria_id: int = Field(
        sa_column=Column(Integer, ForeignKey("categoria.id"), primary_key=True, nullable=False)
    )