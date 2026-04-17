from datetime import datetime, timezone

from app.modules.categoria.models import Categoria
from app.modules.categoria.schemas import CategoriaCreate, CategoriaUpdate
from app.modules.categoria.unit_of_work import CategoriaUnitOfWork



def crear_categoria(uow: CategoriaUnitOfWork, datos: CategoriaCreate) -> Categoria:
    categoria = Categoria.model_validate(datos)
    try:
        uow.repository.add(categoria)
        uow.commit()
    except Exception as e:
        uow.rollback()
        raise e
    uow.refresh(categoria)
    return categoria


def obtener_categoria_por_id(uow: CategoriaUnitOfWork, categoria_id: int) -> Categoria | None:
    return uow.repository.get_by_id(categoria_id)


def listar_categorias(uow: CategoriaUnitOfWork) -> list[Categoria]:
    return uow.repository.list_active()


def actualizar_categoria(
    uow: CategoriaUnitOfWork, categoria_id: int, datos: CategoriaUpdate
) -> Categoria | None:
    categoria = uow.repository.get_by_id(categoria_id)
    if categoria is None:
        return None

    datos_dict = datos.model_dump(exclude_unset=True)
    for campo, valor in datos_dict.items():
        setattr(categoria, campo, valor)

    categoria.updated_at = datetime.now(timezone.utc)
    try:
        uow.repository.add(categoria)
        uow.commit()
    except Exception as e:
        uow.rollback()
        raise e
    uow.refresh(categoria)
    return categoria


def eliminar_categoria(uow: CategoriaUnitOfWork, categoria_id: int) -> bool:
    categoria = uow.repository.get_by_id(categoria_id)
    if categoria is None:
        return False

    categoria.deleted_at = datetime.now(timezone.utc)
    categoria.updated_at = datetime.now(timezone.utc)

    try:
        uow.repository.add(categoria)
        uow.commit()
    except Exception as e:
        uow.rollback()
        raise e
    uow.refresh(categoria)
    return True


def agregar_productos_a_categoria(
    uow: CategoriaUnitOfWork, categoria_id: int, productos_ids: list[int]
) -> Categoria | None:
    categoria = uow.repository.get_by_id(categoria_id)
    if categoria is None:
        return None

    if not productos_ids:
        return categoria

    productos = uow.repository.get_productos_by_ids(productos_ids)
    productos_existentes = {p.id for p in categoria.productos if p.id is not None}

    for producto in productos:
        if producto.id not in productos_existentes:
            categoria.productos.append(producto)

    uow.repository.add(categoria)
    uow.commit()
    uow.refresh(categoria)
    return categoria


def quitar_productos_de_categoria(
    uow: CategoriaUnitOfWork, categoria_id: int, productos_ids: list[int]
) -> Categoria | None:
    categoria = uow.repository.get_by_id(categoria_id)
    if categoria is None:
        return None

    if not productos_ids:
        return categoria

    categoria.productos = [
        p for p in categoria.productos if p.id not in productos_ids
    ]

    uow.repository.add(categoria)
    uow.commit()
    uow.refresh(categoria)
    return categoria