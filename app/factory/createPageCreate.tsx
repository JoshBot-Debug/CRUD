import Box from "@mui/material/Box";
import { Outlet, useLocation } from "react-router";
import Page, { type PageForm } from "~/components/Page";

export interface CreatePageCreateOptions {
  pageParamsKey: string;
  formId: string;
  pageTitle:
    | string
    | React.ReactNode
    | ((loaderData: any) => string | React.ReactNode);
  renderIcon?: (pathname: string) => React.ReactNode;
  form?: PageForm;
}

export default function createPageCreate(options: CreatePageCreateOptions) {
  return function Create({ loaderData }: any) {
    options.pageTitle =
      typeof options.pageTitle === "function"
        ? options.pageTitle(loaderData)
        : options.pageTitle;
    const location = useLocation();
    return (
      <Page
        pageParamsKey={options.pageParamsKey}
        title={options.pageTitle}
        formId={options.formId}
        form={options.form}
        Icon={options.renderIcon?.(location.pathname)}
        save
      >
        <Box sx={{ display: "flex", flex: 1, gap: 2 }}>
          <Box sx={{ flexGrow: 1, width: "100%" }}>
            <Outlet context={{ formId: options.formId }} />
          </Box>
        </Box>
      </Page>
    );
  };
}
