"""Migration script for Phase III schema updates."""

from sqlalchemy import text
from app.database import engine


def migrate():
    """Add Phase III columns to tasks table."""
    with engine.connect() as conn:
        # Add due_date column
        conn.execute(text("""
            ALTER TABLE tasks
            ADD COLUMN IF NOT EXISTS due_date TIMESTAMP
        """))

        # Add priority column
        conn.execute(text("""
            ALTER TABLE tasks
            ADD COLUMN IF NOT EXISTS priority VARCHAR(10)
        """))

        # Add categories column (JSON)
        conn.execute(text("""
            ALTER TABLE tasks
            ADD COLUMN IF NOT EXISTS categories JSON
        """))

        conn.commit()
        print("Migration completed: added due_date, priority, categories columns")


if __name__ == "__main__":
    migrate()
