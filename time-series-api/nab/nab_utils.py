import os
import json
import pandas as pd
import config as config
from pathlib import Path

LABELS_FILE=Path(config.NAB_ASSETS) / "labels" / "combined_labels.json"
with open(LABELS_FILE) as json_file:
    labels=json.load(json_file)

def get_input_filenames(rootdir):
    """
    Input a root directory containing all the dataset folders
    Output: An array that contains each input dataset structured as folder/filename Ex: 'artificialWithAnomaly/art_daily_nojump.csv'
    """
    input_datasets=[]
    for subdir, dirs, files in os.walk(rootdir):
        for file in files:
            filepath = subdir +os.sep +file
            if filepath.endswith(".csv"):
                folder=subdir.split("\\")[-1]
                folder=Path(folder).name #get last folder
                input_datasets.append(folder+"/"+file)
    return input_datasets

def add_labels_to_dataset(dataset, dataset_name):
    """Add anomaly labels to a dataset as a new column using a labels json file

        Args:
            dataset (dataframe): The pandas dataframe object to append the label data to
            dataset_name (string): Name of the dataset in folder/filename format, used as key to json labels object

        Returns:
            dataset (dataframe): The same dataframe appended with the labels information
    """
    dataset["anomaly_label"]=False # creates new column for labeled anomalies and fills with False
    ## Set Labeled Points as anomalous
    for item in labels[dataset_name]: #for each entry in the labels for this file
        dataset.at[item,"anomaly_label"]=True #set label to true


def add_anomaly_window_to_dataset(dataset, window_size):
    """Add anomaly windows to a dataset as a new column using a windows size

        Args:
            dataset (dataframe): The pandas dataframe object to append the anomaly window labels  to
            window_size (number): Length of window before and after anomaly label, Example: window size of 5 results in 10 values, 5 before and 5 after the true label

        Returns:
            dataset (dataframe): The same dataframe appended with the labels information
    """
    #indexes of the true label anomalies
    indexes=[i for i,v in enumerate(dataset["anomaly_label"]==True) if v]
    window=range(-window_size, window_size+1)
    for index in indexes:
        for entry in window:
            dataset.loc[dataset.index[index+entry],'anomaly_window']=True

def format_dataframe(dataset):
    dataset['timestamp']=pd.to_datetime(dataset['timestamp']) #set timestamps to datetime objects
    dataset=dataset.set_index("timestamp") #set index to datetime column
    return dataset