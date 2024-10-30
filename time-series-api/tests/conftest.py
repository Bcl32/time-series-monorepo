import sys
sys.path.append('..')

from collections.abc import AsyncGenerator
import pytest
import pytest_asyncio
from fastapi import FastAPI
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import (
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)

from main import app
from config import database_settings
from database.db_models import Base
from database.session import get_db_session

#pytestmark = pytest.mark.asyncio #async functions fix https://quantlane.com/blog/make-sure-asyncio-tests-always-run/

@pytest_asyncio.fixture()
async def db_session() -> AsyncGenerator[AsyncSession, None]:
    """Start a test database session."""
    db_name = database_settings.DATABASE_URL.split("/")[-1]
    db_url = database_settings.DATABASE_URL.replace(f"/{db_name}", "/test")

    engine = create_async_engine(db_url)

    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)

    session = async_sessionmaker(engine)()
    yield session
    await session.close()


@pytest.fixture()
def test_app(db_session: AsyncSession) -> FastAPI:
    """Create a test app with overridden dependencies."""
    app.dependency_overrides[get_db_session] = lambda: db_session
    return app


@pytest_asyncio.fixture()
async def client(test_app: FastAPI) -> AsyncGenerator[AsyncClient, None]:
    """Create an http client."""
    async with AsyncClient(app=test_app, base_url="http://127.0.0.1:8000") as client:
        yield client