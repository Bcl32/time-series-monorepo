import uuid
from datetime import datetime
from enum import Enum
from pydantic import BaseModel, ConfigDict, Field, AwareDatetime

from schemas.base import DatabaseObject

class Severity(str, Enum):
    low = 'low'
    medium = 'medium'
    high = 'high'


class Anomaly_Base(BaseModel):
    """Anomaly model."""
    model_config = ConfigDict(use_enum_values=True, from_attributes=True)
    
    value: float = Field(default=0)
    time: datetime = Field(default=datetime.now(),description='The datetime of the record labeled anomalous',json_schema_extra={'stats': True})
    anomaly_score: float = Field(default=0)
    threshold: float = Field(default=0)
    status: str = Field(default="test", min_length=1, max_length=127)
    severity: Severity = Field(default="medium")
    tags: list[str] = Field(default=[])

    detector_id: uuid.UUID = Field(json_schema_extra={'source': 'db'})
    detector_name: str = Field(json_schema_extra={'source': 'db'})
    dataset_name: str = Field(json_schema_extra={'source': 'db'})


class Anomaly_DB(Anomaly_Base,DatabaseObject):
    """Anomaly database model."""
    model_config = ConfigDict(from_attributes=True)
    prediction_id: uuid.UUID = Field(json_schema_extra={'source': 'db'})

