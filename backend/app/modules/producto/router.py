from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Path, Response, status
from sqlmodel import Session

from app.core.database import get_session
from app.modules.producto.schemas import ProductoCreate, ProductoRead, ProductoUpdate
from app.modules.producto.service import (
    actualizar_producto,
    agregar_ingrediente_a_producto,
    agregar_producto_a_categoria,
    crear_producto,
    eliminar_ingrediente_de_producto,
    eliminar_producto,
    eliminar_producto_de_categoria,
    listar_productos,
    obtener_producto_por_id,
)
from app.modules.producto.unit_of_work import ProductoUnitOfWork


producto_router = APIRouter(prefix="/productos", tags=["Productos"])


def get_uow(session: Session = Depends(get_session)) -> ProductoUnitOfWork:
    return ProductoUnitOfWork(session)


@producto_router.post("", response_model=ProductoRead, status_code=status.HTTP_201_CREATED)
def crear_producto_endpoint(
    datos: ProductoCreate,
    uow: ProductoUnitOfWork = Depends(get_uow),
):
    return crear_producto(uow, datos)


@producto_router.get("", response_model=list[ProductoRead])
def listar_productos_endpoint(uow: ProductoUnitOfWork = Depends(get_uow)):
    return listar_productos(uow)


@producto_router.get("/{producto_id}", response_model=ProductoRead)
def obtener_producto_endpoint(
    producto_id: Annotated[int, Path(gt=0)], uow: ProductoUnitOfWork = Depends(get_uow)
):
    producto = obtener_producto_por_id(uow, producto_id)
    if not producto:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    return producto


@producto_router.put("/{producto_id}", response_model=ProductoRead)
def actualizar_producto_endpoint(
    producto_id: Annotated[int, Path(gt=0)],
    datos: ProductoUpdate,
    uow: ProductoUnitOfWork = Depends(get_uow),
):
    producto = actualizar_producto(uow, producto_id, datos)
    if not producto:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    return producto


@producto_router.delete("/{producto_id}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_producto_endpoint(
    producto_id: Annotated[int, Path(gt=0)], uow: ProductoUnitOfWork = Depends(get_uow)
):
    eliminado = eliminar_producto(uow, producto_id)
    if not eliminado:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@producto_router.post("/{producto_id}/categorias/{categoria_id}", response_model=ProductoRead)
def agregar_producto_a_categoria_endpoint(
    producto_id: Annotated[int, Path(gt=0)],
    categoria_id: Annotated[int, Path(gt=0)],
    uow: ProductoUnitOfWork = Depends(get_uow),
):
    producto = agregar_producto_a_categoria(uow, producto_id, categoria_id)
    if not producto:
        raise HTTPException(status_code=404, detail="Producto o Categoria no encontrado")
    return producto


@producto_router.delete("/{producto_id}/categorias/{categoria_id}", response_model=ProductoRead)
def eliminar_producto_de_categoria_endpoint(
    producto_id: Annotated[int, Path(gt=0)],
    categoria_id: Annotated[int, Path(gt=0)],
    uow: ProductoUnitOfWork = Depends(get_uow),
):
    producto = eliminar_producto_de_categoria(uow, producto_id, categoria_id)
    if not producto:
        raise HTTPException(status_code=404, detail="Producto o Categoria no encontrado")
    return producto


@producto_router.post("/{producto_id}/ingredientes/{ingrediente_id}", response_model=ProductoRead)
def agregar_ingrediente_a_producto_endpoint(
    producto_id: Annotated[int, Path(gt=0)],
    ingrediente_id: Annotated[int, Path(gt=0)],
    es_removible: bool = False,
    uow: ProductoUnitOfWork = Depends(get_uow),
):
    producto = agregar_ingrediente_a_producto(uow, producto_id, ingrediente_id, es_removible)
    if not producto:
        raise HTTPException(status_code=404, detail="Producto o Ingrediente no encontrado")
    return producto


@producto_router.delete("/{producto_id}/ingredientes/{ingrediente_id}", response_model=ProductoRead)
def eliminar_ingrediente_de_producto_endpoint(
    producto_id: Annotated[int, Path(gt=0)],
    ingrediente_id: Annotated[int, Path(gt=0)],
    uow: ProductoUnitOfWork = Depends(get_uow),
):
    producto = eliminar_ingrediente_de_producto(uow, producto_id, ingrediente_id)
    if not producto:
        raise HTTPException(status_code=404, detail="Producto o Ingrediente no encontrado")
    return producto