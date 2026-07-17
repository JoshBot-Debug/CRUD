import type { Route } from "../+types";
import createPageCreateAction from "~/factory/createPageCreateAction.server";
import createPageCreate from "~/factory/createPageCreate";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Users | Iotafox" },
    { name: "description", content: "An Iotafox CRM Solution" },
  ];
}

export const action = createPageCreateAction({
  pageParamsKey: "users",
  searchKey: "id",
  returnRoute: "../",
  post: () => "/v1/users"
});

export default createPageCreate({
  formId: "users",
  pageParamsKey: "users",
  pageTitle: "Create User",
  form: {
    create: {
      formAction: (formData, submit) => submit(formData, { method: "POST" })
    }
  }
});
