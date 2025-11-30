import { Outlet } from "react-router";
import ErrorBoundaryComponent from "~/components/ErrorBoundary";

export default function ErrorBoundaryLayout() {
  return <Outlet />;
}

export function ErrorBoundary(props: any) {
  return <ErrorBoundaryComponent {...props} />;
}
