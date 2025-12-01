import { fetchAPI } from "~/.server/helper";
import type { Route } from "./+types";

export async function action({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const [result] = await fetchAPI(url.pathname as any, {
    method: request.method,
    headers: request.headers,
    body: request.body,
  })
  return result
}

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const ifNoneMatch = request.headers.get("if-none-match");

  if (ifNoneMatch === "073b042e2516b3a557ea78138e6aacf3")
    return new Response(null, { status: 304 });

  const [result] = await fetchAPI((url.pathname + "?" + url.searchParams) as any, {
    method: request.method,
    headers: request.headers,
    body: request.body,
  })

  return new Response(JSON.stringify(result), {
    status: 200,
    headers: {
      "content-type": "application/json",
      "etag": "073b042e2516b3a557ea78138e6aacf3"
    }
  })
}