import createPageByIdAction from "~/factory/createPageByIdAction.server";
import createPageByIdLoader from "~/factory/createPageByIdLoader.server";
import createPageById from "~/factory/createPageById";

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
    titleField: "role",
    subtitleField: "role",
    titleValueFormatter: (value) => {
            return value.name;
          },
    subtitleValueFormatter: (value) => {
            return value.description;
          }
  },
  formId: "roles-permissions",
  pageParamsKey: "roles-permissions",
  tabLabel: "Roles Permissions",
  pageTitle: "Roles Permission",
  form: {
    update: {
      formAction: (formData, submit) => submit(formData, { method: "PATCH" })
    },
    delete: {
      formAction: (formData, submit) => submit(formData, { method: "DELETE" })
    }
  }
});
