from sqlalchemy import Column, ForeignKey, Integer
from sqlmodel import SQLModel, Field

class IngredienteProductoLink(SQLModel, table=True):
    __tablename__ = "ingrediente_producto_link"  # type: ignore

    ingrediente_id: int = Field(
        sa_column=Column(Integer, ForeignKey("ingrediente.id"), primary_key=True, nullable=False)
    )
    producto_id: int = Field(
        sa_column=Column(Integer, ForeignKey("producto.id"), primary_key=True, nullable=False)
    )
    es_removible: bool = False