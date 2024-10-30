import uuid
from datetime import datetime
from enum import Enum
from pydantic import BaseModel, ConfigDict, Field, AwareDatetime

from schemas.base import DatabaseObject
from schemas import prediction_schema, health_schema


class FileType(str,Enum):
    json= 'json'
    csv = 'csv'
    stream = 'stream'
    excel = 'excel'

class Dataset_Base(BaseModel):
    """Dataset Base model."""
    model_config = ConfigDict(from_attributes=True, use_enum_values=True)
    folder: str = Field(default="test", min_length=1, max_length=127)
    filename: str = Field(default="test", min_length=1, max_length=127)
    path: str = Field(default="test", min_length=1, max_length=127)
    labeled: bool = Field(default=False)
    file_type: FileType = Field(default="csv")
    anomaly_count: int = Field(default=0)
    tags: list[str] = Field(default=[])
    start_time: datetime = Field(default=datetime.now(),description='The earliest datetime value found in the Dataset')
    end_time: datetime = Field(default=datetime.now(), description='The latest datetime value found in the Dataset')

class Dataset_DB(Dataset_Base,DatabaseObject):
    """Dataset Database model."""
    model_config = ConfigDict(from_attributes=True)
    datafeed_id: uuid.UUID = Field(json_schema_extra={'source': 'db'})
    predictions: list[prediction_schema.Prediction_DB] = Field(json_schema_extra={'source': 'db'})

class Dataset_Child(Dataset_Base,DatabaseObject):
    """Dataset Database model."""
    model_config = ConfigDict(from_attributes=True)
    datafeed_id: uuid.UUID = Field(json_schema_extra={'source': 'db'})