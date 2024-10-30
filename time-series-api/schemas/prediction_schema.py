import uuid
from datetime import datetime
from enum import Enum
from pydantic import BaseModel, ConfigDict, Field, AwareDatetime

from schemas.base import DatabaseObject

from schemas import anomaly_schema
      
class Prediction_Base(BaseModel):
    """Prediction payload model."""
    model_config = ConfigDict(from_attributes=True,use_enum_values=True)
    
    dataset_id: uuid.UUID = Field(json_schema_extra={'source': 'db'})
    dataset_name: str = Field(json_schema_extra={'source': 'db'})
    detector_id: uuid.UUID = Field(json_schema_extra={'source': 'db'})
    detector_name: str = Field(json_schema_extra={'source': 'db'})
    url:str

class Prediction_DB(Prediction_Base, DatabaseObject):
    """Prediction model."""
    model_config = ConfigDict(from_attributes=True)
    anomalies: list[anomaly_schema.Anomaly_DB]