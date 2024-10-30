import pandas as pd
import numpy as np
from datetime import datetime

from bokeh.plotting import figure, show
from bokeh.palettes import Category10, Category20, Category20b, Category20c, Accent, Dark2
from bokeh.models import ColumnDataSource, NumeralTickFormatter, HoverTool, Span, Label
from bokeh.layouts import row, column

palettes={"Category10":Category10[10],"Accent":Accent[8], "Dark2":Dark2[8]} #initiate colour object

class bokeh_line_chart:

    def __init__(self,df_cds, y_axis_label, palette,title, graph_options, labels=[], x_axis='datetime', height=400, width=1000):

        self.height=height
        self.width=width
        self.title=title
        self.y_axis_label=y_axis_label

        self.graph_options=graph_options
        self.x_axis=x_axis

        self.palette=palettes[palette]#set colour
        self.colour_index=0

        self.labels=labels

        self.select_tools = ['save','box_select', 'poly_select','help', 'tap', 'pan', 'freehand_draw','undo','redo', 'reset','zoom_in','ywheel_zoom','xwheel_zoom']

        self.p = figure(height=self.height, width=self.width,
                x_axis_label='Datetime',
                x_axis_type='datetime',
                y_axis_label=self.y_axis_label,
                title=self.title,
                toolbar_location='below',
                tools= self.select_tools)
        
        self.layout=self.p
        if isinstance(df_cds, pd.DataFrame):
            self.cds = ColumnDataSource(df_cds)

    def generate_graph(self):
        self.generate_lines()
        self.p.legend.click_policy="hide"

        if (self.graph_options["labels"]==True):
            for label in self.labels:
                self.add_label(label)

        columns=[self.p]
        self.layout=column(columns)


    def add_label(self,label):
        mytext = Label(x=pd.Timestamp(label["x"]), y=label["y"], y_units=label["y_units"], text=label["text"])
        self.p.add_layout(mytext)
        print(label["x"],label["y"],label["text"])

    def add_vline(self,date):
        vline=Span(location=date, dimension='height', line_color='red', line_width=1, line_alpha=0.2)
        self.p.renderers.extend([vline])

    def add_separate_line(self,x,y,legend):
        """Enter actual x and y values instead of column names from a column data source """
        self.p.line(x=x, y=y, legend_label=legend, color=self.palette[self.colour_index], line_width=2)
        self.colour_index=self.colour_index+1

    def add_line(self,x,y,legend):
        self.p.line(x=x, y=y, legend_label=legend, color=self.palette[self.colour_index], line_width=2, source=self.cds)
        self.colour_index=self.colour_index+1

    def generate_lines(self):
        """ Use feature to plot passed to graph to generate all the lines in the chart"""
        for i,feature in enumerate(self.graph_options["features_to_plot"]):
            self.add_line(x=self.x_axis, y=feature, legend=feature)

    def add_second_graph(self, x, y, legend_label, y_axis_label):
        print(x,y)
        self.p2 = figure(height=200, width=self.width,x_axis_label='Datetime',x_axis_type='datetime', x_range=self.p.x_range, y_axis_label=y_axis_label)
        self.p2.line(x=x, legend_label=legend_label, y=y, line_width=2, color=self.palette[self.colour_index])
        self.colour_index=self.colour_index+1
        self.p2.legend.click_policy="hide"
        columns=[self.p,self.p2]
        self.layout=column(columns)
  
    def display_graph(self):
        show(self.layout)

