import React from "react";
//THIRD PARTY LIBRARIES
import { useLocation } from "react-router-dom";

//LOCAL COMPONENTS
import Metadata from "./Metadata";
import EntityViewer from "./EntityViewer";
import { LoadEntity } from "./LoadEntity";

//MODEL SPECIFIC IMPORTS
import { DatafeedsTableData as ChildTableData } from "./components/tables/DatafeedsTableData";
import MainModelData from "./metadata/CollectionModelData.json";
import ChildModelData from "./metadata/DatafeedModelData.json";

export default function Collection() {
  const { state } = useLocation();

  const child_attr_name = "datafeeds";
  const children_attributes = [];

  const get_api_url =
    MainModelData.api_url_base + "/get_by_id" + "/" + state?.object_id;

  var { metadata, dataset, obj_heirarchy } = LoadEntity({
    child_attr_name: child_attr_name,
    get_api_url: get_api_url,
  });

  var table_metadata = ChildTableData({
    add_api_url: ChildModelData.api_url_base + "/create/" + state?.object_id,
    query_invalidation: [get_api_url],
  });

  return (
    <div>
      {metadata && (
        <div>
          <div className="grid xl:grid-cols-12">
            <div className="col-span-6">
              <Metadata
                model_metadata={MainModelData}
                object_data={metadata}
                obj_heirarchy={obj_heirarchy}
                query_invalidation={[get_api_url]}
                children_attributes={children_attributes}
                parent_name=""
              />
            </div>
          </div>
          <EntityViewer
            name={child_attr_name}
            dataset={dataset}
            ModelData={ChildModelData}
            table_config={table_metadata}
          ></EntityViewer>
        </div>
      )}
    </div>
  );
}
