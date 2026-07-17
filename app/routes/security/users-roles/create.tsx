import type { Route } from "../../+types";
import createPageCreateAction from "~/factory/createPageCreateAction.server";
import createPageCreate from "~/factory/createPageCreate";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Users Roles | Iotafox" },
    { name: "description", content: "An Iotafox CRM Solution" },
  ];
}

export const action = createPageCreateAction({
  pageParamsKey: "users-roles",
  searchKey: "id",
  returnRoute: "../",
  post: () => "/v1/security/users-roles"
});

export default createPageCreate({
  pageTitle: "Assign a role",
  formId: "users-roles",
  pageParamsKey: "users-roles",
  form: {
    create: {
      formAction: (formData, submit) => submit(formData, { method: "POST" })
    }
  }
});
