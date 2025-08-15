import { createColumnHelper } from "@tanstack/react-table";
import { Link } from "react-router-dom";
import VisibilityIcon from "@mui/icons-material/Visibility";

//my component data
import ModelData from "../../metadata/PredictionModelData.json";
//MONOREPO PACKAGE IMPORTS
import { ColumnGenerator } from "@repo/datatable/ColumnGenerator";

export function PredictionsTableData({
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
    columnHelper.accessor("detector_name", {
      header: () => <span>Detector</span>,
      size: 20, //set column size for this column
      cell: ({ cell, row }) => {
        return (
          <div>
            <Link
              to={"/Detector"}
              state={{ object_id: row.original.detector_id }}
            >
              <strong>{row.original.detector_name} </strong>
            </Link>
          </div>
        );
      },
    }),
    columnHelper.accessor("dataset_name", {
      header: () => <span>Dataset</span>,
      cell: (info) => info.getValue(),
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
