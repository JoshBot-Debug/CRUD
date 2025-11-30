import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import React, { createContext, useContext, useState } from "react";

interface DialogOptions {
  title: string;
  message: string;
  onConfirm?: (close: () => void) => void;
  cancelLabel?: string;
  confirmLabel?: string;
}

export interface DialogContextType {
  show: (options: DialogOptions) => void;
  close: () => void;
}

const DialogContext = createContext<DialogContextType | null>(null);

export function DialogProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [dialog, setDialog] = useState<DialogOptions | null>(null);

  const show = (options: DialogOptions) => {
    setDialog(options);
    setOpen(true);
  };

  const close = () => {
    setOpen(false);
  };

  return (
    <DialogContext.Provider value={{ show, close }}>
      {children}
      <Dialog
        open={open}
        onClose={close}
        onTransitionExited={() => setDialog(null)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{dialog?.title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {dialog?.message}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={close}>{dialog?.cancelLabel ?? "Cancel"}</Button>
          <Button
            autoFocus
            onClick={() => {
              if (dialog?.onConfirm) return dialog?.onConfirm(close);
              close();
            }}
          >
            {dialog?.confirmLabel ?? "Ok"}
          </Button>
        </DialogActions>
      </Dialog>
    </DialogContext.Provider>
  );
}

export default function useDialog() {
  const context = useContext(DialogContext);
  if (!context)
    throw new Error("useDialog must be used within a <DialogProvider>");
  return context;
}
