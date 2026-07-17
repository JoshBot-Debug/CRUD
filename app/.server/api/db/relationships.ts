import { getTableConfig, PgColumn, type PgTableWithColumns } from "drizzle-orm/pg-core";

type ReverseForeignKey = {
  foreignTable: PgTableWithColumns<any>;
  localColumn: PgColumn;
  foreignColumn: PgColumn;
};

const reverseForeignKeys = new Map<PgTableWithColumns<any>, ReverseForeignKey[]>();

export function prepareRelationships(
  schema: Record<string, PgTableWithColumns<any>>,
) {
  reverseForeignKeys.clear();

  for (const table of Object.values(schema)) {
    const config = getTableConfig(table);

    const relationships = [];

    for (const fk of config.foreignKeys) {
      const reference = fk.reference();

      const localColumn = reference.columns[0];
      const foreignColumn = reference.foreignColumns[0];
      const foreignTable = reference.foreignTable as PgTableWithColumns<any>;

      relationships.push({
        foreignTable,
        localColumn,
        foreignColumn,
      });
    }
    
    reverseForeignKeys.set(table, relationships);
  }
}

export function getRelationships(table: PgTableWithColumns<any>, field: string): ReverseForeignKey | null;

export function getRelationships(table: PgTableWithColumns<any>): ReverseForeignKey[];

export function getRelationships(table: PgTableWithColumns<any>, field?: string) {
  const relationships = reverseForeignKeys.get(table) ?? [];

  if(field === undefined)
    return relationships;

  for(const relation of relationships)
    if(relation.localColumn.name === field) return relation;

  return null
}
