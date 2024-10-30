import React from "react";

// mui
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

//MONOREPO PACKAGE IMPORTS
import { useBokehChart } from "@repo/hooks/useBokehChart";

//other modules
import { embed } from "@bokeh/bokehjs";

export function BokehLineChart(props) {
  let metadata = props.metadata;
  const [graphOptions, setGraphOptions] = React.useState({
    palette: "Dark2",
    features_to_plot: props.features_to_plot,
    missing_values: false,
    labels: true,
    show_anomalies: true,
    anomalies: metadata.anomalies,
    second_graph: false,
  });

  const graphData = useBokehChart(
    props.url,
    metadata.url,
    graphOptions,
    props.lazy_load_enabled,
    props.lazy_load_value
  );

  function update_bokeh_graph(bokeh_obj) {
    if (document.getElementById("myplot")) {
      document.getElementById("myplot").remove(); //remove div that contains the old graph
      var g = document //make new div to store the new graph
        .getElementById("graphContainer")
        .appendChild(document.createElement("div"));
      g.setAttribute("id", "myplot"); //set id on newly made div
      embed.embed_item(bokeh_obj); //place graph data inside new graph div
    }
  }

  if (graphData.isSuccess) {
    console.log("updating graph");
    update_bokeh_graph(JSON.parse(graphData.data["bokeh_graph"]));
  }

  //used to update formData
  function handleChange(event) {
    var { name, value, type, checked } = event.target;
    setGraphOptions((prevFormData) => {
      return {
        ...prevFormData,
        [name]: type === "checkbox" ? checked : value,
      };
    });
  }

  //special formData updater function for select comboboxes as input differs from other inputs are objects and multiple items can used
  function handleComboboxChange(attribute, value) {
    var entries = [];
    value.forEach(function (item) {
      //get labels from each selected object in array
      if (typeof item.label == "undefined") {
        //custom entries don't have label key
        entries.push(item);
      } else {
        entries.push(item.value);
      } //entries from combobox are in an object with label key
    });

    setGraphOptions((prevFormData) => {
      return {
        ...prevFormData,
        [attribute]: entries,
      };
    });
  }

  const stat_options = props.stat_options;

  return (
    <div className="grid xl:grid-cols-12">
      <div className="col-span-9" id="graphContainer">
        <div id="myplot"></div>
      </div>

      <div className="col-span-3">
        {graphData.isLoading && "Getting chart..."}
        {graphData.isError && (
          <div style={{ color: "red" }}>
            An error occurred: {graphData.error.message}
          </div>
        )}
        {graphData.isSuccess && (
          <div style={{ color: "green" }}>Graph Loaded!</div>
        )}

        <div className="w-48">
          <label
            htmlFor="Palette"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Palette
          </label>
          <select
            name="palette"
            id="input_palette"
            onChange={handleChange}
            value={graphOptions.palette}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          >
            {/* <option selected>Activity</option> */}
            <option value="Category10">Category10</option>
            <option value="Accent">Accent</option>
            <option value="Dark2">Dark2</option>
          </select>
        </div>

        <div className="flex items-center mb-4">
          <input
            name="missing_values"
            onChange={handleChange}
            id="missing_values-checkbox"
            type="checkbox"
            checked={graphOptions.missing_values}
            value={graphOptions.missing_values}
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
          ></input>
          <label
            htmlFor="missing_values-checkbox"
            className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
          >
            Show Missing Values
          </label>
        </div>

        <div className="flex items-center mb-4">
          <input
            name="second_graph"
            onChange={handleChange}
            id="second_graph-checkbox"
            type="checkbox"
            checked={graphOptions.second_graph}
            value={graphOptions.second_graph}
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
          ></input>
          <label
            htmlFor="second_graph-checkbox"
            className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
          >
            Add Linked Graph
          </label>
        </div>

        <div className="flex items-center mb-4">
          <input
            name="labels"
            onChange={handleChange}
            id="labels-checkbox"
            type="checkbox"
            checked={graphOptions.labels}
            value={graphOptions.labels}
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
          ></input>
          <label
            htmlFor="labels-checkbox"
            className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
          >
            Show Labels
          </label>
        </div>
        <div className="flex items-center mb-4">
          <input
            name="show_anomalies"
            onChange={handleChange}
            id="show_anomalies-checkbox"
            type="checkbox"
            checked={graphOptions.show_anomalies}
            value={graphOptions.show_anomalies}
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
          ></input>
          <label
            htmlFor="show_anomalies-checkbox"
            className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
          >
            Show Anomalies
          </label>
        </div>

        <Autocomplete
          freeSolo
          multiple
          options={stat_options}
          value={graphOptions.features_to_plot}
          onChange={(event, value) =>
            handleComboboxChange("features_to_plot", value)
          }
          renderInput={(params) => (
            <TextField
              {...params}
              variant="standard"
              label="Features to Plot"
              placeholder="Features to Plot"
            />
          )}
        />
      </div>
    </div>
  );
}
