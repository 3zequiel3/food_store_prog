from typing import Generic, List, TypeVar

from sqlmodel import SQLModel


T = TypeVar("T")


class Page(SQLModel, Generic[T]):
    items: List[T]
    total: int
    skip: int
    limit: int
    has_next: bool
