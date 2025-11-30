import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import type React from "react";
import { useLocation, useResolvedPath } from "react-router";
import NavigationPageItem, {
  type NavigationPageItemProps,
} from "~/components/NavigationPageItem";
import Page from "~/components/Page";

export interface NavigationChildrenPageShortcut {
  label: string;
  command: string;
}

export interface NavigationChildrenPageOptions {
  pageTitle: string | ((loaderData: any) => string);
  renderIcon?: (pathname: string) => React.ReactNode;
  pages: Array<NavigationPageItemProps>;
  shortcuts: Array<NavigationChildrenPageShortcut>;
}

export default function createNavigationChildrenPage(
  options: NavigationChildrenPageOptions,
) {
  function DefaultComponent(loaderData: any) {
    const location = useLocation();
    const r1 = useResolvedPath("../");
    const isNested = r1.pathname !== "/";

    const title =
      typeof options.pageTitle === "string"
        ? options.pageTitle
        : options.pageTitle(loaderData);

    return (
      <Page
        title={title}
        Icon={options.renderIcon?.(location.pathname)}
        isNested={isNested}
      >
        <Box sx={{ display: "flex", gap: 2, flex: 1 }}>
          <Box
            sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 1 }}
          >
            {options.pages.map((props) => (
              <NavigationPageItem
                key={props.label}
                {...props}
                hrefAdd={isNested ? "" : props.hrefAdd}
              />
            ))}
          </Box>

          <Card sx={{ maxWidth: 250 }} hidden={isNested}>
            <CardHeader title="Keyboard Shortcuts" />
            <CardContent
              sx={{ display: "flex", flexDirection: "column", gap: 1 }}
            >
              {options.shortcuts.map(({ label, command }) => (
                <Box
                  key={label}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  <Typography>{label}</Typography>
                  <Chip label={command} />
                </Box>
              ))}
            </CardContent>
          </Card>
        </Box>
      </Page>
    );
  }

  return {
    ...options,
    DefaultComponent,
  };
}
