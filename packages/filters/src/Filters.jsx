//THIRD PARTY LIBRARIES
import React from "react";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";

//my custom components
import DebouncedTextInput from "./DebouncedTextInput";
import DebouncedNumberInput from "./DebouncedNumberInput";
import { SelectFilter } from "./SelectFilter";
import { ListFilter } from "./ListFilter";
import { GroupFilters } from "./functions/GroupFilters";
import { BarChartFilter } from "./BarChartFilter";
import { TimeFilters } from "./TimeFilters";
import { FiltersSummary } from "./FiltersSummary";

export function Filters(props) {
  var filters = props.filters;

  var ModelData = props.ModelData;
  var dataset = props.dataset;

  function change_filters(name, key, value) {
    props.setFilters({
      ...filters, // Copy other fields
      [name]: {
        // but change the entry with the specified name
        ...filters[name], // with the same object
        [key]: value, //but change the specfic entry with the key selected
      },
    });
  }

  let {
    string_filters,
    numeric_filters,
    select_filters,
    list_filters,
    time_filters,
  } = GroupFilters(filters);

  return (
    <div>
      {dataset.length == 0 && <div>No {props.name} to filter.</div>}

      {dataset.length >= 1 && (
        <div>
          <h1 className="text-2xl">
            {props.name}: {props.filteredData.length} / {dataset.length} (
            {((props.filteredData.length / dataset.length) * 100).toFixed(2)}
            %)
          </h1>
          <TabGroup>
            <TabList>
              <Tab className="inline-block p-4 border-b-2 border-transparent rounded-t-lg data-[hover]:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 data-[selected]:text-indigo-600 data-[selected]:border-indigo-600">
                Filters Summary
              </Tab>
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
                <FiltersSummary
                  change_filters={change_filters}
                  model_data={ModelData.model_attributes}
                  filters={props.filters}
                  active_filters={props.active_filters}
                ></FiltersSummary>
              </TabPanel>

              <TabPanel>
                {time_filters.map((entry) => {
                  return (
                    <TimeFilters
                      key={"time-filter-" + entry["name"]}
                      filters={props.filters}
                      change_filters={change_filters}
                      name={entry["name"]}
                    ></TimeFilters>
                  );
                })}
              </TabPanel>
              <TabPanel>
                {string_filters.map((entry) => {
                  return (
                    <DebouncedTextInput
                      key={"text-filter-" + entry["name"]}
                      filters={props.filters}
                      change_filters={change_filters}
                      name={entry["name"]}
                    ></DebouncedTextInput>
                  );
                })}

                {numeric_filters.map((entry) => {
                  return (
                    <DebouncedNumberInput
                      key={"number-filter-" + entry["name"]}
                      filters={props.filters}
                      change_filters={change_filters}
                      name={entry["name"]}
                    ></DebouncedNumberInput>
                  );
                })}

                {select_filters.map((entry) => {
                  return (
                    <SelectFilter
                      key={"select-filter-" + entry["name"]}
                      filters={props.filters}
                      change_filters={change_filters}
                      name={entry["name"]}
                      options={entry["options"]}
                    ></SelectFilter>
                  );
                })}

                {list_filters.map((entry) => {
                  return (
                    <ListFilter
                      key={"select-filter-" + entry["name"]}
                      filters={props.filters}
                      change_filters={change_filters}
                      name={entry["name"]}
                      options={entry["options"]}
                    ></ListFilter>
                  );
                })}
              </TabPanel>
              <TabPanel>
                <div className="grid xl:grid-cols-2">
                  {ModelData.chart_filters.map((entry) => {
                    //find stat for feature by key
                    var stat = props.filteredStats[entry["name"]].find(
                      (obj) => {
                        return obj.name == entry["key"];
                      }
                    )["value"];

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
                </div>
              </TabPanel>
            </TabPanels>
          </TabGroup>
        </div>
      )}
    </div>
  );
}
