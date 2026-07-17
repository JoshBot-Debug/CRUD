import type { Route } from "../../+types";
import createPageByIdAction from "~/factory/createPageByIdAction.server";
import createPageByIdLoader from "~/factory/createPageByIdLoader.server";
import createPageById from "~/factory/createPageById";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Permissions | Iotafox" },
    { name: "description", content: "An Iotafox CRM Solution" },
  ];
}

export const action = createPageByIdAction({
  pageParamsKey: "permissions",
  delete: (a) => `/v1/security/permissions/${a.params.permissionId}`,
  patch: (a) => `/v1/security/permissions/${a.params.permissionId}`
});

export const loader = createPageByIdLoader({
  getMany: (l) => "userId" in l.params ? `/v1/users/${l.params.userId}/security/permissions` : `/v1/security/permissions`,
  getOne: (l) => "userId" in l.params ? `/v1/users/${l.params.userId}/security/permissions/${l.params.permissionId}` : `/v1/security/permissions/${l.params.permissionId}`,
  pageParamsKey: "permissions"
});

export default createPageById({
  column: {
    titleField: "name",
    subtitleField: "description"
  },
  formId: "permissions",
  pageParamsKey: "permissions",
  tabLabel: "Permissions",
  pageTitle: "Permission",
  isRowDeleted: row => row.deletedAt,
  form: {
    update: {
      formAction: (formData, submit) => submit(formData, { method: "PATCH" })
    },
    delete: {
      formAction: (formData, submit) => submit(formData, { method: "DELETE", action: "?stayOnPage" })
    },
    restore: {
      restoreWhen: loaderData => !!loaderData.one.deletedAt,
      formAction: (formData, submit) => {
        formData.set("deletedAt", "null");
        return submit(formData, { method: "PATCH" });
      }
    }
  }
});
