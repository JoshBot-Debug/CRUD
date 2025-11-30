import Button, { type ButtonProps } from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import React from "react";

interface DialogOptions {
  title: string;
  content: string | React.FC;
  onConfirm?: (close: () => void) => void;
  cancelLabel?: string;
  confirmLabel?: string;
  confirmButtonProps?: ButtonProps;
}

export interface DialogContextType {
  show: (options: DialogOptions) => void;
  close: () => void;
}

export default function useDialogComponent(options: DialogOptions) {
  const [open, setOpen] = React.useState(false);

  const show = () => {
    setOpen(true);
  };

  const close = () => {
    setOpen(false);
  };

  return {
    show,
    close,
    Component: (
      <Dialog
        open={open}
        onClose={close}
        onTransitionExited={close}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{options?.title}</DialogTitle>
        <DialogContent>
          {typeof options.content === "string" ? (
            <DialogContentText id="alert-dialog-description">
              {options?.content}
            </DialogContentText>
          ) : (
            <options.content />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={close}>{options?.cancelLabel ?? "Cancel"}</Button>
          <Button
            autoFocus
            onClick={() => {
              if (options?.onConfirm) return options?.onConfirm(close);
              close();
            }}
            {...(options.confirmButtonProps ?? {})}
          >
            {options?.confirmLabel ?? "Ok"}
          </Button>
        </DialogActions>
      </Dialog>
    ),
  };
}
