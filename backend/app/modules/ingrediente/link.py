from sqlalchemy import BigInteger, Column, ForeignKey
from sqlmodel import Field, SQLModel


class IngredienteProductoLink(SQLModel, table=True):
    __tablename__ = "ingrediente_producto_link"  # type: ignore

    ingrediente_id: int = Field(
        sa_column=Column(
            BigInteger,
            ForeignKey("ingrediente.id"),
            primary_key=True,
            nullable=False,
        )
    )
    producto_id: int = Field(
        sa_column=Column(
            BigInteger,
            ForeignKey("producto.id"),
            primary_key=True,
            nullable=False,
        )
    )
    es_removible: bool = Field(default=False, nullable=False)
