//THIRD PARTY LIBRARIES
import { useLocation } from "react-router-dom";
//MONOREPO PACKAGE IMPORTS
import { useGetRequest } from "@repo/hooks/useGetRequest";

//LOCAL COMPONENTS
import NavigationBreadcrumb from "./NavigationBreadcrumb";
import Metadata from "./Metadata";
import EntityViewer from "./EntityViewer";

import { BokehLineChart } from "@repo/charts/BokehLineChart";

//LOCAL COMPONENTS
import { TimeSeriesTableData } from "./components/tables/TimeSeriesTableData";
import { AnomaliesTableData } from "./components/tables/AnomaliesTableData";

//component data
import MainModelData from "./metadata/PredictionModelData.json";
import AnomalyModelData from "./metadata/AnomalyModelData.json";
import TimeSeriesModelData from "./metadata/TimeSeriesModelData.json";

export default function Prediction() {
  const children_attributes = [];

  const { state } = useLocation();

  const get_api_url =
    MainModelData.api_url_base +
    "/load_prediction_file" +
    "/" +
    state?.object_id;
  const getResponse = useGetRequest(get_api_url);

  if (getResponse.isSuccess) {
    var metadata = getResponse.data.metadata;
    var obj_heirarchy = getResponse.data.obj_heirarchy;
    console.log(metadata);
    var anomaly_dataset = metadata["anomalies"];
    var times_series_dataset = getResponse.data.entries;
  }
  var anomaly_table_metadata = AnomaliesTableData({
    add_api_url: "n/a",
    query_invalidation: [get_api_url],
    create_enabled: false,
  });
  var time_series_table_metadata = TimeSeriesTableData({
    add_api_url: "n/a",
    query_invalidation: [get_api_url],
    create_enabled: false,
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

          <BokehLineChart
            url="/fastapi/nab/get_nab_chart"
            metadata={metadata}
            stat_options={["value", "anomaly_score"]}
            features_to_plot={["value"]}
            lazy_load_enabled={false}
            lazy_load_value={metadata.name}
          />

          <EntityViewer
            name="Time Series Entries"
            dataset={times_series_dataset}
            ModelData={TimeSeriesModelData}
            table_config={time_series_table_metadata}
          ></EntityViewer>

          <EntityViewer
            name="Anomalies"
            dataset={anomaly_dataset}
            ModelData={AnomalyModelData}
            table_config={anomaly_table_metadata}
          ></EntityViewer>
        </div>
      )}
    </div>
  );
}
