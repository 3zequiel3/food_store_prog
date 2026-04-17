from typing import Optional

from sqlmodel import Field, SQLModel


class ProductoBase(SQLModel):
    nombre: str
    descripcion: Optional[str] = None
    precio_base: float
    imagen_url: list[str] = Field(default_factory=list)
    disponible: bool = True


class ProductoCreate(ProductoBase):
    pass


class ProductoUpdate(SQLModel):
    nombre: Optional[str] = None
    descripcion: Optional[str] = None
    precio_base: Optional[float] = None
    imagen_url: Optional[list[str]] = None
    disponible: Optional[bool] = None


class ProductoRead(ProductoBase):
    id: int