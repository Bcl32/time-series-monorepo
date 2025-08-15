//THIRD PARTY LIBRARIES
import { useLocation } from "react-router-dom";

//LOCAL COMPONENTS
import Metadata from "./Metadata";
import EntityViewer from "./EntityViewer";
import { LoadEntity } from "./LoadEntity";
import { TimeSeries } from "./TimeSeries";
import { BokehLineChart } from "@repo/charts/BokehLineChart";

//LOCAL COMPONENTS

import { AnomaliesTableData } from "./components/tables/AnomaliesTableData";

//component data
import MainModelData from "./metadata/PredictionModelData.json";
import AnomalyModelData from "./metadata/AnomalyModelData.json";

export default function Prediction() {
  const { state } = useLocation();
  const child_attr_name = "anomalies";
  const children_attributes = [];

  const get_api_url =
    MainModelData.api_url_base + "/get_by_id" + "/" + state?.object_id;

  var { metadata, dataset, obj_heirarchy } = LoadEntity({
    child_attr_name: child_attr_name,
    get_api_url: get_api_url,
  });

  var anomaly_table_metadata = AnomaliesTableData({
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

          <BokehLineChart
            url="/fastapi/nab/get_nab_chart"
            metadata={metadata}
            stat_options={["value", "anomaly_score"]}
            features_to_plot={["value"]}
            lazy_load_enabled={false}
            lazy_load_value={metadata.name}
          />

          <EntityViewer
            name="Anomalies"
            dataset={dataset}
            ModelData={AnomalyModelData}
            table_config={anomaly_table_metadata}
          ></EntityViewer>

          <TimeSeries object_data={metadata}></TimeSeries>
        </div>
      )}
    </div>
  );
}
