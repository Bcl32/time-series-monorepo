import React from "react";
import { ShowHeirarchy } from "@repo/utils/ShowHeirarchy";
import { AnimatedTabs, TabContent } from "@repo/utils/AnimatedTabs";

import CollectionModelData from "./metadata/CollectionModelData.json";
import DatafeedModelData from "./metadata/DatafeedModelData.json";
import HealthModelData from "./metadata/HealthModelData.json";
import DatasetModelData from "./metadata/DatasetModelData.json";
import AnomalyModelData from "./metadata/AnomalyModelData.json";
import PredictionModelData from "./metadata/PredictionModelData.json";
import DetectorModelData from "./metadata/DetectorModelData.json";

export function DisplaySchema() {
  var entity_list = [
    "Collection",
    "Datafeed",
    "Health",
    "Dataset",
    "Anomaly",
    "Prediction",
    "Detector",
  ];
  var schemas = [
    CollectionModelData,
    DatafeedModelData,
    HealthModelData,
    DatasetModelData,
    AnomalyModelData,
    PredictionModelData,
    DetectorModelData,
  ];

  const schema_tabs = schemas.map((schema, index) => {
    return (
      <TabContent key={"tab_panel" + index}>
        <ShowHeirarchy json_data={schema}></ShowHeirarchy>
      </TabContent>
    );
  });

  return (
    <div>
      <AnimatedTabs tab_titles={entity_list}>
        <div className="overflow-auto">{schema_tabs}</div>
      </AnimatedTabs>
    </div>
  );
}
