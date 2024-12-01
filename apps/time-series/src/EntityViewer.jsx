import React from "react";

import { ProcessDataset } from "@repo/utils/ProcessDataset";
import { AllFilters } from "@repo/filters/AllFilters";
import { ChartFilter } from "@repo/filters/ChartFilter";
import { InitializeFilters } from "@repo/filters/InitializeFilters";
import { FiltersSummary } from "@repo/filters/FiltersSummary";
import { GroupFilters } from "@repo/filters/GroupFilters";
import { FilterContext } from "@repo/filters/FilterContext";
import { GetSubkeyValues } from "@repo/filters/GetSubkeyValues";

//MONOREPO PACKAGE IMPORTS
import { DataTable } from "@repo/datatable/DataTable";
import { StatsTable } from "@repo/datatable/StatsTable";

import { AnimatedTabs, TabContent } from "@repo/utils/AnimatedTabs";
// export const FilterContext = React.createContext(0);

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

  //console.log(active_filters, filteredData, datasetStats, filteredStats);

  function change_filters(name, key, value) {
    setFilters({
      ...filters, // Copy other fields
      [name]: {
        // but change the entry with the specified name
        ...filters[name], // with the same object
        [key]: value, //but change the specfic entry with the key selected
      },
    });
  }

  React.useEffect(() => {
    setFilters(InitializeFilters(ModelData.model_attributes, datasetStats));
  }, [dataset]); //runs effect whenever dataset updates, itializes the filter object

  let {
    string_filters,
    numeric_filters,
    select_filters,
    list_filters,
    time_filters,
  } = GroupFilters(filters);

  var charts = ModelData.chart_filters.map((entry) => {
    //find stat for feature by key
    var chart_data = filteredStats[entry["name"]].find((obj) => {
      return obj.name == entry["key"];
    })["value"];

    var chart_metadata = entry;

    if ("subkey" in entry) {
      chart_metadata["subkeys"] = GetSubkeyValues(entry, filteredStats);
    }

    return (
      <ChartFilter
        key={"chart_" + entry["name"] + "_" + entry["key"]}
        chart_metadata={entry}
        chart_data={chart_data}
      ></ChartFilter>
    );
  });

  return (
    <div>
      <FilterContext.Provider
        value={{
          filters: filters,
          change_filters: change_filters,
        }}
      >
        <div className="grid xl:grid-cols-12 py-3">
          <div className="col-span-7">
            {dataset.length == 0 && (
              <div>
                No <span className="capitalize">{name}</span> found.
              </div>
            )}
            {dataset.length >= 1 && (
              <div className="bg-card">
                <h1 className="text-2xl bg-gradient">
                  <span className="capitalize">{name}</span>:{" "}
                  {filteredData.length} / {dataset.length} (
                  {((filteredData.length / dataset.length) * 100).toFixed(2)}
                  %)
                </h1>

                <AnimatedTabs tab_titles={["Summary", "Charts"]}>
                  <div className="overflow-auto">
                    <TabContent className="h-96">
                      <FiltersSummary
                        change_filters={change_filters}
                        model_data={ModelData.model_attributes}
                        filters={filters}
                        active_filters={active_filters}
                      ></FiltersSummary>
                      <StatsTable table_data={datasetStats}></StatsTable>
                    </TabContent>
                    <TabContent>
                      <div className="grid xl:grid-cols-2">{charts}</div>
                    </TabContent>
                  </div>
                </AnimatedTabs>

                {/* {string_filters.map((entry) => {
                  return (
                    <FilterElement key={entry["name"]} filter_data={entry} />
                  );
                })}
                {time_filters.map((entry) => {
                  return (
                    <FilterElement key={entry["name"]} filter_data={entry} />
                  );
                })} */}

                {/* <AllFilters
                  name={name}
                  dataset={dataset}
                  filteredData={filteredData}
                  filters={filters}
                  change_filters={change_filters}
                  datasetStats={datasetStats}
                  filteredStats={filteredStats}
                  ModelData={ModelData}
                /> */}
              </div>
            )}
          </div>

          <div className="col-span-5">
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
      </FilterContext.Provider>
    </div>
  );
}

export default EntityViewer;
