from pydantic import BaseModel

class bokehChartOptions(BaseModel):
    features_to_plot: list
    second_graph: bool = False
    missing_values: bool = False
    labels: bool = True
    show_anomalies: bool = True
    anomalies: list
    palette: str