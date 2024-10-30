import uuid
from typing import Annotated

from fastapi import APIRouter, Body, Depends, HTTPException, status

from schemas import datafeed_schema, health_schema, dataset_schema

import logging
# Include in each module:
log = logging.getLogger(__name__)
log.debug("Logging is configured.")

from database import db_models
from my_db.dependencies import get_repository
from my_db.repository import DatabaseRepository

router = APIRouter(prefix="/datafeed", tags=["datafeed"])

ModelRepository = Annotated[
    DatabaseRepository[db_models.Datafeed],
    Depends(get_repository(db_models.Datafeed)),
]
ParentRepository = Annotated[
    DatabaseRepository[db_models.Collection],
    Depends(get_repository(db_models.Collection)),
]

MODEL_NAME="datafeed"
PARENT_NAME="collection"
MODEL=datafeed_schema.Datafeed_DB
PAYLOAD_MODEL=datafeed_schema.Datafeed_Base
HEALTH_PAYLOAD = health_schema.Health_Base
DATASET_PAYLOAD = dataset_schema.Dataset_Base

# CREATE
@router.post("/create/{parent_id}", status_code=status.HTTP_201_CREATED)
async def create(
    repository: ModelRepository,
    parent_repository: ParentRepository,
    parent_id: uuid.UUID,
    payload: Annotated[PAYLOAD_MODEL, Body(embed=True)],
    health: HEALTH_PAYLOAD = HEALTH_PAYLOAD(),
    datasets: list[DATASET_PAYLOAD] = [],
) -> MODEL:
    
    payload_dict = payload.model_dump()

    parent_obj= await parent_repository.get(parent_id)
    if parent_obj is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Provided ID for "+PARENT_NAME+" does not exist",
        )
    children=[{"model":db_models.Health, "attr_name":"health", "data": health.model_dump()}]

    if (len(datasets)!=0):
        dataset_dicts = [d.model_dump() for d in datasets]
        children.append({"model":db_models.Dataset, "attr_name":"datasets", "data":dataset_dicts})
    
    db_object = await repository.create_children(data={**payload_dict, PARENT_NAME: parent_obj},children=children)
    
    return MODEL.model_validate(db_object)


# CREATE MANY
@router.post("/create_many/{parent_id}", status_code=status.HTTP_201_CREATED)
async def create_many(
    parent_id: uuid.UUID,
    data: list[PAYLOAD_MODEL],
    repository: ModelRepository,
    parent_repository: ParentRepository,
    return_models: bool = True,
) -> list[MODEL] | bool:
    data_dicts=[d.model_dump() for d in data]
    
    parent_obj= await parent_repository.get(parent_id)
    if parent_obj is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Provided ID for "+PARENT_NAME+" does not exist",
        )
    
    for entry in data_dicts:#add collection to each datafeed object
        entry[PARENT_NAME]=parent_obj
 
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
    
    breadcrumb=build_breadcrumb(db_object)
    dataset_metadata=MODEL.model_validate(db_object)
  
    response ={"metadata":dataset_metadata, "breadcrumb":breadcrumb}
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

def build_breadcrumb(datafeed):
    datafeed_obj=datafeed_schema.Datafeed_Base.model_validate(datafeed)
    collection=datafeed.collection
    breadcrumb=[]
    breadcrumb.append({ "type": "Collection", "object": collection, "id": collection.id, "name": collection.name })
    breadcrumb.append({ "type": "Datafeed", "object": datafeed_obj, "id": datafeed.id, "name": datafeed.name })
    return breadcrumb