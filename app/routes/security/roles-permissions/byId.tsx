import type { Route } from "../../+types";
import createPageByIdAction from "~/factory/createPageByIdAction.server";
import createPageByIdLoader from "~/factory/createPageByIdLoader.server";
import createPageById from "~/factory/createPageById";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Roles Permissions | Iotafox" },
    { name: "description", content: "An Iotafox CRM Solution" },
  ];
}

export const action = createPageByIdAction({
  pageParamsKey: "roles-permissions",
  delete: (a) => `/v1/security/roles-permissions/${a.params.rolesPermissionId}`,
  patch: (a) => `/v1/security/roles-permissions/${a.params.rolesPermissionId}`
});

export const loader = createPageByIdLoader({
  getMany: (l) => "userId" in l.params ? `/v1/users/${l.params.userId}/security/roles-permissions` : `/v1/security/roles-permissions`,
  getOne: (l) => "userId" in l.params ? `/v1/users/${l.params.userId}/security/roles-permissions/${l.params.rolesPermissionId}` : `/v1/security/roles-permissions/${l.params.rolesPermissionId}`,
  pageParamsKey: "roles-permissions"
});

export default createPageById({
  column: {
    titleField: "rolesId",
    subtitleField: "rolesId",
    titleValueFormatter: (value) => value.name,
    subtitleValueFormatter: (value) => value.description
  },
  formId: "roles-permissions",
  pageParamsKey: "roles-permissions",
  tabLabel: "Roles Permissions",
  pageTitle: "Roles Permission",
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
