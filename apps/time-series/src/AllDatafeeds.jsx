//THIRD PARTY LIBRARIES
import React from "react";

//MONOREPO PACKAGE IMPORTS
import { useGetRequest } from "@repo/hooks/useGetRequest";

//LOCAL COMPONENTS
import { DatafeedsTableData } from "./components/tables/DatafeedsTableData";
import NavigationBreadcrumb from "./NavigationBreadcrumb";
import EntityViewer from "./EntityViewer";
//component data
import DatafeedModelData from "./metadata/DatafeedModelData.json";

export default function AllDatafeeds() {
  const get_api_url = DatafeedModelData.get_api_url;
  const getResponse = useGetRequest(get_api_url);

  if (getResponse.isSuccess) {
    var dataset = getResponse.data; //runs every state update
    var breadcrumb = [];
  }

  var table_metadata = DatafeedsTableData({
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
            name="Datafeeds"
            dataset={dataset}
            ModelData={DatafeedModelData}
            table_config={table_metadata}
          ></EntityViewer>
        </div>
      )}
    </div>
  );
}
