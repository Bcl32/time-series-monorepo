//THIRD PARTY LIBRARIES
import { useLocation } from "react-router-dom";
//MONOREPO PACKAGE IMPORTS
import { useGetRequest } from "@repo/hooks/useGetRequest";

//LOCAL COMPONENTS
import NavigationBreadcrumb from "./NavigationBreadcrumb";
import Metadata from "./Metadata";
import EntityViewer from "./EntityViewer";

//MODEL SPECIFIC IMPORTS
import { DatafeedsTableData as ChildTableData } from "./components/tables/DatafeedsTableData";
import MainModelData from "./metadata/CollectionModelData.json";
import ChildModelData from "./metadata/DatafeedModelData.json";

export default function Collection() {
  const child_attr_name = "datafeeds";
  const children_attributes = [];
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
