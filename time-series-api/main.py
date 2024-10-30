from enum import Enum
from fastapi import FastAPI, Query
from pydantic import BaseModel
from typing import Annotated
import logging.config
import pandas as pd
import datetime

from logging_config import LOGGING_CONFIG

# Run once at startup:
logging.config.dictConfig(LOGGING_CONFIG)

# Include in each module:
log = logging.getLogger(__name__)
log.debug("Logging is configured.")

import os
print(os.getcwd())

import sys
sys.path.append('./nab/')
sys.path.append('/app/python-modules')

import nab_routes
from timeseries import single_timeseries
from database_routes import collection, datafeed, dataset, anomaly, detector, prediction, health

app = FastAPI()
app.include_router(nab_routes.router)
app.include_router(single_timeseries.router)
app.include_router(anomaly.router)
app.include_router(collection.router)
app.include_router(datafeed.router)
app.include_router(dataset.router)
app.include_router(detector.router)
app.include_router(prediction.router)
app.include_router(health.router)

@app.get("/users/{user_id}")
async def read_user(user_id: str):
    return {"user_id": user_id}
