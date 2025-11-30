import createPageCreateAction from "~/factory/createPageCreateAction.server";
import createPageCreate from "~/factory/createPageCreate";

export const action = createPageCreateAction({
  pageParamsKey: "users",
  searchKey: "id",
  returnRoute: "../",
  post: () => "/v1/users"
});

export default createPageCreate({
  formId: "users",
  pageParamsKey: "users",
  pageTitle: "Create User",
  form: {
    create: {
      formAction: (formData, submit) => submit(formData, { method: "POST" })
    }
  }
});
