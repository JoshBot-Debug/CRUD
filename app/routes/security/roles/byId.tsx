import createPageByIdAction from "~/factory/createPageByIdAction.server";
import createPageByIdLoader from "~/factory/createPageByIdLoader.server";
import createPageById from "~/factory/createPageById";

export const action = createPageByIdAction({
  pageParamsKey: "roles",
  delete: (a) => `/v1/security/roles/${a.params.roleId}`,
  patch: (a) => `/v1/security/roles/${a.params.roleId}`
});

export const loader = createPageByIdLoader({
  getMany: (l) => "userId" in l.params ? `/v1/users/${l.params.userId}/security/roles` : `/v1/security/roles`,
  getOne: (l) => "userId" in l.params ? `/v1/users/${l.params.userId}/security/roles/${l.params.roleId}` : `/v1/security/roles/${l.params.roleId}`,
  pageParamsKey: "roles"
});

export default createPageById({
  column: {
    titleField: "name",
    subtitleField: "description"
  },
  formId: "roles",
  pageParamsKey: "roles",
  tabLabel: "Roles",
  pageTitle: "Role",
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
