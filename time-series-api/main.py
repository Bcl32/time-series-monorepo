from enum import Enum
from fastapi import FastAPI, Query, Security
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Annotated
import logging.config
import pandas as pd
import datetime
from config import Authentication
from auth import azure_scheme
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
import data_loader
from timeseries import single_timeseries
from database_routes import collection, datafeed, dataset, anomaly, detector, prediction, health

auth_settings=Authentication()

app = FastAPI(
    swagger_ui_oauth2_redirect_url='/oauth2-redirect',
    swagger_ui_init_oauth={
        'usePkceWithAuthorizationCodeGrant': True,
        'clientId': auth_settings.FRONT_END_CLIENT_ID,
        'scopes':auth_settings.SCOPE_NAME,
    },
)

app.add_middleware(CORSMiddleware,
    allow_origins=["http//localhost:3200"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"])

app.include_router(nab_routes.router)
app.include_router(data_loader.router)
app.include_router(single_timeseries.router)
app.include_router(anomaly.router)
app.include_router(collection.router)
app.include_router(datafeed.router)
app.include_router(dataset.router)
app.include_router(detector.router)
app.include_router(prediction.router)
app.include_router(health.router)

@app.get("/users/{user_id}",dependencies=[Security(azure_scheme)])
async def read_user(user_id: str):
    return {"user_id": user_id}
