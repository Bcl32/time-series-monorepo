//THIRD PARTY LIBRARIES
import React from "react";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";

//my custom components
import { GroupFilters } from "./functions/GroupFilters";
import { BarChartFilter } from "./BarChartFilter";

import { FilterElement } from "@repo/filters/FilterElement";
export function AllFilters({
  filters,
  change_filters,
  ModelData,
  dataset,
  ...props
}) {
  let {
    string_filters,
    numeric_filters,
    select_filters,
    list_filters,
    time_filters,
  } = GroupFilters(filters);

  return (
    <div>
      <div>
        <TabGroup>
          <TabList>
            <Tab className="inline-block p-4 border-b-2 border-transparent rounded-t-lg data-[hover]:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 data-[selected]:text-indigo-600 data-[selected]:border-indigo-600">
              Time Filters
            </Tab>
            <Tab className="inline-block p-4 border-b-2 border-transparent rounded-t-lg data-[hover]:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 data-[selected]:text-indigo-600 data-[selected]:border-indigo-600">
              Other Filters
            </Tab>
            <Tab className="inline-block p-4 border-b-2 border-transparent rounded-t-lg data-[hover]:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 data-[selected]:text-indigo-600 data-[selected]:border-indigo-600">
              Charts
            </Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              {time_filters.map((entry) => {
                return (
                  <FilterElement key={entry["name"]} filter_data={entry} />
                );
              })}
            </TabPanel>
            <TabPanel>
              {string_filters.map((entry) => {
                return (
                  <FilterElement key={entry["name"]} filter_data={entry} />
                );
              })}

              {numeric_filters.map((entry) => {
                return (
                  <FilterElement key={entry["name"]} filter_data={entry} />
                );
              })}

              {select_filters.map((entry) => {
                return (
                  <FilterElement key={entry["name"]} filter_data={entry} />
                );
              })}

              {list_filters.map((entry) => {
                return (
                  <FilterElement key={entry["name"]} filter_data={entry} />
                );
              })}
            </TabPanel>
            <TabPanel>
              {/* <div className="grid xl:grid-cols-2">
                {ModelData.chart_filters.map((entry) => {
                  //find stat for feature by key
                  var stat = props.filteredStats[entry["name"]].find((obj) => {
                    return obj.name == entry["key"];
                  })["value"];

                  return (
                    <BarChartFilter
                      key={"chart-filter-" + entry["name"]}
                      grouped_data={stat}
                      filters={filters}
                      name={entry["name"]}
                      change_filters={change_filters}
                      colours={{}}
                    />
                  );
                })}
              </div> */}
            </TabPanel>
          </TabPanels>
        </TabGroup>
      </div>
    </div>
  );
}
