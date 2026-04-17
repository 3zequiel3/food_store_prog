from typing import Generic, List, Optional, Type, TypeVar

from sqlmodel import Session, select

from app.core.base_model import BaseModel

E = TypeVar("E", bound=BaseModel)


class BaseRepository(Generic[E]):
    model: Type[E]

    def __init__(self, session: Session):
        self.session = session

    def add(self, entity: E):
        self.session.add(entity)

    def get_by_id(self, entity_id: int) -> Optional[E]:
        return self.session.get(self.model, entity_id)

    def list_active(self) -> List[E]:
        return list(
            self.session.exec(
                select(self.model).where(self.model.deleted_at == None)  # noqa: E711
            ).all()
        )
