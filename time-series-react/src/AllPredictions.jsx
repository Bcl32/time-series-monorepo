//LOCAL COMPONENTS
import { LoadAllEntities } from "./LoadAllEntities";
import EntityViewer from "./EntityViewer";
//component data
import MainModelData from "./metadata/PredictionModelData.json";
import { PredictionsTableData as TableData } from "./components/tables/PredictionsTableData";
export default function AllPredictions() {
  const get_api_url = MainModelData.get_api_url;
  var { dataset } = LoadAllEntities({
    get_api_url: get_api_url,
    name: MainModelData.set_name,
  });

  var table_metadata = TableData({
    add_api_url: "n/a",
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
