import { redirect } from "react-router";
import type { Route } from "./+types/signOut";
import { destroySession, getSession } from "~/.server/session";

export async function action({ request }: Route.ActionArgs) {
  const session = await getSession(request);
  return redirect("/sign-in", {
    headers: {
      "Set-Cookie": await destroySession(session),
    },
  });
}
