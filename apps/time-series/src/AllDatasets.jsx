//THIRD PARTY LIBRARIES
import React from "react";

//MONOREPO PACKAGE IMPORTS
import { useGetRequest } from "@repo/hooks/useGetRequest";

import { setTitleText } from "@repo/utils/setTitleText";
//LOCAL COMPONENTS
import { DatasetsTableData } from "./components/tables/DatasetsTableData";
import NavigationBreadcrumb from "./NavigationBreadcrumb";
import EntityViewer from "./EntityViewer";
//component data
import DatasetModelData from "./metadata/DatasetModelData.json";

export default function AllDatasets() {
  const get_api_url = DatasetModelData.get_api_url;
  const getResponse = useGetRequest(get_api_url);

  if (getResponse.isSuccess) {
    var dataset = getResponse.data; //runs every state update
    var breadcrumb = [];
  }
  setTitleText("All Datasets");
  var table_metadata = DatasetsTableData({
    add_api_url: "/fastapi/datafeed/create",
    query_invalidation: [get_api_url],
    create_enabled: false,
  });

  return (
    <div>
      {getResponse.isSuccess && (
        <div>
          <NavigationBreadcrumb data={breadcrumb} />
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
