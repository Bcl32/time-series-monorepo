import React from "react";
//THIRD PARTY LIBRARIES
import { useLocation } from "react-router-dom";

//LOCAL COMPONENTS
import Metadata from "./Metadata";
import { LoadEntity } from "./LoadEntity";

//MODEL SPECIFIC IMPORTS
import MainModelData from "./metadata/HealthModelData.json";

export default function Health() {
  const { state } = useLocation();
  const child_attr_name = "";
  const children_attributes = [];

  const get_api_url =
    MainModelData.api_url_base + "/get_by_id" + "/" + state?.object_id;
  var { metadata, dataset, obj_heirarchy } = LoadEntity({
    child_attr_name: child_attr_name,
    get_api_url: get_api_url,
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
        </div>
      )}
    </div>
  );
}
