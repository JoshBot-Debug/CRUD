import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";

import AppTheme from "~/theme/AppTheme";
import CssBaseline from "@mui/material/CssBaseline";
import { StyledEngineProvider } from "@mui/material/styles";

import {
  chartsCustomizations,
  datePickersCustomizations,
  treeViewCustomizations,
} from "~/theme/customizations";

import "./app.css";

import useNProgress from "~/hooks/useNProgress";

import ErrorBoundaryComponent from "~/components/ErrorBoundary";
import { DialogProvider } from "./hooks/useDialog";
import type { Route } from "./+types/root";

import InitColorSchemeScript from "@mui/material/InitColorSchemeScript";
import { Box, CircularProgress, LinearProgress, Typography } from "@mui/material";
import Logo from "./components/Logo";

const xThemeComponents = {
  ...chartsCustomizations,
  ...datePickersCustomizations,
  ...treeViewCustomizations,
};

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const isLoading = useNProgress();

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <InitColorSchemeScript />
        <Meta />
        <Links />
      </head>
      <body className="relative">
        {isLoading && (
          <div
            className="absolute top-0 left-0 right-0 bottom-0 opacity-0 z-50 animate-fadeIn"
            style={{
              backgroundColor: "var(--template-palette-background-paper)",
            }}
          />
        )}
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <StyledEngineProvider injectFirst>
      <AppTheme themeComponents={xThemeComponents}>
        <CssBaseline enableColorScheme />
        <DialogProvider>
          <Outlet />
        </DialogProvider>
      </AppTheme>
    </StyledEngineProvider>
  );
}

export function ErrorBoundary(props: any) {
  return <ErrorBoundaryComponent {...props} />;
}

export function HydrateFallback() {
  return (
    <StyledEngineProvider injectFirst>
      <AppTheme themeComponents={xThemeComponents}>
        <CssBaseline enableColorScheme />

        <Box
          sx={(theme) => ({
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
            p: 3,
            width: "100%",
            backgroundRepeat: "no-repeat",
            backgroundImage:
              "radial-gradient(ellipse 80% 50% at 50% -20%, hsl(210, 100%, 90%), transparent)",
            ...theme.applyStyles("dark", {
              backgroundImage:
                "radial-gradient(ellipse 80% 50% at 50% -20%, hsl(210, 100%, 16%), transparent)",
            }),
          })}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              maxWidth: 380,
              textAlign: "center",
              gap: 3,
            }}
          >
            <Box sx={{ maxWidth: 150 }}>
              <Logo />
            </Box>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Typography variant="h6" component="h3" fontWeight="600" color="text.primary">
                Loading assets
              </Typography>
              <Typography variant="body2" color="text.secondary">
                This won't take too long...
              </Typography>
            </Box>

            <Box sx={{ width: 192 }}>
              <LinearProgress
                variant="indeterminate"
                color="primary"
                sx={{
                  height: 4,
                  borderRadius: 2,
                  backgroundColor: 'action.disabledBackground'
                }}
              />
            </Box>
          </Box>
        </Box>

      </AppTheme>
    </StyledEngineProvider>
  );
}