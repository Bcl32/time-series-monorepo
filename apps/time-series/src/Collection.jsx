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
import { DatafeedsTableData } from "./components/tables/DatafeedsTableData";
import Metadata from "./Metadata";
import NavigationBreadcrumb from "./NavigationBreadcrumb";
import EntityViewer from "./EntityViewer";
//my component data
import CollectionModelData from "./metadata/CollectionModelData.json";
import DatafeedModelData from "./metadata/DatafeedModelData.json";

export default function Collection() {
  var object_name = "Collection";
  const { state } = useLocation();
  const collection_id = state?.object_id;

  const get_api_url = "/fastapi/collection/get_by_id" + "/" + collection_id;
  const getResponse = useGetRequest(get_api_url);

  if (getResponse.isSuccess) {
    var metadata = getResponse.data;
    var dataset = getResponse.data["datafeeds"];

    var breadCrumb = [
      // { type: "Collection", id: metadata.id, name: metadata.name },
    ];

    setTitleText(object_name + Capitalize(metadata.name));
  }
  var table_metadata = DatafeedsTableData({
    add_api_url: "/fastapi/datafeed/create/" + collection_id,
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
                  ModelData={CollectionModelData}
                  query_invalidation={[get_api_url]}
                  obj_data={metadata}
                />
              </DialogButton.Content>
            </DialogButton>
          </div>
          <div className="grid xl:grid-cols-12">
            <div className="col-span-6">
              <Metadata
                ModelData={CollectionModelData.model_attributes}
                metadata={metadata}
                children_attributes={[]}
                parent_name=""
              />
            </div>
          </div>
          <EntityViewer
            name={"Datafeeds"}
            dataset={dataset}
            ModelData={DatafeedModelData}
            table_config={table_metadata}
          ></EntityViewer>
        </div>
      )}
    </div>
  );
}
