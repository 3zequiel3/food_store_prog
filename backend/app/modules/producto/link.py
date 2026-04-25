from datetime import datetime, timezone

from sqlalchemy import BigInteger, Column, ForeignKey
from sqlmodel import Field, SQLModel


class ProductoCategoriaLink(SQLModel, table=True):
    __tablename__ = "producto_categoria_link"  # type: ignore

    producto_id: int = Field(
        sa_column=Column(
            BigInteger,
            ForeignKey("producto.id"),
            primary_key=True,
            nullable=False,
        )
    )
    categoria_id: int = Field(
        sa_column=Column(
            BigInteger,
            ForeignKey("categoria.id"),
            primary_key=True,
            nullable=False,
        )
    )
    es_principal: bool = Field(default=False, nullable=False)
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        nullable=False,
    )
