import type { RouterContextProvider } from "react-router";
import { commitSession, getSession, type Session } from "./session";
import type { AlertColor } from "@mui/material/Alert";
import { parseFormData } from "~/helper";
import util from "util";
import { fetch } from "./api/api";

const API = import.meta.env.VITE_API;

type Path = `/${string}`;

export async function createHeaders(
  session: Session,
  options?: { commit: boolean },
) {
  const headers = new Headers();

  async function commit() {
    headers.set("Set-Cookie", await commitSession(session));
  }

  if (options?.commit) await commit();

  return Object.assign(headers, { commit });
}

export function createURL(
  path: Path,
  {
    request,
    pageParamsKey,
  }: { pageParamsKey?: string; request?: Request } = {},
) {
  const url = new URL(API + path);
  if (request) {
    const requestUrl = new URL(request.url);
    const merged = new URLSearchParams(url.search);

    for (const [key, value] of requestUrl.searchParams.entries())
      merged.set(key, value);

    url.search = merged.toString();
  }

  if (pageParamsKey) {
    for (const [key, value] of url.searchParams.entries()) {
      if (!key.includes(":")) continue;
      const [k, f] = key.split(":");
      if (f !== pageParamsKey) continue;
      url.searchParams.delete(key);
      url.searchParams.set(k, value);
    }
  }

  return url;
}

export async function fetchAPI<T>(
  input: Path | URL,
  init: RequestInit & {
    session?: Session;
    request?: Request;
    context?: Readonly<RouterContextProvider>;
  },
): Promise<{ result: T, commitSession: boolean, response: Response } | Response>;

export async function fetchAPI(
  input: Path | URL,
  init: RequestInit & {
    session?: Session;
    request?: Request;
    context?: Readonly<RouterContextProvider>;
    onlyResponse: true;
  },
): Promise<Response>;

export async function fetchAPI<T>(
  input: Path | URL,
  {
    request,
    session,
    context,
    onlyResponse,
    ...init
  }: RequestInit & {
    session?: Session;
    request?: Request;
    context?: Readonly<RouterContextProvider>;
    onlyResponse?: true;
  } = {},
): Promise<{ result: T, commitSession: boolean, response: Response } | Response> {
  if (request && !session) session = await getSession(request);

  init.headers = new Headers(init.headers);

  const token = !session ? null : session.get("token");

  if (token) init.headers.set("authorization", `Bearer ${token}`);

  if (init.body instanceof FormData)
    init.body = JSON.stringify(parseFormData(init.body));

  init.headers.set("content-type", "application/json");

  const url = new URL(typeof input === "string" ? API + input : input);

  const response = await fetch(url, init);

  if (onlyResponse || response.status === 304)
    return response;

  const contentType = response.headers.get("content-type") ?? "";

  // Success
  if (response.ok) {
    const pagination = (() => {
      if (response.headers.get("x-pagination"))
        return JSON.parse(response.headers.get("x-pagination")!);
      return null;
    })();

    if (contentType.includes("application/json")) {
      const result = await response.json();
      const commitSession = "toast" in result && !!session;

      if (commitSession && session) session.flash("toast", result.toast);

      if (!!pagination && Array.isArray(result))
        return { result: { rows: result, ...pagination } as T, commitSession: false, response };
      return { result, commitSession, response };
    }

    if (contentType.includes("text/") || !contentType) {
      const text = await response.text();
      return { result: { text } as T, commitSession: false, response };
    }
  }

  if (!response.ok) {
    console.error({ input, init, response });
    if (
      contentType.includes("application/problem+json") ||
      contentType.includes("application/json")
    ) {
      const error = await response.json();
      console.error(util.inspect(error, { depth: null, colors: true }));
      if (session) {
        if ("toast" in error) session.flash("toast", error.toast);
        else
          session.flash("toast", {
            severity: getAlertColor(response.status),
            title: error.title,
            message: getDetailMessage(error?.detail),
          });
        return { result: null as T, commitSession: true, response };
      }
      return { result: null as T, commitSession: false, response };
    }

    if (contentType.includes("text/")) throw new Error(await response.text());
  }

  console.error({ input, init, response });

  const error = new Error();
  error.name = "Unknown response";
  error.message = "Received an unknown response from the API";
  throw error;
}

function getDetailMessage(detail: any) {
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail))
    return detail
      .map((r: any) => {
        if ("loc" in r && Array.isArray(r.loc))
          return (
            r.msg + ": " + r.loc.filter((s: string) => s !== "body").join(".")
          );
        return r.msg;
      })
      .join("\n");
  return JSON.stringify(detail);
}

function getAlertColor(status: number): AlertColor {
  if (status >= 200 && status < 300) return "success";
  if (status >= 300 && status < 400) return "info";
  if (status >= 400 && status < 500) return "warning";
  if (status >= 500) return "error";
  return "info";
}

export function getReferer(
  request: Request,
  options?: {
    replace?: [number, any][];
    goBack?: boolean;
    keepParams?: boolean | URLSearchParams;
  },
) {
  let paths = !request.headers.get("referer")
    ? new URL(request.url).pathname.split("/").filter(Boolean)
    : new URL(request.headers.get("referer")!).pathname
      .split("/")
      .filter(Boolean);
  if (options?.goBack) paths = paths.slice(0, -1);
  if (options?.replace) {
    for (let i = 0; i < options.replace.length; i++) {
      let [index, value] = options.replace[i];
      if (index < 0) index = paths.length + index;
      if (index >= 0 && index < paths.length) paths[index] = value;
    }
  }
  const params = new URL(request.url).search;
  if (options?.keepParams) {
    if (options.keepParams instanceof URLSearchParams)
      return "/" + paths.join("/") + "?" + options.keepParams;
    return "/" + paths.join("/") + params;
  }
  return "/" + paths.join("/");
}

export function renameSearchParams(
  searchParams: URLSearchParams,
  from: string,
  to: string,
  defaultValue: string = "",
) {
  const current = searchParams.get(from);
  if (defaultValue == "" && !current) return;
  searchParams.set(to, searchParams.get(from) || defaultValue);
  searchParams.delete(from);
}

export function renameFormData(
  formData: FormData,
  from: string,
  to: string,
  defaultValue: string = "",
) {
  const current = formData.get(from);
  if (defaultValue == "" && !current) return;
  formData.set(to, formData.get(from) || defaultValue);
  formData.delete(from);
}

export interface APIError {
  type: string;
  title: string;
  status: number;
  traceId: string;
  errors: Record<string, Array<string>>;
}

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no I, O, 0, 1

function randomString(length: number): string {
  let result = "";

  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    const bytes = new Uint8Array(length);
    crypto.getRandomValues(bytes);

    for (let i = 0; i < length; i++) {
      result += ALPHABET[bytes[i] % ALPHABET.length];
    }

    return result;
  }

  for (let i = 0; i < length; i++) {
    result += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
  }

  return result;
}

export function generateErrorCode(): string {
  const timestamp = Date.now().toString(36).toUpperCase();

  return `ERR-${timestamp}-${randomString(6)}`;
}

export function exclude<T extends Record<string, any>>(object: T, ...keys: (string | number | symbol)[]) {
  return Object.entries(object).reduce((a, [key, value]: [keyof T, T[keyof T]]) => {
    if (keys.includes(key)) return a;
    a[key] = value;
    return a;
  }, {} as T)
}

export function prepareSearchParams(
  primary: URLSearchParams,
  defaults: URLSearchParams
) {
  for (const [key, value] of defaults.entries()) {
    if (key === "filters") {
      const primaryFilters = JSON.parse(
        primary.get("filters") ?? '{"items":[]}'
      ) as { items: any[] };

      const defaultFilters = JSON.parse(value) as {
        items: any[];
      };

      const merged = [...primaryFilters.items];

      for (const filter of defaultFilters.items) {
        const exists = merged.some(
          (f) => f.field === filter.field
        );

        if (!exists) {
          merged.push(filter);
        }
      }

      primary.set("filters", JSON.stringify({ items: merged }));
    } else if (!primary.has(key)) {
      primary.set(key, value);
    }
  }
}

export function applyDefaultDatatableSearchParams(url: URL) {
  const defaultSearchParams = new URLSearchParams({
    sortField: "createdAt",
    sortDirection: "desc",
    filters: JSON.stringify({ items: [{ field: 'deletedAt', operator: 'isEmpty' }] })
  })
  
  prepareSearchParams(url.searchParams, defaultSearchParams);
}