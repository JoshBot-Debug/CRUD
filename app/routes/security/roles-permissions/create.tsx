import createPageCreateAction from "~/factory/createPageCreateAction.server";
import createPageCreate from "~/factory/createPageCreate";

export const action = createPageCreateAction({
  pageParamsKey: "roles-permissions",
  searchKey: "id",
  returnRoute: "../",
  post: () => "/v1/security/roles-permissions"
});

export default createPageCreate({
  pageTitle: "Assign a permission",
  formId: "roles-permissions",
  pageParamsKey: "roles-permissions",
  form: {
    create: {
      formAction: (formData, submit) => submit(formData, { method: "POST" })
    }
  }
});
