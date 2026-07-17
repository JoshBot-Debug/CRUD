
export type HandleRequest = Request & { data: Record<string, any>; params: Record<string, any> }

export type Path = `/${string}`

export type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE"

export type Handle = (req: HandleRequest) => Promise<Response>

export type Router = Record<Method, Record<Path, { handle: Handle; regex: RegExp; keys: string[]; }>>

/**
 * Model describing the filters to apply to the grid.
 * @demos
 *   - [Pass filters to the grid](/x/react-data-grid/filtering/#pass-filters-to-the-data-grid)
 */
export interface GridFilterModel {
  /**
   * @default []
   */
  items: GridFilterItem[];
  /**
   * - `GridLogicOperator.And`: the row must pass all the filter items.
   * - `GridLogicOperator.Or`: the row must pass at least on filter item.
   * @default GridLogicOperator.And
   */
  logicOperator?: GridLogicOperator;
  /**
   * values used to quick filter rows
   * @default []
   */
  quickFilterValues?: any[];
  /**
   * - `GridLogicOperator.And`: the row must pass all the values.
   * - `GridLogicOperator.Or`: the row must pass at least one value.
   * @default GridLogicOperator.And
   */
  quickFilterLogicOperator?: GridLogicOperator;
  /**
   * If `false`, the quick filter will also consider cell values from hidden columns.
   * @default true
   */
  quickFilterExcludeHiddenColumns?: boolean;
}

/**
 * Filter item definition interface.
 * @demos
 *   - [Custom filter operator](/x/react-data-grid/filtering/customization/#create-a-custom-operator)
 */
export interface GridFilterItem {
  /**
   * Must be unique.
   * Only useful when the model contains several items.
   */
  id?: number | string;
  /**
   * The column from which we want to filter the rows.
   */
  field: string;
  /**
   * The filtering value.
   * The operator filtering function will decide for each row if the row values is correct compared to this value.
   */
  value?: any;
  /**
   * The name of the operator we want to apply.
   * A custom operator is supported by providing any string value.
   */
  operator: 'contains' | 'doesNotContain' | 'equals' | 'doesNotEqual' | 'startsWith' | 'endsWith' | '=' | '!=' | '>' | '>=' | '<' | '<=' | 'is' | 'not' | 'after' | 'onOrAfter' | 'before' | 'onOrBefore' | 'isEmpty' | 'isNotEmpty' | 'isAnyOf' | (string & {});
}
declare enum GridLogicOperator {
  And = "and",
  Or = "or",
}
export { GridLogicOperator };