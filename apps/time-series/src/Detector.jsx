//THIRD PARTY LIBRARIES
import { useLocation } from "react-router-dom";
//MONOREPO PACKAGE IMPORTS
import { useGetRequest } from "@repo/hooks/useGetRequest";

//LOCAL COMPONENTS
import NavigationBreadcrumb from "./NavigationBreadcrumb";
import Metadata from "./Metadata";
import EntityViewer from "./EntityViewer";

//MODEL SPECIFIC IMPORTS
import { PredictionsTableData } from "./components/tables/PredictionsTableData";
import { AnomaliesTableData } from "./components/tables/AnomaliesTableData";

import MainModelData from "./metadata/DetectorModelData.json";
import AnomaliesModelData from "./metadata/AnomalyModelData.json";
import PredictionModelData from "./metadata/PredictionModelData.json";

export default function Detector() {
  const children_attributes = [];

  const { state } = useLocation();
  const get_api_url =
    MainModelData.api_url_base + "/get_by_id" + "/" + state?.object_id;
  const getResponse = useGetRequest(get_api_url);

  if (getResponse.isSuccess) {
    var metadata = getResponse.data.metadata;
    var obj_heirarchy = getResponse.data.obj_heirarchy;
    var anomaly_dataset = metadata["anomalies"];
    var prediction_dataset = metadata["predictions"];
  }
  var anomaly_table_metadata = AnomaliesTableData({
    add_api_url: "n/a",
    query_invalidation: [get_api_url],
    create_enabled: false,
  });
  var predictions_table_metadata = PredictionsTableData({
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

          <EntityViewer
            name="Predictions"
            dataset={prediction_dataset}
            ModelData={PredictionModelData}
            table_config={predictions_table_metadata}
          ></EntityViewer>

          <EntityViewer
            name="Anomalies"
            dataset={anomaly_dataset}
            ModelData={AnomaliesModelData}
            table_config={anomaly_table_metadata}
          ></EntityViewer>
        </div>
      )}
    </div>
  );
}
