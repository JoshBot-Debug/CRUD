import createNavigationChildrenPage from "~/factory/createNavigationChildrenPage";
import { applyDatatableDefaultFilters } from "~/helper";
import { Icon } from "~/icons";
import type { Route } from "../+types";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Security | Iotafox" },
    { name: "description", content: "An Iotafox CRM Solution" },
  ];
}

const { pages, DefaultComponent } = createNavigationChildrenPage({
  pageTitle: "Security",
  renderIcon: () => Icon.Security,
  pages: [
    {
      label: "Users & Roles",
      Icon: Icon.UsersAndRoles,
      href: applyDatatableDefaultFilters("../security/users-roles"),
      hrefAdd: "../security/users-roles/create?create=users-roles",
    },
    {
      label: "Roles & Permissions",
      Icon: Icon.RolesAndPermissions,
      href: applyDatatableDefaultFilters("../security/roles-permissions"),
      hrefAdd: "../security/roles-permissions/create?create=roles-permissions",
    },
    {
      label: "Roles",
      Icon: Icon.Roles,
      href: applyDatatableDefaultFilters("../security/roles"),
      hrefAdd: "../security/roles/create?create=roles",
    },
    {
      label: "Permissions",
      Icon: Icon.Permissions,
      href: applyDatatableDefaultFilters("../security/permissions"),
      hrefAdd: "../security/permissions/create?create=permissions",
    },
  ],
  shortcuts: [{ label: "Roles & Permissions", command: "Alt + R" }],
});

export { pages };

export default DefaultComponent;
