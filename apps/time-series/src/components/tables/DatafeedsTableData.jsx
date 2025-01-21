import { createColumnHelper } from "@tanstack/react-table";
import { Link } from "react-router-dom";
import VisibilityIcon from "@mui/icons-material/Visibility";

//other modules
import dayjs from "dayjs";
//my component data
import ModelData from "../../metadata/DatafeedModelData.json";
//MONOREPO PACKAGE IMPORTS
import { ColumnGenerator } from "@repo/datatable/ColumnGenerator";
import { dayjs_sorter } from "@repo/datatable/dayjs_sorter";

export function DatafeedsTableData({
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
            <Link
              to={"/" + ModelData.model_name}
              state={{ object_id: row.original.id }}
            >
              <VisibilityIcon />
              <strong> </strong>
            </Link>
          </div>
        );
      },
    },
    columnHelper.accessor("name", {
      header: () => <span>Name</span>,
      // size: 20, //set column size for this column
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("folder", {
      header: () => <span>Folder</span>,
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("filename", {
      header: () => <span>Filename</span>,
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("feed_type", {
      header: () => <span>Feed Type</span>,
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("health", {
      id: "health_score",
      header: () => <span>Health Score</span>,
      cell: ({ row }) => {
        return (
          <div className="line-clamp-2 h-12">
            <span>{row.original.health.score}</span>
          </div>
        );
      },
    }),
    columnHelper.accessor("tags", {
      id: "tags",
      header: () => <span>Tags</span>,
      cell: ({ row }) => {
        return row.original.tags.map((tag) => <i key={tag}>{tag}, </i>);
      },
    }),
    columnHelper.accessor((row) => row.start_time, {
      id: "start_time",
      cell: (info) => dayjs(info.getValue()).format("MMM, D YYYY - h:mma"),
      sortingFn: (rowA, rowB, column_id) => dayjs_sorter(rowA, rowB, column_id),
      header: () => <span>Start Time</span>,
    }),
    columnHelper.accessor((row) => row.end_time, {
      id: "end_time",
      cell: (info) => dayjs(info.getValue()).format("MMM, D YYYY - h:mma"),
      sortingFn: (rowA, rowB, column_id) => dayjs_sorter(rowA, rowB, column_id),
      header: () => <span>End Time</span>,
    }),
  ];
  const columns = ColumnGenerator({
    custom_columns: custom_columns,
    query_invalidation: query_invalidation,
    ModelData: ModelData,
    add_edit: false,
  });
  var columnVisibility = {
    filename: false,
    folder: false,
    time_created: false,
    time_updated: false,
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
