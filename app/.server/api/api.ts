import crud from "~/.server/api/crud";
import router from "./router";
import type { Method } from "./types";
import { ProblemDocument } from "http-problem-details";
import { permissions, roles, rolesPermissions, users, usersRoles } from "./db/schema";

import.meta.glob("./v*/**/*.ts", { eager: true });

crud({
  prefix: "/v1",
  resource: "users",
  model: users,
  fields: { password: false },
})

crud({
  prefix: "/v1/security",
  resource: "roles",
  model: roles,
})

crud({
  prefix: "/v1/security",
  resource: "users-roles",
  model: usersRoles,
  fields: { usersId: { id: true, firstName: true, middleName: true, lastName: true }, rolesId: { id: true, name: true } }
})

crud({
  prefix: "/v1/security",
  resource: "roles-permissions",
  model: rolesPermissions,
  fields: { permissionsId: {}, rolesId: {} }
})

crud({
  prefix: "/v1/security",
  resource: "permissions",
  model: permissions,
})

const routes = router();

export async function fetch(input: string | URL, init?: RequestInit | undefined): Promise<Response> {

  const url = new URL(input);

  if (!init)
    init = { method: "GET" };

  const request = new Request(url, init)

  const method = request.method.toUpperCase();

  const candidates = Object.values(routes[method as Method]);

  let match = null;

  for (const route of candidates) {
    const result = route.regex.exec(url.pathname);
    if (!result) continue;
    match = { route, params: result.slice(1) };
    break;
  }

  if (!match) throw new Response("Not found", { status: 404 });

  try {
    const { handle } = match.route;
    const params: Record<string, string> = {};
    match.route.keys.forEach((key, index) => params[key] = match.params[index]);
    const handleRequest = Object.assign(request, { data: !init.body ? null : JSON.parse(init.body as any), params })
    const response = await handle(handleRequest)
    return response
  } catch (error) {
    if (error instanceof ProblemDocument)
      return new Response(JSON.stringify(error), { status: error.status, statusText: error.title, headers: { "content-type": "application/json" } })
    if (error instanceof Response) return error;
    console.error(error)
  }

  return new Response("Unknown error", { status: 500 });;
}