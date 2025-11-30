import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import Search from "./Search";

import List from "@mui/material/List";
import ListItemText from "@mui/material/ListItemText";
import ListItemButton from "@mui/material/ListItemButton";
import Box from "@mui/material/Box";
import type { SxProps } from "@mui/material/styles";
import type { Theme } from "@emotion/react";
import type {
  GridColDef,
  GridFilterModel,
  GridPaginationModel,
  GridRowClassNameParams,
  GridSortModel,
} from "@mui/x-data-grid";
import { useLoaderData, useSearchParams } from "react-router";
import OptionsMenu, { type OptionsMenuItem } from "./OptionsMenu";
import type { PopoverPosition } from "@mui/material/Popover";

interface Props {
  onRowDoubleClick?: (row: any) => void;
  sx?: SxProps<Theme>;
  columns: GridColDef[];
  rows: any[];
  rowCount: number;
  hasNextPage: boolean;
  onRenderContextMenuItems?: (row: any) => OptionsMenuItem[];
}

export interface TinyDatatableColDef {
  titleField: string;
  subtitleField?: string;
  titleValueFormatter?: (value: any) => string;
  subtitleValueFormatter?: (value: any) => string;
}

interface TinyDatatableProps {
  searchKey?: string;
  onFocus?: (row: any) => void;
  onRowDoubleClick?: (row: any) => void;
  column: TinyDatatableColDef;
  rows: any[];
  selected?: (row: any) => boolean;
}

export default function Datatable(props: Props) {
  const [anchorPos, setAnchorPos] = React.useState<PopoverPosition | null>(
    null,
  );
  const [contextMenuRowIndex, setContextMenuRowIndex] =
    React.useState<number>(-1);

  const [_, setSearchParams] = useSearchParams();

  const loaderData = useLoaderData();

  const page = loaderData?.searchParams?.page || 0;
  const pageSize = loaderData?.searchParams?.pageSize || 50;

  const sortField = loaderData?.searchParams?.sortField || "";
  const sortDirection =
    (loaderData?.searchParams?.sortDirection as "asc" | "desc") || "asc";

  const sortModel: GridSortModel = React.useMemo(
    () =>
      sortField && sortDirection
        ? [{ field: sortField, sort: sortDirection }]
        : [],
    [sortField, sortDirection],
  );

  const filterModel: GridFilterModel = React.useMemo(
    () => loaderData?.searchParams?.filters ?? { items: [] },
    [JSON.stringify(loaderData?.searchParams?.filters)],
  );

  const paginationModel = React.useMemo(
    () => ({ page, pageSize }),
    [page, pageSize],
  );

  const paginationMeta = React.useMemo(
    () => ({ hasNextPage: props.hasNextPage }),
    [props.hasNextPage],
  );

  const getRowClassName = React.useCallback(
    (params: GridRowClassNameParams<any>) =>
      params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd",
    [],
  );

  const onPaginationModelChange = React.useCallback(
    (model: GridPaginationModel) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          next.set("page", String(model.page));
          next.set("pageSize", String(model.pageSize));
          return next;
        },
        { replace: true, preventScrollReset: true },
      );
    },
    [setSearchParams],
  );

  const onSortModelChange = React.useCallback(
    (model: GridSortModel) => {
      const sort = model[0];
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (sort) {
            next.set("sortField", sort.field);
            next.set("sortDirection", sort.sort ?? "asc");
          } else {
            next.delete("sortField");
            next.delete("sortDirection");
          }
          return next;
        },
        { replace: true, preventScrollReset: true },
      );
    },
    [setSearchParams],
  );

  const onFilterModelChange = React.useCallback(
    (model: GridFilterModel) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (model.items.length > 0)
            next.set("filters", JSON.stringify(model));
          else next.delete("filters");
          return next;
        },
        { replace: true, preventScrollReset: true },
      );
    },
    [setSearchParams],
  );

  const onContextMenu = React.useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      e.preventDefault();
      if (!props.onRenderContextMenuItems) return;
      const element = e.target as HTMLDivElement;
      const parent = element.closest("[data-rowindex]");
      if (!parent) return;
      const rowIndex = parseInt(parent.getAttribute("data-rowindex") ?? "-1");
      if (rowIndex < 0) return;
      setContextMenuRowIndex(rowIndex);
      setAnchorPos({ top: e.clientY, left: e.clientX });
    },
    [props.rows],
  );

  const renderMenuItems = React.useMemo<OptionsMenuItem[]>(() => {
    return (
      props.onRenderContextMenuItems?.(props.rows[contextMenuRowIndex]) ?? []
    );
  }, [props.rows, props.onRenderContextMenuItems, contextMenuRowIndex]);

  return (
    <>
      <DataGrid
        rows={props.rows}
        columns={props.columns}
        onRowDoubleClick={props.onRowDoubleClick}
        getRowClassName={getRowClassName}
        filterMode="server"
        filterModel={filterModel}
        onFilterModelChange={onFilterModelChange}
        sortingMode="server"
        sortModel={sortModel}
        onSortModelChange={onSortModelChange}
        pagination
        paginationMode="server"
        paginationModel={paginationModel}
        pageSizeOptions={pageSizeOptions}
        paginationMeta={paginationMeta}
        rowCount={props.rowCount}
        onPaginationModelChange={onPaginationModelChange}
        density="compact"
        sx={props.sx}
        slotProps={{
          ...datatableSlotProps,
          row: { onContextMenu: onContextMenu },
        }}
      />
      <OptionsMenu
        open={contextMenuRowIndex > -1}
        anchorReference="anchorPosition"
        anchorPosition={anchorPos}
        menuItems={renderMenuItems}
        onClose={() => setContextMenuRowIndex(-1)}
      />
    </>
  );
}

export function TinyDatatable(props: TinyDatatableProps) {
  const [searchParams, setSearchParams] = useSearchParams();

  const onSearch = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (e.target.value)
            next.set(props.searchKey ?? "search", e.target.value);
          else next.delete(props.searchKey ?? "search");
          return next;
        },
        { replace: true, preventScrollReset: true },
      );
    },
    [setSearchParams],
  );

  return (
    <Paper sx={sx.paper}>
      <Search
        sx={sx.search}
        onChange={onSearch}
        defaultValue={
          searchParams.get(props.searchKey ?? "search") || undefined
        }
      />
      <Box sx={sx.box}>
        <List dense sx={sx.list}>
          {props.rows.map((row) => (
            <ListItemButton
              key={row.id}
              sx={sx.listItemButton}
              onDoubleClick={() =>
                props.onRowDoubleClick && props.onRowDoubleClick(row)
              }
              onFocus={() => props.onFocus && props.onFocus(row)}
              selected={props.selected && props.selected(row)}
            >
              <ListItemText
                slotProps={{
                  primary: {
                    sx: { overflow: "hidden", textOverflow: "ellipsis" },
                  },
                  secondary: {
                    sx: { overflow: "hidden", textOverflow: "ellipsis" },
                  },
                }}
                primary={
                  props.column.titleValueFormatter
                    ? props.column.titleValueFormatter(
                        row[props.column.titleField],
                      )
                    : row[props.column.titleField]
                }
                secondary={
                  !props.column.subtitleField
                    ? undefined
                    : props.column.subtitleValueFormatter
                      ? props.column.subtitleValueFormatter(
                          row[props.column.subtitleField],
                        )
                      : row[props.column.subtitleField]
                }
              />
            </ListItemButton>
          ))}
        </List>
      </Box>
    </Paper>
  );
}

const sx = {
  paper: {
    flex: 1,
    p: 0,
    display: "flex",
    flexDirection: "column",
    minWidth: 250,
  },
  search: { mx: 1, mt: 1 },
  box: { flex: 1, position: "relative" },
  listItemButton: { flex: 0, borderRadius: 1 },
  list: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexGrow: 1,
    overflowY: "auto",
    px: 1,
    gap: 1,
    scrollbarWidth: "thin",
    scrollbarColor: "#bdbdbd transparent",
    "&::-webkit-scrollbar": {
      width: 8,
    },
    "&::-webkit-scrollbar-track": {
      backgroundColor: "transparent",
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: "#bdbdbd",
      borderRadius: 4,
    },
    "&::-webkit-scrollbar-thumb:hover": {
      backgroundColor: "#9e9e9e",
    },
  },
};

const pageSizeOptions = [25, 50, 100];

const datatableSlotProps = {
  filterPanel: {
    filterFormProps: {
      logicOperatorInputProps: {
        variant: "outlined",
        size: "small",
      },
      columnInputProps: {
        variant: "outlined",
        size: "small",
        sx: { mt: "auto" },
      },
      operatorInputProps: {
        variant: "outlined",
        size: "small",
        sx: { mt: "auto" },
      },
      valueInputProps: {
        InputComponentProps: {
          variant: "outlined",
          size: "small",
        },
      },
    },
  },
};
