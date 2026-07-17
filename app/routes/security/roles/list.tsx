import createPageListLoader from "~/factory/createPageListLoader.server";
import createPageList from "~/factory/createPageList";
import { formatDatetime } from "~/helper";

export const loader = createPageListLoader({
  getMany: (l) => "userId" in l.params ? `/v1/users/${l.params.userId}/security/roles` : `/v1/security/roles`,
  pageParamsKey: "roles"
});

export default createPageList({
  isRowDeleted: row => row.deletedAt,
  columns: [
    {
      field: "id",
      headerName: "ID",
      flex: 1,
      type: "string"
    },
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      type: "string"
    },
    {
      field: "description",
      headerName: "Description",
      flex: 1,
      type: "string"
    },
    {
      field: "createdAt",
      headerName: "Created At",
      flex: 1,
      type: "dateTime",
      valueFormatter: formatDatetime
    },
    {
      field: "updatedAt",
      headerName: "Updated At",
      flex: 1,
      type: "dateTime",
      valueFormatter: formatDatetime
    },
    {
      field: "deletedAt",
      headerName: "Deleted At",
      flex: 1,
      type: "dateTime",
      valueFormatter: formatDatetime
    }
  ],
  formId: "roles",
  pageParamsKey: "roles",
  pageTitle: "Roles",
  import: () => "/v1/security/roles/import"
});
