import { fetchAPI } from "~/.server/helper";
import type { Route } from "./+types";

export async function action({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  return await fetchAPI(url.pathname as any, {
    method: request.method,
    headers: request.headers,
    body: request.body,
    onlyResponse: true,
  })
}

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  return await fetchAPI((url.pathname + "?" + url.searchParams) as any, {
    method: request.method,
    headers: request.headers,
    body: request.body,
    onlyResponse: true,
  })
}