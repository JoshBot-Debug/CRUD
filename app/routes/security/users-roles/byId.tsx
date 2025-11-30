import createPageByIdAction from "~/factory/createPageByIdAction.server";
import createPageByIdLoader from "~/factory/createPageByIdLoader.server";
import createPageById from "~/factory/createPageById";

export const action = createPageByIdAction({
  pageParamsKey: "users-roles",
  delete: (a) => `/v1/security/users-roles/${a.params.usersRoleId}`,
  patch: (a) => `/v1/security/users-roles/${a.params.usersRoleId}`
});

export const loader = createPageByIdLoader({
  getMany: (l) => "userId" in l.params ? `/v1/users/${l.params.userId}/security/users-roles` : `/v1/security/users-roles`,
  getOne: (l) => "userId" in l.params ? `/v1/users/${l.params.userId}/security/users-roles/${l.params.usersRoleId}` : `/v1/security/users-roles/${l.params.usersRoleId}`,
  pageParamsKey: "users-roles"
});

export default createPageById({
  column: {
    titleField: "user",
    subtitleField: "user",
    titleValueFormatter: (value) => {
            return value.full_name;
          },
    subtitleValueFormatter: (value) => {
            return value.username;
          }
  },
  formId: "users-roles",
  pageParamsKey: "users-roles",
  tabLabel: "Users Roles",
  pageTitle: "Users Role",
  form: {
    update: {
      formAction: (formData, submit) => submit(formData, { method: "PATCH" })
    },
    delete: {
      formAction: (formData, submit) => submit(formData, { method: "DELETE" })
    }
  }
});
