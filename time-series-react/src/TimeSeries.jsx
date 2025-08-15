import React from "react";
//LOCAL COMPONENTS
import EntityViewer from "./EntityViewer";
import { useDataLoader } from "@repo/hooks/useDataLoader";

import { TimeSeriesTableData } from "./components/tables/TimeSeriesTableData";
import TimeSeriesModelData from "./metadata/TimeSeriesModelData.json";

export function TimeSeries({ object_data }) {
  console.log(object_data);

  const loaderResponse = useDataLoader(
    "fastapi/loader/load_prediction_file",
    object_data.url
  );
  if (loaderResponse.isSuccess) {
    var times_series_dataset = loaderResponse.data;
  }

  var time_series_table_metadata = TimeSeriesTableData({
    add_api_url: "n/a",
    create_enabled: false,
  });

  return (
    <div>
      {times_series_dataset && (
        <EntityViewer
          name="Time Series Entries"
          dataset={times_series_dataset}
          ModelData={TimeSeriesModelData}
          table_config={time_series_table_metadata}
        ></EntityViewer>
      )}
    </div>
  );
}
