import React from "react";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";

import { ProcessDataset } from "@repo/utils/ProcessDataset";
import { Filters } from "@repo/filters/Filters";
import { InitializeFilters } from "@repo/filters/InitializeFilters";

//MONOREPO PACKAGE IMPORTS
import { DataTable } from "@repo/datatable/DataTable";
import { StatsTable } from "@repo/datatable/StatsTable";

export function EntityViewer({
  name,
  dataset,
  ModelData,
  table_config,
  ...props
}) {
  const [filters, setFilters] = React.useState({});

  var { active_filters, filteredData, datasetStats, filteredStats } =
    ProcessDataset(dataset, filters, ModelData);

  console.log(active_filters, filteredData, datasetStats, filteredStats);

  React.useEffect(() => {
    setFilters(InitializeFilters(ModelData.model_attributes, datasetStats));
  }, [dataset]); //runs effect whenever dataset updates, itializes the filter object

  return (
    <div>
      <div className="grid xl:grid-cols-12 py-3">
        <div className="col-span-6">
          <Filters
            name={name}
            dataset={dataset}
            filteredData={filteredData}
            filters={filters}
            setFilters={setFilters}
            active_filters={active_filters}
            datasetStats={datasetStats}
            filteredStats={filteredStats}
            ModelData={ModelData}
          />
        </div>
        <div className="col-span-6">
          <StatsTable table_data={datasetStats}></StatsTable>
        </div>
        <div className="col-span-6">
          <DataTable
            title={name}
            create_enabled={table_config.create_enabled}
            tableData={filteredData}
            defaultSort={table_config.defaultSort}
            columnVisibility={table_config.columnVisibility}
            columns={table_config.columns}
            renderSubComponent={table_config.renderSubComponent}
            ModelData={ModelData}
            rowClickFunction={() => {}}
            query_invalidation={table_config.query_invalidation}
            add_api_url={table_config.add_api_url}
          />
        </div>
      </div>
      {/* )} */}
    </div>
  );
}

export default EntityViewer;
