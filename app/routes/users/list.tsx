import createPageListLoader from "~/factory/createPageListLoader.server";
import createPageList from "~/factory/createPageList";

export const loader = createPageListLoader({
  pageParamsKey: "users",
  getMany: () => "/v1/users"
});

export default createPageList({
  columns: [
    {
      field: "firstName",
      headerName: "First name",
      flex: 2,
      type: "string"
    },
    {
      field: "middleName",
      headerName: "Middle name",
      flex: 2,
      type: "string"
    },
    {
      field: "lastName",
      headerName: "Last name",
      flex: 2,
      type: "string"
    },
    {
      field: "email",
      headerName: "Email",
      flex: 2,
      type: "string"
    },
    {
      field: "phone",
      headerName: "Phone",
      flex: 2,
      type: "string"
    }
  ],
  formId: "users",
  pageParamsKey: "users",
  pageTitle: "Users",
  import: () => "/v1/users/import"
});
