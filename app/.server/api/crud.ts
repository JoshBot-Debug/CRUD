import { PgColumn, PgDoublePrecision, PgInteger, PgNumeric, PgNumericBigInt, PgReal, PgSmallInt, PgTimestamp, PgVarchar, type PgTableWithColumns } from "drizzle-orm/pg-core";
import { createRouter } from "./router";
import toast from "./toast";
import { type HandleRequest, type Path } from "./types";
import db from "./db";
import pluralize from "pluralize";
import { and, asc, desc, eq, gte, ilike, inArray, isNotNull, isNull, lt, lte, ne, or, SQL } from "drizzle-orm";
import dayjs from "dayjs";
import { exclude, generateErrorCode } from "../helper";
import { getFields, type FieldSelection } from "../select";
import type { GridFilterModel } from "./types";

const sorting: any = { asc, desc };

export interface CRUDOptions {
  prefix: Path;
  resource: string;
  model: PgTableWithColumns<any>;
  fields?: FieldSelection;
}

function getAll(object: any) {
  const results: any[] = [];

  for (const [key, values] of Object.entries(object) as any) {
    if (!Array.isArray(values)) return [object];
    for (let i = 0; i < values.length; i++) {
      if (!results[i]) results[i] = {}
      results[i][key] = values[i];
    }
  }

  return results
}

function getDateRange(search: string | null) {
  const formats = [
    "MMM D, YYYY",
    "MMM D YYYY",
    "MMM D",
    "D-M-YYYY",
    "DD-MM-YYYY",
    "MM-DD-YYYY",
    "YYYY-MM-DD",
    "YYYY/MM/DD",
    "MMM D, YYYY HH",
    "MMM D, YYYY HH:mm",
    "MM-DD-YYYY HH",
    "MM-DD-YYYY HH:mm",
    "YYYY-MM-DD HH",
    "YYYY-MM-DD HH:mm"
  ];

  let parsed: dayjs.Dayjs | null = null;
  let usedFormat: string | null = null;

  for (const fmt of formats) {
    const d = dayjs(search, fmt, true);
    if (d.isValid()) {
      parsed = d;
      usedFormat = fmt;
      break;
    }
  }

  if (!parsed) return null;

  const hasMinute = /m/.test(usedFormat!);
  const hasHour = /H/.test(usedFormat!);
  const hasDay = /D/.test(usedFormat!) || /DD/.test(usedFormat!);

  let start = parsed;
  let end;

  if (hasMinute) {
    end = parsed.add(1, "minute");
  } else if (hasHour) {
    end = parsed.add(1, "hour");
  } else if (hasDay) {
    end = parsed.add(1, "day");
  } else {
    end = parsed.add(1, "day");
  }

  return { start: start.toDate(), end: end.toDate() };
}

function buildFilters(
  fields: Record<string, any>,
  search: string | null,
  filters: GridFilterModel | null
): SQL | undefined {

  const numericValue = search && /^-?\d+(\.\d+)?$/.test(search) ? Number(search) : null;
  const dateValue = getDateRange(search); // Assumed utility from your scope

  const searchWhere: SQL[] = [];
  const filterWhere: SQL[] = [];

  const columns = Object.values(fields).filter(o => o instanceof PgColumn);
  const relations = Object.values(fields).filter(o => !(o instanceof PgColumn));

  for (const table of relations)
    for (const field in table)
      columns.push(table[field])

  // 1. Process Global Search (Iterating all columns)
  if (search) {
    for (const column of columns) {

      if (!(column instanceof PgColumn)) continue;

      if (column instanceof PgVarchar) {
        searchWhere.push(ilike(column, `%${search}%`));
      }

      if (dateValue != null && column instanceof PgTimestamp) {
        searchWhere.push(
          and(
            gte(column, dateValue.start),
            lt(column, dateValue.end)
          )!
        );
      }

      if (numericValue !== null) {
        if (
          column instanceof PgInteger ||
          column instanceof PgNumericBigInt ||
          column instanceof PgSmallInt ||
          column instanceof PgReal ||
          column instanceof PgDoublePrecision ||
          column instanceof PgNumeric
        ) {
          searchWhere.push(eq(column, numericValue));
        }
      }
    }
  }

  // 2. Process MUI Explicit Filters
  if (filters && Array.isArray(filters.items)) {
    for (const item of filters.items) {
      const { field, operator, value } = item;

      const column = fields[field];

      if (!(column instanceof PgColumn)) continue;

      if (value === undefined || value === null || value === '')
        if (operator !== 'isEmpty' && operator !== 'isNotEmpty') continue;

      let condition: SQL | undefined;

      switch (operator) {
        // String & General Operators
        case 'equals':
          condition = eq(column, value);
          break;
        case 'contains':
          condition = ilike(column, `%${value}%`);
          break;
        case 'startsWith':
          condition = ilike(column, `${value}%`);
          break;
        case 'endsWith':
          condition = ilike(column, `%${value}`);
          break;

        // Numeric & Date Operators
        case 'is':
          condition = eq(column, value);
          break;
        case 'not':
          condition = ne(column, value);
          break;
        case 'after':
          condition = gte(column, value);
          break;
        case 'onOrAfter':
          condition = gte(column, value);
          break;
        case 'before':
          condition = lt(column, value);
          break;
        case 'onOrBefore':
          condition = lte(column, value);
          break;

        // Null / Emptiness Checks
        case 'isEmpty':
          condition = isNull(column);
          break;
        case 'isNotEmpty':
          condition = isNotNull(column);
          break;

        // Array / Multi-select Operators
        case 'isAnyOf':
          if (Array.isArray(value) && value.length > 0)
            condition = inArray(column, value);
          break;

        default:
          console.warn(`Unsupported filter operator: ${operator}`);
          break;
      }

      if (condition)
        filterWhere.push(condition);
    }
  }

  // 3. Combine search and specific filters cleanly
  const conditions: SQL[] = [];

  if (searchWhere.length > 0) {
    conditions.push(or(...searchWhere)!);
  }

  if (filterWhere.length > 0) {
    // MUI linkOperators determine whether items stack with AND or OR (defaults to AND)
    const isOrLink = filters?.logicOperator === 'or';
    conditions.push(isOrLink ? or(...filterWhere)! : and(...filterWhere)!);
  }

  if (conditions.length === 0) return undefined;

  // Both global search AND explicit filters must match
  return and(...conditions);
}

export default function crud({ model, ...options }: CRUDOptions) {
  const router = createRouter({ prefix: options.prefix });

  const param = `${pluralize.singular(options.resource)}Id`;

  const { fields, joins } = getFields(model, options.fields);

  async function create(req: HandleRequest): Promise<Response> {
    const values = getAll(req.data);

    const instances = await (async () => {
      try {
        const [inserted] = await db
          .insert(model)
          .values(values)
          .returning({ id: model.id });

        const query = db
          .select(fields)
          .from(model)
          .where(eq(model.id, inserted.id));

        for (const join of joins)
          query.leftJoin(join.table, join.condition)

        return await query
      } catch (error) {
        const code = generateErrorCode();
        console.error(code, error)
        return new Response(toast.error("Operation failed", `Failed to create record(s). Code: ${code}`), {
          status: 400,
          headers: { "content-type": "application/json" }
        })
      }
    })()

    if (instances instanceof Response) return instances;

    return new Response(toast.success("Create success", `${instances.length} record(s) created`, { data: instances }), {
      status: 200,
      headers: { "content-type": "application/json" }
    })
  }

  async function update(req: HandleRequest): Promise<Response> {
    const values = getAll(req.data);

    const instances = await (async () => {
      try {
        const result = await db.transaction(async (tx) => {
          const ids = (
            await Promise.all(
              values.map(value =>
                tx
                  .update(model)
                  .set(exclude(value, "id"))
                  .where(eq(model.id, value.id))
                  .returning({ id: model.id })
              )
            )
          ).flat().map(r => r.id);

          const query = tx
            .select(fields)
            .from(model)
            .where(inArray(model.id, ids));

          for (const join of joins)
            query.leftJoin(join.table, join.condition);

          return await query;
        });

        return result;
      } catch (error) {
        const code = generateErrorCode();
        console.error(code, error)
        return new Response(toast.error("Operation failed", `Failed to update record(s). Code: ${code}`), {
          status: 400,
          headers: { "content-type": "application/json" }
        })
      }
    })()

    if (instances instanceof Response) return instances;

    return new Response(toast.success("Update success", `${instances.length} record(s) updated`, { data: instances }), {
      status: 200,
      headers: { "content-type": "application/json" }
    })
  }

  async function destroy(req: HandleRequest): Promise<Response> {
    const values = getAll(req.data);

    const groupConditions = values.map(record => {
      const fieldConds = Object.entries(record).map(([key, value]) =>
        eq(model[key], value)
      );
      return and(...fieldConds);
    });

    const whereClause = or(...groupConditions);

    const instances = await (async () => {
      try {
        return await db.update(model).set({ deletedAt: new Date() }).where(whereClause).returning();
      } catch (error) {
        const code = generateErrorCode();
        console.error(code, error)
        return new Response(toast.error("Operation failed", `Failed to delete record(s). Code: ${code}`), {
          status: 400,
          headers: { "content-type": "application/json" }
        })
      }
    })()

    if (instances instanceof Response) return instances;

    return new Response(toast.success("Delete success", `${instances.length} record(s) deleted`, { data: instances }), {
      status: 200,
      headers: { "content-type": "application/json" }
    })
  }

  async function getMany(req: HandleRequest): Promise<Response> {
    const now = performance.now();

    const url = new URL(req.url);

    const one = (await db.select({ updatedAt: model.updatedAt }).from(model).orderBy(desc(model.updatedAt)).limit(1))

    if (!one.length) {
      return new Response(JSON.stringify([]), {
        status: 200,
        headers: {
          "content-type": "application/json",
          "x-pagination": JSON.stringify({
            page: 0,
            pageSize: 0,
            rowCount: 0,
            totalPages: 0,
            hasNextPage: false,
            hasPreviousPage: false,
          }),
          "etag": new Date().toISOString()
        }
      })
    }

    const updatedAt = one[0].updatedAt;

    const ifNoneMatch = req.headers.get("if-none-match")

    if (ifNoneMatch === updatedAt?.toISOString()) {
      console.log(`GET (cached) ${url} took ${performance.now() - now}`)
      return new Response(null, { status: 304 });
    }

    const allPages = url.searchParams.has("allPages")
    const page = Math.max(parseInt(url.searchParams.get("page") || "0", 10), 0);
    const pageSize = Math.max(parseInt(url.searchParams.get("pageSize") || "50", 10), 1);
    const search = url.searchParams.get("search");
    const filters = JSON.parse(url.searchParams.get("filters") ?? "null");
    const sortField = url.searchParams.get("sortField");
    const sortDirection = url.searchParams.get("sortDirection");

    const { fields, joins } = getFields(model, options.fields);

    const offset = page * pageSize;

    const where = buildFilters(fields, search, filters)

    const query = db.select(fields).from(model);

    if (where) query.where(where);

    if (!allPages) query.limit(pageSize).offset(offset);

    if (sortField && sortDirection)
      query.orderBy(sorting[sortDirection](model[sortField]))

    for (const join of joins)
      query.leftJoin(join.table, join.condition)

    const instances = await query;

    console.log(`GET ${url} took ${performance.now() - now}`)

    const rowCount = await db.$count(model)
    const totalPages = Math.ceil(rowCount / pageSize);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    const pagination = {
      page,
      pageSize,
      rowCount,
      totalPages,
      hasNextPage,
      hasPreviousPage,
    };

    return new Response(JSON.stringify(instances), {
      status: 200,
      headers: {
        "content-type": "application/json",
        "x-pagination": JSON.stringify(pagination),
        "etag": updatedAt.toISOString()
      }
    })
  }

  async function getOne(req: HandleRequest): Promise<Response> {
    const id = req.params[param];
    const iquery = db.select({ ...fields, updatedAt: model.updatedAt }).from(model).where(eq(model.id, id));

    for (const join of joins)
      iquery.leftJoin(join.table, join.condition)

    const instance = (await iquery)[0];

    if (!instance)
      return new Response(null, { status: 404 });

    const ifNoneMatch = req.headers.get("if-none-match")

    const updatedAt = instance.updatedAt;

    if (!("updatedAt" in fields))
      delete instance.updatedAt

    if (ifNoneMatch === updatedAt.toISOString())
      return new Response(null, { status: 304 });

    return new Response(JSON.stringify(instance), {
      status: 200,
      headers: {
        "content-type": "application/json",
        "etag": updatedAt.toISOString()
      }
    })
  }

  router("GET", `/${options.resource}`, getMany);
  router("GET", `/${options.resource}/{${param}}`, getOne);
  router("POST", `/${options.resource}`, create);
  router("PATCH", `/${options.resource}/{${param}}`, update);
  router("DELETE", `/${options.resource}/{${param}}`, destroy);
}