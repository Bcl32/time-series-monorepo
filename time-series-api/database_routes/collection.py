import uuid
from typing import Annotated

from fastapi import APIRouter, Body, Depends, HTTPException, status

from schemas import collection_schema

import logging
# Include in each module:
log = logging.getLogger(__name__)
log.debug("Logging is configured.")

from database import db_models
from my_db.dependencies import get_repository
from my_db.repository import DatabaseRepository

router = APIRouter(prefix="/collection", tags=["collection"])

ModelRepository = Annotated[
    DatabaseRepository[db_models.Collection],
    Depends(get_repository(db_models.Collection)),
]
MODEL_NAME="collection"
MODEL=collection_schema.Collection_DB
DISPLAY_MODEL = collection_schema.Collection_Display
PAYLOAD_MODEL=collection_schema.Collection_Base

# CREATE
@router.post("/create", status_code=status.HTTP_201_CREATED)
async def create(
    payload: Annotated[PAYLOAD_MODEL, Body(embed=True)],
    repository: ModelRepository,
) -> MODEL:
    db_object = await repository.create(payload.model_dump())
    return MODEL.model_validate(db_object)

# CREATE MANY
@router.post("/create_many", status_code=status.HTTP_201_CREATED)
async def create_many(
    data: list[PAYLOAD_MODEL],
    repository: ModelRepository,
    return_models: bool = True,
) -> list[MODEL] | bool:
    data_dicts=[d.model_dump() for d in data]
    db_objects = await repository.create_many(data_dicts,return_models=return_models)
    
    if db_objects==True:
        return db_objects
    else:
        return [MODEL.model_validate(item) for item in db_objects]

# GET ALL
@router.get("/get_all", status_code=status.HTTP_200_OK)
async def get_all(repository: ModelRepository) -> list[DISPLAY_MODEL]:
    db_objects = await repository.filter()
    return [DISPLAY_MODEL.model_validate(item) for item in db_objects]

# GET BY COLUMN
@router.post("/get_by_column", status_code=status.HTTP_200_OK)
async def get_by_column(repository: ModelRepository, column: str, value: list[str] | list[int] | list[uuid.UUID]) -> list[MODEL]:
    db_objects = await repository.get_by_column(column=column,value=value)
    return [MODEL.model_validate(item) for item in db_objects]

# GET BY ID
@router.get("/get_by_id/{id}", status_code=status.HTTP_200_OK)
async def get_by_id(id: uuid.UUID, repository: ModelRepository)-> MODEL:
    db_object = await repository.get(id)
    if db_object is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=MODEL_NAME+" does not exist",
        )
    return MODEL.model_validate(db_object)

# UPDATE
@router.post("/update", status_code=status.HTTP_200_OK)
async def update(
    repository: ModelRepository,
    data: PAYLOAD_MODEL,
     id: uuid.UUID,
) -> MODEL:
    db_object = await repository.update(id=id,data=data.model_dump())
    return db_object

# DELETE
@router.post("/delete", status_code=status.HTTP_200_OK)
async def delete(
    repository: ModelRepository,
    value: list[str] | list[int] | list[uuid.UUID],
    column: str = "id",
) -> int:
    rows = await repository.delete(column=column,value=value)
    return rows