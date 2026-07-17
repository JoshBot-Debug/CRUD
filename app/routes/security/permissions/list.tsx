import type { Route } from "../../+types";
import createPageListLoader from "~/factory/createPageListLoader.server";
import createPageList from "~/factory/createPageList";
import { formatDatetime } from "~/helper";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Permissions | Iotafox" },
    { name: "description", content: "An Iotafox CRM Solution" },
  ];
}

export const loader = createPageListLoader({
  getMany: (l) => "userId" in l.params ? `/v1/users/${l.params.userId}/security/permissions` : `/v1/security/permissions`,
  pageParamsKey: "permissions"
});

export default createPageList({
  onRenderContextMenuItems: (row, { dialog, submit }) => {
    return [
      {
        label: "Delete",
        onClick: () => {
          dialog.show({
            title: "Delete row",
            confirmLabel: "Continue",
            message: "Are you sure you want to delete this row?",
            onConfirm: (close) => submit(row, {
              action: `./${row.id}?stayOnPage`,
              method: "DELETE"
            }).finally(close)
          });
        }
      }
    ];
  },
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
      flex: 2,
      type: "string"
    },
    {
      field: "description",
      headerName: "Description",
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
  formId: "permissions",
  pageParamsKey: "permissions",
  pageTitle: "Permissions",
  import: () => "/v1/security/permissions/import"
});
