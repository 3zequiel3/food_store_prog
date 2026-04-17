from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlmodel import Session

from app.core.database import get_session
from app.modules.categoria.schemas import CategoriaCreate, CategoriaRead, CategoriaUpdate
from app.modules.categoria.service import (
    actualizar_categoria,
    crear_categoria,
    eliminar_categoria,
    listar_categorias,
    obtener_categoria_por_id,
)
from app.modules.categoria.unit_of_work import CategoriaUnitOfWork


categoria_router = APIRouter(prefix="/categorias", tags=["Categorias"])


def get_uow(session: Session = Depends(get_session)) -> CategoriaUnitOfWork:
    return CategoriaUnitOfWork(session)


@categoria_router.post("", response_model=CategoriaRead, status_code=status.HTTP_201_CREATED)
def crear_categoria_endpoint(
    datos: CategoriaCreate, uow: CategoriaUnitOfWork = Depends(get_uow)
):
    return crear_categoria(uow, datos)


@categoria_router.get("", response_model=list[CategoriaRead])
def listar_categorias_endpoint(uow: CategoriaUnitOfWork = Depends(get_uow)):
    return listar_categorias(uow)


@categoria_router.get("/{categoria_id}", response_model=CategoriaRead)
def obtener_categoria_endpoint(
    categoria_id: int, uow: CategoriaUnitOfWork = Depends(get_uow)
):
    categoria = obtener_categoria_por_id(uow, categoria_id)
    if not categoria:
        raise HTTPException(status_code=404, detail="Categoria no encontrada")
    return categoria


@categoria_router.put("/{categoria_id}", response_model=CategoriaRead)
def actualizar_categoria_endpoint(
    categoria_id: int,
    datos: CategoriaUpdate,
    uow: CategoriaUnitOfWork = Depends(get_uow),
):
    categoria = actualizar_categoria(uow, categoria_id, datos)
    if not categoria:
        raise HTTPException(status_code=404, detail="Categoria no encontrada")
    return categoria


@categoria_router.delete("/{categoria_id}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_categoria_endpoint(
    categoria_id: int, uow: CategoriaUnitOfWork = Depends(get_uow)
):
    eliminado = eliminar_categoria(uow, categoria_id)
    if not eliminado:
        raise HTTPException(status_code=404, detail="Categoria no encontrada")
    return Response(status_code=status.HTTP_204_NO_CONTENT)