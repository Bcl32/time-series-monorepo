//LOCAL COMPONENTS
import { LoadAllEntities } from "./LoadAllEntities";
import EntityViewer from "./EntityViewer";
//component data
import MainModelData from "./metadata/DatafeedModelData.json";
import { DatafeedsTableData as TableData } from "./components/tables/DatafeedsTableData";

export default function AllDatafeeds() {
  const get_api_url = MainModelData.get_api_url;

  var { dataset } = LoadAllEntities({
    get_api_url: get_api_url,
    name: MainModelData.set_name,
  });

  var table_metadata = TableData({
    add_api_url: MainModelData.add_api_url,
    query_invalidation: [get_api_url],
    create_enabled: false,
  });

  return (
    <div>
      {dataset && (
        <div>
          <EntityViewer
            name={MainModelData.set_name}
            dataset={dataset}
            ModelData={MainModelData}
            table_config={table_metadata}
          ></EntityViewer>
        </div>
      )}
    </div>
  );
}
