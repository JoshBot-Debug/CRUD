import type { GridColDef } from "@mui/x-data-grid";

export const API = import.meta.env.VITE_API;

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
