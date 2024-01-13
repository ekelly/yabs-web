import { useSelector } from "react-redux";
import {
  getBillDescription,
  setBillDescription,
  setBillTotal,
} from "~/lib/features/core";
import { useAppDispatch } from "~/lib/hooks";
import { ChangeEvent } from "react";
import { TextField, Paper, InputAdornment } from "@mui/material";

export default function BillInfo() {
  const dispatch = useAppDispatch();

  const billDescription = useSelector(getBillDescription);

  const updateBillNameHandler = (e: ChangeEvent<HTMLInputElement>) => {
    dispatch(setBillDescription(e.currentTarget.value));
  };

  const updateBillTotalHandler = (e: ChangeEvent<HTMLInputElement>) => {
    dispatch(setBillTotal(Number(e.currentTarget.value)));
  };

  return (
    <>
      <Paper
        component="form"
        elevation={1}
        sx={{
          p: "2px 4px",
          display: "flex",
          marginTop: "5px",
          alignItems: "center",
          width: "95%",
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        <TextField
          placeholder="Bill Name"
          value={billDescription}
          onChange={updateBillNameHandler}
          sx={{ width: "inherit" }}
        />
        <TextField
          placeholder="Bill Total"
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
          }}
          inputMode="decimal"
          onChange={updateBillTotalHandler}
        />
      </Paper>
    </>
  );
}
