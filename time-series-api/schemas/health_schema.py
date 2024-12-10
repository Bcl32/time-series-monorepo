import uuid
from datetime import datetime
from enum import Enum
from pydantic import BaseModel, ConfigDict, Field, AwareDatetime

from schemas.base import DatabaseObject

class Status(str, Enum):
    active = 'active'
    inactive = 'inactive'

class Health_Base(BaseModel):
    """Health model."""
    model_config = ConfigDict(from_attributes=True,use_enum_values=True)
    last_received: datetime = Field(default=datetime.now(),description='The datetime a hearbeat was last received', json_schema_extra={'data_type': 'datetime'})
    heartbeat_frequency: int = Field(default=3600,description='How frequently the hearbeats are expected in number of seconds', json_schema_extra={'data_type': 'number'})
    heartbeat_timeout: int = Field(default=3,description='The number of heartbeats that can be missed before an alert is generated', json_schema_extra={'data_type': 'number'})
    score: int = Field(default=100, ge=0, le=100, description='A score representing the overall health of the object', json_schema_extra={'data_type': 'number'})
    status: Status = Field(default='inactive',  json_schema_extra={'data_type': 'select'})

class Health_DB(Health_Base,DatabaseObject):
    """Health database model."""
    model_config = ConfigDict(from_attributes=True)
    datafeed_id: uuid.UUID = Field(json_schema_extra={'data_type': 'id'})
    #dataset_name: str = Field(min_length=1, max_length=127, json_schema_extra={'data_type': 'text'})
  
   