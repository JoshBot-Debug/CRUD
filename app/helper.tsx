import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import type { GridColDef } from "@mui/x-data-grid";
import dayjs from "dayjs";
import { Link, useResolvedPath } from "react-router";
import { ToWords } from "to-words";

export function exportToCSV<T extends Record<string, any>>(
  columns: GridColDef[],
  rows: T[],
  filename = "export.csv",
) {
  if (!rows || rows.length === 0) {
    console.warn("No data to export");
    return;
  }

  const header = columns.map((col) => col.headerName ?? col.field).join(",");

  const body = rows
    .map((row) => {
      return columns
        .map((col) => {
          const value = row[col.field as keyof T];
          if (col.valueFormatter) {
            // If the column defines a formatter, use it
            // @ts-ignore
            return JSON.stringify(col.valueFormatter(value, null, null, null));
          }
          // Escape commas/quotes properly
          return JSON.stringify(value ?? "");
        })
        .join(",");
    })
    .join("\n");

  const csv = `${header}\n${body}`;

  // Trigger download
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
}

function isPlainObject(obj: any): obj is Record<string, any> {
  return typeof obj === "object" && obj !== null && !Array.isArray(obj);
}

export function merge<T>(object: T, next: T): T {
  if (!next) return object;

  for (const key in object) {
    const value = object[key];

    // @ts-ignore
    if (!(key in next))
      // @ts-ignore
      next[key] = value;
    else {
      const nextVal = next[key];

      if (isPlainObject(value) && isPlainObject(nextVal)) merge(value, nextVal);
      else if (Array.isArray(value) && Array.isArray(nextVal))
        // @ts-ignore
        next[key] = [...value, ...nextVal];
    }
  }
  return next;
}

export function renderForeignKey(url: `/${string}/`) {
  return ({ value }: any) => {
    const r2 = useResolvedPath("../");
    const to = r2.pathname.slice(0, -1) + url;

    if (!Array.isArray(value))
      return <Link to={to + value.id}>{value.id}</Link>;
    return (
      <Box sx={{ display: "flex", gap: 1 }}>
        {value.map(({ id }: any) => (
          <Link key={id} to={to + id}>
            <Chip label={id} color="info" />
          </Link>
        ))}
      </Box>
    );
  };
}

export function formatMoney(value: any) {
  if (isNaN(parseFloat(value))) return "0.00";
  return (
    "₹ " +
    parseFloat(value).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  );
}

export function formatDate(value: any) {
  if (!value) return "";
  const date = dayjs(value);
  if (date.isValid()) return date.format("MMMM D, YYYY");
  return value;
}

export function formatDatetime(value: any) {
  if (!value) return "";
  const date = dayjs(value);
  if (date.isValid()) return date.format("MMMM D, YYYY h:mm A");
  return value;
}

export const toWords = new ToWords({
  localeCode: "en-IN",
  converterOptions: {
    currency: true,
    ignoreDecimal: false,
    ignoreZeroCurrency: false,
    doNotAddOnly: false,
    currencyOptions: {
      name: "Rupee",
      plural: "Rupees",
      symbol: "₹",
      fractionalUnit: {
        name: "Paisa",
        plural: "Paise",
        symbol: "",
      },
    },
  },
});

export function parseFormData(formData: FormData): any {
  const result: Record<string, any> = {};

  for (const [key, value] of formData.entries()) {
    if (result[key] !== undefined) {
      if (!Array.isArray(result[key])) result[key] = [result[key]];
      result[key].push(parseValue(value));
    } else {
      result[key] = parseValue(value);
    }
  }

  return result;
}

export function parseSearchParams(request: Request) {
  const url = new URL(request.url);
  const result: any = {};
  for (const [key, value] of url.searchParams)
    assignDeep(result, key, parseValue(value));
  return result;
}

export function parseValue(value: any) {
  if (value === "true") return true;
  if (value === "false") return false;
  if (value === "null") return null;
  if (value === "undefined") return undefined;
  if (!isNaN(Number(value)) && value.trim() !== "") return Number(value);
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

export function assignDeep(obj: any, key: string, value: any) {
  const path = key.replace(/\]/g, "").split("[");

  let curr = obj;
  for (let i = 0; i < path.length; i++) {
    const part = path[i];
    const isLast = i === path.length - 1;

    if (isLast) {
      if (curr[part] !== undefined) {
        curr[part] = [].concat(curr[part], value);
      } else {
        curr[part] = value;
      }
    } else {
      if (!curr[part] || typeof curr[part] !== "object") {
        curr[part] = {};
      }
      curr = curr[part];
    }
  }
}
