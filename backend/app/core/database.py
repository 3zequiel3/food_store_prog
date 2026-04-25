import os
from pathlib import Path

from dotenv import load_dotenv
from sqlalchemy import create_engine, text
from sqlmodel import SQLModel, Session


BASE_DIR = Path(__file__).resolve().parents[2]
load_dotenv(BASE_DIR / ".env")

DB_USER = os.getenv("DB_USER", "ezequiel")
DB_PASSWORD = os.getenv("DB_PASSWORD", "ezequiel")
DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = os.getenv("DB_PORT", "510")
DB_NAME = os.getenv("DB_NAME", "food_store")
DB_ECHO = os.getenv("DB_ECHO", "false").lower() == "true"

DATABASE_URL_MASTER = f"postgresql+psycopg://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}"
DATABASE_URL = f"{DATABASE_URL_MASTER}/{DB_NAME}"

engine = create_engine(DATABASE_URL, echo=DB_ECHO)


def create_db_and_tables():
    """Crea la base de datos (si no existe) y las tablas del proyecto."""
    from app.modules.categoria.models import Categoria  # noqa: F401
    from app.modules.ingrediente.models import Ingrediente  # noqa: F401
    from app.modules.ingrediente.link import IngredienteProductoLink  # noqa: F401
    from app.modules.producto.link import ProductoCategoriaLink  # noqa: F401
    from app.modules.producto.models import Producto  # noqa: F401

    # Postgres necesita conectarse a una DB existente ("postgres" es la admin
    # por default) y ejecutar CREATE DATABASE fuera de transaccion (AUTOCOMMIT).
    engine_master = create_engine(
        f"{DATABASE_URL_MASTER}/postgres",
        echo=False,
        isolation_level="AUTOCOMMIT",
    )

    with engine_master.connect() as conn:
        exists = conn.execute(
            text("SELECT 1 FROM pg_database WHERE datname = :name"),
            {"name": DB_NAME},
        ).scalar()
        if not exists:
            conn.execute(text(f'CREATE DATABASE "{DB_NAME}"'))

    engine_master.dispose()
    SQLModel.metadata.create_all(engine)


def get_session():
    with Session(engine) as session:
        yield session