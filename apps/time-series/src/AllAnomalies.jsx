//THIRD PARTY LIBRARIES
import React, { useRef } from "react";

//MONOREPO PACKAGE IMPORTS
import { useGetRequest } from "@repo/hooks/useGetRequest";

import { setTitleText } from "@repo/utils/setTitleText";
import { Button } from "@repo/utils/Button";
import { PrintState } from "@repo/utils/PrintState";

//LOCAL COMPONENTS
import { AnomaliesTableData } from "./components/tables/AnomaliesTableData";
import NavigationBreadcrumb from "./NavigationBreadcrumb";
import EntityViewer from "./EntityViewer";
//my component data
import AnomalyModelData from "./metadata/AnomalyModelData.json";

export default function AllAnomalies() {
  const get_api_url = AnomalyModelData.get_api_url;
  const getResponse = useGetRequest(get_api_url);

  if (getResponse.isSuccess) {
    var dataset = getResponse.data; //runs every state update
    var breadcrumb = [];
  }
  setTitleText("All Anomalies");
  var table_metadata = AnomaliesTableData({
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
            name="Anomalies"
            dataset={dataset}
            ModelData={AnomalyModelData}
            table_config={table_metadata}
          ></EntityViewer>
        </div>
      )}
    </div>
  );
}
