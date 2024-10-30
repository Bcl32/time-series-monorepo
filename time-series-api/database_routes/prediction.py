import uuid
from typing import Annotated

from fastapi import APIRouter, Body, Depends, HTTPException, status
from pathlib import Path
import config as config
from pydantic import BaseModel
from datetime import datetime
import logging
# Include in each module:
log = logging.getLogger(__name__)
log.debug("Logging is configured.")

from data_loader import load_csv_file
from database import db_models
from my_db.dependencies import get_repository
from my_db.repository import DatabaseRepository

from schemas import prediction_schema, anomaly_schema

router = APIRouter(prefix="/prediction", tags=["prediction"])

ModelRepository = Annotated[
    DatabaseRepository[db_models.Prediction],
    Depends(get_repository(db_models.Prediction)),
]
FirstParentRepository = Annotated[
    DatabaseRepository[db_models.Dataset],
    Depends(get_repository(db_models.Dataset)),
]
SecondParentRepository = Annotated[
    DatabaseRepository[db_models.Detector],
    Depends(get_repository(db_models.Detector)),
]

FIRST_PARENT_NAME="dataset"
SECOND_PARENT_NAME="detector"

MODEL_NAME="prediction"

MODEL=prediction_schema.Prediction_DB
PAYLOAD_MODEL=prediction_schema.Prediction_Base

ANOMALY_MODEL = anomaly_schema.Anomaly_Base

class Prediction_Entry(BaseModel):
    value: float
    timestamp: datetime
    anomaly_score: float

# CREATE WITH TWO PARENTS
@router.post("/create", status_code=status.HTTP_201_CREATED)
async def create(
    payload: PAYLOAD_MODEL,
    repository: ModelRepository,
    first_parent_repository: FirstParentRepository,
    second_parent_repository: SecondParentRepository,
    anomalies: list[ANOMALY_MODEL]  = [],
) -> MODEL:
    
    payload_dict = payload.model_dump()
   
    first_parent_obj= await first_parent_repository.get(payload_dict[FIRST_PARENT_NAME+"_id"])
    second_parent_obj= await second_parent_repository.get(payload_dict[SECOND_PARENT_NAME+"_id"])
    if first_parent_obj is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Provided ID for "+FIRST_PARENT_NAME+" does not exist",
        )
    if second_parent_obj is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Provided ID for "+SECOND_PARENT_NAME+" does not exist",
        )

    children=[]
    if (len(anomalies)!=0):
        anomaly_dicts = [d.model_dump() for d in anomalies]
        children.append({"model":db_models.Anomaly, "attr_name":"anomalies", "data":anomaly_dicts})

    db_object = await repository.create_children(data={**payload_dict, FIRST_PARENT_NAME: first_parent_obj, SECOND_PARENT_NAME: second_parent_obj}, children=children)
    return MODEL.model_validate(db_object)

# CREATE MANY WITH TWO PARENTS - CHECK EACH PARENT FOR UNIQUE VALUES
@router.post("/create_many", status_code=status.HTTP_201_CREATED)
async def create_many(
    data: list[PAYLOAD_MODEL],
    repository: ModelRepository,
    first_parent_repository: FirstParentRepository,
    second_parent_repository: SecondParentRepository,
    return_models: bool = True,
) -> list[MODEL] | bool:
    data_dicts=[d.model_dump() for d in data]
    
    for entry in data_dicts:#add parents to each object
        first_parent_obj= await first_parent_repository.get(entry[FIRST_PARENT_NAME+"_id"])
        second_parent_obj= await second_parent_repository.get(entry[SECOND_PARENT_NAME+"_id"])
        if first_parent_obj is None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Provided ID for "+FIRST_PARENT_NAME+" does not exist",
            )
        if second_parent_obj is None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Provided ID for "+SECOND_PARENT_NAME+" does not exist",
            )

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

# LOAD DATASET
# GET BY ID
@router.get("/load_prediction_file/{id}", status_code=status.HTTP_200_OK)
async def load_prediction_file(
    id: uuid.UUID,
     repository: ModelRepository,
):
    prediction_obj = await repository.get(id)
    if prediction_obj is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=MODEL_NAME+" does not exist",
        )

    folder = prediction_obj.dataset.folder
    filename = prediction_obj.dataset.filename
    dataset_filepath= Path(config.NAB_ASSETS / "predictions" / prediction_obj.detector_name) / folder / Path(prediction_obj.detector_name+"_"+filename)
    log.debug((dataset_filepath))
    entries = load_csv_file(dataset_filepath,Prediction_Entry)

    prediction_model=MODEL.model_validate(prediction_obj)

    breadcrumb=build_breadcrumb(prediction_obj,prediction_model)
  
    response ={"metadata":prediction_model, "entries":entries, "breadcrumb":breadcrumb}
    return response

def build_breadcrumb(prediction,model):
    #uses raw prediction_obj for the parent data and the validated model for the prediction data, can't use prediction object as it causes an infinite loop
    dataset=prediction.dataset
    datafeed=dataset.datafeed
    collection=datafeed.collection
    breadcrumb=[]
    breadcrumb.append({ "type": "Collection", "object": collection, "id": collection.id, "name": collection.name })
    breadcrumb.append({ "type": "Datafeed", "object": datafeed, "id": datafeed.id, "name": datafeed.name })
    breadcrumb.append({ "type": "Dataset", "object": dataset, "id": dataset.id, "name": dataset.filename })
    breadcrumb.append({ "type": "Prediction", "object": model, "id": prediction.id, "name": prediction.detector_name })
    return breadcrumb
