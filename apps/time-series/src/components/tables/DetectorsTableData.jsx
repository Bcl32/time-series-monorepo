import { createColumnHelper } from "@tanstack/react-table";
import { Link } from "react-router-dom";
import VisibilityIcon from "@mui/icons-material/Visibility";

//my component data
import ModelData from "../../metadata/DetectorModelData.json";
//MONOREPO PACKAGE IMPORTS
import { ColumnGenerator } from "@repo/datatable/ColumnGenerator";
import { Tooltip } from "@repo/utils/Tooltip";

export function DetectorsTableData({
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
      size: 20, //set column size for this column
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("description", {
      header: () => <span>Description</span>,
      size: 250, //set column size for this column
      cell: ({ cell, row }) => {
        return (
          <Tooltip delayDuration={400} content={row.original.description}>
            <span className="text-md line-clamp-4 h-24">
              {row.original.description}
            </span>
          </Tooltip>
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
