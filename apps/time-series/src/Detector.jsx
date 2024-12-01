import React from "react";
//THIRD PARTY LIBRARIES
import { useLocation } from "react-router-dom";

//LOCAL COMPONENTS
import Metadata from "./Metadata";
import EntityViewer from "./EntityViewer";
import { LoadEntity } from "./LoadEntity";
//MODEL SPECIFIC IMPORTS
import { PredictionsTableData as ChildTableData } from "./components/tables/PredictionsTableData";
import MainModelData from "./metadata/DetectorModelData.json";
import ChildModelData from "./metadata/PredictionModelData.json";

export default function Detector() {
  const { state } = useLocation();
  const child_attr_name = "predictions";
  const children_attributes = [];

  const get_api_url =
    MainModelData.api_url_base + "/get_by_id" + "/" + state?.object_id;

  var { metadata, dataset, obj_heirarchy } = LoadEntity({
    child_attr_name: child_attr_name,
    get_api_url: get_api_url,
  });

  var table_metadata = ChildTableData({
    add_api_url: "n/a",
    query_invalidation: [get_api_url],
    create_enabled: false,
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
