import type { Route } from "../../+types";
import createPageCreateAction from "~/factory/createPageCreateAction.server";
import createPageCreate from "~/factory/createPageCreate";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Permissions | Iotafox" },
    { name: "description", content: "An Iotafox CRM Solution" },
  ];
}

export const action = createPageCreateAction({
  pageParamsKey: "permissions",
  searchKey: "id",
  returnRoute: "../",
  post: () => "/v1/security/permissions"
});

export default createPageCreate({
  formId: "permissions",
  pageParamsKey: "permissions",
  pageTitle: "Create Permission",
  form: {
    create: {
      formAction: (formData, submit) => submit(formData, { method: "POST" })
    }
  }
});
