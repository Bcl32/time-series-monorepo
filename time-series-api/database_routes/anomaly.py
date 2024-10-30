import uuid
from typing import Annotated

from fastapi import APIRouter, Body, Depends, HTTPException, status

from schemas import anomaly_schema

import logging
# Include in each module:
log = logging.getLogger(__name__)
log.debug("Logging is configured.")

from database import db_models
from my_db.dependencies import get_repository
from my_db.repository import DatabaseRepository

router = APIRouter(prefix="/anomaly", tags=["anomaly"])

ModelRepository = Annotated[
    DatabaseRepository[db_models.Anomaly],
    Depends(get_repository(db_models.Anomaly)),
]
FirstParentRepository = Annotated[
    DatabaseRepository[db_models.Prediction],
    Depends(get_repository(db_models.Prediction)),
]
SecondParentRepository = Annotated[
    DatabaseRepository[db_models.Detector],
    Depends(get_repository(db_models.Detector)),
]


MODEL_NAME="anomaly"

MODEL=anomaly_schema.Anomaly_DB
PAYLOAD_MODEL=anomaly_schema.Anomaly_Base

FIRST_PARENT_NAME="prediction"
SECOND_PARENT_NAME="detector"

# CREATE WITH TWO PARENTS
@router.post("/create", status_code=status.HTTP_201_CREATED)
async def create(
    payload: Annotated[PAYLOAD_MODEL, Body(embed=True)],
    repository: ModelRepository,
    first_parent_repository: FirstParentRepository,
    second_parent_repository: SecondParentRepository,
) -> MODEL:
    
    payload_dict = payload.model_dump()
    print(payload_dict[FIRST_PARENT_NAME+"_id"])
    first_parent_obj= await first_parent_repository.get(payload_dict[FIRST_PARENT_NAME+"_id"])
    second_parent_obj= await second_parent_repository.get(payload_dict[SECOND_PARENT_NAME+"_id"])
    if first_parent_obj is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Provided ID for "+FIRST_PARENT_NAME+" does not exist",
        )
    if second_parent_obj is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Provided ID for "+SECOND_PARENT_NAME+" does not exist",
        )

    db_object = await repository.create({**payload_dict, FIRST_PARENT_NAME: first_parent_obj, SECOND_PARENT_NAME: second_parent_obj})
    return MODEL.model_validate(db_object)

# CREATE MANY WITH TWO PARENTS
@router.post("/create_many/{prediction_id}", status_code=status.HTTP_201_CREATED)
async def create_many(
prediction_id: uuid.UUID,
    data: list[PAYLOAD_MODEL],
    repository: ModelRepository,
    first_parent_repository: FirstParentRepository,
    second_parent_repository: SecondParentRepository,
    return_models: bool = True,
) -> list[MODEL] | bool:
    data_dicts=[d.model_dump() for d in data]

    first_parent_obj= await first_parent_repository.get(prediction_id)
    second_parent_obj= await second_parent_repository.get(data_dicts[0]["detector_id"])
    if first_parent_obj is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Provided ID for "+FIRST_PARENT_NAME+" does not exist",
        )
    if second_parent_obj is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Provided ID for "+SECOND_PARENT_NAME+" does not exist",
        )
    
    for entry in data_dicts:#add datafeed to each dataset object
        entry[FIRST_PARENT_NAME]=first_parent_obj
        entry[SECOND_PARENT_NAME]=second_parent_obj
 
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