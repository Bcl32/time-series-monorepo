import React from "react";
import { Link, useLocation } from "react-router-dom";

//MONOREPO PACKAGE IMPORTS
import { useGetRequest } from "@repo/hooks/useGetRequest";

import { Button } from "@repo/utils/Button";
import { setTitleText } from "@repo/utils/setTitleText";
import { Capitalize } from "@repo/utils/StringFunctions";
import { EditModelForm } from "@repo/forms/EditModelForm";
import { DialogButton } from "@repo/utils/DialogButton";

//LOCAL COMPONENTS
import { PredictionsTableData } from "./components/tables/PredictionsTableData";
import { AnomaliesTableData } from "./components/tables/AnomaliesTableData";
import EntityViewer from "./EntityViewer";
import Metadata from "./Metadata";
import NavigationBreadcrumb from "./NavigationBreadcrumb";

//component data
import AnomaliesModelData from "./metadata/AnomalyModelData.json";
import PredictionModelData from "./metadata/PredictionModelData.json";
import DetectorModelData from "./metadata/DetectorModelData.json";

export default function Detector() {
  var object_name = "Detector";
  const { state } = useLocation();
  const object_id = state?.object_id;

  const get_api_url = "/fastapi/detector/get_by_id" + "/" + object_id;
  const getResponse = useGetRequest(get_api_url);

  if (getResponse.isSuccess) {
    var metadata = getResponse.data;
    var anomaly_dataset = metadata["anomalies"];
    var prediction_dataset = metadata["predictions"];
    var breadcrumb = [];

    setTitleText("Detector: " + Capitalize(metadata.name));
  }
  var anomaly_table_metadata = AnomaliesTableData({
    add_api_url: "n/a",
    query_invalidation: [get_api_url],
    create_enabled: false,
  });
  var predictions_table_metadata = PredictionsTableData({
    add_api_url: "n/a",
    query_invalidation: [get_api_url],
    create_enabled: false,
  });

  return (
    <div>
      {getResponse.isSuccess && (
        <div>
          <NavigationBreadcrumb data={breadcrumb} />
          <div>
            <DialogButton key={"dialog-" + metadata.id}>
              <DialogButton.Button asChild>
                <Button variant="default">Edit {object_name}</Button>
              </DialogButton.Button>

              <DialogButton.Content title="Edit Entry" variant="grey">
                <EditModelForm
                  key={"entryform_edit_data_entry"}
                  ModelData={DetectorModelData}
                  query_invalidation={[get_api_url]}
                  obj_data={metadata}
                />
              </DialogButton.Content>
            </DialogButton>
          </div>
          <div className="grid xl:grid-cols-12">
            <div className="col-span-6">
              <Metadata
                ModelData={DetectorModelData.model_attributes}
                metadata={metadata}
                children_attributes={[]}
                parent_name=""
              />
            </div>
          </div>

          <EntityViewer
            name="Predictions"
            dataset={prediction_dataset}
            ModelData={PredictionModelData}
            table_config={predictions_table_metadata}
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
