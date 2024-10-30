from fastapi import HTTPException, status
import uuid
from typing import Generic, TypeVar

from sqlalchemy import BinaryExpression, select, delete
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import SQLAlchemyError, DBAPIError

import logging
# Include in each module:
log = logging.getLogger(__name__)
log.debug("Logging is configured.")

import database.db_models as models

Model = TypeVar("Model", bound=models.Base)


class DatabaseRepository(Generic[Model]):
    """Repository for performing database queries."""

    def __init__(self, model: type[Model], session: AsyncSession) -> None:
        self.model = model
        self.session = session

    async def create(self, data: dict) -> Model:
        instance = self.model(**data)
        self.session.add(instance)
        await self.session.commit()
        await self.session.refresh(instance)
        return instance
    
    async def create_children(self, data: dict, children: None) -> Model:
        instance = self.model(**data)
        if (children):
            for child in children:

                child_model=child["model"]
                data=child["data"]
                attr_name=child["attr_name"]

                if isinstance(data, list):
                    for list_item in data:
                        obj=child_model(**list_item)
                        getattr(instance, attr_name).append(obj) #add child to parent list
                else:
                    obj=child_model(**data)
                    setattr(instance,attr_name,obj) #add child to parent
        
        self.session.add(instance)
        await self.session.commit()
        await self.session.refresh(instance)
        return instance

    async def create_many(self, data: list[dict], return_models: bool = False) -> list[Model]:
        instances = [self.model(**d) for d in data]
        self.session.add_all(instances)
        await self.session.commit()

        if not return_models:
            return True

        for obj in instances:
            await self.session.refresh(obj)

        return instances

    async def get(self, id: uuid.UUID) -> Model | None:
        return await self.session.get(self.model, id)

    async def get_by_column(self,  column: str, value: list[str] | list[int] | list[uuid.UUID],) -> Model | None:
        if (len(value)==1):
            query = select(self.model).where(getattr(self.model, column) == value[0])
        if (len(value)>1):
            query = select(self.model).where(getattr(self.model, column).in_(value))
        rows = await self.session.execute(query)
        return rows.unique().scalars().all()

    
    async def filter(
        self,
        *expressions: BinaryExpression,
    ) -> list[Model]:
        query = select(self.model)

        if expressions:
            query = query.where(*expressions)
        return list(await self.session.scalars(query))
    

    async def delete(self, value: list[str] | list[int] | list[uuid.UUID], column: str = "id",) -> int:
        if (len(value)==0):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Must provide at least one value"
            )
        if (len(value)==1):
            query = delete(self.model).where(getattr(self.model, column) == value[0])
        if (len(value)>1):
            query = delete(self.model).where(getattr(self.model, column).in_(value))
        try:
            rows = await self.session.execute(query)
        except (SQLAlchemyError, DBAPIError) as exc:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=str(exc.__dict__['orig'])
            )
        
        await self.session.commit()
        return rows.rowcount
    
    async def update(self, id: uuid.UUID, data: dict) -> Model:
        """

        Args:
            id (uuid.UUID): object ID of the sqlalchemy object
            data (dict): one or more key value pairs to update

        Returns:
            Model: the sqlalchemy object that was updated
        """
        db_model = await self.session.get(self.model, id)

        if db_model is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=self.model.__name__+" does not exist",
            )

        for key, value in data.items():
            setattr(db_model, key, value)
            self.session.add(db_model)

        await self.session.commit()
        await self.session.refresh(db_model)
        return db_model