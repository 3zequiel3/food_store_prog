from datetime import datetime, timezone

from app.modules.ingrediente.models import Ingrediente
from app.modules.ingrediente.schemas import IngredienteCreate, IngredienteUpdate
from app.modules.ingrediente.unit_of_work import IngredienteUnitOfWork


def crear_ingrediente(uow: IngredienteUnitOfWork, datos: IngredienteCreate) -> Ingrediente:
    ingrediente = Ingrediente.model_validate(datos)
    with uow:
        uow.repository.add(ingrediente)
        uow.commit()
        uow.refresh(ingrediente)
    return ingrediente


def obtener_ingrediente_por_id(uow: IngredienteUnitOfWork, ingrediente_id: int) -> Ingrediente | None:
    return uow.repository.get_by_id(ingrediente_id)


def listar_ingredientes(uow: IngredienteUnitOfWork) -> list[Ingrediente]:
    return uow.repository.list_active()


def actualizar_ingrediente(
    uow: IngredienteUnitOfWork, ingrediente_id: int, datos: IngredienteUpdate
) -> Ingrediente | None:
    ingrediente = uow.repository.get_by_id(ingrediente_id)
    if ingrediente is None:
        return None

    datos_dict = datos.model_dump(exclude_unset=True)
    for campo, valor in datos_dict.items():
        setattr(ingrediente, campo, valor)

    ingrediente.updated_at = datetime.now(timezone.utc)

    with uow:
        uow.repository.add(ingrediente)
        uow.commit()
        uow.refresh(ingrediente)
    return ingrediente


def eliminar_ingrediente(uow: IngredienteUnitOfWork, ingrediente_id: int) -> bool:
    ingrediente = uow.repository.get_by_id(ingrediente_id)
    if ingrediente is None:
        return False

    ingrediente.deleted_at = datetime.now(timezone.utc)
    ingrediente.updated_at = datetime.now(timezone.utc)

    with uow:
        uow.repository.add(ingrediente)
        uow.commit()
    return True
