"""SQLAlchemy connection and transaction helpers for the existing MySQL schema."""

from collections.abc import Iterator
from contextlib import contextmanager

from sqlalchemy import Engine, create_engine, inspect, text
from sqlalchemy.engine import URL
from sqlalchemy.orm import Session, sessionmaker

from app.config import Settings


REQUIRED_TABLES = frozenset({"waste_categories", "detections", "detected_objects"})


def create_db_engine(settings: Settings) -> Engine:
    url = URL.create(
        "mysql+pymysql",
        username=settings.db_user,
        password=settings.db_password,
        host=settings.db_host,
        port=settings.db_port,
        database=settings.db_name,
        query={"charset": "utf8mb4"},
    )
    return create_engine(url, pool_pre_ping=True)


def create_session_factory(engine: Engine) -> sessionmaker[Session]:
    return sessionmaker(bind=engine, expire_on_commit=False)


@contextmanager
def session_scope(factory: sessionmaker[Session]) -> Iterator[Session]:
    session = factory()
    try:
        yield session
        session.commit()
    except Exception:
        session.rollback()
        raise
    finally:
        session.close()


def check_database_schema(engine: Engine) -> set[str]:
    """Check connectivity and expected tables without creating or changing data."""
    with engine.connect() as connection:
        connection.execute(text("SELECT 1"))

    existing = set(inspect(engine).get_table_names())
    missing = REQUIRED_TABLES - existing
    if missing:
        raise RuntimeError(f"Missing MySQL tables: {', '.join(sorted(missing))}")

    with engine.connect() as connection:
        for table in sorted(REQUIRED_TABLES):
            connection.execute(text(f"SELECT 1 FROM {table} LIMIT 1"))
    return existing
