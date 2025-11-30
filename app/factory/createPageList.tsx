import Box from "@mui/material/Box";
import type { GridColDef } from "@mui/x-data-grid";
import download from "downloadjs";
import { useCallback } from "react";
import { useLocation, useSearchParams, useSubmit, type SubmitFunction } from "react-router";
import { useNavigate, useResolvedPath } from "react-router";
import { exportToCSV } from "~/.client/helper";
import Datatable from "~/components/Datatable";
import FileUpload from "~/components/FileUpload";
import type { OptionsMenuItem } from "~/components/OptionsMenu";
import Page from "~/components/Page";
import useDialog, { type DialogContextType } from "~/hooks/useDialog";
import useDialogComponent from "~/hooks/useDialogComponent";
import useFetchAPI from "~/hooks/useFetchAPI";

type RenderContextMenuItemsOptions = {
  dialog: DialogContextType;
  submit: SubmitFunction;
};

export interface CreatePageListOptions {
  pageParamsKey: string;
  formId: string;
  pageTitle:
  | string
  | React.ReactNode
  | ((loaderData: any) => string | React.ReactNode);
  renderIcon?: (pathname: string) => React.ReactNode;
  onRenderContextMenuItems?: (
    row: any,
    options: RenderContextMenuItemsOptions,
  ) => OptionsMenuItem[];
  columns: Array<GridColDef>;
  import?: () => `/${string}`;
}

export default function createPageList(options: CreatePageListOptions) {
  return function List({ loaderData }: any) {
    options.pageTitle =
      typeof options.pageTitle === "function"
        ? options.pageTitle(loaderData)
        : options.pageTitle;
    const location = useLocation();
    const navigate = useNavigate();
    const r1 = useResolvedPath("../");
    const isNested = r1.pathname !== "/";
    const dialog = useDialog();
    const submit = useSubmit();
    const fetch = useFetchAPI();
    const [searchParams] = useSearchParams();
    const search = searchParams.get(`search:${options.pageParamsKey}`)

    const importDialog = useDialogComponent({
      title: "Import",
      confirmLabel: "Upload",
      content: () => (
        <form id={`import-${options.formId}`}>
          <FileUpload
            label="Select or drop files"
            name="file"
            templateName={`${options.pageTitle}.template.csv`}
            onDownloadTemplate={
              !options.import
                ? undefined
                : async () => {
                  if (!options.import) return;
                  const result = await fetch<any>(options.import());
                  download(result.blob, result.filename, result.mimeType);
                }
            }
          />
        </form>
      ),
      onConfirm: () => { },
      confirmButtonProps: {
        form: `import-${options.formId}`,
        type: "submit",
        formEncType: "multipart/form-data",
        formMethod: "POST",
        formAction(formData) {
          if (!options.import) return;
          fetch(options.import(), {
            method: "POST",
            body: formData,
          }).finally(importDialog.close);
        },
      },
    });

    const onRowDoubleClick = useCallback(
      (row: any) => navigate(window.location.pathname + `/${row.id}`),
      [navigate],
    );

    const onCreate = useCallback(() => {
      navigate(window.location.pathname + `/create?create=${options.formId}`);
    }, [navigate]);

    const onExport = useCallback(
      () =>
        exportToCSV(
          options.columns,
          loaderData.many.rows,
          `${options.pageTitle}.csv`,
        ),
      [loaderData.many.rows],
    );

    const onRenderContextMenuWithDialog = useCallback(
      (row: any) => {
        return (
          options.onRenderContextMenuItems?.(row, { dialog, submit }) ?? []
        );
      },
      [options.onRenderContextMenuItems],
    );

    return (
      <Page
        pageParamsKey={options.pageParamsKey}
        formId={options.formId}
        title={options.pageTitle}
        Icon={options.renderIcon?.(location.pathname)}
        onCreate={onCreate}
        onExport={onExport}
        onImport={importDialog.show}
        isNested={isNested}
        create={!isNested}
        import={!!options.import && !isNested}
        export
        search
      >
        {importDialog.Component}
        <Box
          sx={{
            flex: 1,
            position: "relative",
          }}
        >
          <Datatable
            rows={loaderData.many.rows}
            rowCount={loaderData.many.rowCount}
            hasNextPage={loaderData.many.hasNextPage}
            search={search}
            columns={options.columns}
            onRowDoubleClick={onRowDoubleClick}
            onRenderContextMenuItems={onRenderContextMenuWithDialog}
            sx={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
            }}
          />
        </Box>
      </Page>
    );
  };
}
