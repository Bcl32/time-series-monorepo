import React, { Fragment, useState, useEffect } from "react";

import {
  useReactTable,
  getExpandedRowModel,
  getCoreRowModel,
  flexRender,
  getSortedRowModel,
  getPaginationRowModel,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableFooter,
  TableRow,
} from "./Table";

import {
  DropdownMenu,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@repo/utils/Dropdown";

import AddIcon from "@mui/icons-material/Add";
import ViewColumnIcon from "@mui/icons-material/ViewColumn";
import DeleteIcon from "@mui/icons-material/Delete";
import { DataTablePagination } from "./TablePagination";

//MONOREPO PACKAGE IMPORTS
import { useDatabaseMutation } from "@repo/hooks/useDatabaseMutation";
import { DialogButton } from "@repo/utils/DialogButton";
import { Button } from "@repo/utils/Button";
import { AddModelForm } from "@repo/forms/AddModelForm";
import { DeleteModelForm } from "@repo/forms/DeleteModelForm";

export function DataTable(props) {
  const [rowSelection, setRowSelection] = React.useState({});
  let [open, setOpen] = useState(false);

  const [columnVisibility, setColumnVisibility] = React.useState(
    props.columnVisibility
  );

  const [sorting, setSorting] = React.useState([
    {
      id: props.defaultSort, // Must be equal to the accessorKey of the coulmn you want sorted by default
      desc: true,
    },
  ]);
  const tableInstance = useReactTable({
    columns: props.columns,
    data: props.tableData,
    state: {
      sorting,
      rowSelection,
      columnVisibility,
    },
    getRowId: (row) => row.id,
    enableRowSelection: true, //enable row selection for all rows
    onRowSelectionChange: setRowSelection,
    onColumnVisibilityChange: setColumnVisibility,
    getRowCanExpand: () => true,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  function fillFormFromTable(data) {
    props.setFormData(data);
  }

  var rowClickFunction = fillFormFromTable; //fillFormFromTable is the default function to activate on click
  if ("rowClickFunction" in props) {
    //if an alternative click function is provided as a prop
    rowClickFunction = props.rowClickFunction; //the passed prop function is now used on click instead
  }

  return (
    <div>
      <h3 className="display: inline-block text-2xl">{props.title}</h3>
      {props.create_enabled && (
        <DialogButton
          className="display: inline-block"
          key={"dialog-add-entry"}
        >
          <DialogButton.Button asChild>
            <Button variant="default" size="default">
              <AddIcon /> {"Create New"}
            </Button>
          </DialogButton.Button>

          <DialogButton.Content
            title={"Create New " + props.ModelData.model_name}
            variant="grey"
          >
            <AddModelForm
              key={"entryform_add_data_entry"}
              add_api_url={props.add_api_url}
              ModelData={props.ModelData}
              query_invalidation={props.query_invalidation}
            />
          </DialogButton.Content>
        </DialogButton>
      )}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="default" size="default">
            <ViewColumnIcon /> {"Columns"}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {tableInstance
            .getAllColumns()
            .filter((column) => column.getCanHide())
            .map((column) => {
              return (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              );
            })}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* <DialogButton key={"dialog-show-hide-columns"} isModal={true}>
        <DialogButton.Button asChild>
          <Button variant="default" size="default">
            <ViewColumnIcon /> {"Columns"}
          </Button>
        </DialogButton.Button>

        <DialogButton.Content title="Show/Hide Columns">
          {tableInstance.getAllLeafColumns().map((column) => {
            return (
              <div key={column.id} className="px-1">
                <label>
                  <input
                    {...{
                      type: "checkbox",
                      checked: column.getIsVisible(),
                      onChange: column.getToggleVisibilityHandler(),
                    }}
                  />{" "}
                  {column.id}
                </label>
              </div>
            );
          })}
        </DialogButton.Content>
      </DialogButton> */}

      <DialogButton
        key={"dialog-delete-entry"}
        isModal={true}
        className="display: inline-block"
      >
        <DialogButton.Button asChild>
          <Button variant="default" size="default">
            <DeleteIcon /> {"Delete"}
          </Button>
        </DialogButton.Button>

        <DialogButton.Content title="Delete Entries">
          <DeleteModelForm
            key={"delete_entry_form"}
            delete_api_url={props.ModelData.delete_api_url}
            query_invalidation={props.query_invalidation}
            rowSelection={rowSelection}
            setRowSelection={setRowSelection}
          ></DeleteModelForm>
        </DialogButton.Content>
      </DialogButton>

      <Table className="text-md border-4 rounded-lg">
        {/* <TableCaption>
          A data table containing records for {props.title}
        </TableCaption> */}

        <TableHeader>
          {tableInstance.getHeaderGroups().map((headerGroup) => {
            return (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder ? null : (
                        <div
                          style={{
                            width:
                              header.getSize() !== 150
                                ? header.getSize()
                                : undefined,
                          }}
                          {...{
                            className: header.column.getCanSort()
                              ? "cursor-pointer select-none flex min-w-[36px]"
                              : "",
                            onClick: header.column.getToggleSortingHandler(),
                          }}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {{
                            asc: <span className="pl-2">↑</span>,
                            desc: <span className="pl-2">↓</span>,
                          }[header.column.getIsSorted()] ?? null}
                        </div>
                      )}
                    </TableHead>
                  );
                })}
              </TableRow>
            );
          })}
        </TableHeader>
        <TableBody>
          {tableInstance.getRowModel().rows?.length ? ( //if no table results instead the body is just a cell that displays "no results"
            tableInstance.getRowModel().rows.map((row) => (
              <Fragment key={row.id}>
                <TableRow
                  data-state={row.getIsSelected() && "selected"} //enables different styling for selected rows
                  onClick={() => rowClickFunction(row.original)} //optionally passed to datatable object to activate onClick
                >
                  {row.getVisibleCells().map((cell) => {
                    return (
                      <TableCell
                        key={cell.id}
                        style={{
                          // left: cell.column.getStart(),
                          width: cell.column.getSize(),
                        }}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>

                {row.getIsExpanded() && (
                  <TableRow>
                    {/* 2nd row is a custom 1 cell row */}
                    <TableCell colSpan={row.getVisibleCells().length}>
                      {props.renderSubComponent({ row })}
                    </TableCell>
                  </TableRow>
                )}
              </Fragment>
            ))
          ) : (
            //if no table results instead the body is just a cell that displays "no results"
            <TableRow>
              <TableCell
                colSpan={props.columns.length}
                className="h-24 text-center"
              >
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
        <TableFooter>
          {tableInstance.getFooterGroups().map((footerGroup) => (
            <TableRow key={footerGroup.id}>
              {footerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.footer,
                        header.getContext()
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableFooter>
      </Table>

      <DataTablePagination table={tableInstance} />
    </div>
  );
}
