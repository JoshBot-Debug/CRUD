import type { Route } from "../../+types";
import createPageCreateAction from "~/factory/createPageCreateAction.server";
import createPageCreate from "~/factory/createPageCreate";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Roles | Iotafox" },
    { name: "description", content: "An Iotafox CRM Solution" },
  ];
}

export const action = createPageCreateAction({
  pageParamsKey: "roles",
  searchKey: "id",
  returnRoute: "../",
  post: () => "/v1/security/roles"
});

export default createPageCreate({
  formId: "roles",
  pageParamsKey: "roles",
  pageTitle: "Create Role",
  form: {
    create: {
      formAction: (formData, submit) => submit(formData, { method: "POST" })
    }
  }
});
