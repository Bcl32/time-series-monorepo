from fastapi import APIRouter, status
from pydantic import BaseModel, ConfigDict, Field, AwareDatetime
import config as config
from json import loads
from pathlib import Path
import pandas as pd
from datetime import datetime
import json
import pickle
import logging
from bokeh.embed import json_item
from charts import nab_chart
from charting.bokehChartOptions import bokehChartOptions 
import nab_utils

# Include in each module:
log = logging.getLogger(__name__)
log.debug(__file__ +" Logging Enabled")


router = APIRouter(
    prefix="/nab",
    tags=["nab"],
)

class NAB_Summary_Entry(BaseModel):
    folder: str
    filename: str
    earliest_date: datetime
    latest_date: datetime
    has_anomaly: bool
    anomaly_count: float

@router.get('/get_nab_summary_data')
def get_nab_summary_data() -> list[NAB_Summary_Entry]:

    filepath = Path(config.NAB_ASSETS) / "nab_summary_stats.csv"
    df_nab = pd.read_csv(filepath).to_json(orient='records')
    parsed = loads(df_nab)
    
    log.debug("ROUTE CALL: get_nab_summary_data")
    return [NAB_Summary_Entry.model_validate(entry) for entry in parsed]

@router.post('/get_nab_chart', status_code=status.HTTP_200_OK)
def get_nab_chart(
    graph_options : bokehChartOptions,
    file_url : str
    ):

    """ example file_url: /app/static/nab/predictions/labeler/artificialNoAnomaly/labeler_art_daily_small_noise.csv
    
    folder ='artificialNoAnomaly'
    filename = 'labeler_art_daily_small_noise.csv'
    orignal_filename = 'art_daily_small_noise.csv',
    labels_key = 'artificialNoAnomaly/art_daily_small_noise.csv'
    """

    folder = file_url.split("/")[-2]
    filename = file_url.split("/")[-1]
    orignal_filename=filename.split("_")[1:]
    orignal_filename='_'.join(orignal_filename)
    labels_key = folder+"/" + orignal_filename

    df_nab = pd.read_csv(file_url)

    df_nab=nab_utils.format_dataframe(df_nab)
    nab_utils.add_labels_to_dataset(df_nab,labels_key)

    graph = nab_chart(df_nab,graph_options.model_dump(),filename)
    return {"bokeh_graph":json.dumps(json_item(graph,"myplot"))}