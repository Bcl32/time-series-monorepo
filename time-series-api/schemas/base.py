import uuid
from datetime import datetime
from enum import Enum
from pydantic import BaseModel, ConfigDict, Field, AwareDatetime

class DatabaseObject(BaseModel):
    id: uuid.UUID = Field(json_schema_extra={'source': 'db'})
    time_created: datetime = Field(json_schema_extra={'source': 'db'})
    time_updated: datetime = Field(json_schema_extra={'source': 'db'})