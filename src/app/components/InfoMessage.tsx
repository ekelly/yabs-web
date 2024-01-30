"use client";
import { Snackbar, Alert } from "@mui/material";
import * as React from "react";

type Props = {
  message?: string;
  handleClose: (event: Event | React.SyntheticEvent) => void;
};

/**
 * This component allows for the creation of info
 * message popups for the user, by providing a message
 * and triggering function. This is intended to be used
 * with useState, and the info message will appear when
 * the message string exists.
 */
export const InfoMessage: React.FC<Props> = ({ message, handleClose }) => {
  return (
    <Snackbar
      open={!!message}
      autoHideDuration={4000}
      onClose={handleClose}
      message={message}
      sx={{ bottom: { xs: 90, sm: 0 } }}
    >
      <Alert onClose={handleClose} severity="info" sx={{ width: "100%" }}>
        {message}
      </Alert>
    </Snackbar>
  );
};
