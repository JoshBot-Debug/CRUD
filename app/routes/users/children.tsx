import createNavigationChildrenPage from "~/factory/createNavigationChildrenPage";
import { Icon } from "~/icons";

const { pages, DefaultComponent } = createNavigationChildrenPage({
  pageTitle: "User",
  renderIcon: () => Icon.User,
  pages: [
    {
      label: "Details",
      Icon: Icon.Details,
      href: "./details",
    },
    {
      label: "Roles",
      Icon: Icon.Roles,
      href: "./security/roles",
      hrefAdd: "./security/roles/create?create",
    },
    {
      label: "Permissions",
      Icon: Icon.Permissions,
      href: "./security/permissions",
      hrefAdd: "./security/permissions/create?create",
    },
  ],
  shortcuts: [{ label: "Roles & Permissions", command: "Alt + R" }],
});

export { pages };

export default DefaultComponent;
