import uuid
from typing import Annotated
from fastapi import APIRouter, status
from pydantic import BaseModel, ConfigDict, Field, AwareDatetime
from fastapi import APIRouter, Depends, HTTPException, status
import config as config
from json import loads
from pathlib import Path
import pandas as pd
from datetime import datetime
import json
import pickle
import logging

# Include in each module:
log = logging.getLogger(__name__)
log.debug(__file__ +" Logging Enabled")

router = APIRouter(prefix="/loader", tags=["loader"])

class Time_Entry(BaseModel):
    value: float
    timestamp: datetime

class Labeled_Time_Entry(Time_Entry):
    anomaly_label: bool

class Prediction_Entry(Time_Entry):
    anomaly_score: float

@router.post("/load_prediction_file", status_code=status.HTTP_200_OK)
def load_prediction_file(file_url: str):
    log.debug((file_url))
    entries = load_csv_file(file_url,Prediction_Entry)
    return entries

def load_csv_file(filepath,file_schema):
    df_dataset = pd.read_csv(filepath)
    df_dataset['timestamp']=pd.to_datetime(df_dataset['timestamp']) #set timestamps to datetime objects
    dict_dataset = loads(df_dataset.to_json(orient='records'))
    return [file_schema.model_validate(entry) for entry in dict_dataset]
