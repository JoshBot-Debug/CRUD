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
        <Meta />
        <Links />
      </head>
      <body className="relative">
        {isLoading && (
          <div
            className="absolute top-0 left-0 right-0 bottom-0 opacity-0 z-[50] animate-fadeIn"
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
