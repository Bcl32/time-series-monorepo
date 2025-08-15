import { createColumnHelper } from "@tanstack/react-table";
import { Link } from "react-router-dom";
import VisibilityIcon from "@mui/icons-material/Visibility";

//my component data
import ModelData from "../../metadata/CollectionModelData.json";
//MONOREPO PACKAGE IMPORTS
import { ColumnGenerator } from "@repo/datatable/ColumnGenerator";

import { CustomTooltip } from "@repo/utils/Tooltip";

export function CollectionsTableData({
  query_invalidation,
  add_api_url,
  create_enabled = true,
}) {
  const columnHelper = createColumnHelper();
  const custom_columns = [
    {
      id: "ViewObject",
      header: () => <span>View</span>,
      footer: () => <span>View</span>,
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
      footer: () => <span>Name</span>,
      cell: (info) => info.getValue(),
    }),
    // columnHelper.accessor("description", {
    //   header: () => <span>Description</span>,
    //   cell: (info) => info.getValue(),
    // }),
    columnHelper.accessor("description", {
      header: () => <span>Description</span>,
      footer: () => <span>Description</span>,
      size: 250, //set column size for this column
      cell: ({ cell, row }) => {
        return (
          <CustomTooltip delayDuration={400} content={row.original.description}>
            <span className="text-sm line-clamp-2 h-10">
              {row.original.description}
            </span>
          </CustomTooltip>
        );
      },
    }),
    columnHelper.accessor("datafeeds", {
      header: () => <span>Datafeeds</span>,
      footer: () => <span>Datafeeds</span>,
      cell: ({ cell, row }) => {
        return <span>{row.original.datafeeds.length}</span>;
      },
    }),
    columnHelper.accessor("tags", {
      id: "tags",
      header: () => <span>Tags</span>,
      footer: () => <span>Tags</span>,
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
