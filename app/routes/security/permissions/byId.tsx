import createPageByIdAction from "~/factory/createPageByIdAction.server";
import createPageByIdLoader from "~/factory/createPageByIdLoader.server";
import createPageById from "~/factory/createPageById";

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
  form: {
    update: {
      formAction: (formData, submit) => submit(formData, { method: "PATCH" })
    },
    delete: {
      formAction: (formData, submit) => submit(formData, { method: "DELETE" })
    }
  }
});
