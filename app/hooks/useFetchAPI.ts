import { useState, useCallback, useEffect } from "react";
import { useRevalidator, useRouteLoaderData } from "react-router";
import getCache from "~/cache";

type Path = `/${string}`;

type Status = "initial" | "pending" | "error" | "success";

interface InitOption extends RequestInit {
  disabled?: boolean;
  enableCache?: boolean;
  cacheInvalidationTimeout?: number;
}

interface FetchAPI {
  <T>(input: Path | URL, init?: InitOption): Promise<T>;
  readonly pending: boolean;
}

interface FetchResult<T> {
  pending: boolean;
  status: Status;
  result: T | null;
  error: unknown;
  refetch: () => Promise<T | null>;
}

export default function useFetchAPI(): FetchAPI;

export default function useFetchAPI<T>(
  input: Path | URL,
  init?: InitOption,
): FetchResult<T>;

export default function useFetchAPI<T>(
  input?: Path | URL,
  init?: InitOption,
): FetchAPI | FetchResult<T> {
  const cache = getCache();
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<any>(null);
  const [status, setStatus] = useState<Status>("initial");
  const revalidate = useRevalidator();

  const data = useRouteLoaderData("layouts/AuthenticatedLayout");
  const token = data?.token;
  const api = data?.api;

  const request = useCallback(
    async function <T>(input: Path | URL, init?: InitOption): Promise<T> {
      setStatus("pending");
      setIsLoading(true);
      setError(null);
      try {
        const enableCache = (!init?.method || init.method.toLowerCase() === "get") && init?.enableCache;

        const headers = new Headers(init?.headers);

        if (token) headers.set("authorization", `Bearer ${token}`);

        if (!(init?.body instanceof FormData))
          headers.set("content-type", "application/json");

        const url = new URL(typeof input === "string" ? api + input : input);

        if (enableCache && cache.has(url.toString())) return cache.get(url.toString());

        const response = await fetch(url, { ...init, headers });
        const contentType = response.headers.get("content-type") ?? "";
        const contentDisposition =
          response.headers.get("content-disposition") ?? "";

        if (response.ok) {
          setStatus("success");

          if (contentDisposition.includes("attachment")) {
            const match = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(
              contentDisposition,
            );
            const filename = match ? match[1].replace(/['"]/g, "") : "unknown";

            return {
              blob: (await response.blob()) as T,
              filename: filename,
              mimeType: contentType,
            } as T;
          }

          const pagination = response.headers.get("x-pagination")
            ? JSON.parse(response.headers.get("x-pagination")!)
            : null;

          if (contentType.includes("application/json")) {
            const result = await response.json();
            if (pagination && Array.isArray(result)) {
              const paginationResult = { rows: result, ...pagination } as T;
              setResult(paginationResult);
              if (enableCache) cache.set(url.toString(), paginationResult, { cacheInvalidationTimeout: init?.cacheInvalidationTimeout })
              return paginationResult;
            }
            setResult(result);
            if (enableCache) cache.set(url.toString(), result, { cacheInvalidationTimeout: init?.cacheInvalidationTimeout })
            return result as T;
          }

          if (contentType.includes("text/") || !contentType) {
            const text = await response.text();
            setResult({ text });
            return { text } as T;
          }

          await revalidate.revalidate();
        }

        console.error({ input, init });
        setStatus("error");

        if (contentType.includes("application/problem+json")) {
          const error = await response.json();
          console.error(error);
          setResult(error);
          return error;
        }

        if (contentType.includes("text/")) {
          throw new Error(await response.text());
        }

        throw Object.assign(
          new Error("Received an unknown response from the API"),
          {
            name: "UnknownResponse",
          },
        );
      } catch (e) {
        console.error(e);
        setError(e);
        setStatus("error");
        throw e;
      } finally {
        setIsLoading(false);
      }
    },
    [api, token, data],
  );

  const refetch = useCallback(
    async () => (!input ? null : ((await request(input, init)) as T)),
    [input, init, request],
  );

  useEffect(() => {
    if (!input || init?.disabled) return;
    refetch();
  }, [input, init?.disabled]);

  if (!input) {
    Object.defineProperty(request, "pending", {
      get: () => isLoading,
      enumerable: true,
      configurable: true,
    });

    return request as FetchAPI;
  }

  return {
    pending: isLoading,
    result,
    status,
    error,
    refetch,
  };
}
