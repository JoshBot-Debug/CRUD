import type { Route } from "../../+types";
import createPageByIdAction from "~/factory/createPageByIdAction.server";
import createPageByIdLoader from "~/factory/createPageByIdLoader.server";
import createPageById from "~/factory/createPageById";
import { userFullName } from "~/helper";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Users Roles | Iotafox" },
    { name: "description", content: "An Iotafox CRM Solution" },
  ];
}

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
    titleField: "usersId",
    subtitleField: "usersId",
    titleValueFormatter: (value) => {
      return userFullName(value);
    },
    subtitleValueFormatter: (value) => {
      return value.email;
    }
  },
  formId: "users-roles",
  pageParamsKey: "users-roles",
  tabLabel: "Users Roles",
  pageTitle: "Users Role",
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
