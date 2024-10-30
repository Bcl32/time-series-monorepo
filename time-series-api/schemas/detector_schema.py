import uuid
from datetime import datetime
from enum import Enum
from pydantic import BaseModel, ConfigDict, Field, AwareDatetime

from schemas.base import DatabaseObject

from schemas import anomaly_schema
from schemas import prediction_schema


class Detector_Base(BaseModel):
    """Detector payload model."""
    model_config = ConfigDict(use_enum_values=True)

    name: str
    description: str
    source: str = Field(default="")
    documentation: str = Field(default="")
    tags: list[str] = Field(default=[])

class Detector_DB(Detector_Base, DatabaseObject):
    """Detector model."""
    model_config = ConfigDict(from_attributes=True)
    anomalies: list[anomaly_schema.Anomaly_DB]
    predictions: list[prediction_schema.Prediction_DB]

