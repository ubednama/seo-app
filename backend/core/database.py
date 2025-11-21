from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker, DeclarativeBase
from core.config import settings

# Use async engine for database connections
engine = create_async_engine(settings.DATABASE_URL, echo=settings.DEBUG)

# Use AsyncSession for database sessions
AsyncSessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
    class_=AsyncSession
)

# Modern, class-based style for SQLAlchemy Base
class Base(DeclarativeBase):
    pass

# Async dependency to get a database session
async def get_db():
    """
    Dependency that provides an async database session.
    """
    async with AsyncSessionLocal() as session:
        yield session