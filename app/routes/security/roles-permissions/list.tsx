import createPageListLoader from "~/factory/createPageListLoader.server";
import createPageList from "~/factory/createPageList";
import { formatDatetime, renderForeignKey } from "~/helper";

export const loader = createPageListLoader({
  getMany: (l) => "userId" in l.params ? `/v1/users/${l.params.userId}/security/roles-permissions` : `/v1/security/roles-permissions`,
  pageParamsKey: "roles-permissions"
});

export default createPageList({
  columns: [
    {
      field: "id",
      headerName: "ID",
      flex: 1,
      type: "string"
    },
    {
      field: "rolesId",
      headerName: "Role",
      flex: 1,
      type: "string",
      renderCell: renderForeignKey("/security/roles/", "name")
    },
    {
      field: "permissionsId",
      headerName: "Permission",
      flex: 1,
      type: "string",
      renderCell: renderForeignKey("/security/permissions/", "name")
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
  formId: "roles-permissions",
  pageParamsKey: "roles-permissions",
  pageTitle: "Roles Permissions",
  import: () => "/v1/security/roles-permissions/import"
});
