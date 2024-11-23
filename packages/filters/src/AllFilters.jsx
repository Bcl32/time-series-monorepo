//THIRD PARTY LIBRARIES
import React from "react";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";

//my custom components
import { GroupFilters } from "./functions/GroupFilters";
import { AnimatedTabs, TabContent } from "@repo/utils/AnimatedTabs";
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
        <AnimatedTabs tab_titles={["Time Filters", "Other Filters"]}>
          <div className="overflow-auto">
            <TabContent>
              {time_filters.map((entry) => {
                return (
                  <FilterElement key={entry["name"]} filter_data={entry} />
                );
              })}
            </TabContent>
            <TabContent unmount={false}>
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
            </TabContent>
          </div>
        </AnimatedTabs>
      </div>
    </div>
  );
}
