import { Outlet } from "react-router";
import { alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import AppNavbar from "~/components/AppNavbar";
import Header from "~/components/Header";
import SideMenu from "~/components/SideMenu";
import Copyright from "~/components/Copyright";
import type { Route } from "./+types/AuthenticatedLayout";
import { getSession } from "~/.server/session";

const API = import.meta.env.VITE_API;

export const middleware: Route.MiddlewareFunction[] = [
  async ({ request, context }) => {
    // const session = await getSession(request);

    // if (!session.get("token")) return redirect("/sign-in");

    // const [permissions] = await fetchAPI<any>(
    //   createURL("/v1/security/permissions?allPages"),
    //   { session },
    // );

    // context.set(
    //   AppContext.permissions,
    //   permissions.rows.map((row: any) => row.name),
    // );
  },
];

export async function loader({ request, context }: Route.LoaderArgs) {
  const session = await getSession(request);
  const email = session.get("email");

  return { api: API, token: session.get("token")!, user: { email } };
}

export default function AuthenticatedLayout() {
  return (
    <Box sx={{ display: "flex" }}>
      <SideMenu />
      <AppNavbar />
      <Box
        component="main"
        sx={(theme) => ({
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
          backgroundColor: theme.vars
            ? `rgba(${theme.vars.palette.background.defaultChannel} / 1)`
            : alpha(theme.palette.background.default, 1),
          overflow: "auto",
        })}
      >
        <Stack
          spacing={2}
          sx={{
            position: "relative",
            flex: 1,
            alignItems: "center",
            mx: 3,
            pb: 2,
            mt: { xs: 8, md: 0 },
          }}
        >
          <Header />
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              flex: 1,
              width: "100%",
            }}
          >
            <Outlet />
          </Box>
          <Copyright sx={{ my: 4 }} />
        </Stack>
      </Box>
    </Box>
  );
}
