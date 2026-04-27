from typing import Annotated, Literal

from fastapi import APIRouter, HTTPException, Path, Query, Response, status

from app.core.exceptions import NombreYaExiste
from app.core.schemas import Page
from app.modules.ingrediente.schemas import IngredienteCreate, IngredienteRead, IngredienteUpdate
from app.modules.ingrediente.service import IngredienteService


ingrediente_router = APIRouter(prefix="/ingredientes", tags=["Ingredientes"])
_service = IngredienteService()


@ingrediente_router.post("", response_model=IngredienteRead, status_code=status.HTTP_201_CREATED)
def crear_ingrediente_endpoint(datos: IngredienteCreate):
    try:
        return _service.crear(datos)
    except NombreYaExiste as exc:
        raise HTTPException(status_code=422, detail=str(exc))


@ingrediente_router.get("", response_model=Page[IngredienteRead])
def listar_ingredientes_endpoint(
    skip: Annotated[int, Query(ge=0)] = 0,
    limit: Annotated[int, Query(gt=0, le=100)] = 20,
    nombre: Annotated[str | None, Query(min_length=1, max_length=100)] = None,
    es_alergeno: Annotated[bool | None, Query()] = None,
    sort_by: Annotated[Literal["nombre", "created_at"], Query()] = "nombre",
    order: Annotated[Literal["asc", "desc"], Query()] = "asc",
):
    items, total = _service.listar(
        skip=skip,
        limit=limit,
        nombre=nombre,
        es_alergeno=es_alergeno,
        sort_by=sort_by,
        order=order,
    )
    return Page[IngredienteRead](
        items=[IngredienteRead.model_validate(i) for i in items],
        total=total,
        skip=skip,
        limit=limit,
        has_next=(skip + limit) < total,
    )


@ingrediente_router.get("/{ingrediente_id}", response_model=IngredienteRead)
def obtener_ingrediente_endpoint(ingrediente_id: Annotated[int, Path(gt=0)]):
    ingrediente = _service.obtener_por_id(ingrediente_id)
    if not ingrediente:
        raise HTTPException(status_code=404, detail="Ingrediente no encontrado")
    return ingrediente


@ingrediente_router.put("/{ingrediente_id}", response_model=IngredienteRead)
def actualizar_ingrediente_endpoint(
    ingrediente_id: Annotated[int, Path(gt=0)],
    datos: IngredienteUpdate,
):
    try:
        ingrediente = _service.actualizar(ingrediente_id, datos)
    except NombreYaExiste as exc:
        raise HTTPException(status_code=422, detail=str(exc))
    if not ingrediente:
        raise HTTPException(status_code=404, detail="Ingrediente no encontrado")
    return ingrediente


@ingrediente_router.delete("/{ingrediente_id}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_ingrediente_endpoint(ingrediente_id: Annotated[int, Path(gt=0)]):
    eliminado = _service.eliminar(ingrediente_id)
    if not eliminado:
        raise HTTPException(status_code=404, detail="Ingrediente no encontrado")
    return Response(status_code=status.HTTP_204_NO_CONTENT)
