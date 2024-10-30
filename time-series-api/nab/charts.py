from fastapi import APIRouter, Depends, Body, status
from pydantic import BaseModel

from typing import Annotated
from bokeh.embed import json_item
from datetime import datetime
from charting.chart_builder import bokeh_line_chart
from bokeh.models import HoverTool, Span

def nab_chart(df, graph_options, title):

    myLineChart= bokeh_line_chart(df,
                                  palette=graph_options["palette"],
                                  title=title,
                                  y_axis_label='Value',
                                  x_axis='timestamp',
                                  graph_options=graph_options,
                                  height=400, width=1200)


    tooltips= [('Date', '@timestamp{%F}'),('Value', '@value')]
    myLineChart.__dict__["p"].add_tools(HoverTool(tooltips=tooltips,formatters={'@timestamp': 'datetime'}))


    if graph_options["labels"]:
        anomaly_times=df.loc[df["anomaly_label"]==True].index #get anomalies
        for anomaly in anomaly_times:
            vline = Span(location=anomaly, dimension='height', line_color='blue', line_dash='dashed', line_width=3, line_alpha=0.8)
            myLineChart.__dict__["p"].renderers.extend([vline])

    if graph_options["show_anomalies"]:
        for anomaly in graph_options["anomalies"]:
            anomaly=datetime.strptime(anomaly["time"], '%Y-%m-%dT%H:%M:%SZ')#convert anomlay strings to datetime objects
            vline = Span(location=anomaly, dimension='height', line_color='red', line_dash='dashed', line_width=3, line_alpha=0.8)
            myLineChart.__dict__["p"].renderers.extend([vline])


    myLineChart.generate_graph()

    if graph_options["second_graph"]:
        myLineChart.add_second_graph(x=df.index,
                                    y=df["anomaly_score"],
                                    legend_label='Anomaly Score', y_axis_label='Anomaly Score')
        
    return myLineChart.__dict__["layout"]