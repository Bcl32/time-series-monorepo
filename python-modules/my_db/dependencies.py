from collections.abc import Callable

from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from database import db_models
from my_db import repository, session

def get_repository(
    model: type[db_models.Base],
) -> Callable[[AsyncSession], repository.DatabaseRepository]:
    def func(session: AsyncSession = Depends(session.get_db_session)):
        return repository.DatabaseRepository(model, session)

    return func