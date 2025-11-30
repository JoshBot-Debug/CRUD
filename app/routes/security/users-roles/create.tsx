import createPageCreateAction from "~/factory/createPageCreateAction.server";
import createPageCreate from "~/factory/createPageCreate";

export const action = createPageCreateAction({
  pageParamsKey: "users-roles",
  searchKey: "id",
  returnRoute: "../",
  post: () => "/v1/security/users-roles"
});

export default createPageCreate({
  pageTitle: "Assign a role",
  formId: "users-roles",
  pageParamsKey: "users-roles",
  form: {
    create: {
      formAction: (formData, submit) => submit(formData, { method: "POST" })
    }
  }
});
