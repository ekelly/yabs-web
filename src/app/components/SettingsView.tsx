"use client";
import { Typography, TextField, Box, Button } from "@mui/material";
import { updateVenmoUsername } from "~/lib/features/settings";

export default function SettingsView() {

  const submitFormHandler = (formData: FormData) => {
    const username = formData.get("venmo-username");
    if (username !== null) {
      updateVenmoUsername(username as string);
    } else {
      updateVenmoUsername();
    }
  };

  return (
    <>
      <Typography variant="h4">
        Settings
      </Typography>
      <br />
      <Box>
        <form action={submitFormHandler}>
          <TextField name="venmo-username" id="venmo-username" label="Venmo username"  />
          <br/>
          <Button type="submit" sx={{float: "right"}}>Submit</Button>
        </form>
      </Box>
    </>
  );
}
