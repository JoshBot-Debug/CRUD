import createPageListLoader from "~/factory/createPageListLoader.server";
import createPageList from "~/factory/createPageList";
import { renderForeignKey, userFullName } from "~/helper";

export const loader = createPageListLoader({
  getMany: (l) => "userId" in l.params ? `/v1/users/${l.params.userId}/security/users-roles` : `/v1/security/users-roles`,
  pageParamsKey: "users-roles"
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
      field: "users_id",
      headerName: "User",
      flex: 1,
      type: "string",
      renderCell: renderForeignKey("/users/", userFullName)
    },
    {
      field: "roles_id",
      headerName: "Role",
      flex: 1,
      type: "string",
      renderCell: renderForeignKey("/security/roles/", "name")
    }
  ],
  formId: "users-roles",
  pageParamsKey: "users-roles",
  pageTitle: "Users Roles",
  import: () => "/v1/security/users-roles/import"
});
