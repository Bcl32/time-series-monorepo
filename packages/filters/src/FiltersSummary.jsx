import React from "react";
//other modules
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
dayjs.extend(duration);

//MONOREPO PACKAGE IMPORTS
import { Button } from "@repo/utils/Button";

export function FiltersSummary(props) {
  return (
    <div>
      <div>
        <h1 className="text-2xl text-blue-600 dark:text-blue-500">
          Active Filters:
        </h1>
      </div>

      {Object.entries(props.active_filters).map(([key, entry]) => {
        console.log(key, entry);
        if (entry["type"] === "datetime") {
          var start = props.filters[key]["value"]["timespan_begin"];
          var end = props.filters[key]["value"]["timespan_end"];

          var filter_value =
            "Start: " +
            dayjs(start).format("MMM, D YYYY - h:mma") +
            "\n End: " +
            dayjs(end).format("MMM, D YYYY - h:mma");
        } else {
          console.log(props.filters[key]);
          var filter_value =
            props.filters[key]["rule"] + " " + props.filters[key]["value"];
        }

        return (
          <FiltersEntry
            key={"filter-summary" + key}
            name={key}
            entry={entry}
            filter_value={filter_value}
            filters={props.filters}
            test={"test"}
            change_filters={props.change_filters}
          ></FiltersEntry>
        );
      })}
    </div>
  );
}

function FiltersEntry({ name, entry, filters, filter_value, change_filters }) {
  return (
    <div className="flex flex-row grid xl:grid-cols-12" key={name}>
      <span className="font-semibold col-span-4">
        {/* capitalizes the string */}
        {name[0].toUpperCase() + name.slice(1)}:
      </span>

      <span className="whitespace-pre-line col-span-6">{filter_value}</span>

      <Button
        onClick={() =>
          change_filters(name, "value", filters[name]["filter_empty"])
        }
        variant="blue"
        size="lg"
        className="col-span-2"
      >
        Reset
      </Button>
    </div>
  );
}
