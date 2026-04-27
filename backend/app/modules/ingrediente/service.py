from datetime import datetime, timezone

from sqlalchemy.exc import IntegrityError

from app.core.exceptions import NombreYaExiste
from app.modules.ingrediente.models import Ingrediente
from app.modules.ingrediente.schemas import IngredienteCreate, IngredienteUpdate
from app.modules.ingrediente.unit_of_work import IngredienteUnitOfWork


class IngredienteService:
    def crear(self, datos: IngredienteCreate) -> Ingrediente:
        ingrediente = Ingrediente.model_validate(datos)
        with IngredienteUnitOfWork() as uow:
            uow.repository.add(ingrediente)
            try:
                uow.session.flush()
            except IntegrityError:
                raise NombreYaExiste("ingrediente", datos.nombre)
            return uow.repository.get_by_id(ingrediente.id)

    def obtener_por_id(self, ingrediente_id: int) -> Ingrediente | None:
        with IngredienteUnitOfWork() as uow:
            return uow.repository.get_by_id(ingrediente_id)

    def listar(
        self,
        skip: int = 0,
        limit: int = 20,
        nombre: str | None = None,
        es_alergeno: bool | None = None,
        sort_by: str = "nombre",
        order: str = "asc",
    ) -> tuple[list[Ingrediente], int]:
        with IngredienteUnitOfWork() as uow:
            return uow.repository.listar_filtrado(
                skip=skip,
                limit=limit,
                nombre=nombre,
                es_alergeno=es_alergeno,
                sort_by=sort_by,
                order=order,
            )

    def actualizar(
        self, ingrediente_id: int, datos: IngredienteUpdate
    ) -> Ingrediente | None:
        with IngredienteUnitOfWork() as uow:
            ingrediente = uow.repository.get_by_id(ingrediente_id)
            if ingrediente is None:
                return None

            datos_dict = datos.model_dump(exclude_unset=True)
            for campo, valor in datos_dict.items():
                setattr(ingrediente, campo, valor)

            ingrediente.updated_at = datetime.now(timezone.utc)
            uow.repository.add(ingrediente)
            try:
                uow.session.flush()
            except IntegrityError:
                raise NombreYaExiste("ingrediente", datos_dict.get("nombre", ""))
            return uow.repository.get_by_id(ingrediente.id)

    def eliminar(self, ingrediente_id: int) -> bool:
        with IngredienteUnitOfWork() as uow:
            ingrediente = uow.repository.get_by_id(ingrediente_id)
            if ingrediente is None:
                return False

            ingrediente.deleted_at = datetime.now(timezone.utc)
            ingrediente.updated_at = datetime.now(timezone.utc)
            uow.repository.add(ingrediente)
            uow.session.flush()
            return True
