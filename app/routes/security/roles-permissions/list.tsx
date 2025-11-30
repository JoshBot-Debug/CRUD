import createPageListLoader from "~/factory/createPageListLoader.server";
import createPageList from "~/factory/createPageList";
import { renderForeignKey } from "~/helper";

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
      field: "role",
      headerName: "Role",
      flex: 1,
      type: "string",
      renderCell: renderForeignKey("/security/roles/", "name")
    },
    {
      field: "permission",
      headerName: "Permission",
      flex: 1,
      type: "string",
      renderCell: renderForeignKey("/security/permissions/", "name")
    }
  ],
  formId: "roles-permissions",
  pageParamsKey: "roles-permissions",
  pageTitle: "Roles Permissions",
  import: () => "/v1/security/roles-permissions/import"
});
