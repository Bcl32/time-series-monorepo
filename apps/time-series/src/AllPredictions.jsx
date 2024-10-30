//THIRD PARTY LIBRARIES
import React from "react";

//MONOREPO PACKAGE IMPORTS
import { useGetRequest } from "@repo/hooks/useGetRequest";

import { setTitleText } from "@repo/utils/setTitleText";
//LOCAL COMPONENTS
import { PredictionsTableData } from "./components/tables/PredictionsTableData";
import NavigationBreadcrumb from "./NavigationBreadcrumb";
import EntityViewer from "./EntityViewer";
//component data
import PredictionModelData from "./metadata/PredictionModelData.json";

export default function AllPredictions() {
  const get_api_url = PredictionModelData.get_api_url;
  const getResponse = useGetRequest(get_api_url);

  if (getResponse.isSuccess) {
    var dataset = getResponse.data; //runs every state update
    var breadcrumb = [];
  }
  setTitleText("All Predictions");
  var table_metadata = PredictionsTableData({
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
            name="Predictions"
            dataset={dataset}
            ModelData={PredictionModelData}
            table_config={table_metadata}
          ></EntityViewer>
        </div>
      )}
    </div>
  );
}
