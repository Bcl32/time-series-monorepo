import React from "react";
import { Link, useLocation } from "react-router-dom";

//MONOREPO PACKAGE IMPORTS
import { useGetRequest } from "@repo/hooks/useGetRequest";
import { BokehLineChart } from "@repo/charts/BokehLineChart";

import { Button } from "@repo/utils/Button";
import { PrintState } from "@repo/utils/PrintState";
import { setTitleText } from "@repo/utils/setTitleText";
import { Capitalize } from "@repo/utils/StringFunctions";
import { EditModelForm } from "@repo/forms/EditModelForm";
import { DialogButton } from "@repo/utils/DialogButton";

//LOCAL COMPONENTS
import { TimeSeriesTableData } from "./components/tables/TimeSeriesTableData";
import { AnomaliesTableData } from "./components/tables/AnomaliesTableData";
import EntityViewer from "./EntityViewer";

import Metadata from "./Metadata";
import NavigationBreadcrumb from "./NavigationBreadcrumb";

//component data
import PredictionModelData from "./metadata/PredictionModelData.json";
import AnomaliesModelData from "./metadata/AnomalyModelData.json";
import TimeSeriesModelData from "./metadata/TimeSeriesModelData.json";

export default function Prediction() {
  var object_name = "Prediction";
  const { state } = useLocation();
  const object_id = state?.object_id;

  const get_api_url =
    "/fastapi/prediction/load_prediction_file" + "/" + object_id;
  const getResponse = useGetRequest(get_api_url);

  if (getResponse.isSuccess) {
    var metadata = getResponse.data.metadata;
    var anomaly_dataset = metadata["anomalies"];
    var times_series_dataset = getResponse.data.entries;

    var breadcrumbs = getResponse.data.breadcrumb;

    setTitleText(
      "Predictions: " +
        Capitalize(metadata.detector_name) +
        " / " +
        Capitalize(metadata.dataset_name)
    );
  }
  var anomaly_table_metadata = AnomaliesTableData({
    add_api_url: "n/a",
    query_invalidation: [get_api_url],
    create_enabled: false,
  });
  var time_series_table_metadata = TimeSeriesTableData({
    add_api_url: "n/a",
    query_invalidation: [get_api_url],
    create_enabled: false,
  });
  console.log(anomaly_dataset, times_series_dataset);
  return (
    <div>
      {getResponse.isSuccess && (
        <div>
          <NavigationBreadcrumb data={breadcrumbs} />
          <div>
            <DialogButton key={"dialog-" + metadata.id}>
              <DialogButton.Button asChild>
                <Button variant="default">Edit {object_name}</Button>
              </DialogButton.Button>

              <DialogButton.Content title="Edit Entry" variant="grey">
                <EditModelForm
                  key={"entryform_edit_data_entry"}
                  ModelData={PredictionModelData}
                  query_invalidation={[get_api_url]}
                  obj_data={metadata}
                />
              </DialogButton.Content>
            </DialogButton>
          </div>

          <div className="grid xl:grid-cols-12">
            <div className="col-span-6">
              <Metadata
                ModelData={PredictionModelData.model_attributes}
                metadata={metadata}
                children_attributes={[]}
                parent_name=""
              />
            </div>
          </div>

          <BokehLineChart
            url="/fastapi/nab/get_nab_chart"
            metadata={metadata}
            stat_options={["value", "anomaly_score"]}
            features_to_plot={["value"]}
            lazy_load_enabled={false}
            lazy_load_value={metadata.name}
          />

          <EntityViewer
            name="Time Series Entries"
            dataset={times_series_dataset}
            ModelData={TimeSeriesModelData}
            table_config={time_series_table_metadata}
          ></EntityViewer>

          <EntityViewer
            name="Anomalies"
            dataset={anomaly_dataset}
            ModelData={AnomaliesModelData}
            table_config={anomaly_table_metadata}
          ></EntityViewer>
        </div>
      )}
    </div>
  );
}
