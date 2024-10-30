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
import { DatasetsTableData } from "./components/tables/DatasetsTableData";
import EntityViewer from "./EntityViewer";

//my component data
import DatasetModelData from "./metadata/DatasetModelData.json";
import DatafeedModelData from "./metadata/DatafeedModelData.json";
import HealthModelData from "./metadata/HealthModelData.json";

export default function Datafeed() {
  var object_name = "Datafeed";
  const { state } = useLocation();
  const datafeed_id = state?.object_id;

  const get_api_url = "/fastapi/datafeed/get_by_id" + "/" + datafeed_id;
  const getResponse = useGetRequest(get_api_url);

  if (getResponse.isSuccess) {
    var metadata = getResponse.data.metadata;
    var dataset = metadata["datasets"];
    var breadCrumb = getResponse.data.breadcrumb;

    setTitleText(object_name + Capitalize(metadata.filename));
  }

  var table_metadata = DatasetsTableData({
    add_api_url: "/fastapi/dataset/create/" + datafeed_id,
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
                  ModelData={DatafeedModelData}
                  query_invalidation={[get_api_url]}
                  obj_data={metadata}
                />
              </DialogButton.Content>
            </DialogButton>
          </div>

          <div className="grid xl:grid-cols-12">
            <div className="col-span-6">
              <Metadata
                ModelData={DatafeedModelData.model_attributes}
                metadata={metadata}
                children_attributes={[
                  ["health", HealthModelData.model_attributes],
                ]}
                parent_name=""
              />
            </div>
          </div>

          <EntityViewer
            name="Datasets"
            dataset={dataset}
            ModelData={DatasetModelData}
            table_config={table_metadata}
          ></EntityViewer>
        </div>
      )}
    </div>
  );
}
