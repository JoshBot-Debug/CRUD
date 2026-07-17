import { data, type LoaderFunctionArgs } from "react-router";
import { createHeaders, createURL, fetchAPI } from "~/.server/helper";
import { getSession } from "~/.server/session";
import { parseSearchParams } from "~/helper";

export interface CreatePageListLoaderOptions {
  pageParamsKey: string;
  getMany: (options: LoaderFunctionArgs) => `/${string}`;
}

export default function createPageListLoader(
  options: CreatePageListLoaderOptions,
) {
  return async function loader(l: LoaderFunctionArgs) {
    const session = await getSession(l.request);
    const searchParams = parseSearchParams(l.request);
    const headers = await createHeaders(session);

    const result = {
      many: {} as any,
      searchParams,
    };

    const url = createURL(options.getMany(l), {
      request: l.request,
      pageParamsKey: options.pageParamsKey,
    });

    const r = await fetchAPI<any>(url, {
      session,
      context: l.context,
    });

    if (r instanceof Response) return r;

    if (r.commitSession) await headers.commit();

    result.many = r.result ?? {};

    return data(result, { headers });
  };
}
