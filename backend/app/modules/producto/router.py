from typing import Annotated, Literal

from fastapi import APIRouter, HTTPException, Path, Query, Response, status

from app.core.schemas import Page
from app.modules.producto.exceptions import CategoriaNoEsSubcategoria
from app.modules.producto.schemas import ProductoCreate, ProductoRead, ProductoUpdate
from app.modules.producto.service import ProductoService


producto_router = APIRouter(prefix="/productos", tags=["Productos"])
_service = ProductoService()


@producto_router.post("", response_model=ProductoRead, status_code=status.HTTP_201_CREATED)
def crear_producto_endpoint(datos: ProductoCreate):
    try:
        return _service.crear(datos)
    except CategoriaNoEsSubcategoria as exc:
        raise HTTPException(status_code=422, detail=str(exc))


@producto_router.get("", response_model=Page[ProductoRead])
def listar_productos_endpoint(
    skip: Annotated[int, Query(ge=0)] = 0,
    limit: Annotated[int, Query(gt=0, le=100)] = 20,
    nombre: Annotated[str | None, Query(min_length=1, max_length=150)] = None,
    disponible: Annotated[bool | None, Query()] = None,
    precio_min: Annotated[float | None, Query(ge=0)] = None,
    precio_max: Annotated[float | None, Query(ge=0)] = None,
    categoria_id: Annotated[int | None, Query(gt=0)] = None,
    ingrediente_id: Annotated[int | None, Query(gt=0)] = None,
    sort_by: Annotated[Literal["nombre", "precio_base", "created_at"], Query()] = "created_at",
    order: Annotated[Literal["asc", "desc"], Query()] = "desc",
):
    items, total = _service.listar(
        skip=skip,
        limit=limit,
        nombre=nombre,
        disponible=disponible,
        precio_min=precio_min,
        precio_max=precio_max,
        categoria_id=categoria_id,
        ingrediente_id=ingrediente_id,
        sort_by=sort_by,
        order=order,
    )
    return Page[ProductoRead](
        items=[ProductoRead.model_validate(p) for p in items],
        total=total,
        skip=skip,
        limit=limit,
        has_next=(skip + limit) < total,
    )


@producto_router.get("/{producto_id}", response_model=ProductoRead)
def obtener_producto_endpoint(producto_id: Annotated[int, Path(gt=0)]):
    producto = _service.obtener_por_id(producto_id)
    if not producto:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    return producto


@producto_router.put("/{producto_id}", response_model=ProductoRead)
def actualizar_producto_endpoint(
    producto_id: Annotated[int, Path(gt=0)],
    datos: ProductoUpdate,
):
    producto = _service.actualizar(producto_id, datos)
    if not producto:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    return producto


@producto_router.delete("/{producto_id}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_producto_endpoint(producto_id: Annotated[int, Path(gt=0)]):
    eliminado = _service.eliminar(producto_id)
    if not eliminado:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@producto_router.post("/{producto_id}/categorias/{categoria_id}", response_model=ProductoRead)
def agregar_producto_a_categoria_endpoint(
    producto_id: Annotated[int, Path(gt=0)],
    categoria_id: Annotated[int, Path(gt=0)],
):
    try:
        producto = _service.agregar_a_categoria(producto_id, categoria_id)
    except CategoriaNoEsSubcategoria as exc:
        raise HTTPException(status_code=422, detail=str(exc))
    if not producto:
        raise HTTPException(status_code=404, detail="Producto o Categoria no encontrado")
    return producto


@producto_router.delete("/{producto_id}/categorias/{categoria_id}", response_model=ProductoRead)
def eliminar_producto_de_categoria_endpoint(
    producto_id: Annotated[int, Path(gt=0)],
    categoria_id: Annotated[int, Path(gt=0)],
):
    producto = _service.eliminar_de_categoria(producto_id, categoria_id)
    if not producto:
        raise HTTPException(status_code=404, detail="Producto o Categoria no encontrado")
    return producto


@producto_router.post("/{producto_id}/ingredientes/{ingrediente_id}", response_model=ProductoRead)
def agregar_ingrediente_a_producto_endpoint(
    producto_id: Annotated[int, Path(gt=0)],
    ingrediente_id: Annotated[int, Path(gt=0)],
    es_removible: bool = False,
):
    producto = _service.agregar_ingrediente(producto_id, ingrediente_id, es_removible)
    if not producto:
        raise HTTPException(status_code=404, detail="Producto o Ingrediente no encontrado")
    return producto


@producto_router.delete("/{producto_id}/ingredientes/{ingrediente_id}", response_model=ProductoRead)
def eliminar_ingrediente_de_producto_endpoint(
    producto_id: Annotated[int, Path(gt=0)],
    ingrediente_id: Annotated[int, Path(gt=0)],
):
    producto = _service.eliminar_ingrediente(producto_id, ingrediente_id)
    if not producto:
        raise HTTPException(status_code=404, detail="Producto o Ingrediente no encontrado")
    return producto
