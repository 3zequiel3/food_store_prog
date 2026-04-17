from typing import Annotated, Optional

from sqlmodel import Field, SQLModel


class CategoriaBase(SQLModel):
    nombre: Annotated[str, Field(min_length=2, max_length=100)]
    descripcion: Annotated[Optional[str], Field(default=None, max_length=500)]


class CategoriaCreate(CategoriaBase):
    pass


class CategoriaUpdate(SQLModel):
    nombre: Annotated[Optional[str], Field(default=None, min_length=2, max_length=100)]
    descripcion: Annotated[Optional[str], Field(default=None, max_length=500)]


class CategoriaRead(CategoriaBase):
    id: int