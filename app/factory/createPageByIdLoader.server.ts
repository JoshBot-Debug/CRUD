import { data, type LoaderFunctionArgs } from "react-router";
import { createHeaders, createURL, fetchAPI } from "~/.server/helper";
import { getSession } from "~/.server/session";

export interface CreatePageByIdLoaderOptions {
	pageParamsKey: string;
	getMany: (options: LoaderFunctionArgs) => `/${string}`;
	getOne: (options: LoaderFunctionArgs) => `/${string}`;
}

export default function createPageByIdLoader(
	options: CreatePageByIdLoaderOptions,
) {
	return async function loader(l: LoaderFunctionArgs) {
		const session = await getSession(l.request);

		const headers = await createHeaders(session);

		const result = {
			many: {} as any,
			one: {} as any,
		};

		{
			const url = createURL(options.getMany(l), {
				request: l.request,
				pageParamsKey: options.pageParamsKey,
			});
			const [response, commit] = await fetchAPI<any>(url, {
				session,
				context: l.context,
			});
			result.many = response ?? {};
			if (commit) await headers.commit();
		}

		{
			const url = createURL(options.getOne(l), {
				request: l.request,
				pageParamsKey: options.pageParamsKey,
			});
			const [response, commit] = await fetchAPI<any>(url, {
				session,
				context: l.context,
			});
			result.one = response ?? {};
			if (commit) await headers.commit();
		}

		return data(result, { headers });
	};
}
