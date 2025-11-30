import { data, redirect, type ActionFunctionArgs } from "react-router";
import { createHeaders, fetchAPI } from "~/.server/helper";
import { getSession } from "~/.server/session";

export interface CreatePageCreateActionOption {
	pageParamsKey: string;
	searchKey: string;
	returnRoute: `/${string}` | "../";
	post: (options: ActionFunctionArgs) => `/${string}`;
}

export default function createPageCreateAction(
	options: CreatePageCreateActionOption,
) {
	return async function action(a: ActionFunctionArgs) {
		const url = new URL(a.request.url);
		const session = await getSession(a.request);
		const formData = await a.request.formData();

		const [result, commit] = await fetchAPI<any>(options.post(a), {
			session,
			method: a.request.method,
			body: formData,
			context: a.context,
		});

		if (!result)
			return data(null, { headers: await createHeaders(session, { commit }) });

		const isMany = Array.isArray(result.data);
		const record = isMany ? result.data[0] : result.data
		const search = isMany ? result.data.map((r: any) => r[options.searchKey]).join(",") : result.data[options.searchKey]
		const searchParams = new URLSearchParams(url.searchParams);
		searchParams.delete("create");
		searchParams.set("search", search);
		const returnPath = `${options.returnRoute === "../" ? url.pathname.replace(/\/[^/]+$/, "") : options.returnRoute}/${record.id}?${searchParams}`;

		return redirect(returnPath, {
			headers: await createHeaders(session, { commit }),
		});
	};
}
