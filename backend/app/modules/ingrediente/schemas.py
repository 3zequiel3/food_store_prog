from typing import Annotated, Optional

from sqlmodel import Field, SQLModel


class IngredienteBase(SQLModel):
    nombre: Annotated[str, Field(min_length=2, max_length=100)]
    descripcion: Annotated[Optional[str], Field(default=None, max_length=500)]
    es_alergeno: bool = False


class IngredienteCreate(IngredienteBase):
    pass


class IngredienteUpdate(SQLModel):
    nombre: Annotated[Optional[str], Field(default=None, min_length=2, max_length=100)]
    descripcion: Annotated[Optional[str], Field(default=None, max_length=500)]
    es_alergeno: Optional[bool] = None


class IngredienteRead(IngredienteBase):
    id: int
