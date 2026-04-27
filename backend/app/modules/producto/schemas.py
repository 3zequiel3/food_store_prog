from typing import Annotated, Optional

from sqlmodel import Field, SQLModel

from app.modules.categoria.schemas import CategoriaRead
from app.modules.ingrediente.schemas import IngredienteRead


class IngredienteEnProductoRead(IngredienteRead):
    es_removible: bool = False


class ProductoBase(SQLModel):
    nombre: Annotated[str, Field(min_length=2, max_length=150)]
    descripcion: Annotated[Optional[str], Field(default=None, max_length=500)]
    precio_base: Annotated[float, Field(ge=0, description="Precio mayor o igual a 0")]
    imagenes_url: list[str] = Field(default_factory=list)
    disponible: bool = True
    stock_cantidad: Annotated[int, Field(default=0, ge=0, description="Stock disponible")] = 0


class ProductoCreate(ProductoBase):
    categorias_ids: Annotated[
        list[int],
        Field(min_length=1, description="Al menos una subcategoria"),
    ]
    ingredientes_ids: Annotated[
        list[int],
        Field(min_length=1, description="Al menos un ingrediente"),
    ]


class ProductoUpdate(SQLModel):
    nombre: Annotated[Optional[str], Field(default=None, min_length=2, max_length=150)]
    descripcion: Annotated[Optional[str], Field(default=None, max_length=500)]
    precio_base: Annotated[Optional[float], Field(default=None, ge=0)]
    imagenes_url: Optional[list[str]] = None
    disponible: Optional[bool] = None
    stock_cantidad: Annotated[Optional[int], Field(default=None, ge=0)] = None


class ProductoRead(ProductoBase):
    id: int
    categorias: list[CategoriaRead] = []
    ingredientes: list[IngredienteRead] = []
