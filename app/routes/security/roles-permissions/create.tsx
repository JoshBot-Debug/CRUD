import type { Route } from "../../+types";
import createPageCreateAction from "~/factory/createPageCreateAction.server";
import createPageCreate from "~/factory/createPageCreate";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Roles Permissions | Iotafox" },
    { name: "description", content: "An Iotafox CRM Solution" },
  ];
}

export const action = createPageCreateAction({
  pageParamsKey: "roles-permissions",
  searchKey: "id",
  returnRoute: "../",
  post: () => "/v1/security/roles-permissions"
});

export default createPageCreate({
  pageTitle: "Assign a permission",
  formId: "roles-permissions",
  pageParamsKey: "roles-permissions",
  form: {
    create: {
      formAction: (formData, submit) => submit(formData, { method: "POST" })
    }
  }
});
