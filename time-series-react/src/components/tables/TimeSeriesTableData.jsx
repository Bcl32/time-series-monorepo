import { createColumnHelper } from "@tanstack/react-table";
//other modules
import dayjs from "dayjs";
import { dayjs_sorter } from "@repo/datatable/dayjs_sorter";

export function TimeSeriesTableData({
  query_invalidation,
  add_api_url,
  create_enabled = true,
}) {
  const columnHelper = createColumnHelper();
  const columns = [
    columnHelper.accessor("timestamp", {
      header: () => <span>Datetime</span>,
      cell: (info) => dayjs(info.getValue()).format("MMM, D YYYY - h:mma"),
      sortingFn: (rowA, rowB, column_id) => dayjs_sorter(rowA, rowB, column_id),
    }),
    columnHelper.accessor("value", {
      header: () => <span>Value</span>,
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("anomaly_score", {
      header: () => <span>Anomaly Score</span>,
      cell: (info) => info.getValue().toString(),
    }),
  ];
  var columnVisibility = {};

  let table_settings = {
    columns: columns,
    create_enabled: create_enabled,
    defaultSort: "timestamp",
    columnVisibility: columnVisibility,
    query_invalidation: query_invalidation,
    add_api_url: add_api_url,
  };

  return table_settings;
}
