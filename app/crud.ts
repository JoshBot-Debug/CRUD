import {
  route,
  layout,
  prefix,
  type RouteConfigEntry,
} from "@react-router/dev/routes";

import type { CreatePageListLoaderOptions } from "./factory/createPageListLoader.server";
import type { CreatePageListOptions } from "./factory/createPageList";
import type { CreatePageCreateActionOption } from "./factory/createPageCreateAction.server";
import type { CreatePageCreateOptions } from "./factory/createPageCreate";
import type { CreatePageByIdOptions } from "./factory/createPageById";
import type { CreatePageByIdLoaderOptions } from "./factory/createPageByIdLoader.server";
import type { CreatePageByIdActionOptions } from "./factory/createPageByIdAction.server";

import * as fs from "fs";
import { dirname } from "path";
import pluralize from "pluralize";

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object
  ? T[P] extends Function
  ? T[P]
  : DeepPartial<T[P]>
  : T[P];
};

export interface DefaultPageOptions { apiPrefix?: `/${string}` }

export type CRUDOptionsList = {
  loader: CreatePageListLoaderOptions;
  page: CreatePageListOptions;
  children?: RouteConfigEntry[];
}

export type CRUDOptionsCreate = {
  action: CreatePageCreateActionOption;
  page: CreatePageCreateOptions;
  children?: RouteConfigEntry[];
}

export type CRUDOptionsById = {
  loader: CreatePageByIdLoaderOptions;
  action: CreatePageByIdActionOptions;
  page: CreatePageByIdOptions;
  children?: RouteConfigEntry[];
}

export interface CRUDOptions {
  layouts?: string[];
  list?: DeepPartial<CRUDOptionsList>;
  create?: DeepPartial<CRUDOptionsCreate>;
  byId?: DeepPartial<CRUDOptionsById>;
  routeIdPrefix?: string;
}

export interface DefaultPageArgs {
  type: "Create" | "List" | "ById"
  loader?: any;
  action?: any;
  page?: any;
}

export interface LayoutOptions {
  routeIdPrefix?: string;
}

function writeFileSync(path: string, content: string) {
  fs.mkdirSync(dirname(path), { recursive: true });
  fs.writeFileSync(path, content, "utf-8");
}

function toCode(value: any, indent = 2): string {
  if (typeof value === "function")
    return value.toString();

  if (value && typeof value === "object" && value.__inline)
    return value.toString();

  if (Array.isArray(value))
    return `[\n${value.map(v =>
      " ".repeat(indent) + toCode(v, indent + 2)
    ).join(",\n")}\n${" ".repeat(indent - 2)}]`;

  if (value && typeof value === "object") {
    const entries = Object.entries(value)
      .map(([k, v]) =>
        `${" ".repeat(indent)}${k}: ${toCode(v, indent + 2)}`
      );
    return `{\n${entries.join(",\n")}\n${" ".repeat(indent - 2)}}`;
  }

  return JSON.stringify(value);
}


function extractImports(value: any): string {
  if (value && typeof value === "object" && value.__imports)
    return value.__imports.join("\n").trim();

  if (Array.isArray(value))
    return value.map(v => extractImports(v)).join("\n").trim()

  if (value && typeof value === "object") {
    const entries = Object.entries(value)
      .map(([k, v]) => extractImports(v));
    return entries.join("\n").trim();
  }

  return "";
}


function isPlainObject(obj: any): obj is Record<string, any> {
  return typeof obj === "object" && obj !== null && !Array.isArray(obj);
}

function inline(str: string, imports: string[] = []): any {
  return {
    __inline: true,
    __imports: imports,
    __value: str,
    toString() {
      return this.__value
    }
  }
}

function inlineReplacer(object: any, replacerMap: any) {
  function validate(inlineObject: any) {
    const replacerKeys = Object.keys(replacerMap);
    const pattern = /{crud::(.*?)}/g;
    const matches = inlineObject.__value.matchAll(pattern);
    for (const match of matches) {
      const fullMatch = match[0];
      if (!replacerKeys.includes(fullMatch)) {
        console.error(
          `CRUD Error: Invalid matcher key "${fullMatch}"\n` +
          `Available choices: ${replacerKeys.join(", ")}\n`
        );
      }
    }
  }

  if (object.__inline) {
    validate(object);
    for (const key in replacerMap)
      object.__value = object.__value.replaceAll(key, replacerMap[key])
    return object;
  }

  for (const key in object) {
    const value = object[key];
    if (isPlainObject(value))
      object[key] = inlineReplacer(value, replacerMap);
    else if (Array.isArray(value))
      for (let i = 0; i < value.length; i++)
        value[i] = inlineReplacer(value[i], replacerMap);
  }

  return object;
}

function merge<T>(object: T, next: DeepPartial<T>): T {
  if (!next) return object;

  for (const key in object) {
    const value = object[key];

    // @ts-ignore
    if (!(key in next))
      // @ts-ignore
      next[key] = value;
    else {
      const nextVal = next[key];
      if (isPlainObject(value) && isPlainObject(nextVal))
        merge(value, nextVal);
      else if (Array.isArray(value) && Array.isArray(nextVal))
        // @ts-ignore
        next[key] = [...value, ...nextVal];
    }
  }

  return next as T;
}

function getNameFromResource(resource: string) {
  return resource.split("-").map(n => n[0].toUpperCase() + n.slice(1)).join(" ")
}

function removeDuplicateLines(...args: string[]) {
  const seen = new Set<string>();

  for (const block of args) {
    for (const line of block.split("\n")) {
      const trimmed = line.trim();
      if (trimmed && !seen.has(trimmed)) {
        seen.add(trimmed);
      }
    }
  }

  return Array.from(seen).join("\n");
}

const CRUD_FILE = ({ type, page, loader, action }: DefaultPageArgs) => {
  let out = "";

  if (action)
    out += `import createPage${type}Action from "~/factory/createPage${type}Action.server";\n`;

  if (loader)
    out += `import createPage${type}Loader from "~/factory/createPage${type}Loader.server";\n`;

  if (page)
    out += `import createPage${type} from "~/factory/createPage${type}";`;

  const actionImports = extractImports(action)
  const loaderImports = extractImports(loader)
  const pageImports = extractImports(page)
  const extraImports = removeDuplicateLines(actionImports, loaderImports, pageImports);

  if (extraImports)
    out += "\n" + extraImports;

  if (action)
    out += `\n\nexport const action = createPage${type}Action(${toCode(action)});`;

  if (loader)
    out += `\n\nexport const loader = createPage${type}Loader(${toCode(loader)});`;

  if (page)
    out += `\n\nexport default createPage${type}(${toCode(page)});`;

  return out.trim() + "\n";
};

function generateDefaultListOptions(options: { routeDir: string; resource: string; __override: DeepPartial<CRUDOptionsList>; __options: DefaultPageOptions }): CRUDOptionsList {
  const apiPrefix = options.__options.apiPrefix ?? "/"
  const route = (apiPrefix + "/" + options.routeDir) as any;
  const name = getNameFromResource(options.resource)


  const merged = merge({
    loader: {
      pageParamsKey: options.resource,
      getMany: inline(`() => "${route}"`)
    },
    page: {
      formId: options.resource,
      pageParamsKey: options.resource,
      pageTitle: pluralize(name),
      import: inline(`() => "${route}/import"`),
      columns: [],
    }
  }, options.__override)

  return inlineReplacer(merged, { "{crud::route}": options.routeDir, "{crud::name}": name })
}

function generateDefaultCreateOptions(options: { routeDir: string; resource: string; __override: DeepPartial<CRUDOptionsCreate>; __options: DefaultPageOptions }): CRUDOptionsCreate {
  const apiPrefix = options.__options.apiPrefix ?? "/"
  const route = (apiPrefix + "/" + options.routeDir) as any;
  const name = getNameFromResource(options.resource)
  const merged = merge({
    action: {
      pageParamsKey: options.resource,
      searchKey: "id",
      returnRoute: "../",
      post: inline(`() => "${route}"`),
    },
    page: {
      formId: options.resource,
      pageParamsKey: options.resource,
      pageTitle: inline(`"Create ${pluralize.singular(name)}"`),
      form: {
        create: {
          formAction: (formData, submit) => submit(formData, { method: "POST" }),
        },
      },
    }
  }, options.__override)

  return inlineReplacer(merged, { "{crud::route}": options.routeDir, "{crud::name}": name })
}

function resourceToParamsId(str: string) {
  const pascal = pluralize.singular(str)
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('');

  return pascal.charAt(0).toLowerCase() + pascal.slice(1) + 'Id';
}

function generateDefaultByIdOptions(options: { routeDir: string; resource: string; __override: DeepPartial<CRUDOptionsById>; __options: DefaultPageOptions }): CRUDOptionsById {
  const apiPrefix = options.__options.apiPrefix ?? "/"
  const route = (apiPrefix + "/" + options.routeDir) as any;
  const name = getNameFromResource(options.resource)
  const paramsId = resourceToParamsId(options.resource)
  const merged = merge({
    action: {
      pageParamsKey: options.resource,
      delete: inline(`(a) => \`${route}/\${a.params.${paramsId}}\``),
      patch: inline(`(a) => \`${route}/\${a.params.${paramsId}}\``),
    },
    loader: {
      pageParamsKey: options.resource,
      getMany: inline(`() => "${route}"`),
      getOne: inline(`(l) => \`${route}/\${l.params.${paramsId}}\``),
    },
    page: {
      formId: options.resource,
      pageParamsKey: options.resource,
      tabLabel: pluralize(name),
      pageTitle: pluralize.singular(name),
      form: {
        update: {
          formAction: (formData, submit) => submit(formData, { method: "PATCH" }),
        },
        delete: {
          formAction: (formData, submit) => submit(formData, { method: "DELETE" }),
        },
      },
      column: { titleField: "id" },
    }
  }, options.__override)

  return inlineReplacer(merged, { "{crud::route}": options.routeDir, "{crud::name}": name, "{crud::paramsId}": paramsId })
}

function crud(resource: string, options: CRUDOptions = {}) {
  const layouts = options.layouts ?? []
  const layoutIds = layouts.join(".")
  const dir = `${layoutIds.length ? layoutIds + "." : ""}${resource}`
  const id = `${options.routeIdPrefix ? `${options.routeIdPrefix}.` : ""}${dir}`
  const routeDir = dir.replace(/\./g, "/");
  const paramsId = resourceToParamsId(resource)

  if (options.list) {
    if ((options.list as any).__.__default) options.list = generateDefaultListOptions({ ...(options.list as any).__, routeDir, resource })
    writeFileSync(`${import.meta.dirname}/routes/${routeDir}/list.tsx`, CRUD_FILE({ type: "List", ...options.list }))
  }

  if (options.create) {
    if ((options.create as any).__.__default) options.create = generateDefaultCreateOptions({ ...(options.create as any).__, routeDir, resource })
    writeFileSync(`${import.meta.dirname}/routes/${routeDir}/create.tsx`, CRUD_FILE({ type: "Create", ...options.create }))
  }

  if (options.byId) {
    if ((options.byId as any).__.__default) options.byId = generateDefaultByIdOptions({ ...(options.byId as any).__, routeDir, resource })
    writeFileSync(`${import.meta.dirname}/routes/${routeDir}/byId.tsx`, CRUD_FILE({ type: "ById", ...options.byId }))
  }

  return prefix(resource, [
    route("", `routes/${routeDir}/list.tsx`, { id: `${id}.list` }, options.list?.children),
    route(`:${paramsId}`, `routes/${routeDir}/byId.tsx`, { id: `${id}.byId` }, [
      {
        index: true,
        id: `${id}.byId.upsert.component`,
        file: `routes/${routeDir}/upsert.component.tsx`,
      },
      ...(options.byId?.children ?? [])
    ]),
    route("create", `routes/${routeDir}/create.tsx`, { id: `${id}.create` }, [
      {
        index: true,
        id: `${id}.create.upsert.component`,
        file: `routes/${routeDir}/upsert.component.tsx`,
      },
      ...(options.create?.children ?? [])
    ]),
  ])
}


crud.layout = function (resource: string, curds: [typeof crud, ...Parameters<typeof crud>][], options?: LayoutOptions) {
  const routeDir = resource.replace(/\./g, "/");
  const id = options?.routeIdPrefix

  const children = curds.flatMap(([fn, ...args]: any) => {
    const opts = args[1] ?? {};
    if (!Array.isArray(opts.layouts)) opts.layouts = []
    opts.layouts.push(resource)
    if (options?.routeIdPrefix) opts.routeIdPrefix = options.routeIdPrefix;
    return fn(args[0], opts)
  })

  return prefix(resource.split(".").slice(-1)[0], [
    route("", `routes/${routeDir}/children.tsx`, { id: `${id}.children` }),
    layout(`routes/${routeDir}/children.layout.tsx`, { id: `${id}.children.layout` }, children),
  ])
}

crud.defaultList = function (override?: DeepPartial<CRUDOptionsList>, options: DefaultPageOptions = {}) {
  return {
    __: {
      __default: true,
      __override: override,
      __options: options,
    },
  } as any
}

crud.defaultById = function (override?: DeepPartial<CRUDOptionsById>, options: DefaultPageOptions = {}) {
  return {
    __: {
      __default: true,
      __override: override,
      __options: options,
    },
  } as any
}

crud.defaultCreate = function (override?: DeepPartial<CRUDOptionsCreate>, options: DefaultPageOptions = {}) {
  return {
    __: {
      __default: true,
      __override: override,
      __options: options,
    },
  } as any
}

crud.inline = inline;

export default crud;