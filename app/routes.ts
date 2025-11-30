import {
  type RouteConfig,
  index,
  route,
  layout,
} from "@react-router/dev/routes";
import crud, { type DefaultPageOptions } from "./crud";

const defaultOptions: DefaultPageOptions = { apiPrefix: "/v1" }

const inlined = {
  formatDatetime: () => crud.inline("formatDatetime", [`import { formatDatetime } from "~/helper";`]),
  renderForeignKey: () => crud.inline("renderForeignKey(\"/{crud::route}/\", \"name\")", [`import { renderForeignKey } from "~/helper";`]),
  nestedGetMany: () => crud.inline(`(l) => "userId" in l.params ? \`/v1/users/\${l.params.userId}/{crud::route}\` : \`/v1/{crud::route}\``),
  nestedGetOne: () => crud.inline(`(l) => "userId" in l.params ? \`/v1/users/\${l.params.userId}/{crud::route}/\${l.params.{crud::paramsId}}\` : \`/v1/{crud::route}/\${l.params.{crud::paramsId}}\``),
}

const CRUD = [
  ...crud("users", {
    list: crud.defaultList({
      page: {
        columns: [
          { field: "firstName", headerName: "First name", flex: 2, type: "string" },
          { field: "middleName", headerName: "Middle name", flex: 2, type: "string" },
          { field: "lastName", headerName: "Last name", flex: 2, type: "string" },
          { field: "email", headerName: "Email", flex: 2, type: "string" },
          { field: "phone", headerName: "Phone", flex: 2, type: "string" },
          { field: "createdAt", headerName: "Created At", flex: 2, type: "dateTime", valueFormatter: inlined.formatDatetime(), },
          { field: "updatedAt", headerName: "Updated At", flex: 2, type: "dateTime", valueFormatter: inlined.formatDatetime(), },
          { field: "deletedAt", headerName: "Deleted At", flex: 2, type: "dateTime", valueFormatter: inlined.formatDatetime(), },
        ],
      }
    }, defaultOptions),

    create: crud.defaultCreate({}, defaultOptions),
    byId: crud.defaultById({
      page: {
        column: {
          titleField: "firstName",
          subtitleField: "email",
        }
      }
    }, defaultOptions),
  }),

  ...crud.layout("security", [
    [crud, "roles"],
    [crud, "permissions"],
    [crud, "roles-permissions"],
    [crud, "users-roles"]
  ]),
]

export default [
  layout("layouts/BaseLayout.tsx", [
    index("routes/index.tsx"),

    route("sign-in", "routes/signIn.tsx"),
    route("sign-out", "routes/signOut.tsx"),
    route("v1/*", "routes/proxy.tsx"),

    layout("layouts/AuthenticatedLayout.tsx", [
      layout("layouts/ErrorBoundaryLayout.tsx", [
        route("dashboard", "routes/dashboard.tsx"),
        ...CRUD
      ]),
    ]),
  ]),
] satisfies RouteConfig;
