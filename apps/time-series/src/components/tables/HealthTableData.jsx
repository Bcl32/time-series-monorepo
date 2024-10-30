import { createColumnHelper } from "@tanstack/react-table";
import { Link } from "react-router-dom";
import VisibilityIcon from "@mui/icons-material/Visibility";
//other modules
import dayjs from "dayjs";
//my component data
import ModelData from "../../metadata/PredictionModelData.json";
//MONOREPO PACKAGE IMPORTS
import { ColumnGenerator } from "@repo/datatable/ColumnGenerator";
import { dayjs_sorter } from "@repo/datatable/dayjs_sorter";

export function HealthTableData({
  query_invalidation,
  add_api_url,
  create_enabled = true,
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
            <Link to={"/Health"} state={{ object_id: row.original.id }}>
              <VisibilityIcon />
              <strong> </strong>
            </Link>
          </div>
        );
      },
    },
    // columnHelper.accessor("heartbeat_frequency", {
    //   header: () => <span>Hearbeat Frequency</span>,
    //   cell: (row) => row.original.heartbeat.frequency,
    // }),
    // columnHelper.accessor("heartbeat_timeout", {
    //   header: () => <span>Hearbeat Timeout</span>,
    //   cell: (row) => row.original.heartbeat.timeout,
    // }),
    columnHelper.accessor("score", {
      header: () => <span>Score</span>,
      //cell: (info) => info.getValue(),
      cell: (info) => info.getValue().toString().substring(0, 8),
    }),
    columnHelper.accessor("status", {
      header: () => <span>Status</span>,
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("last_received", {
      header: () => <span>Last Received</span>,
      cell: (info) => dayjs(info.getValue()).format("MMM, D YYYY - h:mma"),
      sortingFn: (rowA, rowB, column_id) => dayjs_sorter(rowA, rowB, column_id),
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

  const renderSubComponent = ({ row }) => {
    return (
      <div className="h-96 overflow-scroll">
        <pre style={{ fontSize: "20px" }}>
          <code>{JSON.stringify(row.original, null, 2)}</code>
        </pre>
      </div>
    );
  };

  let table_settings = {
    columns: columns,
    create_enabled: create_enabled,
    defaultSort: "time_created",
    columnVisibility: columnVisibility,
    renderSubComponent: renderSubComponent,
    query_invalidation: query_invalidation,
    add_api_url: add_api_url,
  };

  return table_settings;
}
