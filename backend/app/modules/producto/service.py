from datetime import datetime, timezone
from typing import Optional

from app.modules.producto.link import ProductoCategoriaLink
from app.modules.producto.models import Producto
from app.modules.producto.schemas import ProductoCreate, ProductoUpdate
from app.modules.producto.unit_of_work import ProductoUnitOfWork


def crear_producto(uow: ProductoUnitOfWork, datos: ProductoCreate) -> Producto:
    producto = Producto.model_validate(datos)
    uow.repository.add(producto)
    uow.commit()
    uow.refresh(producto)
    return producto


def obtener_producto_por_id(uow: ProductoUnitOfWork, producto_id: int) -> Producto | None:
    return uow.repository.get_by_id(producto_id)


def listar_productos(uow: ProductoUnitOfWork) -> list[Producto]:
    return uow.repository.list_active()


def actualizar_producto(
    uow: ProductoUnitOfWork, producto_id: int, datos: ProductoUpdate
) -> Producto | None:
    producto = uow.repository.get_by_id(producto_id)
    if producto is None:
        return None

    datos_dict = datos.model_dump(exclude_unset=True)
    for campo, valor in datos_dict.items():
        setattr(producto, campo, valor)

    producto.updated_at = datetime.now(timezone.utc)

    uow.repository.add(producto)
    uow.commit()
    uow.refresh(producto)
    return producto


def eliminar_producto(uow: ProductoUnitOfWork, producto_id: int) -> bool:
    producto = uow.repository.get_by_id(producto_id)
    if producto is None:
        return False

    producto.deleted_at = datetime.now(timezone.utc)
    producto.updated_at = datetime.now(timezone.utc)

    uow.repository.add(producto)
    uow.commit()
    return True


def agregar_producto_a_categoria(
    uow: ProductoUnitOfWork, producto_id: int, categoria_id: int
) -> Optional[Producto]:
    producto = uow.repository.get_by_id(producto_id)
    if not producto:
        return None

    existing = uow.repository.get_link(producto_id, categoria_id)
    if not existing:
        link = ProductoCategoriaLink(producto_id=producto_id, categoria_id=categoria_id)
        uow.repository.add_link(link)
        uow.commit()

    uow.refresh(producto)
    return producto


def eliminar_producto_de_categoria(
    uow: ProductoUnitOfWork, producto_id: int, categoria_id: int
) -> Optional[Producto]:
    link = uow.repository.get_link(producto_id, categoria_id)
    if not link:
        return None

    uow.repository.delete_link(link)
    uow.commit()

    return uow.repository.get_by_id(producto_id)
