import { data, Outlet } from "react-router";
import type { Route } from "./+types/BaseLayout";
import { commitSession, getSession } from "~/.server/session";
import type { Toast } from "~/types";
import { useEffect, useState } from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import type { GrowProps } from "@mui/material/Grow";
import Grow from "@mui/material/Grow";
import AlertTitle from "@mui/material/AlertTitle";

export async function loader({ request }: Route.LoaderArgs) {
  const session = await getSession(request);
  const toast = session.get("toast") ?? null;

  const headers = new Headers();

  if (toast) headers.append("Set-Cookie", await commitSession(session));

  return data({ toast }, { headers });
}

export default function BaseLayout({ loaderData }: Route.ComponentProps) {
  const [alert, setAlert] = useState<Toast | null>(null);

  useEffect(() => {
    setAlert(loaderData.toast);
  }, [loaderData.toast]);

  return (
    <>
      <Outlet />
      {!!alert && (
        <Snackbar
          open
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          autoHideDuration={6000}
          onClose={() => setAlert(null)}
          slots={{ transition: GrowTransition }}
          sx={{ maxWidth: 400 }}
        >
          <Alert severity={alert.severity}>
            {alert.title && (
              <AlertTitle variant="h6" sx={{ marginBottom: 0 }}>
                {alert.title}
              </AlertTitle>
            )}
            <pre>{alert.message}</pre>
          </Alert>
        </Snackbar>
      )}
    </>
  );
}

function GrowTransition(props: GrowProps) {
  return <Grow {...props} />;
}
