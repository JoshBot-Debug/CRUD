import type React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {
  useLocation,
  useNavigate,
  useOutletContext,
  useSearchParams,
  useSubmit,
  type SubmitFunction,
} from "react-router";
import { useCallback } from "react";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";

import SaveIcon from "@mui/icons-material/Save";
import DownloadRounded from "@mui/icons-material/DownloadRounded";
import ImportExportRounded from "@mui/icons-material/ImportExportRounded";
import CreateIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PrintIcon from "@mui/icons-material/Print";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Search from "./Search";
import ButtonGroup from "@mui/material/ButtonGroup";

interface FormItem {
  form?: string;
  formAction: (
    formData: FormData,
    submit: SubmitFunction,
  ) => Promise<void> | void;
}

export interface PageForm {
  create?: FormItem;
  update?: FormItem;
  delete?: FormItem;
}

interface Props extends React.PropsWithChildren {
  title: string | React.ReactNode;
  pageParamsKey?: string;
  formId?: string;
  Icon?: React.ReactNode;
  onCreate?: () => void;
  onExport?: () => void;
  onImport?: () => void;
  onUpdate?: () => void;
  onDelete?: (close: () => void) => void;
  onPrint?: () => void;
  onSave?: () => void;
  save?: boolean;
  search?: boolean;
  create?: boolean;
  update?: boolean;
  delete?: boolean;
  import?: boolean;
  export?: boolean;
  form?: PageForm;
  isNested?: boolean;
  deleteProps?: {
    label?: string;
    dialog?: {
      title?: string;
      content?: string;
      continueLabel?: string;
      cancelLabel?: string;
    };
  };
}

export default function Page(props: Props) {
  const outlet = useOutletContext<{ pageVariant?: "child" }>();

  const submit = useSubmit();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();

  const pathnames = location.pathname.split("/").filter((x) => x);

  const deleteFormId = props?.form?.delete?.form ?? props.formId;
  const updateFormId = props?.form?.update?.form ?? props.formId;

  const isEditing = searchParams.get("update") === updateFormId;
  const isDeleting = searchParams.get("delete") === deleteFormId;
  const isChild = outlet?.pageVariant == "child";

  const onSearch = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchParams(
        (prev) => {
          if (!props.pageParamsKey) {
            console.error(
              "Search will not work with specifying the pageParamsKey prop.",
            );
            return prev;
          }
          const next = new URLSearchParams(prev);
          if (e.target.value)
            next.set(`search:${props.pageParamsKey}`, e.target.value);
          else next.delete(`search:${props.pageParamsKey}`);
          return next;
        },
        { replace: true, preventScrollReset: true },
      );
    },
    [setSearchParams],
  );

  const onDeleteShow = useCallback(
    () =>
      setSearchParams(
        (prev) => {
          if (!deleteFormId) return prev;
          const next = new URLSearchParams(prev);
          next.set("delete", deleteFormId);
          return next;
        },
        { replace: true, preventScrollReset: true },
      ),
    [],
  );

  const onDeleteHide = useCallback(
    () =>
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          next.delete("delete");
          return next;
        },
        { replace: true, preventScrollReset: true },
      ),
    [],
  );

  const onEditShow = useCallback(
    () =>
      setSearchParams(
        (prev) => {
          if (!updateFormId) return prev;
          const next = new URLSearchParams(prev);
          next.set("update", updateFormId);
          return next;
        },
        { replace: true, preventScrollReset: true },
      ),
    [setSearchParams],
  );

  const onEditHide = useCallback(
    () =>
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          next.delete("update");
          return next;
        },
        { replace: true, preventScrollReset: true },
      ),
    [setSearchParams],
  );

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        flex: 1,
        width: "100%",
        maxWidth: { sm: "100%", md: "1700px" },
      }}
    >
      <Stack direction="row" alignItems="center" spacing={1} mb={2}>
        {pathnames.length > 1 && !isChild && !props.isNested && (
          <IconButton
            component={ArrowBackIcon}
            onClick={() => navigate(-1)}
            size="small"
            sx={{ border: "none" }}
          />
        )}
        {props.Icon}
        {typeof props.title === "string" ? (
          <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
            {props.title}
          </Typography>
        ) : (
          props.title
        )}
        <Box flex={1} />

        <Search
          onChange={onSearch}
          hidden={!props.search}
          defaultValue={searchParams.get("search") || undefined}
        />

        <Button
          variant="contained"
          color="success"
          startIcon={<SaveIcon />}
          onClick={props.onSave}
          size="small"
          hidden={!props.save}
          type={!!props?.form?.create?.formAction ? "submit" : "button"}
          form={props?.form?.create?.form ?? props.formId}
          formAction={
            !!props?.form?.create?.formAction
              ? (formData) =>
                  props?.form?.create?.formAction?.(formData, submit)
              : undefined
          }
        >
          Save
        </Button>
        <Button
          variant="contained"
          startIcon={<CreateIcon />}
          onClick={props.onCreate}
          size="small"
          hidden={!props.create}
        >
          Create
        </Button>

        <ButtonGroup hidden={!(isEditing && props.update)}>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={props.onUpdate}
            size="small"
            hidden={!props.update}
            type={!!props?.form?.update?.formAction ? "submit" : "button"}
            form={props?.form?.update?.form ?? props.formId}
            formAction={
              !!props?.form?.update?.formAction
                ? (formData) =>
                    props?.form?.update?.formAction?.(formData, submit)
                : undefined
            }
          >
            Save
          </Button>
          <Button size="small" variant="contained" onClick={onEditHide}>
            <CloseIcon />
          </Button>
        </ButtonGroup>
        <Button
          variant="contained"
          startIcon={<EditIcon />}
          onClick={onEditShow}
          size="small"
          hidden={!props.update || isEditing}
        >
          Edit
        </Button>
        <Button
          variant="contained"
          color="error"
          startIcon={<DeleteIcon />}
          onClick={onDeleteShow}
          size="small"
          hidden={!props.delete}
        >
          {props.deleteProps?.label ?? "Delete"}
        </Button>
        <Button
          variant="contained"
          color="secondary"
          startIcon={<PrintIcon />}
          onClick={props.onPrint}
          size="small"
          hidden={!props.onPrint}
        >
          Print
        </Button>
        <ButtonGroup
          size="small"
          color="secondary"
          variant="contained"
          hidden={!props.import && !props.export}
          sx={{
            "& .MuiButtonBase-root": {
              border: "none",
            },
          }}
        >
          {props.import && (
            <Button
              startIcon={<ImportExportRounded />}
              onClick={props.onImport}
            >
              Import
            </Button>
          )}
          {props.export && (
            <Button startIcon={<DownloadRounded />} onClick={props.onExport}>
              Export
            </Button>
          )}
        </ButtonGroup>
      </Stack>

      {props.children}

      <Dialog open={isDeleting} onClose={onDeleteHide}>
        <DialogTitle>
          {props.deleteProps?.dialog?.title ?? "Delete"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {props.deleteProps?.dialog?.content ??
              "Are you sure you want to delete this item?"}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onDeleteHide}>
            {props.deleteProps?.dialog?.cancelLabel ?? "Cancel"}
          </Button>
          <Button
            autoFocus
            type={!!props?.form?.delete?.formAction ? "submit" : "button"}
            form={props?.form?.delete?.form ?? props.formId}
            formAction={
              !!props?.form?.delete?.formAction
                ? (formData) =>
                    props?.form?.delete?.formAction?.(formData, submit)
                : undefined
            }
          >
            {props.deleteProps?.dialog?.continueLabel ?? "Continue"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
