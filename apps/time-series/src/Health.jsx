//THIRD PARTY LIBRARIES
import { useLocation } from "react-router-dom";
//MONOREPO PACKAGE IMPORTS
import { useGetRequest } from "@repo/hooks/useGetRequest";

//LOCAL COMPONENTS
import NavigationBreadcrumb from "./NavigationBreadcrumb";
import Metadata from "./Metadata";

//MODEL SPECIFIC IMPORTS
import MainModelData from "./metadata/HealthModelData.json";

export default function Health() {
  const children_attributes = [];
  const { state } = useLocation();
  const get_api_url =
    MainModelData.api_url_base + "/get_by_id" + "/" + state?.object_id;
  const getResponse = useGetRequest(get_api_url);

  if (getResponse.isSuccess) {
    var metadata = getResponse.data.metadata;
    var obj_heirarchy = getResponse.data.obj_heirarchy;
  }

  return (
    <div>
      {getResponse.isSuccess && (
        <div>
          <NavigationBreadcrumb data={obj_heirarchy} />
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
