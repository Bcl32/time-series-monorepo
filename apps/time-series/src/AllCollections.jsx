//THIRD PARTY LIBRARIES
import React from "react";

//MONOREPO PACKAGE IMPORTS
import { useGetRequest } from "@repo/hooks/useGetRequest";

import { setTitleText } from "@repo/utils/setTitleText";

//LOCAL COMPONENTS

import { CollectionsTableData } from "./components/tables/CollectionsTableData";
import NavigationBreadcrumb from "./NavigationBreadcrumb";

import EntityViewer from "./EntityViewer";
//component data
import MainModelData from "./metadata/CollectionModelData.json";

export default function AllCollections() {
  var object_name = "Collection";
  const get_api_url = MainModelData.get_api_url;
  const getResponse = useGetRequest(get_api_url);

  if (getResponse.isSuccess) {
    var dataset = getResponse.data; //runs every state update
    var breadcrumb = [];
  }

  setTitleText("All Collections");
  var table_metadata = CollectionsTableData({
    add_api_url: MainModelData.add_api_url,
    query_invalidation: [get_api_url],
  });
  return (
    <div>
      {getResponse.isSuccess && (
        <div>
          <NavigationBreadcrumb data={breadcrumb} />
          <EntityViewer
            name="Collections"
            dataset={dataset}
            ModelData={MainModelData}
            table_config={table_metadata}
          ></EntityViewer>
        </div>
      )}
    </div>
  );
}
