import createPageByIdAction from "~/factory/createPageByIdAction.server";
import createPageByIdLoader from "~/factory/createPageByIdLoader.server";
import createPageById from "~/factory/createPageById";

export const action = createPageByIdAction({
  pageParamsKey: "users",
  delete: (a) => `/v1/users/${a.params.userId}`,
  patch: (a) => `/v1/users/${a.params.userId}`
});

export const loader = createPageByIdLoader({
  pageParamsKey: "users",
  getMany: () => "/v1/users",
  getOne: (l) => `/v1/users/${l.params.userId}`
});

export default createPageById({
  column: {
    titleField: "firstName",
    subtitleField: "email"
  },
  formId: "users",
  pageParamsKey: "users",
  tabLabel: "Users",
  pageTitle: "User",
  form: {
    update: {
      formAction: (formData, submit) => submit(formData, { method: "PATCH" })
    },
    delete: {
      formAction: (formData, submit) => submit(formData, { method: "DELETE" })
    }
  }
});
