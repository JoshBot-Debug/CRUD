import { fetchAPI } from "~/.server/helper";
import type { Route } from "./+types";

export async function action({ request, params }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const { "*": splat } = params as any;
  const target = `/v1/${splat}`;
  return await fetchAPI((target + "?" + url.searchParams) as any, {
    method: request.method,
    headers: request.headers,
    body: request.body,
    onlyResponse: true,
  })
}

export async function loader({ request, params }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const { "*": splat } = params as any;
  const target = `/v1/${splat}`;
  return await fetchAPI((target + "?" + url.searchParams) as any, {
    method: request.method,
    headers: request.headers,
    body: request.body,
    onlyResponse: true,
  })
}