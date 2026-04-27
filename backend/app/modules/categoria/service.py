from datetime import datetime, timezone

from fastapi import HTTPException, status
from sqlalchemy.exc import IntegrityError

from app.core.exceptions import NombreYaExiste
from app.modules.categoria.exceptions import CicloEnJerarquia
from app.modules.categoria.models import Categoria
from app.modules.categoria.repository import CategoriaRepository
from app.modules.categoria.schemas import CategoriaCreate, CategoriaUpdate
from app.modules.categoria.unit_of_work import CategoriaUnitOfWork


class CategoriaService:
    def crear(self, datos: CategoriaCreate) -> Categoria:
        categoria = Categoria.model_validate(datos)
        with CategoriaUnitOfWork() as uow:
            if categoria.parent_id is not None:
                padre = uow.repository.get_by_id(categoria.parent_id)
                if padre is None:
                    raise HTTPException(
                        status_code=status.HTTP_404_NOT_FOUND,
                        detail="Categoria padre no encontrada",
                    )
            uow.repository.add(categoria)
            try:
                uow.session.flush()
            except IntegrityError:
                raise NombreYaExiste("categoria", datos.nombre)
            return uow.repository.get_by_id(categoria.id)

    def obtener_por_id(self, categoria_id: int) -> Categoria | None:
        with CategoriaUnitOfWork() as uow:
            return uow.repository.get_by_id(categoria_id)

    def listar(
        self,
        skip: int = 0,
        limit: int = 20,
        nombre: str | None = None,
        tipo: str | None = None,
        parent_id: int | None = None,
        sort_by: str = "nombre",
        order: str = "asc",
    ) -> tuple[list[Categoria], int]:
        with CategoriaUnitOfWork() as uow:
            return uow.repository.listar_filtrado(
                skip=skip,
                limit=limit,
                nombre=nombre,
                tipo=tipo,
                parent_id=parent_id,
                sort_by=sort_by,
                order=order,
            )

    def actualizar(
        self, categoria_id: int, datos: CategoriaUpdate
    ) -> Categoria | None:
        with CategoriaUnitOfWork() as uow:
            categoria = uow.repository.get_by_id(categoria_id)
            if categoria is None:
                return None

            datos_dict = datos.model_dump(exclude_unset=True)

            if "parent_id" in datos_dict:
                nuevo_parent = datos_dict["parent_id"]
                if nuevo_parent is not None:
                    if nuevo_parent == categoria_id:
                        raise HTTPException(
                            status_code=status.HTTP_400_BAD_REQUEST,
                            detail="Una categoria no puede ser su propio padre",
                        )
                    padre = uow.repository.get_by_id(nuevo_parent)
                    if padre is None:
                        raise HTTPException(
                            status_code=status.HTTP_404_NOT_FOUND,
                            detail="Categoria padre no encontrada",
                        )
                    if self._generaria_ciclo(
                        uow.repository, categoria_id, nuevo_parent
                    ):
                        raise CicloEnJerarquia(categoria_id)

            for campo, valor in datos_dict.items():
                setattr(categoria, campo, valor)

            categoria.updated_at = datetime.now(timezone.utc)
            uow.repository.add(categoria)
            try:
                uow.session.flush()
            except IntegrityError:
                raise NombreYaExiste(
                    "categoria", datos_dict.get("nombre", categoria.nombre)
                )
            return uow.repository.get_by_id(categoria.id)

    def eliminar(self, categoria_id: int) -> bool:
        with CategoriaUnitOfWork() as uow:
            categoria = uow.repository.get_by_id(categoria_id)
            if categoria is None:
                return False

            categoria.deleted_at = datetime.now(timezone.utc)
            categoria.updated_at = datetime.now(timezone.utc)
            uow.repository.add(categoria)
            uow.session.flush()
            return True

    def _generaria_ciclo(
        self,
        repo: CategoriaRepository,
        categoria_id: int,
        nuevo_parent_id: int,
    ) -> bool:
        visitado: set[int] = set()
        actual: int | None = nuevo_parent_id
        while actual is not None:
            if actual == categoria_id:
                return True
            if actual in visitado:
                return False
            visitado.add(actual)
            padre = repo.get_by_id(actual)
            if padre is None:
                return False
            actual = padre.parent_id
        return False
