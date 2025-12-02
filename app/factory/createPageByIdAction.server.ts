import { data, redirect, type ActionFunctionArgs } from "react-router";
import { createHeaders, fetchAPI, getReferer } from "~/.server/helper";
import { getSession } from "~/.server/session";

export interface CreatePageByIdActionOptions {
  pageParamsKey: string;
  delete: (options: ActionFunctionArgs) => `/${string}`;
  patch: (options: ActionFunctionArgs) => `/${string}`;
}

export default function createPageByIdAction(
  options: CreatePageByIdActionOptions,
) {
  return async function action(a: ActionFunctionArgs) {
    const session = await getSession(a.request);
    const searchParams = new URL(a.request.url).searchParams;
    const formData = await a.request.formData();
    const method = a.request.method.toLowerCase();

    const r = await fetchAPI<any>(
      method === "patch" ? options.patch(a) : options.delete(a),
      {
        session,
        method: a.request.method,
        body: formData,
        context: a.context,
      },
    );

    if (r instanceof Response) return r;

    if (!r.result)
      return data(null, { headers: await createHeaders(session, { commit: r.commitSession }) });

    if (method === "delete")
      return redirect(
        getReferer(a.request, { goBack: !searchParams.has("stayOnPage") }),
        {
          headers: await createHeaders(session, { commit: r.commitSession }),
        },
      );

    return redirect(getReferer(a.request), {
      headers: await createHeaders(session, { commit: r.commitSession }),
    });
  };
}
