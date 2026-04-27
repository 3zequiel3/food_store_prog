from typing import Annotated, Literal

from fastapi import APIRouter, HTTPException, Path, Query, Response, status

from app.core.exceptions import NombreYaExiste
from app.core.schemas import Page
from app.modules.categoria.exceptions import CicloEnJerarquia
from app.modules.categoria.schemas import CategoriaCreate, CategoriaRead, CategoriaUpdate
from app.modules.categoria.service import CategoriaService


categoria_router = APIRouter(prefix="/categorias", tags=["Categorias"])
_service = CategoriaService()


@categoria_router.post("", response_model=CategoriaRead, status_code=status.HTTP_201_CREATED)
def crear_categoria_endpoint(datos: CategoriaCreate):
    try:
        return _service.crear(datos)
    except (NombreYaExiste, CicloEnJerarquia) as exc:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=str(exc),
        )


@categoria_router.get("", response_model=Page[CategoriaRead])
def listar_categorias_endpoint(
    skip: Annotated[int, Query(ge=0)] = 0,
    limit: Annotated[int, Query(gt=0, le=100)] = 20,
    nombre: Annotated[str | None, Query(min_length=1, max_length=100)] = None,
    tipo: Annotated[Literal["raiz", "subcategoria"] | None, Query()] = None,
    parent_id: Annotated[int | None, Query(gt=0)] = None,
    sort_by: Annotated[Literal["nombre", "created_at"], Query()] = "nombre",
    order: Annotated[Literal["asc", "desc"], Query()] = "asc",
):
    items, total = _service.listar(
        skip=skip,
        limit=limit,
        nombre=nombre,
        tipo=tipo,
        parent_id=parent_id,
        sort_by=sort_by,
        order=order,
    )
    return Page[CategoriaRead](
        items=[CategoriaRead.model_validate(c) for c in items],
        total=total,
        skip=skip,
        limit=limit,
        has_next=(skip + limit) < total,
    )


@categoria_router.get("/{categoria_id}", response_model=CategoriaRead)
def obtener_categoria_endpoint(categoria_id: Annotated[int, Path(gt=0)]):
    categoria = _service.obtener_por_id(categoria_id)
    if not categoria:
        raise HTTPException(status_code=404, detail="Categoria no encontrada")
    return categoria


@categoria_router.put("/{categoria_id}", response_model=CategoriaRead)
def actualizar_categoria_endpoint(
    categoria_id: Annotated[int, Path(gt=0)],
    datos: CategoriaUpdate,
):
    try:
        categoria = _service.actualizar(categoria_id, datos)
    except (NombreYaExiste, CicloEnJerarquia) as exc:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=str(exc),
        )
    if not categoria:
        raise HTTPException(status_code=404, detail="Categoria no encontrada")
    return categoria


@categoria_router.delete("/{categoria_id}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_categoria_endpoint(categoria_id: Annotated[int, Path(gt=0)]):
    eliminado = _service.eliminar(categoria_id)
    if not eliminado:
        raise HTTPException(status_code=404, detail="Categoria no encontrada")
    return Response(status_code=status.HTTP_204_NO_CONTENT)
