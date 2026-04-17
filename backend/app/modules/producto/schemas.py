from typing import Annotated, Optional

from sqlmodel import Field, SQLModel

from app.modules.categoria.schemas import CategoriaRead
from app.modules.ingrediente.schemas import IngredienteRead


class IngredienteEnProductoRead(IngredienteRead):
    es_removible: bool = False


class ProductoBase(SQLModel):
    nombre: Annotated[str, Field(min_length=2, max_length=150)]
    descripcion: Annotated[Optional[str], Field(default=None, max_length=500)]
    precio_base: Annotated[float, Field(gt=0, description="Precio mayor a 0")]
    imagen_url: list[str] = Field(default_factory=list)
    disponible: bool = True


class ProductoCreate(ProductoBase):
    pass


class ProductoUpdate(SQLModel):
    nombre: Annotated[Optional[str], Field(default=None, min_length=2, max_length=150)]
    descripcion: Annotated[Optional[str], Field(default=None, max_length=500)]
    precio_base: Annotated[Optional[float], Field(default=None, gt=0)]
    imagen_url: Optional[list[str]] = None
    disponible: Optional[bool] = None


class ProductoRead(ProductoBase):
    id: int
    categorias: list[CategoriaRead] = []
    ingredientes: list[IngredienteRead] = []