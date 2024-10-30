import uuid
from datetime import datetime
from enum import Enum
from pydantic import BaseModel, ConfigDict, Field, AwareDatetime

from schemas.base import DatabaseObject
from schemas import dataset_schema, health_schema

class FeedType(str,Enum):
    file= 'file'
    stream = 'stream'

class Datafeed_Base(BaseModel):
    """Datafeed Base model."""
    model_config = ConfigDict(from_attributes=True, use_enum_values=True)
    name: str = Field(default="test", min_length=1, max_length=127)
    folder: str = Field(default="test", min_length=1, max_length=127)
    filename: str = Field(default="test", min_length=1, max_length=127)
    feed_type: FeedType = Field(default="file")
    tags: list[str] = Field(default=[])
    start_time: datetime = Field(default=datetime.now(),description='The earliest datetime value found in the Datafeed')
    end_time: datetime = Field(default=datetime.now(), description='The latest datetime value found in the Datafeed')

class Datafeed_DB(Datafeed_Base,DatabaseObject):
    """Datafeed Database model."""
    model_config = ConfigDict(from_attributes=True)
    collection_id: uuid.UUID = Field(json_schema_extra={'source': 'db'})
    datasets: list[dataset_schema.Dataset_Child] = Field(json_schema_extra={'source': 'db'})
    health: health_schema.Health_DB = Field(json_schema_extra={'source': 'db'})

class Datafeed_Child(Datafeed_Base,DatabaseObject):
    """Datafeed Database model."""
    model_config = ConfigDict(from_attributes=True)
    collection_id: uuid.UUID = Field(json_schema_extra={'source': 'db'})
    health: health_schema.Health_DB = Field(json_schema_extra={'source': 'db'})