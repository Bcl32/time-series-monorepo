import uuid
from datetime import datetime
from enum import Enum
from pydantic import BaseModel, ConfigDict, Field, AwareDatetime

from schemas.base import DatabaseObject
from schemas import datafeed_schema

class Collection_Base(BaseModel):
    """Collection Base model."""
    model_config = ConfigDict(from_attributes=True, use_enum_values=True)
    name: str = Field()
    description: str = Field()
    tags: list[str] = Field(default=[])

class Collection_DB(Collection_Base,DatabaseObject):
    """Datafeed model."""
    model_config = ConfigDict(from_attributes=True)
    datafeeds: list[datafeed_schema.Datafeed_DB] 

class Collection_Display(Collection_Base,DatabaseObject):
    """Datafeed model."""
    model_config = ConfigDict(from_attributes=True)
    datafeeds: list[datafeed_schema.Datafeed_Child] 

