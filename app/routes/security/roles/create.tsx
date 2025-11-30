import createPageCreateAction from "~/factory/createPageCreateAction.server";
import createPageCreate from "~/factory/createPageCreate";

export const action = createPageCreateAction({
  pageParamsKey: "roles",
  searchKey: "id",
  returnRoute: "../",
  post: () => "/v1/security/roles"
});

export default createPageCreate({
  formId: "roles",
  pageParamsKey: "roles",
  pageTitle: "Create Role",
  form: {
    create: {
      formAction: (formData, submit) => submit(formData, { method: "POST" })
    }
  }
});
