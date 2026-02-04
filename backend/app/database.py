"""Database connection and session management."""

from sqlmodel import SQLModel, create_engine, Session
from app.config import settings

engine = create_engine(settings.DATABASE_URL, echo=True)


def create_db_and_tables():
    """Create all database tables."""
    SQLModel.metadata.create_all(engine)


def get_session():
    """Dependency to get database session."""
    with Session(engine) as session:
        yield session
