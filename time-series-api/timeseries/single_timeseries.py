from pathlib import Path
import datetime

from fastapi import APIRouter, Query
from pydantic import BaseModel
from typing import Annotated
import pandas as pd

router = APIRouter(
    prefix="/model",
    tags=["models"],
)

class Single_TimeSeries_Input(BaseModel):
    key: str
    dt: datetime.datetime
    value: float

@router.post("/detect/timeseries/single")
def post_time_series_single(
    input_data: list[Single_TimeSeries_Input],
    #sensitivity_score: float = 50,
    sensitivity_score: Annotated[float, Query(ge=0, le=100)] = 50,
    #max_fraction_anomalies: float = 1.0,
    max_fraction_anomalies: Annotated[float, Query(ge=0, le=1)] = 1.0,
    debug: bool = False
):
    df = pd.DataFrame(i.__dict__ for i in input_data)
    
    (df, weights, details) = single_timeseries.detect_single_timeseries(df, sensitivity_score, max_fraction_anomalies)
    
    results = { "anomalies": json.loads(df.to_json(orient='records', date_format='iso')) }
    
    if (debug):
        results.update({ "debug_weights": weights })
        results.update({ "debug_details": details })
    return results