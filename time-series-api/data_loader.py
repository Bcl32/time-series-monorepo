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

class Labeled_Time_Entry(BaseModel):
    value: float
    timestamp: datetime
    anomaly_label: bool

class Time_Entry(BaseModel):
    value: float
    timestamp: datetime

def load_csv_file(filepath,file_schema):
    df_dataset = pd.read_csv(filepath)
    df_dataset['timestamp']=pd.to_datetime(df_dataset['timestamp']) #set timestamps to datetime objects
    dict_dataset = loads(df_dataset.to_json(orient='records'))
    return [file_schema.model_validate(entry) for entry in dict_dataset]
