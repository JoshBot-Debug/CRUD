import { eq, SQL } from "drizzle-orm";
import { PgColumn, getTableConfig, type PgTableWithColumns } from "drizzle-orm/pg-core";
import { getRelationships } from "./api/db/relationships";

export type FieldSelection = {
  [key: string]: boolean | FieldSelection | ((localColumn: PgColumn, foreignColumn: PgColumn) => SQL);
};

type FieldJoin = {
  table: PgTableWithColumns<any>;
  condition: any;
}

function getSelectedFields(table: PgTableWithColumns<any>, fields: FieldSelection = {}) {
  const selection: Record<string, any> = {};
  const isSpecificFieldSelection = Object.values(fields).includes(true);

  for (const column of Object.values(table)) {
    if (!(column instanceof PgColumn)) continue;

    // If any field was true, it's a specific selection
    if (fields[column.name] === true) selection[column.name] = column;

    // If it was a specific selection, end here
    if (isSpecificFieldSelection) continue;

    // If a field is false, don't select it
    if (fields[column.name] === false) continue;

    // Select all fields by default
    selection[column.name] = column;
  }

  return selection;
}

export function getJoins(table: PgTableWithColumns<any>, fields: FieldSelection = {}): { selection: Record<string, any>; joins: FieldJoin[] } {
  if (!Object.keys(fields).length) return { selection: {}, joins: [] };

  const relationships = getRelationships(table);

  const selection: Record<string, any> = {};
  const joins: FieldJoin[] = [];

  for (const fk of relationships) {
    const localColumn = fk.localColumn;
    const foreignColumn = fk.foreignColumn;
    const foreignTable = fk.foreignTable;

    const relationName = localColumn.name;
    const value = fields[relationName];

    if (value === true) {
      selection[relationName] = foreignTable;
      joins.push({
        table: foreignTable,
        condition: eq(localColumn, foreignColumn),
      });
    }
    if (typeof value === "function") {
      selection[relationName] = foreignTable;
      joins.push({
        table: foreignTable,
        condition: value(localColumn, foreignColumn),
      });
    }
    else if (typeof value === "object") {
      selection[relationName] = getSelectedFields(foreignTable, value);
      joins.push({
        table: foreignTable,
        condition: eq(localColumn, foreignColumn),
      });
    }
  }

  return { selection, joins };
}

export function getFields(
  table: PgTableWithColumns<any>,
  fields?: FieldSelection,
) {
  const relationships = getRelationships(table);

  const selection = getSelectedFields(table, fields);

  const joins: {
    table: PgTableWithColumns<any>;
    condition: any;
  }[] = [];

  if (!fields) return {
    fields: selection,
    joins,
  };

  for (const fk of relationships) {
    const localColumn = fk.localColumn;
    const foreignColumn = fk.foreignColumn;
    const foreignTable = fk.foreignTable;

    const relationName = localColumn.name;
    const value = fields[relationName];

    if (value === true && !(relationName in selection)) {
      selection[relationName] = foreignTable;
      joins.push({
        table: foreignTable,
        condition: eq(localColumn, foreignColumn),
      });
    }
    else if (typeof value === "function") {
      selection[relationName] = foreignTable;
      joins.push({
        table: foreignTable,
        condition: value(localColumn, foreignColumn),
      });
    }
    else if (typeof value === "object") {
      const recursion = getFields(foreignTable, value);
      selection[relationName] = recursion.fields;
      joins.push({
        table: foreignTable,
        condition: eq(localColumn, foreignColumn),
      }, ...recursion.joins);
    }
  }

  return {
    fields: selection,
    joins,
  };
}