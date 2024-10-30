//THIRD PARTY LIBRARIES
import React from "react";

//MONOREPO PACKAGE IMPORTS
import { useGetRequest } from "@repo/hooks/useGetRequest";

import { setTitleText } from "@repo/utils/setTitleText";

//LOCAL COMPONENTS
import { HealthTableData } from "./components/tables/HealthTableData";
import NavigationBreadcrumb from "./NavigationBreadcrumb";
import EntityViewer from "./EntityViewer";
//component data
import HealthModelData from "./metadata/HealthModelData.json";

export default function AllHealth() {
  const get_api_url = HealthModelData.get_api_url;
  const getResponse = useGetRequest(get_api_url);

  if (getResponse.isSuccess) {
    var dataset = getResponse.data; //runs every state update

    var breadcrumb = [];
  }

  setTitleText("All Health Objects");
  var table_metadata = HealthTableData({
    add_api_url: "n/a",
    query_invalidation: [get_api_url],
    create_enabled: false,
  });
  return (
    <div>
      {getResponse.isSuccess && (
        <div>
          <NavigationBreadcrumb data={breadcrumb} />
          <EntityViewer
            name="Health Objects"
            dataset={dataset}
            ModelData={HealthModelData}
            table_config={table_metadata}
          ></EntityViewer>
        </div>
      )}
    </div>
  );
}
