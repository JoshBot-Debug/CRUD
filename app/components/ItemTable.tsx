import DeleteRounded from "@mui/icons-material/DeleteRounded";
import AddRounded from "@mui/icons-material/AddRounded";
import { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";

export type TableControllerRows = Record<string, Record<string, RowItem>>;

type TableControllerOptions<T extends string | number | symbol> = {
  fields: {
    [K in T]: {
      headerName: string;
      defaultValue?: any;
    };
  };
};

export function useItemTableController<T extends string | number | symbol>(
  options: TableControllerOptions<T>,
) {
  const [rows, setRows] = useState<TableControllerRows>(() => {
    const key = generateKey();
    const row = Object.entries(options.fields).reduce(
      (a, [fieldName, { headerName, defaultValue = "" }]: any) => ({
        ...a,
        [fieldName]: { value: defaultValue },
      }),
      {},
    );
    Object.setPrototypeOf(row, { __rowStatus__: 1 });
    return { [key]: row };
  });

  function onAddItem() {
    const key = generateKey();
    const newRow = Object.entries(options.fields).reduce(
      (a, [fieldName, { headerName, defaultValue = "" }]: any) => ({
        ...a,
        [fieldName]: { value: defaultValue },
      }),
      {},
    );
    Object.setPrototypeOf(newRow, { __rowStatus__: 1 });
    setRows((prev) => {
      const next = { ...prev, [key]: newRow };
      Object.setPrototypeOf(next, Object.getPrototypeOf(prev) ?? {});
      return next;
    });
  }

  function onRemoveItem(key: string) {
    setRows((prev) => {
      const next = { ...prev };
      const objectProto = Object.getPrototypeOf(next[key]);

      const proto = Object.getPrototypeOf(prev) ?? {};

      if (objectProto.__rowStatus__ === 2) {
        Object.setPrototypeOf(next[key], {
          ...(Object.getPrototypeOf(next[key]) ?? {}),
          __rowStatus__: 3,
        });
        Object.setPrototypeOf(next, {
          ...proto,
          __deleted__: [...(proto.__deleted__ ?? []), next[key]],
        });
      } else Object.setPrototypeOf(next, proto);

      delete next[key];

      return next;
    });
  }

  function onChange(key: string, column: string, value: any) {
    setRows((prev) => {
      const next = { ...prev };
      next[key][column] = { value: value };
      Object.setPrototypeOf(next, Object.getPrototypeOf(prev) ?? {});
      return next;
    });
  }

  function set(rows: TableControllerRows) {
    for (const rowId in rows) {
      const col = rows[rowId];
      Object.setPrototypeOf(rows[rowId], { __rowStatus__: 2 });
      for (const colName in col) {
        const item = col[colName];
        if (colName === "__metadata__") {
          Object.setPrototypeOf(rows[rowId], {
            __metadata__: item,
            __rowStatus__: 2,
          });
          delete rows[rowId][colName];
        }
      }
    }
    setRows(rows);
  }

  function get() {
    const result = [];

    const data = [
      ...Object.values(rows),
      ...(Object.getPrototypeOf(rows).__deleted__ ?? []),
    ];

    for (let i = 0; i < data.length; i++) {
      const col = data[i];
      const item: any = {};
      for (const colName in col) {
        if (!Object.prototype.hasOwnProperty.call(col, colName)) continue;
        const data = col[colName];
        item[colName] = data.value;
      }
      const proto = Object.getPrototypeOf(col);
      const metadata = proto.__metadata__;
      const rowStatus = proto.__rowStatus__;
      result.push({ ...metadata, rowStatus, ...item });
    }

    return result;
  }

  get();

  return {
    get,
    rows,
    fields: options.fields,
    onAddItem,
    onRemoveItem,
    onChange,
    set,
  };
}

type ControllerProps<T extends string | number | symbol> = ReturnType<
  typeof useItemTableController<T>
>;

type RowItem = { value: any };

type RowItemComponent<T extends string | number | symbol> = React.FC<
  RowItem &
    Omit<ControllerProps<T>, "onChange"> & {
      row: string;
      onChange(value: any): void;
    }
>;

export interface ItemTableProps<T extends string | number | symbol> {
  row: Record<T, RowItemComponent<T>>;
  controller: ControllerProps<T>;
  error?: string;
}

export type ExtractRowItems<
  T extends ReturnType<typeof useItemTableController>,
> = ItemTableProps<keyof T["fields"]>["row"];

export default function ItemTable<T extends string>(props: ItemTableProps<T>) {
  const RowEntries = Object.entries(props.controller.rows);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {props.error && (
        <Typography sx={{ color: "red", fontSize: 14, ml: 2 }}>
          {props.error}
        </Typography>
      )}
      <Table>
        <TableHead>
          <TableRow>
            {Object.entries(props.controller.fields).map(
              ([fieldName, { headerName }]: any) => (
                <TableCell key={fieldName}>{headerName}</TableCell>
              ),
            )}
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {RowEntries.map(([row, items]) => {
            return (
              <TableRow key={row}>
                {Object.entries(items).map(([column, item]) => {
                  const Component = props.row[
                    column as keyof ItemTableProps<T>["row"]
                  ] as RowItemComponent<T>;
                  return (
                    <TableCell key={column}>
                      <Component
                        value={item.value}
                        {...props.controller}
                        row={row}
                        onChange={(value) =>
                          props.controller.onChange(row, column, value)
                        }
                      />
                    </TableCell>
                  );
                })}
                <TableCell>
                  <IconButton
                    className={RowEntries.length === 1 ? "hiddenButton" : ""}
                    onClick={() => props.controller.onRemoveItem(row)}
                    disabled={RowEntries.length === 1}
                  >
                    <DeleteRounded />
                  </IconButton>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      <Button onClick={props.controller.onAddItem} sx={{ ml: "auto" }}>
        Add <AddRounded />
      </Button>
    </Box>
  );
}

function generateKey() {
  return (
    Date.now().toString(32) + Math.floor(Math.random() * 100_000).toString(32)
  );
}
