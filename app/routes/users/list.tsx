import createPageListLoader from "~/factory/createPageListLoader.server";
import createPageList from "~/factory/createPageList";
import { formatDatetime } from "~/helper";

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
    },
    {
      field: "createdAt",
      headerName: "Created At",
      flex: 2,
      type: "dateTime",
      valueFormatter: formatDatetime
    },
    {
      field: "updatedAt",
      headerName: "Updated At",
      flex: 2,
      type: "dateTime",
      valueFormatter: formatDatetime
    },
    {
      field: "deletedAt",
      headerName: "Deleted At",
      flex: 2,
      type: "dateTime",
      valueFormatter: formatDatetime
    }
  ],
  formId: "users",
  pageParamsKey: "users",
  pageTitle: "Users",
  import: () => "/v1/users/import"
});
