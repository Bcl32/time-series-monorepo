//THIRD PARTY LIBRARIES
import { useLocation } from "react-router-dom";
//MONOREPO PACKAGE IMPORTS
import { useGetRequest } from "@repo/hooks/useGetRequest";

//LOCAL COMPONENTS
import NavigationBreadcrumb from "./NavigationBreadcrumb";
import Metadata from "./Metadata";
import EntityViewer from "./EntityViewer";

//MODEL SPECIFIC IMPORTS
import { DatasetsTableData as ChildTableData } from "./components/tables/DatasetsTableData";
import MainModelData from "./metadata/DatafeedModelData.json";
import ChildModelData from "./metadata/DatasetModelData.json";
import HealthModelData from "./metadata/HealthModelData.json";

export default function Datafeed() {
  const child_attr_name = "datasets";
  const children_attributes = [["health", HealthModelData.model_attributes]];
  const { state } = useLocation();
  const get_api_url =
    MainModelData.api_url_base + "/get_by_id" + "/" + state?.object_id;

  const getResponse = useGetRequest(get_api_url);

  if (getResponse.isSuccess) {
    var metadata = getResponse.data.metadata;
    var obj_heirarchy = getResponse.data.obj_heirarchy;
    var dataset = metadata[child_attr_name];
  }
  var table_metadata = ChildTableData({
    add_api_url: ChildModelData.api_url_base + "/create/" + state?.object_id,
    query_invalidation: [get_api_url],
  });

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
