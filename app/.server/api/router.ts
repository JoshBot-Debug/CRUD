import type { Path, Handle, Method, Router } from "./types";

interface Options {
  prefix?: Path;
}

const initialRoutes: Router = {
  GET: {},
  POST: {},
  PUT: {},
  PATCH: {},
  DELETE: {},
}

const g_Routes = initialRoutes;

export function createRouter(options?: Options) {

  function patternToRegex(pattern: string) {
    // Convert "/users/{id}" → /^\/users\/([^/]+)$/
    const keys: string[] = [];
    const regex = new RegExp(
      "^" +
      pattern.replace(/\{([^\/]+)\}/g, (_, key) => {
        keys.push(key);
        return "([^/]+)";
      }) +
      "$"
    );
    return { regex, keys };
  }

  function addPrefix(route: Path): Path {
    const prefix = (options?.prefix ?? "") as Path
    return (prefix + route) as Path
  }

  function addRoute(method: Method, handle: Handle): void;
  function addRoute(method: Method, route: Path, handle: Handle): void;
  function addRoute(method: Method, routeOrHandle: Path | Handle, handleMaybe?: Handle) {
    const route = typeof routeOrHandle === "function"
      ? (!!options?.prefix ? options?.prefix : null)
      : typeof routeOrHandle === "string" ? routeOrHandle : null;

    const handle = typeof routeOrHandle === "function" ? routeOrHandle : (!!handleMaybe ? handleMaybe : null);

    if (!!route && !!handle) {
      const fullRoute = typeof routeOrHandle === "function" ? route : addPrefix(route);
      // if (!g_Routes[method][fullRoute]) g_Routes[method][fullRoute] = []
      // if (g_Routes[method][fullRoute].includes(handle)) return;
      // if (g_Routes[method][fullRoute].length >= 1) return;
      // g_Routes[method][fullRoute].push(handle);
      g_Routes[method][fullRoute] = {
        ...patternToRegex(fullRoute),
        handle
      }
      return;
    }

    throw new Error("Invalid arguments for router (const router = createRouter)")
  }

  return addRoute
}

export default function router() {
  return g_Routes;
}