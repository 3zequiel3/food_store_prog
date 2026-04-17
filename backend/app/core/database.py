import os
from pathlib import Path

from dotenv import load_dotenv
from sqlalchemy import create_engine, text
from sqlmodel import SQLModel, Session


BASE_DIR = Path(__file__).resolve().parents[2]
load_dotenv(BASE_DIR / ".env")

DB_USER = os.getenv("DB_USER", "root")
DB_PASSWORD = os.getenv("DB_PASSWORD", "root")
DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = os.getenv("DB_PORT", "508")
DB_NAME = os.getenv("DB_NAME", "trabajo3")
DB_ECHO = os.getenv("DB_ECHO", "false").lower() == "true"

DATABASE_URL_MASTER = f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}"
DATABASE_URL = f"{DATABASE_URL_MASTER}/{DB_NAME}"

engine = create_engine(DATABASE_URL, echo=DB_ECHO)


def create_db_and_tables():
    """Crea la base de datos y las tablas del proyecto."""
    from app.modules.categoria.models import Categoria  # noqa: F401
    from app.modules.ingrediente.models import Ingrediente  # noqa: F401
    from app.modules.ingrediente.link import IngredienteProductoLink  # noqa: F401
    from app.modules.producto.link import ProductoCategoriaLink  # noqa: F401
    from app.modules.producto.models import Producto  # noqa: F401

    engine_master = create_engine(DATABASE_URL_MASTER, echo=False)

    with engine_master.connect() as conn:
        conn.execute(text(f"CREATE DATABASE IF NOT EXISTS {DB_NAME}"))
        conn.commit()

    engine_master.dispose()
    SQLModel.metadata.create_all(engine)


def get_session():
    with Session(engine) as session:
        yield session