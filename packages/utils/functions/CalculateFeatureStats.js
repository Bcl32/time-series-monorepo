import React from "react";

import dayjs from "dayjs";
import { dayjs_sorter } from "@repo/datatable/dayjs_sorter";
import { ComputeTimeBounds } from "./ComputeTimeBounds";
import { ComputeGroupedStats } from "./ComputeGroupedStats";

export function CalculateFeatureStats(metadata, dataset) {
  var stats = {};

  metadata.map(function (item, index, array) {
    var name = item["name"];
    stats[name] = [];

    if (item["type"] === "number") {
      var min = {
        name: "min",
        type: "number",
        value: Math.min(...dataset.map((entry) => entry[name])),
      };
      var max = {
        name: "max",
        type: "number",
        value: Math.max(...dataset.map((entry) => entry[name])),
      };

      stats[name].push(min, max);
    }

    if (item["type"] === "list") {
      var options = new Set();
      dataset.map((entry) => {
        entry[name].map((option) => {
          options.add(option);
        });
      });

      var entry = {
        name: "options",
        type: "list",
        value: Array.from(options.values()),
      };

      stats[name].push(entry);
    }

    if (item["type"] === "string" || item["type"] === "select") {
      var entry = {
        name: "count",
        type: "count",
        value: ComputeGroupedStats(dataset, name),
      };
      stats[name].push(entry);
    }

    if (item["type"] === "datetime") {
      var [earliest_datetime, latest_datetime] = ComputeTimeBounds(
        dataset,
        name
      );

      var earliest = {
        name: "earliest",
        type: "datetime",
        value: earliest_datetime,
      };
      var latest = {
        name: "latest",
        type: "datetime",
        value: latest_datetime,
      };

      stats[name].push(earliest, latest);

      if (item["stats"]) {
        //don't compute these time bins for time_created, time_updated
        dataset = dataset.map((item) => convert_dates(item, name));

        daily = ComputeGroupedStats(dataset, name + "-day");
        daily = daily.sort(sort_dates("name"));

        weekly = ComputeGroupedStats(dataset, name + "-week");
        weekly = weekly.sort(sort_dates("name"));

        monthly = ComputeGroupedStats(dataset, name + "-month");
        monthly = monthly.sort(sort_dates("name"));

        var stat_daily = {
          name: "daily",
          type: "count",
          value: daily,
        };
        var stat_weekly = {
          name: "weekly",
          type: "count",
          value: weekly,
        };
        var stat_monthly = {
          name: "monthly",
          type: "count",
          value: monthly,
        };
        stats[name].push(stat_daily, stat_weekly, stat_monthly);
      }
    }
  });
  console.log(stats);
  return stats;
}

function sort_dates(field) {
  return function (a, b) {
    return (
      (dayjs(a[field]) > dayjs(b[field])) - (dayjs(a[field]) < dayjs(b[field]))
    );
  };
}

function convert_dates(dataset, feature_name) {
  // console.log(item.end_time);
  dataset[feature_name + "-day"] = dayjs(dataset[feature_name]).format(
    "MMMM DD YYYY"
  );

  dataset[feature_name + "-week"] = dayjs(dataset[feature_name])
    .set("day", 0)
    .format("MMMM DD YYYY");

  dataset[feature_name + "-month"] = dayjs(dataset[feature_name]).format(
    "MMMM YYYY"
  );

  return dataset;
}
