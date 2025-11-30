import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { Link, Outlet, useLocation, useResolvedPath } from "react-router";
import type { NavigationChildrenPageOptions } from "./createNavigationChildrenPage";

interface NavigationChildrenLayoutOptions {
  pages: NavigationChildrenPageOptions["pages"];
}

export default function createNavigationChildrenLayout({
  pages,
}: NavigationChildrenLayoutOptions) {
  function DefaultComponent() {
    const r2 = useResolvedPath("../");
    const r1 = useResolvedPath("");
    const isNested = r2.pathname !== r1.pathname;

    return (
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1, flex: 1 }}>
        <Box
          hidden={isNested}
          sx={{
            display: "flex",
            gap: 1,
            width: "100%",
            overflowX: "auto",
            overflowY: "hidden",
            height: 38,
            pr: 8,
            "&::-webkit-scrollbar": {
              height: 2,
            },
            "&::-webkit-scrollbar-track": {
              backgroundColor: "transparent",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#bdbdbd",
              borderRadius: 4,
            },
            "&::-webkit-scrollbar-thumb:hover": {
              backgroundColor: "#9e9e9e",
            },
          }}
        >
          {pages.map((props) => (
            <LinkButton key={props.label} {...props} />
          ))}
        </Box>
        <Outlet />
      </Box>
    );
  }

  return DefaultComponent;
}

function startsWith(a: string, b: string) {
  const _a = a.split("/").filter(Boolean)
  const _b = b.split("/").filter(Boolean)
  
  for (let i = 0; i < _b.length; i++)
    if(_a[i] !== _b[i]) return false

  return true;
}

function LinkButton(props: any) {
  const location = useLocation();
  const resolved = useResolvedPath(props.href);
  const active = startsWith(location.pathname, resolved.pathname);

  return (
    // @ts-ignore
    <Button
      startIcon={props.Icon}
      variant={active ? "contained" : "outlined"}
      size="small"
      to={props.href}
      LinkComponent={Link}
      sx={{ height: 30, whiteSpace: "nowrap", flexShrink: 0 }}
    >
      {props.label}
    </Button>
  );
}
