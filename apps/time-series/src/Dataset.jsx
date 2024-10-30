//THIRD PARTY LIBRARIES
import React from "react";
import { useLocation } from "react-router-dom";

//MONOREPO PACKAGE IMPORTS
import { useGetRequest } from "@repo/hooks/useGetRequest";

import { Button } from "@repo/utils/Button";
import { PrintState } from "@repo/utils/PrintState";
import { setTitleText } from "@repo/utils/setTitleText";
import { Capitalize } from "@repo/utils/StringFunctions";

import { EditModelForm } from "@repo/forms/EditModelForm";
import { DialogButton } from "@repo/utils/DialogButton";

//LOCAL COMPONENTS
import Metadata from "./Metadata";
import NavigationBreadcrumb from "./NavigationBreadcrumb";

import { PredictionsTableData } from "./components/tables/PredictionsTableData";
import EntityViewer from "./EntityViewer";

//my component data
import PredictionsModelData from "./metadata/PredictionModelData.json";
import DatasetModelData from "./metadata/DatasetModelData.json";
export default function Dataset() {
  const { state } = useLocation();
  const dataset_id = state?.object_id;

  const get_api_url = "/fastapi/dataset/get_by_id" + "/" + dataset_id;
  const getResponse = useGetRequest(get_api_url);

  var object_name = "Dataset";

  if (getResponse.isSuccess) {
    var metadata = getResponse.data.metadata;
    var dataset = metadata["predictions"];
    var breadCrumb = getResponse.data.breadcrumb;

    setTitleText("Dataset: " + Capitalize(metadata.filename));
  }

  var table_metadata = PredictionsTableData({
    add_api_url: "/fastapi/prediction/create/" + dataset_id,
    query_invalidation: [get_api_url],
  });
  return (
    <div>
      {getResponse.isSuccess && (
        <div>
          <NavigationBreadcrumb data={breadCrumb} />

          <div>
            <DialogButton key={"dialog-" + metadata.id}>
              <DialogButton.Button asChild>
                <Button variant="blue">Edit {object_name}</Button>
              </DialogButton.Button>

              <DialogButton.Content title="Edit Entry" variant="grey">
                <EditModelForm
                  key={"entryform_edit_data_entry"}
                  ModelData={DatasetModelData}
                  query_invalidation={[get_api_url]}
                  obj_data={metadata}
                />
              </DialogButton.Content>
            </DialogButton>
          </div>

          <div className="grid xl:grid-cols-12">
            <div className="col-span-6">
              <Metadata
                ModelData={DatasetModelData.model_attributes}
                metadata={metadata}
                parent={["Datafeed Data", breadCrumb[1]]}
                children_attributes={[]}
                parent_name=""
              />
            </div>
          </div>

          <EntityViewer
            name="Predictions"
            dataset={dataset}
            ModelData={PredictionsModelData}
            table_config={table_metadata}
          ></EntityViewer>
        </div>
      )}
    </div>
  );
}
