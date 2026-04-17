from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlmodel import Session

from app.core.database import get_session
from app.modules.ingrediente.schemas import IngredienteCreate, IngredienteRead, IngredienteUpdate
from app.modules.ingrediente.service import (
    actualizar_ingrediente,
    crear_ingrediente,
    eliminar_ingrediente,
    listar_ingredientes,
    obtener_ingrediente_por_id,
)
from app.modules.ingrediente.unit_of_work import IngredienteUnitOfWork


ingrediente_router = APIRouter(prefix="/ingredientes", tags=["Ingredientes"])


def get_uow(session: Session = Depends(get_session)) -> IngredienteUnitOfWork:
    return IngredienteUnitOfWork(session)


@ingrediente_router.post("", response_model=IngredienteRead, status_code=status.HTTP_201_CREATED)
def crear_ingrediente_endpoint(
    datos: IngredienteCreate, uow: IngredienteUnitOfWork = Depends(get_uow)
):
    return crear_ingrediente(uow, datos)


@ingrediente_router.get("", response_model=list[IngredienteRead])
def listar_ingredientes_endpoint(uow: IngredienteUnitOfWork = Depends(get_uow)):
    return listar_ingredientes(uow)


@ingrediente_router.get("/{ingrediente_id}", response_model=IngredienteRead)
def obtener_ingrediente_endpoint(
    ingrediente_id: int, uow: IngredienteUnitOfWork = Depends(get_uow)
):
    ingrediente = obtener_ingrediente_por_id(uow, ingrediente_id)
    if not ingrediente:
        raise HTTPException(status_code=404, detail="Ingrediente no encontrado")
    return ingrediente


@ingrediente_router.put("/{ingrediente_id}", response_model=IngredienteRead)
def actualizar_ingrediente_endpoint(
    ingrediente_id: int,
    datos: IngredienteUpdate,
    uow: IngredienteUnitOfWork = Depends(get_uow),
):
    ingrediente = actualizar_ingrediente(uow, ingrediente_id, datos)
    if not ingrediente:
        raise HTTPException(status_code=404, detail="Ingrediente no encontrado")
    return ingrediente


@ingrediente_router.delete("/{ingrediente_id}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_ingrediente_endpoint(
    ingrediente_id: int, uow: IngredienteUnitOfWork = Depends(get_uow)
):
    eliminado = eliminar_ingrediente(uow, ingrediente_id)
    if not eliminado:
        raise HTTPException(status_code=404, detail="Ingrediente no encontrado")
    return Response(status_code=status.HTTP_204_NO_CONTENT)
