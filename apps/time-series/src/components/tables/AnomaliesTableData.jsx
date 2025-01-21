import { createColumnHelper } from "@tanstack/react-table";
import { Link } from "react-router-dom";
import VisibilityIcon from "@mui/icons-material/Visibility";
//other modules
import dayjs from "dayjs";
//my component data
import ModelData from "../../metadata/AnomalyModelData.json";
//MONOREPO PACKAGE IMPORTS
import { ColumnGenerator } from "@repo/datatable/ColumnGenerator";
import { dayjs_sorter } from "@repo/datatable/dayjs_sorter";

export function AnomaliesTableData({
  query_invalidation,
  add_api_url,
  create_enabled,
}) {
  const columnHelper = createColumnHelper();
  const custom_columns = [
    {
      id: "ViewObject",
      header: () => <span>View</span>,
      minSize: 10,
      maxSize: 10,
      cell: ({ cell, row }) => {
        return (
          <div>
            <Link
              to={"/Prediction"}
              state={{ object_id: row.original.prediction_id }}
            >
              <VisibilityIcon />
              <strong> </strong>
            </Link>
          </div>
        );
      },
    },
    columnHelper.accessor("value", {
      header: () => <span>Value</span>,
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("anomaly_score", {
      header: () => <span>Anomaly Score</span>,
      //cell: (info) => info.getValue(),
      cell: (info) => info.getValue().toString().substring(0, 8),
    }),
    columnHelper.accessor("threshold", {
      header: () => <span>Threshold</span>,
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("time", {
      header: () => <span>Datetime</span>,
      cell: (info) => dayjs(info.getValue()).format("MMM, D YYYY - h:mma"),
      sortingFn: (rowA, rowB, column_id) => dayjs_sorter(rowA, rowB, column_id),
    }),
    columnHelper.accessor("dataset_name", {
      header: () => <span>Dataset</span>,
      minSize: 50,
      size: 30,
      maxSize: 100,
      cell: ({ row }) => {
        var folder = row.original.dataset_name;
        var filename = "";
        if (row.original.dataset_name.includes("/")) {
          folder = row.original.dataset_name.split("/")[0].substring(0, 35);
          filename = row.original.dataset_name.split("/")[1].substring(0, 35);
        }

        return (
          <Link
            to={"/Prediction"}
            state={{ object_id: row.original.prediction_id }}
          >
            <div className="line-clamp-2 h-12">
              <span>{folder}</span>
              {" / " + filename}
            </div>
            <strong> </strong>
          </Link>
        );
      },
    }),
    columnHelper.accessor("detector_name", {
      header: () => <span>Detector</span>,
      cell: ({ row }) => {
        return (
          <Link
            to={"/Detector"}
            state={{ object_id: row.original.detector_id }}
          >
            <strong>{row.original.detector_name} </strong>
          </Link>
        );
      },
    }),
    columnHelper.accessor("status", {
      header: () => <span>Status</span>,
      cell: (info) => info.getValue().toString(), //toString with make boolean values visible in table
    }),
    columnHelper.accessor("severity", {
      header: () => <span>Severity</span>,
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("tags", {
      id: "tags",
      header: () => <span>Tags</span>,
      cell: ({ row }) => {
        return row.original.tags.map((tag) => <i key={tag}>{tag}, </i>);
      },
    }),
  ];

  const columns = ColumnGenerator({
    custom_columns: custom_columns,
    query_invalidation: query_invalidation,
    ModelData: ModelData,
    add_edit: false,
  });

  var columnVisibility = {
    time_created: false,
    time_updated: false,
    value: false,
    time: false,
    threshold: false,
  };

  let table_settings = {
    columns: columns,
    create_enabled: create_enabled,
    defaultSort: "time_created",
    columnVisibility: columnVisibility,
    query_invalidation: query_invalidation,
    add_api_url: add_api_url,
  };

  return table_settings;
}
