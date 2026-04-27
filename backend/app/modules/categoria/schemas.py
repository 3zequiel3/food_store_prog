from __future__ import annotations

from typing import Annotated, Optional

from sqlmodel import Field, SQLModel


class CategoriaBase(SQLModel):
    nombre: Annotated[str, Field(min_length=2, max_length=100)]
    descripcion: Annotated[Optional[str], Field(default=None, max_length=500)]
    imagen_url: Optional[str] = None
    parent_id: Optional[int] = None


class CategoriaCreate(CategoriaBase):
    pass


class CategoriaUpdate(SQLModel):
    nombre: Annotated[Optional[str], Field(default=None, min_length=2, max_length=100)]
    descripcion: Annotated[Optional[str], Field(default=None, max_length=500)]
    imagen_url: Optional[str] = None
    parent_id: Optional[int] = None


class CategoriaRead(CategoriaBase):
    id: int


class CategoriaTreeRead(SQLModel):
    id: int
    nombre: str
    descripcion: Optional[str] = None
    imagen_url: Optional[str] = None
    parent_id: Optional[int] = None
    subcategorias: list["CategoriaTreeRead"] = []

    model_config = {"from_attributes": True}


CategoriaTreeRead.model_rebuild()
