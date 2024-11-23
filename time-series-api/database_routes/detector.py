import uuid
from typing import Annotated

from fastapi import APIRouter, Body, Depends, HTTPException, status

from schemas import detector_schema

import logging
# Include in each module:
log = logging.getLogger(__name__)
log.debug("Logging is configured.")

from database import db_models
from my_db.dependencies import get_repository
from my_db.repository import DatabaseRepository
from database.build_object_heirarchy import build_object_heirarchy

router = APIRouter(prefix="/detector", tags=["detector"])

ModelRepository = Annotated[
    DatabaseRepository[db_models.Detector],
    Depends(get_repository(db_models.Detector)),
]
MODEL_NAME="detector"
MODEL=detector_schema.Detector_DB
PAYLOAD_MODEL=detector_schema.Detector_Base

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
    data: list[MODEL],
    repository: ModelRepository,
    return_models: bool = False,
) -> list[MODEL] | bool:
    data_dicts=[d.model_dump() for d in data]
    db_objects = await repository.create_many(data_dicts,return_models=return_models)
    
    if db_objects==True:
        return db_objects
    else:
        return [MODEL.model_validate(item) for item in db_objects]

# GET ALL
@router.get("/get_all", status_code=status.HTTP_200_OK)
async def get_all(repository: ModelRepository) -> list[MODEL]:
    db_objects = await repository.filter()
    return [MODEL.model_validate(item) for item in db_objects]

# GET BY COLUMN
@router.post("/get_by_column", status_code=status.HTTP_200_OK)
async def get_by_column(repository: ModelRepository, column: str, value: list[str] | list[int] | list[uuid.UUID]) -> list[MODEL]:
    db_objects = await repository.get_by_column(column=column,value=value)
    return [MODEL.model_validate(item) for item in db_objects]

# GET BY ID
@router.get("/get_by_id/{id}", status_code=status.HTTP_200_OK)
async def get_by_id(id: uuid.UUID, repository: ModelRepository):
    db_object = await repository.get(id)
    if db_object is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=MODEL_NAME+" does not exist",
        )

    obj_heirarchy=build_object_heirarchy(db_object=db_object, base_object=PAYLOAD_MODEL.model_validate(db_object), inheritance_chain=[])
    metadata=MODEL.model_validate(db_object)
    response ={"metadata":metadata, "obj_heirarchy":obj_heirarchy}
    return response

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