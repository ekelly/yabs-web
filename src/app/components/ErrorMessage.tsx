import { Snackbar, Alert } from "@mui/material";
import * as React from "react";
import { useCallback } from "react";

export const ErrorMessage = (props: {
  message?: string;
  triggerError: (show: string) => void;
}) => {
  const { message, triggerError } = props;
  const handleClose = useCallback(
    (_event?: React.SyntheticEvent | Event, reason?: string) => {
      if (reason === "clickaway") {
        return;
      }

      triggerError("");
    },
    [triggerError]
  );

  return (
    <Snackbar
      open={!!message}
      autoHideDuration={5000}
      onClose={handleClose}
      message={message}
      sx={{ bottom: { xs: 90, sm: 0 } }}
    >
      <Alert onClose={handleClose} severity="error" sx={{ width: "100%" }}>
        {message}
      </Alert>
    </Snackbar>
  );
};
