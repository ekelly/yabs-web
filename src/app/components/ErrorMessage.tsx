"use client";
import { Snackbar, Alert } from "@mui/material";
import * as React from "react";
import { useCallback } from "react";

type Props = {
  message?: string;
  triggerError: (show: string) => void;
};

/**
 * This component allows for the creation of error
 * message popups for the user, by providing a message
 * and triggering function. This is intended to be used
 * with useState, and the error message will appear when
 * the message string exists.
 */
export const ErrorMessage: React.FC<Props> = ({ message, triggerError }) => {
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
