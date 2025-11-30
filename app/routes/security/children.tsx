import createNavigationChildrenPage from "~/factory/createNavigationChildrenPage";
import { Icon } from "~/icons";

const { pages, DefaultComponent } = createNavigationChildrenPage({
  pageTitle: "Security",
  renderIcon: () => Icon.Security,
  pages: [
    {
      label: "Users & Roles",
      Icon: Icon.UsersAndRoles,
      href: "../security/users-roles",
      hrefAdd: "../security/users-roles/create?create=users-roles",
    },
    {
      label: "Roles & Permissions",
      Icon: Icon.RolesAndPermissions,
      href: "../security/roles-permissions",
      hrefAdd: "../security/roles-permissions/create?create=roles-permissions",
    },
    {
      label: "Roles",
      Icon: Icon.Roles,
      href: "../security/roles",
      hrefAdd: "../security/roles/create?create=roles",
    },
    {
      label: "Permissions",
      Icon: Icon.Permissions,
      href: "../security/permissions",
      hrefAdd: "../security/permissions/create?create=permissions",
    },
  ],
  shortcuts: [{ label: "Roles & Permissions", command: "Alt + R" }],
});

export { pages };

export default DefaultComponent;
