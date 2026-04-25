from datetime import datetime, timezone
from typing import Optional

from sqlalchemy import BigInteger
from sqlmodel import Field, SQLModel


class BaseModel(SQLModel):
    id: Optional[int] = Field(
        default=None,
        primary_key=True,
        sa_type=BigInteger,
    )
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    deleted_at: Optional[datetime] = None
