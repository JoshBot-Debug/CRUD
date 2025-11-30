import Box from "@mui/material/Box";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Paper from "@mui/material/Paper";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import { useCallback, useState } from "react";
import {
  Link,
  Outlet,
  useLocation,
  useNavigate,
  useResolvedPath,
} from "react-router";
import {
  TinyDatatable,
  type TinyDatatableColDef,
} from "~/components/Datatable";
import Page, { type PageForm } from "~/components/Page";
import TabPanel from "~/components/TabPanel";
import type { MainMenuItem } from "~/menu";
import pluralize from "pluralize";

export interface CreatePageByIdOptions {
  pageParamsKey: string;
  formId: string;
  pageTitle:
    | string
    | React.ReactNode
    | ((loaderData: any) => string | React.ReactNode);
  tabLabel: string;
  form?: PageForm;
  column: TinyDatatableColDef;
  menu?: Array<MainMenuItem>;
  renderIcon?: (pathname: string) => React.ReactNode;
}

export default function createPageById(options: CreatePageByIdOptions) {
  return function ById({ loaderData }: any) {
    options.pageTitle =
      typeof options.pageTitle === "function"
        ? options.pageTitle(loaderData)
        : options.pageTitle;
    const location = useLocation();
    const navigate = useNavigate();
    const [state, setState] = useState<{ tab: number }>({ tab: 0 });
    const r2 = useResolvedPath("../");
    const r1 = useResolvedPath("");

    const isNested = r2.pathname !== "/";
    const isExactMatch = location.pathname == r1.pathname;

    const onNavigateTo = useCallback(
      (row: any) => {
        const paths = r1.pathname.split("/").filter(Boolean);
        navigate("/" + paths.slice(0, -1).join("/") + "/" + row.id);
      },
      [navigate],
    );

    const onCreate = useCallback(() => {
      const path = r1.pathname
        .split("/")
        .filter(Boolean)
        .slice(0, -1)
        .join("/");
      const _formId = options.form?.create?.form ?? options.formId;
      if (!_formId) return;
      navigate("/" + path + `/create?create=${_formId}`);
    }, [navigate]);

    return (
      <Page
        pageParamsKey={options.pageParamsKey}
        title={options.pageTitle}
        Icon={options.renderIcon?.(location.pathname)}
        onCreate={onCreate}
        formId={options.formId}
        form={options.form}
        isNested={isNested}
        create={isExactMatch && !isNested}
        update={isExactMatch}
        delete={isExactMatch}
      >
        <Box sx={{ display: "flex", flex: 1, gap: 2 }}>
          <Paper
            sx={{
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              minWidth: 250,
              maxWidth: 250,
              width: "100%",
              flex: 1,
            }}
          >
            <Tabs
              hidden={!options.menu?.length}
              value={state.tab}
              onChange={(_, tab) => setState((prev: any) => ({ ...prev, tab }))}
            >
              <Tab label={pluralize(options.tabLabel)} value={0} />
              <Tab label="Details" value={1} />
            </Tabs>
            <TabPanel
              value={state.tab}
              index={0}
              sx={{ display: "flex", flex: 1 }}
            >
              <TinyDatatable
                searchKey={`search:${options.formId}`}
                column={options.column}
                rows={loaderData.many.rows}
                onFocus={onNavigateTo}
                onRowDoubleClick={onNavigateTo}
                selected={(r) => r.id == loaderData.one.id}
              />
            </TabPanel>
            <TabPanel
              hidden={!options.menu?.length}
              value={state.tab}
              index={1}
              sx={{ p: 1 }}
            >
              {options.menu?.map((item, index) => (
                <Link key={index} to={item.to}>
                  <ListItem disablePadding sx={{ display: "block", mb: 1 }}>
                    <ListItemButton
                      selected={location.pathname.startsWith(
                        item.to.replaceAll("./", `${r1.pathname}/`),
                      )}
                    >
                      <ListItemIcon>{item.Icon}</ListItemIcon>
                      <ListItemText primary={item.label} />
                    </ListItemButton>
                  </ListItem>
                </Link>
              ))}
            </TabPanel>
          </Paper>
          <Outlet
            key={loaderData.one.id}
            context={{
              formId: options.formId,
              pageVariant: "child",
              loaderData: { one: loaderData.one },
            }}
          />
        </Box>
      </Page>
    );
  };
}
