import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useCallback } from "react";
import {
  useBlocker,
  useSearchParams,
  type BlockerFunction,
} from "react-router";

export default function UnsavedChanges() {
  const [searchParams] = useSearchParams();

  const isReadonly = !searchParams.has("update");

  const shouldBlock = useCallback<BlockerFunction>(
    ({ currentLocation, nextLocation }) => {
      const shouldBlock =
        !isReadonly && currentLocation.pathname !== nextLocation.pathname;
      if (shouldBlock && document.activeElement instanceof HTMLElement)
        document.activeElement.blur();
      return shouldBlock;
    },
    [!isReadonly],
  );

  const blocker = useBlocker(shouldBlock);

  return (
    <Dialog
      open={blocker.state == "blocked"}
      onClose={blocker.reset}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">Unsaved changes</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          You have unsaved changes, are you sure you want to leave this page?
          <br />
          All unsaved changes will be lost.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={blocker.reset} autoFocus>
          Go Back
        </Button>
        <Button onClick={blocker.proceed}>Continue</Button>
      </DialogActions>
    </Dialog>
  );
}
