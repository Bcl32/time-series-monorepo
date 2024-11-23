//THIRD PARTY LIBRARIES
import React from "react";

//MONOREPO PACKAGE IMPORTS
import { useGetRequest } from "@repo/hooks/useGetRequest";

//LOCAL COMPONENTS
import { DetectorsTableData } from "./components/tables/DetectorsTableData";
import NavigationBreadcrumb from "./NavigationBreadcrumb";
import EntityViewer from "./EntityViewer";
//component data
import MainModelData from "./metadata/DetectorModelData.json";

export default function AllDetectors() {
  const get_api_url = MainModelData.get_api_url;
  const getResponse = useGetRequest(get_api_url);

  if (getResponse.isSuccess) {
    var dataset = getResponse.data; //runs every state update
    var breadcrumb = [];
  }

  var table_metadata = DetectorsTableData({
    add_api_url: MainModelData.add_api_url,
    query_invalidation: [get_api_url],
    create_enabled: true,
  });

  return (
    <div>
      {getResponse.isSuccess && (
        <div>
          <NavigationBreadcrumb data={breadcrumb} />
          <EntityViewer
            name="Detectors"
            dataset={dataset}
            ModelData={MainModelData}
            table_config={table_metadata}
          ></EntityViewer>
        </div>
      )}
    </div>
  );
}
